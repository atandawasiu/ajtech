import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useCreateService,
  useGetService,
  useUpdateService,
  getGetServiceQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Code2, Server, Smartphone, Layout, Database, Layers, X, Plus } from "lucide-react";
import { Link } from "wouter";

const ICONS = [
  { value: "code",       label: "Code",       icon: Code2 },
  { value: "server",     label: "Server",     icon: Server },
  { value: "smartphone", label: "Mobile",     icon: Smartphone },
  { value: "layout",     label: "Layout",     icon: Layout },
  { value: "database",   label: "Database",   icon: Database },
  { value: "layers",     label: "Layers",     icon: Layers },
];

const formSchema = z.object({
  title:       z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon:        z.string().min(1, "Icon is required"),
  order:       z.coerce.number().int().min(0).default(0),
});

export default function AdminServiceForm() {
  const [, setLocation] = useLocation();
  const [, editParams] = useRoute("/admin/services/:id/edit");
  const serviceId = editParams?.id;
  const isEdit = Boolean(serviceId);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createService = useCreateService();
  const updateService = useUpdateService();

  const { data: existing, isLoading: loadingExisting } = useGetService(
    serviceId ?? "",
    { query: { queryKey: getGetServiceQueryKey(serviceId ?? ""), enabled: isEdit } }
  );

  const [features, setFeatures] = useState<string[]>([""]);
  const [newFeature, setNewFeature] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", icon: "code", order: 0 },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        title: existing.title,
        description: existing.description,
        icon: existing.icon,
        order: existing.order,
      });
      setFeatures(existing.features.length ? existing.features : [""]);
    }
  }, [existing]);

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (i: number) => setFeatures(prev => prev.filter((_, idx) => idx !== i));

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      ...values,
      features: features.filter(f => f.trim()),
    };

    if (isEdit && serviceId) {
      updateService.mutate(
        { id: serviceId, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["listServices"] });
            toast({ title: "Service updated", description: `"${values.title}" saved.` });
            setLocation("/admin/services");
          },
          onError: () => toast({ variant: "destructive", title: "Update failed" }),
        }
      );
    } else {
      createService.mutate(
        { data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["listServices"] });
            toast({ title: "Service created", description: `"${values.title}" is now listed.` });
            setLocation("/admin/services");
          },
          onError: () => toast({ variant: "destructive", title: "Create failed" }),
        }
      );
    }
  };

  const isPending = createService.isPending || updateService.isPending;
  const selectedIcon = form.watch("icon");

  if (isEdit && loadingExisting) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/services" aria-label="Back to services" className="inline-flex p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold tracking-tight">{isEdit ? "Edit Service" : "New Service"}</h2>
          <p className="text-sm text-muted-foreground">{isEdit ? "Update service details." : "Add a new service offering to your portfolio."}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          {/* Icon picker */}
          <div>
            <FormLabel className="text-sm font-medium block mb-2">Icon</FormLabel>
            <div className="flex gap-2 flex-wrap">
              {ICONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => form.setValue("icon", value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                    selectedIcon === value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Full-Stack Development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Sort Order</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="0" {...field} />
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
                <FormLabel className="text-sm font-medium">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what this service entails..."
                    className="min-h-[100px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Features */}
          <div>
            <FormLabel className="text-sm font-medium block mb-2">
              Key Features / Deliverables
            </FormLabel>
            <div className="space-y-2 mb-3">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm flex-1 text-foreground">{f || <span className="text-muted-foreground italic">Empty feature</span>}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={e => setNewFeature(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
                placeholder="e.g. React + TypeScript SPA development"
                className="flex-1"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-3 py-2 rounded-lg border border-border hover:bg-secondary transition-colors flex items-center gap-1.5 text-sm shrink-0"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Press Enter or click Add to add a feature.</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link href="/admin/services">
              <button type="button" className="px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-secondary transition-colors">
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Saving…</>
              ) : (
                isEdit ? "Update Service" : "Create Service"
              )}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
