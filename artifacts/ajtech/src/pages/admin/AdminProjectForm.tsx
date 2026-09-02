import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  useCreateProject, 
  useUpdateProject, 
  useGetProject, 
  getGetProjectQueryKey,
  getListProjectsQueryKey
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
  description: z.string().min(1, "Description is required"),
  longDescription: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tags: z.string().transform(str => str.split(',').map(s => s.trim()).filter(Boolean)),
  category: z.string().min(1, "Category is required"),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  featured: z.boolean().default(false),
  order: z.coerce.number().default(0),
});

export default function AdminProjectForm() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/projects/:id/edit");
  const isEdit = !!params?.id;
  const projectId = params?.id || "";

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const { data: project, isLoading } = useGetProject(projectId, {
    query: {
      enabled: isEdit,
      queryKey: getGetProjectQueryKey(projectId)
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      imageUrl: "",
      tags: [],
      category: "",
      liveUrl: "",
      githubUrl: "",
      featured: false,
      order: 0,
    }
  });

  useEffect(() => {
    if (project && isEdit) {
      form.reset({
        ...project,
        longDescription: project.longDescription || "",
        imageUrl: project.imageUrl || "",
        liveUrl: project.liveUrl || "",
        githubUrl: project.githubUrl || "",
        tags: project.tags as unknown as any, // Handled by transform, but initial value needs to be string
      });
      // Workaround for tags since they come as array but form expects string
      form.setValue('tags', project.tags.join(', ') as any);
    }
  }, [project, isEdit, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      ...values,
      longDescription: values.longDescription || undefined,
      imageUrl: values.imageUrl || undefined,
      liveUrl: values.liveUrl || undefined,
      githubUrl: values.githubUrl || undefined,
    };

    if (isEdit) {
      updateProject.mutate({ id: projectId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Project updated" });
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId) });
          setLocation("/admin/projects");
        },
        onError: () => toast({ variant: "destructive", title: "Error updating project" })
      });
    } else {
      createProject.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Project created" });
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
          setLocation("/admin/projects");
        },
        onError: () => toast({ variant: "destructive", title: "Error creating project" })
      });
    }
  };

  if (isEdit && isLoading) {
    return <div>Loading...</div>;
  }

  const isPending = createProject.isPending || updateProject.isPending;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/projects")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            {isEdit ? "Edit Project" : "New Project"}
          </h2>
          <p className="text-muted-foreground">
            {isEdit ? "Update project details." : "Add a new project to your portfolio."}
          </p>
        </div>
      </div>

      <div className="p-8 rounded-xl border border-border bg-card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Web App, Mobile App" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief summary for the card" className="h-20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Description (HTML allowed)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Full description for the detail page" className="h-40 font-mono text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="liveUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="React, Node.js, TypeScript (comma separated)" {...field} />
                  </FormControl>
                  <FormDescription>Comma separated list of technologies</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-border rounded-lg bg-background">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Project</FormLabel>
                      <FormDescription>
                        Show on the home page
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

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" disabled={isPending}>
                {isPending ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Project</>}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
