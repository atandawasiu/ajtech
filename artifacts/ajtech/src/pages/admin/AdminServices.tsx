import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useListServices, useDeleteService, getListServicesQueryKey } from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, Code2, Server, Smartphone, Layout, Database, Layers, AlertTriangle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

function getIcon(name: string) {
  switch (name.toLowerCase()) {
    case "code": return <Code2 className="w-5 h-5" />;
    case "server": return <Server className="w-5 h-5" />;
    case "smartphone": return <Smartphone className="w-5 h-5" />;
    case "layout": return <Layout className="w-5 h-5" />;
    case "database": return <Database className="w-5 h-5" />;
    case "layers": return <Layers className="w-5 h-5" />;
    default: return <Code2 className="w-5 h-5" />;
  }
}

function DeleteDialog({ id, title, onClose }: { id: string; title: string; onClose: () => void }) {
  const deleteService = useDeleteService();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = () => {
    deleteService.mutate({ id }, {
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
        toast({ title: "Service deleted", description: `"${title}" has been removed.` });
        onClose();
      },
      onError: () => {
        toast({ variant: "destructive", title: "Delete failed", description: "Could not delete this service." });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold">Delete Service</h3>
            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm mb-6 text-muted-foreground">
          Are you sure you want to delete <strong className="text-foreground">"{title}"</strong>?
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteService.isPending}
            className="flex-1 px-4 py-2 rounded-full bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            {deleteService.isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminServices() {
  const { data: services, isLoading, isError } = useListServices();
  const [deletingId, setDeletingId] = useState<{ id: string; title: string } | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Services</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{services?.length ?? 0} service offerings listed.</p>
        </div>
        <Link href="/admin/services/new" data-testid="link-add-service" className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Service
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 rounded-xl border border-border bg-card animate-pulse" />)}
        </div>
      ) : isError ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-destructive/40 bg-destructive/5">
          <Code2 className="w-10 h-10 text-destructive/50 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">Services could not be loaded</h3>
          <p className="text-sm text-muted-foreground">Refresh the page and try again.</p>
        </div>
      ) : services && services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {getIcon(service.icon)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">{service.title}</h3>
                      <span className="text-xs text-muted-foreground">Order: {service.order}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/admin/services/${service.id}/edit`} data-testid={`link-edit-service-${service.id}`} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-primary">
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setDeletingId({ id: service.id, title: service.title })}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{service.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {service.features.slice(0, 3).map((f, fi) => (
                    <span key={fi} className="text-xs px-2 py-0.5 rounded-full border border-border bg-secondary text-muted-foreground">
                      {f}
                    </span>
                  ))}
                  {service.features.length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full border border-border bg-secondary text-muted-foreground">
                      +{service.features.length - 3} more
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border border-dashed border-border bg-card">
          <Code2 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No services yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Add your first service offering.</p>
           <Link href="/admin/services/new" data-testid="link-empty-add-service" className="inline-flex px-5 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
             Add Service
           </Link>
        </div>
      )}

      <AnimatePresence>
        {deletingId && (
          <DeleteDialog
            id={deletingId.id}
            title={deletingId.title}
            onClose={() => setDeletingId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
