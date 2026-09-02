import { createHmac, timingSafeEqual } from "node:crypto";
import { Router, type IRouter } from "express";
import { db, projectsTable, blogPostsTable, messagesTable, servicesTable } from "@workspace/db";
import { count, eq, gte, sql } from "drizzle-orm";
import {
  GetAdminStatsResponse,
  GetAdminAnalyticsResponse,
  AdminLoginBody,
  AdminLoginResponse,
  AdminLogoutResponse,
  GetAdminMeResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ||
  (process.env.NODE_ENV === "production" ? "" : "ajtech2024");
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  (process.env.NODE_ENV === "production" ? "" : "development-session-secret");
const SESSION_COOKIE = "ajtech_admin";

function createSessionToken(): string {
  const signature = createHmac("sha256", SESSION_SECRET)
    .update("authenticated")
    .digest("hex");
  return `authenticated.${signature}`;
}

function isAuthenticated(req: Parameters<Parameters<typeof router.get>[1]>[0]): boolean {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token || !SESSION_SECRET) return false;

  const expected = createSessionToken();
  const actualBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (!ADMIN_PASSWORD || parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  res.cookie(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
  });

  res.json(AdminLoginResponse.parse({ success: true, message: "Logged in successfully" }));
});

router.post("/admin/logout", async (_req, res): Promise<void> => {
  res.clearCookie(SESSION_COOKIE);
  res.json(AdminLogoutResponse.parse({ success: true }));
});

router.get("/admin/me", async (req, res): Promise<void> => {
  res.json(GetAdminMeResponse.parse({ authenticated: isAuthenticated(req) }));
});

router.get("/admin/stats", async (req, res): Promise<void> => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [totalProjects] = await db.select({ count: count() }).from(projectsTable);
  const [featuredProjects] = await db.select({ count: count() }).from(projectsTable).where(eq(projectsTable.featured, true));
  const [totalBlogPosts] = await db.select({ count: count() }).from(blogPostsTable);
  const [publishedBlogPosts] = await db.select({ count: count() }).from(blogPostsTable).where(eq(blogPostsTable.published, true));
  const [totalMessages] = await db.select({ count: count() }).from(messagesTable);
  const [unreadMessages] = await db.select({ count: count() }).from(messagesTable).where(eq(messagesTable.read, false));
  const [totalServices] = await db.select({ count: count() }).from(servicesTable);

  res.json(GetAdminStatsResponse.parse({
    totalProjects: Number(totalProjects.count),
    featuredProjects: Number(featuredProjects.count),
    totalBlogPosts: Number(totalBlogPosts.count),
    publishedBlogPosts: Number(publishedBlogPosts.count),
    totalMessages: Number(totalMessages.count),
    unreadMessages: Number(unreadMessages.count),
    totalServices: Number(totalServices.count),
  }));
});

router.get("/admin/analytics", async (req, res): Promise<void> => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Messages by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const messagesRaw = await db
    .select({
      month: sql<string>`to_char(${messagesTable.createdAt}, 'Mon YYYY')`,
      monthSort: sql<string>`to_char(${messagesTable.createdAt}, 'YYYY-MM')`,
      count: count(),
    })
    .from(messagesTable)
    .where(gte(messagesTable.createdAt, sixMonthsAgo))
    .groupBy(
      sql`to_char(${messagesTable.createdAt}, 'Mon YYYY')`,
      sql`to_char(${messagesTable.createdAt}, 'YYYY-MM')`
    )
    .orderBy(sql`to_char(${messagesTable.createdAt}, 'YYYY-MM')`);

  // Fill missing months with 0
  const months: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const found = messagesRaw.find((r) => r.monthSort === sortKey);
    months.push({ month: label, count: found ? Number(found.count) : 0 });
  }

  // Blog posts by month
  const blogRaw = await db
    .select({
      month: sql<string>`to_char(${blogPostsTable.createdAt}, 'Mon YYYY')`,
      monthSort: sql<string>`to_char(${blogPostsTable.createdAt}, 'YYYY-MM')`,
      count: count(),
    })
    .from(blogPostsTable)
    .where(gte(blogPostsTable.createdAt, sixMonthsAgo))
    .groupBy(
      sql`to_char(${blogPostsTable.createdAt}, 'Mon YYYY')`,
      sql`to_char(${blogPostsTable.createdAt}, 'YYYY-MM')`
    )
    .orderBy(sql`to_char(${blogPostsTable.createdAt}, 'YYYY-MM')`);

  const blogMonths: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const found = blogRaw.find((r) => r.monthSort === sortKey);
    blogMonths.push({ month: label, count: found ? Number(found.count) : 0 });
  }

  // Projects by category
  const projectsRaw = await db
    .select({
      category: projectsTable.category,
      count: count(),
    })
    .from(projectsTable)
    .groupBy(projectsTable.category)
    .orderBy(sql`count(*) desc`);

  const projectsByCategory = projectsRaw.map((r) => ({
    category: r.category,
    count: Number(r.count),
  }));

  // Totals
  const [totalContent] = await db.select({ count: count() }).from(projectsTable);
  const [blogCount] = await db.select({ count: count() }).from(blogPostsTable);
  const [totalMsg] = await db.select({ count: count() }).from(messagesTable);
  const [readMsg] = await db.select({ count: count() }).from(messagesTable).where(eq(messagesTable.read, true));

  const totalContentPieces = Number(totalContent.count) + Number(blogCount.count);
  const responseRate = Number(totalMsg.count) > 0
    ? Math.round((Number(readMsg.count) / Number(totalMsg.count)) * 100)
    : 0;

  res.json(GetAdminAnalyticsResponse.parse({
    messagesByMonth: months,
    projectsByCategory,
    blogPostsByMonth: blogMonths,
    totalContentPieces,
    responseRate,
  }));
});

export default router;
