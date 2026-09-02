import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { useGetBlogPost, getGetBlogPostQueryKey } from "@workspace/api-client-react";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:id");
  const postId = params?.id || "";

  const { data: post, isLoading, error } = useGetBlogPost(postId, {
    query: {
      enabled: !!postId,
      queryKey: getGetBlogPostQueryKey(postId)
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-5">
        <div className="w-full max-w-4xl animate-pulse space-y-5">
          <div className="h-4 w-28 rounded bg-white/10" />
          <div className="h-14 w-4/5 rounded bg-white/10" />
          <div className="h-5 w-2/3 rounded bg-white/[.04]" />
          <div className="h-72 rounded-2xl bg-white/[.04]" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4">
        <h1 data-testid="status-post-not-found" className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">The post you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/blog"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="site-shell flex flex-col w-full min-h-screen pt-20 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
        </Link>
        
        <header className="mb-16">
          <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground mb-6 font-mono">
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
          
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-8 leading-tight text-gradient">
            {post.title}
          </h1>
          
          {post.coverImageUrl && (
            <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden border border-border bg-muted my-10">
              <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 pt-6 border-t border-border/40">
            <Tag className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
            {post.tags.map(tag => (
              <span key={tag} className="text-xs font-mono bg-secondary text-secondary-foreground px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </header>
        
        <div 
          className="prose prose-invert prose-lg max-w-none prose-headings:tracking-tight prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-border prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <footer className="mt-20 pt-10 border-t border-border/40 flex justify-between items-center">
          <p className="text-muted-foreground italic font-serif">Thanks for reading.</p>
          <Button variant="outline" asChild>
            <Link href="/blog">More Posts</Link>
          </Button>
        </footer>
      </div>
    </article>
  );
}
