import { motion } from "framer-motion";
import { Code2, Cpu, Database, Layout, Server, Smartphone, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  const skills = [
    { name: "Frontend Development", items: ["React", "Next.js", "Vue", "TypeScript", "Tailwind CSS", "Framer Motion"] },
    { name: "Backend Engineering", items: ["Node.js", "Python", "Go", "PostgreSQL", "Redis", "GraphQL"] },
    { name: "Infrastructure & DevOps", items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Vercel", "Cloudflare"] },
    { name: "Architecture", items: ["Microservices", "Serverless", "Event-Driven", "REST", "System Design"] }
  ];

  const experience = [
    {
      year: "2022 - Present",
      role: "Senior Full-Stack Engineer",
      company: "Independent / ajTech",
      description: "Partnering with startups and agencies to build high-performance digital products from 0 to 1. Architecting scalable systems and leading technical execution."
    },
    {
      year: "2019 - 2022",
      role: "Software Engineer",
      company: "TechNova Solutions",
      description: "Core developer on the enterprise product team. Improved platform performance by 40% and led the migration from monolithic architecture to microservices."
    },
    {
      year: "2017 - 2019",
      role: "Frontend Developer",
      company: "Creative Digital",
      description: "Built award-winning marketing sites and e-commerce platforms. Specialized in complex animations and interactive 3D experiences."
    }
  ];

  return (
    <div className="site-shell flex flex-col w-full">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3" />
        
        <div className="container mx-auto max-w-5xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-8"
          >
             Engineering <span className="text-gradient italic font-serif">elegant</span> solutions to complex problems.
          </motion.h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg text-muted-foreground leading-relaxed">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="mb-6">
                I'm a full-stack engineer who believes that code is craft. I don't just build features; I build robust, scalable systems that deliver exceptional user experiences.
              </p>
              <p>
                With a background bridging design and deeply technical engineering, I operate effectively across the entire stack—from database schema design to complex frontend state management and micro-interactions.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="mb-6">
                My approach is pragmatic but uncompromising on quality. I choose the right tools for the job, favoring boring, stable technology for infrastructure while pushing the boundaries of what's possible on the frontend.
              </p>
              <p>
                When I'm not writing code, I'm usually reading about system architecture, experimenting with new frameworks, or trying to brew the perfect cup of coffee.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="py-24 bg-card relative border-y border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Technical Arsenal</h2>
            <p className="text-muted-foreground">The tools and technologies I use to build robust applications.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 border border-border rounded-xl bg-background hover:border-primary/50 transition-colors"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  {index === 0 && <Layout className="w-5 h-5 text-primary" />}
                  {index === 1 && <Server className="w-5 h-5 text-primary" />}
                  {index === 2 && <Cpu className="w-5 h-5 text-primary" />}
                  {index === 3 && <Database className="w-5 h-5 text-primary" />}
                  {skillGroup.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map(item => (
                    <span key={item} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Experience</h2>
            <p className="text-muted-foreground">A timeline of my professional journey.</p>
          </div>
          
          <div className="space-y-12">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 md:pl-0"
              >
                <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
                  <div className="hidden md:block col-span-1 text-right pt-1">
                    <span className="text-sm font-mono text-primary font-medium">{exp.year}</span>
                  </div>
                  
                  <div className="md:col-span-4 relative">
                    {/* Timeline line and dot for desktop */}
                    <div className="hidden md:block absolute -left-[2.3rem] top-2 w-3 h-3 rounded-full bg-primary border-4 border-background ring-1 ring-border z-10" />
                    <div className="hidden md:block absolute -left-8 top-5 bottom-[-3rem] w-px bg-border -z-0" />
                    
                    {/* Timeline line and dot for mobile */}
                    <div className="md:hidden absolute -left-8 top-2 w-3 h-3 rounded-full bg-primary border-4 border-background ring-1 ring-border z-10" />
                    <div className="md:hidden absolute -left-[1.65rem] top-5 bottom-[-3rem] w-px bg-border -z-0" />
                    
                    <div className="md:hidden mb-2">
                      <span className="text-sm font-mono text-primary font-medium">{exp.year}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>
                    <h4 className="text-lg text-muted-foreground mb-4">{exp.company}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">Ready to collaborate?</h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
            I'm currently accepting new projects and consulting opportunities.
          </p>
          <Button size="lg" variant="secondary" className="h-14 px-10 text-lg" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
