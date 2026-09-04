import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  useCreateBlogPost, 
  useUpdateBlogPost, 
  useGetBlogPost, 
  getGetBlogPostQueryKey,
  getListBlogPostsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tags: z.string(),
  published: z.boolean().default(false),
  readTime: z.coerce.number().optional(),
});

export default function AdminBlogForm() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/blog/:id/edit");
  const isEdit = !!params?.id;
  const postId = params?.id || "";

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();

  const { data: post, isLoading } = useGetBlogPost(postId, {
    query: {
      enabled: isEdit,
      queryKey: getGetBlogPostQueryKey(postId)
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImageUrl: "",
      tags: "",
      published: false,
      readTime: 5,
    }
  });

  useEffect(() => {
    if (post && isEdit) {
      form.reset({
        ...post,
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        coverImageUrl: post.coverImageUrl || "",
        readTime: post.readTime || 5,
        tags: post.tags.join(", "),
      });
    }
  }, [post, isEdit, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      ...values,
      tags: values.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      slug: values.slug || undefined,
      excerpt: values.excerpt || undefined,
      coverImageUrl: values.coverImageUrl || undefined,
      readTime: values.readTime || undefined,
    };

    if (isEdit) {
      updatePost.mutate({ id: postId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Post updated" });
          queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetBlogPostQueryKey(postId) });
          setLocation("/admin/blog");
        },
        onError: () => toast({ variant: "destructive", title: "Error updating post" })
      });
    } else {
      createPost.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Post created" });
          queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
          setLocation("/admin/blog");
        },
        onError: () => toast({ variant: "destructive", title: "Error creating post" })
      });
    }
  };

  if (isEdit && isLoading) return <div>Loading...</div>;

  const isPending = createPost.isPending || updatePost.isPending;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/blog")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            {isEdit ? "Edit Post" : "New Post"}
          </h2>
          <p className="text-muted-foreground">
            {isEdit ? "Update blog post content." : "Write a new article for your journal."}
          </p>
        </div>
      </div>

      <div className="p-8 rounded-xl border border-border bg-card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Post title" className="text-lg font-medium" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="my-awesome-post" {...field} />
                    </FormControl>
                    <FormDescription>Auto-generated from title if left blank</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="readTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Read Time (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief summary for the blog list" className="h-20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (HTML/Markdown)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="<p>Start writing here...</p>" className="min-h-[400px] font-mono text-sm resize-y" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Engineering, React, Architecture" {...field} />
                  </FormControl>
                  <FormDescription>Comma separated list of tags</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-6 border border-border rounded-lg bg-background">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publish Post</FormLabel>
                      <FormDescription>
                        Make this post visible to the public
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" disabled={isPending}>
                {isPending ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Post</>}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
