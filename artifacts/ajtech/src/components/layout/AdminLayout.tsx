import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, FolderGit2, FileText, MessageSquare, Settings, LogOut, Code2, ExternalLink, Wrench, Sun, Moon, Menu, X, ChevronRight } from "lucide-react";
import { useAdminLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/projects", icon: FolderGit2, label: "Projects" },
  { href: "/admin/blog", icon: FileText, label: "Journal" },
  { href: "/admin/services", icon: Wrench, label: "Services" },
  { href: "/admin/messages", icon: MessageSquare, label: "Inbox" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const isDark = theme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const handleToggle = () => {
    setTheme(nextTheme);
    toast({
      title: `${nextTheme === "light" ? "Light" : "Dark"} theme enabled`,
      description: "Your preference will be remembered on this device.",
      duration: 2200,
    });
  };
  return <button type="button" data-testid="button-admin-theme" onClick={handleToggle} aria-pressed={isDark} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-slate-500 transition-colors hover:bg-white/[.05] hover:text-slate-200">{isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}{isDark ? "Light theme" : "Dark theme"}</button>;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logout = useAdminLogout();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isLoginPage = location === "/admin/login";
  const currentNav = navItems.find((item) => location === item.href || location.startsWith(`${item.href}/`));
  const handleLogout = () => logout.mutate(undefined, {
    onSuccess: () => {
      queryClient.clear();
      toast({ title: "Signed out", description: "Your admin session has ended." });
      setLocation("/admin/login");
    },
    onError: () => toast({ variant: "destructive", title: "Sign out failed", description: "Please try again." }),
  });

  if (isLoginPage) return <div className="min-h-[100dvh] bg-background text-foreground">{children}</div>;

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`${mobile ? "fixed inset-y-0 left-0 z-50 w-72 shadow-2xl" : "hidden w-64 shrink-0 lg:flex"} flex-col border-r border-white/[.08] bg-[#0b0d19]`}>
      <div className="flex h-[4.5rem] items-center justify-between border-b border-white/[.08] px-5">
        <Link href="/admin/dashboard" data-testid="link-admin-brand" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/50 bg-primary/10"><Code2 className="h-4 w-4 text-primary" /></span>
          <span className="font-semibold tracking-[-.04em] text-slate-100">aj<span className="text-primary">Tech</span><span className="ml-1 font-mono text-[10px] font-normal tracking-[.12em] text-slate-600">CMS</span></span>
        </Link>
        {mobile && <button type="button" data-testid="button-close-admin-menu" onClick={() => setMobileOpen(false)} className="text-slate-500 hover:text-white"><X className="h-5 w-5" /></button>}
      </div>
      <div className="px-5 pb-3 pt-6"><p className="eyebrow text-[9px] text-slate-600">Workspace</p><p className="mt-2 text-sm text-slate-300">AJTech Studio</p></div>
      <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-3">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = location === href || location.startsWith(`${href}/`);
          return <Link key={href} href={href} data-testid={`link-admin-${label.toLowerCase()}`} onClick={() => setMobileOpen(false)} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${active ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-white/[.04] hover:text-slate-200"}`}><Icon className="h-4 w-4" /><span className="flex-1">{label}</span>{active && <ChevronRight className="h-3.5 w-3.5" />}</Link>;
        })}
      </nav>
      <div className="space-y-1 border-t border-white/[.08] p-3">
        <ThemeToggle />
        <Link href="/" data-testid="link-admin-view-site" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-500 transition-colors hover:bg-white/[.05] hover:text-slate-200"><ExternalLink className="h-4 w-4" /> View live site</Link>
        <button type="button" data-testid="button-admin-logout" onClick={handleLogout} disabled={logout.isPending} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-slate-500 transition-colors hover:bg-red-400/10 hover:text-red-300"><LogOut className="h-4 w-4" />{logout.isPending ? "Signing out..." : "Sign out"}</button>
      </div>
    </aside>
  );

  return <div className="admin-shell min-h-[100dvh] text-foreground">
    <div className="flex min-h-[100dvh]">
      <Sidebar />
      {mobileOpen && <><div data-testid="admin-mobile-overlay" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" /><Sidebar mobile /></>}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-white/[.08] bg-[#0b0d19]/75 px-5 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button type="button" data-testid="button-open-admin-menu" onClick={() => setMobileOpen(true)} className="text-slate-400 lg:hidden"><Menu className="h-5 w-5" /></button>
            <div className="hidden items-center gap-2 text-xs text-slate-600 sm:flex"><span>Workspace</span><ChevronRight className="h-3 w-3" /><span className="text-slate-300">{currentNav?.label ?? "Admin"}</span></div>
            <span className="font-mono text-[10px] uppercase tracking-[.14em] text-slate-500 sm:hidden">{currentNav?.label ?? "Admin"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[.1em] text-emerald-400/80 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> System online</span>
            <Link href="/admin/messages" data-testid="link-admin-inbox-header" className="rounded-lg border border-white/10 p-2 text-slate-500 transition-colors hover:border-primary/40 hover:text-primary"><MessageSquare className="h-4 w-4" /></Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-5 md:p-8"><div className="mx-auto max-w-6xl">{children}</div></main>
      </div>
    </div>
  </div>;
}