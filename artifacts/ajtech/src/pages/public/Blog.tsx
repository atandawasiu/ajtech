import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListBlogPosts } from "@workspace/api-client-react";
import { Calendar, Clock, ChevronRight } from "lucide-react";

export default function Blog() {
  const { data: posts, isLoading } = useListBlogPosts({ published: true });

  return (
    <div className="site-shell flex flex-col w-full min-h-screen pt-20">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16"
        >
           <p className="eyebrow mb-4">Notes from the build</p>
           <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Engineering <span className="text-gradient">Journal</span></h1>
          <p className="text-xl text-muted-foreground">
            Thoughts on software architecture, frontend engineering, and building digital products.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl border border-border bg-card p-8 h-48 animate-pulse" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-12 max-w-4xl">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-x-4 -inset-y-6 md:-inset-x-8 md:-inset-y-8 rounded-2xl bg-card opacity-0 group-hover:opacity-100 transition-opacity -z-10 border border-border/50" />
                <Link href={`/blog/${post.id}`} className="block">
                  <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground mb-4 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary" />
                      {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    {post.readTime && (
                      <span className="flex items-center gap-1.5 border-l border-border pl-4">
                        <Clock className="w-4 h-4 text-primary" />
                        {post.readTime} min read
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  
                  {post.excerpt && (
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-2 transition-transform">
                    Read article <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-border rounded-xl bg-card">
            <p className="text-muted-foreground">No posts published yet. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
