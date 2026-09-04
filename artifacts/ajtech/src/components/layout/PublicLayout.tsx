import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Journal" },
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

  return (
    <button
      type="button"
      data-testid="button-toggle-theme"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[.04] text-slate-400 transition-colors hover:border-primary/50 hover:text-white"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export default function PublicLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="site-shell min-h-[100dvh] bg-background text-foreground">
      <div className="orb orb-blue animate-drift -left-48 top-28 z-[-2] h-[28rem] w-[28rem] opacity-30" />
      <div className="orb orb-violet animate-drift right-[-12rem] top-[34rem] z-[-2] h-[34rem] w-[34rem] opacity-20" />
      <header className="sticky top-0 z-40 border-b border-white/[.08] bg-[#090a16]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" data-testid="link-brand-home" className="group flex items-center gap-3">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-primary/50 bg-primary/10 font-mono text-sm text-primary shadow-[0_0_24px_rgba(104,167,255,.18)]">
              <span className="absolute h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_#68a7ff]" />
              <span className="absolute inset-[5px] rounded border border-primary/40" />
            </span>
            <span className="font-semibold tracking-[-.04em] text-slate-100">aj<span className="text-primary">Tech</span><span className="ml-1 font-mono text-[10px] font-normal tracking-[.12em] text-slate-500">/STUDIO</span></span>
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
                className={`relative py-2 text-sm transition-colors ${location === link.href ? "text-white" : "text-slate-400 hover:text-white"}`}
              >
                {link.label}
                {location === link.href && <span className="absolute -bottom-[1.65rem] left-1/2 h-px w-5 -translate-x-1/2 bg-primary shadow-[0_0_10px_#68a7ff]" />}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link href="/contact" data-testid="link-header-contact" className="group flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-[#090a16]">
              Start a project <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
              <button type="button" data-testid="button-toggle-menu" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300">
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-0 top-[4.5rem] z-30 border-b border-white/10 bg-[#0b0c1b]/95 p-5 shadow-2xl backdrop-blur-xl md:hidden"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <Link href="/" data-testid="link-mobile-home" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white">Home</Link>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-mobile-${link.label.toLowerCase()}`} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white">{link.label}</Link>
              ))}
              <Link href="/contact" data-testid="link-mobile-contact" onClick={() => setOpen(false)} className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-[#090a16]">Start a project <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <main className="relative z-0 min-h-[60vh]">{children}</main>

      <footer className="relative mt-20 overflow-hidden border-t border-white/[.08] bg-[#080914]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" data-testid="link-footer-brand" className="font-semibold tracking-[-.04em] text-slate-100">aj<span className="text-primary">Tech</span><span className="ml-1 font-mono text-[10px] tracking-[.12em] text-slate-500">/STUDIO</span></Link>
              <p className="mt-5 max-w-xs text-sm leading-7 text-slate-500">A personal brand and boutique engineering studio for ambitious digital products.</p>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[.16em] text-slate-600">Lagos · Remote · Worldwide</p>
            </div>
            <div>
              <h2 className="eyebrow mb-4 text-slate-500">Explore</h2>
              <div className="flex flex-col gap-3">{navLinks.concat({ href: "/contact", label: "Contact" }).map((link) => <Link key={link.href} href={link.href} data-testid={`link-footer-${link.label.toLowerCase()}`} className="w-fit text-sm text-slate-400 transition-colors hover:text-primary">{link.label}</Link>)}</div>
            </div>
            <div>
              <h2 className="eyebrow mb-4 text-slate-500">Elsewhere</h2>
              <div className="flex flex-col gap-3">
                <a data-testid="link-footer-github" href="https://github.com/atandawasiu" target="_blank" rel="noopener noreferrer" className="w-fit text-sm text-slate-400 transition-colors hover:text-primary">GitHub ↗</a>
                <a data-testid="link-footer-linkedin" href="https://www.linkedin.com/in/wasiu-atanda-4636a8253" target="_blank" rel="noopener noreferrer" className="w-fit text-sm text-slate-400 transition-colors hover:text-primary">LinkedIn ↗</a>
                <a data-testid="link-footer-whatsapp" href="https://wa.me/2348102344943" target="_blank" rel="noopener noreferrer" className="w-fit text-sm text-slate-400 transition-colors hover:text-primary">WhatsApp ↗</a>
              </div>
            </div>
            <div>
              <h2 className="eyebrow mb-4 text-slate-500">Open channel</h2>
              <p className="text-sm leading-6 text-slate-500">Have a hard problem with a human shape? I would like to hear about it.</p>
              <Link href="/contact" data-testid="link-footer-start" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-white">Start a conversation <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </div>
          </div>
          <div className="mt-16 flex flex-col justify-between gap-3 border-t border-white/[.08] pt-6 text-[11px] text-slate-600 sm:flex-row">
            <span>© {new Date().getFullYear()} ajTech Studio</span>
            <span className="font-mono">Built for the interesting edge cases.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}