import { useRoute, Link } from "wouter";
import { useGetProject, getGetProjectQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Code2, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const projectId = params?.id || "";

  const { data: project, isLoading, error } = useGetProject(projectId, {
    query: {
      enabled: !!projectId,
      queryKey: getGetProjectQueryKey(projectId)
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-5">
        <div className="w-full max-w-5xl animate-pulse space-y-5">
          <div className="h-4 w-28 rounded bg-white/10" />
          <div className="h-16 w-3/4 rounded bg-white/10" />
          <div className="h-52 rounded-2xl bg-white/[.04]" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4">
        <h1 data-testid="status-project-not-found" className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/projects"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="site-shell flex flex-col w-full min-h-screen pt-20 pb-24">
      {/* Hero Section */}
        <div className="relative border-b border-white/[.08] bg-white/[.025]">
         <div className="grid-field absolute inset-0 opacity-20 pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 relative z-10">
          <Link href="/projects" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to all projects
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-mono font-medium mb-6">
                {project.category}
              </div>
               <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-gradient">{project.title}</h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                {project.liveUrl && (
                  <Button size="lg" asChild className="h-12 px-8 shadow-[0_0_20px_-5px_rgba(var(--primary))]">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      View Live Project <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button size="lg" variant="outline" asChild className="h-12 px-8 bg-background">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" /> Source Code
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
               className="glass-panel relative aspect-video lg:aspect-square xl:aspect-video rounded-2xl overflow-hidden shadow-2xl"
            >
              {project.imageUrl ? (
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                  <Code2 className="w-24 h-24 text-muted-foreground/20" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-4 md:px-8 mt-16 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-24">
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-invert prose-lg max-w-none prose-headings:tracking-tight prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80"
              dangerouslySetInnerHTML={{ __html: project.longDescription || project.description }}
            />
          </div>
          
          <div className="lg:col-span-1 space-y-8">
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-border pb-4">
                <Tag className="w-5 h-5 text-primary" /> Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-background border border-border rounded-md text-sm font-mono text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-6 rounded-xl border border-border bg-card">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-border pb-4">
                <Calendar className="w-5 h-5 text-primary" /> Timeline
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Launched</div>
                  <div className="font-medium">{new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <div className="font-medium text-emerald-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
