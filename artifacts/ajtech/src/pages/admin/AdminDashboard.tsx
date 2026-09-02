import { useState, type ReactNode } from "react";
import { Link } from "wouter";
import { Activity, ArrowUpRight, BarChart3, CheckCircle2, CircleAlert, FileText, FolderGit2, Github, Inbox, Plus, Server, Sparkles, Wrench } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useGetAdminAnalytics, useGetAdminStats, useHealthCheck, getGetAdminAnalyticsQueryKey, getGetAdminStatsQueryKey, getHealthCheckQueryKey } from "@workspace/api-client-react";

const palette = { blue: "#68a7ff", violet: "#ad82ff", green: "#56d6ad" };

function StatCard({ label, value, detail, icon: Icon, accent }: { label: string; value: number | string; detail: string; icon: typeof Activity; accent: string }) {
  return <div className="rounded-2xl border border-white/[.09] bg-white/[.035] p-5 transition-colors hover:border-white/20" data-testid={`stat-card-${label.toLowerCase().replaceAll(" ", "-")}`}>
    <div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${accent}18` }}><Icon className="h-4 w-4" style={{ color: accent }} /></span><span className="font-mono text-[10px] text-slate-600">LIVE</span></div>
    <p className="mt-6 text-3xl font-semibold tracking-[-.06em] text-slate-100">{value}</p><p className="mt-1 text-sm text-slate-300">{label}</p><p className="mt-1 text-xs text-slate-600">{detail}</p>
  </div>;
}

function Panel({ title, eyebrow, children, className = "" }: { title: string; eyebrow?: string; children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-white/[.09] bg-white/[.025] p-5 md:p-6 ${className}`}><div className="mb-5 flex items-end justify-between border-b border-white/[.08] pb-4"><div><p className="eyebrow text-[9px] text-slate-600">{eyebrow ?? "Workspace"}</p><h2 className="mt-1 text-base font-medium tracking-[-.03em] text-slate-200">{title}</h2></div></div>{children}</section>;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-lg border border-white/10 bg-[#111328] px-3 py-2 text-xs shadow-xl"><p className="mb-1 font-mono text-[10px] text-slate-500">{label}</p>{payload.map((item) => <p key={item.name} style={{ color: item.color }}>{item.name}: <strong className="text-slate-100">{item.value}</strong></p>)}</div>;
}

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey() } });
  const { data: analytics, isLoading: analyticsLoading, isError: analyticsError } = useGetAdminAnalytics({ query: { queryKey: getGetAdminAnalyticsQueryKey() } });
  const { data: health, isLoading: healthLoading, isError: healthError } = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey() } });
  const [chart, setChart] = useState<"messages" | "blog">("messages");
  const chartData = chart === "messages" ? analytics?.messagesByMonth ?? [] : analytics?.blogPostsByMonth ?? [];
  const completion = stats ? [stats.featuredProjects > 0, stats.publishedBlogPosts > 0, stats.totalServices > 0, stats.unreadMessages === 0].filter(Boolean).length : 0;

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><p className="eyebrow">Studio control room</p><h1 className="mt-2 text-3xl font-medium tracking-[-.06em] text-slate-100 md:text-4xl">Good work needs a clear view.</h1><p className="mt-2 text-sm text-slate-500">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p></div>
      <div className="flex gap-2"><Link href="/admin/projects/new" data-testid="link-dashboard-new-project" className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-[#090a16] transition-transform hover:-translate-y-0.5"><Plus className="h-3.5 w-3.5" /> New project</Link><a href="/" target="_blank" rel="noopener noreferrer" data-testid="link-dashboard-live-site" className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-medium text-slate-300 hover:border-primary/50 hover:text-primary"><ArrowUpRight className="h-3.5 w-3.5" /> Live site</a></div>
    </div>

    {statsError ? <div data-testid="status-dashboard-error" className="flex items-center gap-3 rounded-xl border border-red-300/20 bg-red-400/[.05] p-4 text-sm text-red-200"><CircleAlert className="h-4 w-4" /> Dashboard data could not be loaded. Try refreshing this page.</div> : statsLoading ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/[.03]" />)}</div> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Projects" value={stats?.totalProjects ?? 0} detail={`${stats?.featuredProjects ?? 0} featured`} icon={FolderGit2} accent={palette.blue} />
      <StatCard label="Journal posts" value={stats?.totalBlogPosts ?? 0} detail={`${stats?.publishedBlogPosts ?? 0} published`} icon={FileText} accent={palette.violet} />
      <StatCard label="Services" value={stats?.totalServices ?? 0} detail="Listed offerings" icon={Wrench} accent="#e6b86b" />
      <StatCard label="Unread messages" value={stats?.unreadMessages ?? 0} detail={`${stats?.totalMessages ?? 0} total inquiries`} icon={Inbox} accent={stats?.unreadMessages ? "#ff8097" : palette.green} />
    </div>}

    <div className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
      <Panel title="Publishing activity" eyebrow="Actual activity">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="max-w-sm text-xs leading-5 text-slate-500">Counts from the API over the last six months. No estimates or projections.</p><div className="flex rounded-lg border border-white/10 bg-white/[.03] p-1"><button type="button" data-testid="button-dashboard-messages-chart" onClick={() => setChart("messages")} className={`rounded-md px-3 py-1.5 text-[11px] ${chart === "messages" ? "bg-primary text-[#090a16]" : "text-slate-500 hover:text-slate-200"}`}>Messages</button><button type="button" data-testid="button-dashboard-blog-chart" onClick={() => setChart("blog")} className={`rounded-md px-3 py-1.5 text-[11px] ${chart === "blog" ? "bg-primary text-[#090a16]" : "text-slate-500 hover:text-slate-200"}`}>Blog</button></div></div>
        {analyticsError ? <div className="flex h-52 items-center justify-center text-sm text-slate-500">Activity data is unavailable right now.</div> : analyticsLoading ? <div className="h-52 animate-pulse rounded-xl bg-white/[.04]" /> : chartData.length ? <ResponsiveContainer width="100%" height={220}><AreaChart data={chartData} margin={{ top: 8, right: 5, bottom: 0, left: -24 }}><defs><linearGradient id="activity-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={palette.blue} stopOpacity={.3} /><stop offset="100%" stopColor={palette.blue} stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="rgba(145,160,215,.1)" strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fill: "#6d7492", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={{ fill: "#6d7492", fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="count" name={chart === "messages" ? "Messages" : "Posts"} stroke={palette.blue} fill="url(#activity-fill)" strokeWidth={2} dot={{ fill: palette.blue, r: 3, strokeWidth: 0 }} /></AreaChart></ResponsiveContainer> : <div className="flex h-52 flex-col items-center justify-center text-center"><BarChart3 className="mb-3 h-7 w-7 text-slate-700" /><p className="text-sm text-slate-500">No activity recorded yet.</p></div>}
      </Panel>
      <Panel title="Content pulse" eyebrow="Studio health">
        <div className="flex items-center gap-5"><div className="relative flex h-24 w-24 shrink-0 items-center justify-center"><svg className="-rotate-90" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(145,160,215,.12)" strokeWidth="2.5" /><circle cx="18" cy="18" r="15.9" fill="none" stroke={palette.violet} strokeWidth="2.5" strokeDasharray={`${completion * 25} 100`} strokeLinecap="round" /></svg><span className="absolute text-xl font-semibold text-slate-100">{completion}/4</span></div><div><p className="text-sm text-slate-300">Core signals present</p><p className="mt-1 text-xs leading-5 text-slate-600">A simple view of whether the essential portfolio surfaces have content.</p></div></div>
        <div className="mt-7 space-y-3">{[{ label: "Featured work", done: (stats?.featuredProjects ?? 0) > 0 }, { label: "Published journal", done: (stats?.publishedBlogPosts ?? 0) > 0 }, { label: "Services listed", done: (stats?.totalServices ?? 0) > 0 }, { label: "Inbox reviewed", done: (stats?.unreadMessages ?? 0) === 0 }].map((item) => <div key={item.label} className="flex items-center gap-3 text-xs"><span className={item.done ? "text-emerald-400" : "text-slate-700"}>{item.done ? <CheckCircle2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}</span><span className={item.done ? "text-slate-400" : "text-slate-500"}>{item.label}</span><span className="ml-auto font-mono text-[10px] text-slate-700">{item.done ? "ready" : "next"}</span></div>)}</div>
      </Panel>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      <Panel title="System check" eyebrow="Observed status"><div className="flex items-center gap-3 rounded-xl border border-white/[.08] bg-white/[.025] p-3"><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${health?.status === "ok" ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-300"}`}><Server className="h-4 w-4" /></span><div><p className="text-sm text-slate-300">API service</p><p data-testid="status-api-health" className="text-xs text-slate-600">{healthLoading ? "Checking..." : healthError ? "Unavailable" : health?.status ?? "Unknown"}</p></div><span className={`ml-auto h-2 w-2 rounded-full ${healthError ? "bg-red-400" : "bg-emerald-400"}`} /></div><p className="mt-4 text-xs leading-5 text-slate-600">Only the API health endpoint is shown here. Infrastructure status is not inferred.</p></Panel>
      <Panel title="Quick actions" eyebrow="Move the work"><div className="space-y-2">{[{ href: "/admin/projects/new", icon: FolderGit2, label: "Add a project" }, { href: "/admin/blog/new", icon: FileText, label: "Write a journal post" }, { href: "/admin/services/new", icon: Wrench, label: "List a service" }].map(({ href, icon: Icon, label }) => <Link key={href} href={href} data-testid={`link-quick-${label.toLowerCase().replaceAll(" ", "-")}`} className="flex items-center gap-3 rounded-xl border border-white/[.08] px-3 py-2.5 text-xs text-slate-400 transition-colors hover:border-primary/40 hover:text-primary"><Icon className="h-3.5 w-3.5" />{label}<ArrowUpRight className="ml-auto h-3.5 w-3.5" /></Link>)}</div></Panel>
      <Panel title="Public presence" eyebrow="External"><a data-testid="link-dashboard-github" href="https://github.com/atandawasiu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-white/[.08] p-3 transition-colors hover:border-primary/40"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-200"><Github className="h-4 w-4" /></span><span className="flex-1"><span className="block text-sm text-slate-300">GitHub profile</span><span className="block text-xs text-slate-600">atandawasiu</span></span><ArrowUpRight className="h-3.5 w-3.5 text-slate-600" /></a><div className="mt-4 flex items-center gap-2 text-xs text-slate-600"><Activity className="h-3.5 w-3.5 text-primary" /> Response rate <strong className="ml-auto text-slate-300">{analyticsLoading ? "—" : `${analytics?.responseRate ?? 0}%`}</strong></div></Panel>
    </div>
  </div>;
}