import { motion } from "framer-motion";
import { useListServices } from "@workspace/api-client-react";
import { Code2, Server, Smartphone, Layout, Database, CheckCircle2 } from "lucide-react";

export default function Services() {
  const { data: services, isLoading, isError } = useListServices();

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "code": return <Code2 className="w-8 h-8 text-primary" />;
      case "server": return <Server className="w-8 h-8 text-primary" />;
      case "smartphone": return <Smartphone className="w-8 h-8 text-primary" />;
      case "layout": return <Layout className="w-8 h-8 text-primary" />;
      case "database": return <Database className="w-8 h-8 text-primary" />;
      default: return <Code2 className="w-8 h-8 text-primary" />;
    }
  };

  return (
    <div className="site-shell flex flex-col w-full min-h-screen pt-20">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16"
        >
           <p className="eyebrow mb-4">What I bring to the room</p>
           <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Expertise & <span className="text-gradient">Services</span></h1>
          <p className="text-xl text-muted-foreground">
            Specialized engineering services to turn complex problems into scalable digital products.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-xl border border-border bg-card p-8 h-80 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 border border-red-300/30 rounded-xl bg-red-400/[.04]">
            <p className="text-muted-foreground">Services are temporarily unavailable. Please refresh and try again.</p>
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-8 md:p-10 rounded-2xl border border-border bg-card relative overflow-hidden transition-all hover:border-primary/50"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors" />
                
                <div className="mb-6 p-4 bg-background/50 border border-border rounded-xl inline-block backdrop-blur-sm">
                  {getIcon(service.icon)}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-primary mb-2">Key Deliverables</h3>
                  <ul className="space-y-3">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-border rounded-xl bg-card">
            <p className="text-muted-foreground">Services coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
