import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Code2, ExternalLink, Layers3, Orbit, Sparkles } from "lucide-react";
import { useListProjects } from "@workspace/api-client-react";

function SkeletonProject() {
  return <div className="h-80 animate-pulse rounded-2xl border border-white/10 bg-white/[.04]" />;
}

export default function Home() {
  const { data: projects, isLoading, isError } = useListProjects({ featured: true });

  return (
    <div className="overflow-hidden">
      <section className="relative flex min-h-[calc(100dvh-4.5rem)] items-center">
        <div className="orb orb-blue animate-drift -right-40 top-10 h-[30rem] w-[30rem] opacity-45" />
        <div className="orb orb-violet animate-drift -left-48 bottom-[-10rem] h-[34rem] w-[34rem] opacity-30" />
        <div className="grid-field absolute inset-0 opacity-45" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-16 px-5 py-20 md:px-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-12 lg:py-28">
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className="eyebrow mb-7 flex items-center gap-3">
              <span className="h-px w-8 bg-primary" /> Independent engineering studio
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .08 }} className="max-w-4xl text-[3.8rem] font-semibold leading-[.94] tracking-[-.075em] text-slate-100 sm:text-7xl lg:text-[6.8rem]">
              Complex ideas.<br /><span className="text-gradient">Clear signal.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .16 }} className="mt-8 max-w-xl text-base leading-7 text-slate-400 md:text-lg">
              AJTech turns ambitious product ideas into polished, dependable digital experiences — from first system map to the last meaningful pixel.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .24 }} className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/projects" data-testid="link-hero-work" className="group flex items-center gap-3 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-[#090a16] transition-transform hover:-translate-y-0.5">
                See the work <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link href="/contact" data-testid="link-hero-contact" className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-primary/60 hover:text-primary">
                Start a conversation
              </Link>
            </motion.div>
            <div className="mt-16 flex items-center gap-6 border-t border-white/10 pt-5 text-xs text-slate-500">
              <span className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Currently taking on select builds</span>
              <span className="hidden font-mono text-[10px] tracking-[.1em] sm:block">AJ / 001</span>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: .94, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .9, delay: .18 }} className="relative mx-auto h-[26rem] w-full max-w-[30rem] lg:h-[34rem]">
            <div className="absolute inset-8 rounded-[2.5rem] border border-primary/20 bg-primary/[.04] shadow-[0_0_100px_rgba(104,167,255,.1)]" />
            <div className="absolute inset-16 rounded-[2rem] border border-violet-300/20 bg-violet-300/[.03]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-panel animate-float relative flex h-52 w-52 rotate-[-7deg] flex-col justify-between rounded-[2rem] p-6 sm:h-60 sm:w-60">
                <div className="flex items-start justify-between"><Orbit className="h-7 w-7 text-primary" /><span className="font-mono text-[10px] text-slate-500">CORE / 01</span></div>
                <div><div className="mb-2 h-px w-10 bg-primary" /><p className="text-2xl font-semibold tracking-[-.06em] text-slate-100">Make it<br /><span className="text-primary">make sense.</span></p></div>
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[.12em] text-slate-500"><span>systems + stories</span><span>24° 18'</span></div>
              </div>
            </div>
            <div className="absolute left-0 top-16 rounded-xl border border-white/10 bg-[#111328]/85 px-3 py-2 backdrop-blur"><p className="font-mono text-[10px] text-primary">STATUS</p><p className="mt-1 text-xs text-slate-300">shipping with intent</p></div>
            <div className="absolute bottom-12 right-0 rounded-xl border border-white/10 bg-[#111328]/85 px-3 py-2 backdrop-blur"><p className="font-mono text-[10px] text-violet-300">STACK</p><p className="mt-1 text-xs text-slate-300">product / platform / web</p></div>
            <div className="absolute left-1/2 top-0 h-10 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-slate-600 md:flex"><ArrowDownRight className="h-3.5 w-3.5" /> Scroll to explore</div>
      </section>

      <section className="relative border-y border-white/[.08] bg-[#0c0e1d]/75 py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="eyebrow mb-4">Selected signal</p><h2 className="max-w-xl text-4xl font-medium leading-[.98] tracking-[-.06em] text-slate-100 md:text-6xl">Work that holds<br /><span className="text-slate-500">up under pressure.</span></h2></div>
            <Link href="/projects" data-testid="link-featured-all" className="group flex items-center gap-2 text-sm font-medium text-primary">View all work <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
          </div>
          {isLoading ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"><SkeletonProject /><SkeletonProject /><SkeletonProject /></div> : isError ? (
            <div data-testid="status-featured-error" className="rounded-2xl border border-dashed border-red-300/20 bg-red-400/[.04] p-10 text-center"><p className="text-sm text-red-200">Featured work is temporarily unavailable.</p><Link href="/projects" className="mt-4 inline-block text-sm text-primary">Browse the archive</Link></div>
          ) : projects && projects.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 3).map((project, index) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .5, delay: index * .08 }}>
                  <Link href={`/projects/${project.id}`} data-testid={`card-featured-project-${project.id}`} className="group block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[.035] transition-all hover:-translate-y-1 hover:border-primary/45 hover:bg-white/[.055]">
                    <div className="relative aspect-[1.35/1] overflow-hidden bg-[#161a34]">
                      {project.imageUrl ? <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105" /> : <div className="grid-field flex h-full items-center justify-center"><Code2 className="h-10 w-10 text-primary/35" /></div>}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f20] via-transparent to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-[#0b0d1a]/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.1em] text-primary backdrop-blur">{project.category}</span>
                      <span className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white opacity-0 transition-opacity group-hover:opacity-100"><ExternalLink className="h-3.5 w-3.5" /></span>
                    </div>
                    <div className="p-5"><div className="flex items-start justify-between gap-4"><h3 className="text-lg font-medium tracking-[-.04em] text-slate-100">{project.title}</h3><span className="font-mono text-[10px] text-slate-600">0{index + 1}</span></div><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{project.description}</p><div className="mt-5 flex flex-wrap gap-1.5">{project.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] text-slate-500">{tag}</span>)}</div></div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : <div data-testid="empty-featured-projects" className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-sm text-slate-500">Featured projects will appear here as the studio ships.</div>}
        </div>
      </section>

      <section className="relative py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="eyebrow mb-4">The studio approach</p><h2 className="max-w-md text-4xl font-medium leading-[1] tracking-[-.06em] text-slate-100 md:text-5xl">Less theatre.<br /><span className="text-slate-500">More useful magic.</span></h2><p className="mt-6 max-w-sm text-sm leading-7 text-slate-500">Every engagement is a collaboration between product thinking, visual craft, and the engineering discipline to make it last.</p></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[{ icon: Sparkles, number: "01", title: "Find the signal", copy: "Turn a dense brief into a clear product direction and a buildable plan." }, { icon: Layers3, number: "02", title: "Shape the system", copy: "Design the architecture and interface together, so neither becomes an afterthought." }, { icon: Code2, number: "03", title: "Ship with care", copy: "Build fast without making future-you pay interest. Performance and polish are part of the deliverable." }, { icon: ExternalLink, number: "04", title: "Leave it stronger", copy: "You get a product your team can understand, extend, and confidently put in front of people." }].map(({ icon: Icon, number, title, copy }) => <div key={number} className="glass-panel rounded-2xl p-6"><div className="flex items-center justify-between"><Icon className="h-5 w-5 text-primary" /><span className="font-mono text-[10px] text-slate-600">{number}</span></div><h3 className="mt-12 text-lg font-medium tracking-[-.04em] text-slate-100">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-5 mb-12 overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-br from-[#172746] via-[#12152d] to-[#21153e] md:mx-8">
        <div className="orb orb-blue -right-28 -top-32 h-80 w-80 opacity-25" /><div className="mx-auto max-w-7xl px-6 py-16 md:px-14 md:py-20"><p className="eyebrow mb-5">Have an interesting edge case?</p><div className="flex flex-col justify-between gap-10 md:flex-row md:items-end"><h2 className="max-w-2xl text-4xl font-medium leading-[.98] tracking-[-.065em] text-slate-100 md:text-6xl">Bring the hard part.<br /><span className="text-primary">I’ll bring the clarity.</span></h2><Link href="/contact" data-testid="link-home-cta" className="group flex w-fit items-center gap-3 rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-[#0c0e1d]">Let’s talk <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link></div></div>
      </section>
    </div>
  );
}