import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useListProjects } from "@workspace/api-client-react";
import { Code2, ArrowRight, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: projectsResponse, isLoading, isError } = useListProjects({});
  const { toast } = useToast();
  const projects = Array.isArray(projectsResponse)
    ? projectsResponse
    : ((projectsResponse as { data?: typeof projectsResponse } | undefined)?.data ?? []);

  const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = activeCategory === "All" || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="site-shell flex flex-col w-full min-h-screen pt-20">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16"
        >
           <p className="eyebrow mb-4">Archive / 2020—present</p>
           <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Selected <span className="text-gradient">Work</span></h1>
          <p className="text-xl text-muted-foreground">
            A comprehensive archive of products, platforms, and digital experiences I've engineered.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-start md:items-center justify-between sticky top-24 z-20 bg-background/95 backdrop-blur py-4 border-b border-border/40">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                 onClick={() => {
                   setActiveCategory(category);
                   toast({
                     title: category === "All" ? "Showing all projects" : `Filtered by ${category}`,
                     duration: 1800,
                   });
                 }}
                className={`rounded-full px-6 ${activeCategory === category ? "shadow-[0_0_15px_-5px_rgba(var(--primary))]" : ""}`}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full bg-card"
            />
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-xl border border-border bg-card p-1 h-[400px] animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-32 border border-red-300/30 rounded-xl bg-red-400/[.04]">
            <h3 className="text-xl font-bold mb-2">Work is temporarily unavailable</h3>
            <p className="text-muted-foreground">Please refresh the page and try again.</p>
          </div>
        ) : filteredProjects && filteredProjects.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-[0_0_30px_-15px_rgba(var(--primary))] flex flex-col h-full"
                >
                  <Link href={`/projects/${project.id}`}>
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      {project.imageUrl ? (
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary">
                          <Code2 className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-80" />
                      <div className="absolute top-4 left-4">
                        <span className="text-xs font-mono text-primary-foreground px-2 py-1 rounded bg-primary shadow-lg backdrop-blur-sm">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                        {project.description}
                      </p>
                      <div className="mt-auto pt-4 border-t border-border/50 flex flex-wrap gap-2">
                        {project.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="text-xs text-muted-foreground font-mono bg-background px-2 py-1 rounded border border-border/50">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="text-xs text-muted-foreground font-mono bg-background px-2 py-1 rounded border border-border/50">
                            +{project.tags.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-32 border border-border rounded-xl bg-card border-dashed">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            <Button 
              variant="outline" 
              className="mt-6"
               onClick={() => {
                 setActiveCategory("All");
                 setSearchQuery("");
                 toast({ title: "Filters cleared", description: "Showing the full project archive.", duration: 1800 });
               }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
