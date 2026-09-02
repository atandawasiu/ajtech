import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, messagesTable } from "@workspace/db";
import {
  ListMessagesResponse,
  CreateMessageBody,
  MarkMessageReadParams,
  MarkMessageReadResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/messages", async (_req, res): Promise<void> => {
  const rows = await db.select().from(messagesTable).orderBy(desc(messagesTable.createdAt));
  const mapped = rows.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }));
  res.json(ListMessagesResponse.parse(mapped));
});

router.post("/messages", async (req, res): Promise<void> => {
  const parsed = CreateMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [message] = await db
    .insert(messagesTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      body: parsed.data.body,
    })
    .returning();

  res.status(201).json({
    ...message,
    createdAt: message.createdAt.toISOString(),
  });
});

router.patch("/messages/:id/read", async (req, res): Promise<void> => {
  const params = MarkMessageReadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [message] = await db
    .update(messagesTable)
    .set({ read: true })
    .where(eq(messagesTable.id, params.data.id))
    .returning();

  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }

  res.json(MarkMessageReadResponse.parse({
    ...message,
    createdAt: message.createdAt.toISOString(),
  }));
});

export default router;
