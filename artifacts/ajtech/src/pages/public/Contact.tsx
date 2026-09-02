import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateMessage } from "@workspace/api-client-react";
import { Mail, MapPin, MessageSquare, Send, Copy, Check, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  body: z.string().min(10, "Message must be at least 10 characters")
});

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast({
         title: `${label} copied`,
        description: value,
        duration: 2500,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ variant: "destructive", title: "Copy failed", description: "Please copy manually." });
    }
  };

  return (
    <button
      data-testid={`button-copy-${label.toLowerCase()}`}
      onClick={handleCopy}
      className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-all"
      aria-label={`Copy ${label}`}
    >
      {copied
        ? <Check className="w-3.5 h-3.5 text-emerald-500" />
        : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

const CONTACT_ITEMS = [
  {
    icon: Mail,
    label: "Email",
    display: "atandawasiu13@email.com",
    href: "mailto:atandawasiu13@email.com",
    copyValue: "atandawasiu13@email.com",
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-primary">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.55 4.1 1.515 5.829L.057 23.882a.5.5 0 0 0 .613.613l6.053-1.458A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.8-.53-5.38-1.456l-.386-.228-3.993.962.98-3.895-.251-.4A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    ),
    label: "WhatsApp",
    display: "+234 810 234 4943",
    href: "https://wa.me/2348102344943",
    copyValue: "+2348102344943",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    display: "Wasiu Atanda",
    href: "https://www.linkedin.com/in/wasiu-atanda-4636a8253",
    copyValue: "https://www.linkedin.com/in/wasiu-atanda-4636a8253",
  },
  {
    icon: MapPin,
    label: "Location",
    display: "Remote — Worldwide",
    href: null,
    copyValue: null,
  },
];

export default function Contact() {
  const { toast } = useToast();
  const createMessage = useCreateMessage();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", body: "" }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createMessage.mutate({ data: values }, {
      onSuccess: () => {
        setIsSuccess(true);
        form.reset();
        toast({
           title: "Message sent",
          description: "Thanks for reaching out — I'll get back to you soon.",
        });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Couldn't send your message. Please try again or email directly.",
        });
      }
    });
  };

  return (
    <div className="site-shell flex flex-col w-full min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Contact</p>
          <h1 className="text-5xl md:text-6xl font-light tracking-[-0.04em] text-foreground mb-4">
             Let's <span className="text-gradient">Talk</span>
          </h1>
          <p className="text-lg text-muted-foreground font-light max-w-xl leading-relaxed">
            Have a project in mind, need consulting, or just want to say hi? Send me a message — I respond within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

          {/* ── Form ── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="lg:col-span-3 order-2 lg:order-1"
          >
            {isSuccess ? (
               <div className="glass-panel p-10 rounded-2xl text-center h-full flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mb-5">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight mb-3">Message Sent!</h3>
                <p className="text-muted-foreground mb-8 max-w-sm font-light leading-relaxed">
                  Thank you! I've received your message and will respond as soon as possible.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
               <div className="glass-panel p-7 md:p-9 rounded-2xl">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Name</FormLabel>
                            <FormControl>
                               <Input data-testid="input-contact-name" placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Email</FormLabel>
                            <FormControl>
                               <Input data-testid="input-contact-email" placeholder="you@company.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Subject <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                          <FormControl>
                             <Input data-testid="input-contact-subject" placeholder="What are we making?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="body"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Message</FormLabel>
                          <FormControl>
                            <Textarea
                               data-testid="input-contact-message"
                               placeholder="Tell me about the problem, the people, and what you have tried..."
                              className="min-h-[180px] resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                       data-testid="button-contact-submit"
                      className="w-full h-11 rounded-full text-sm font-medium shadow-[0_4px_14px_rgba(83,58,253,0.3)]"
                      disabled={createMessage.isPending}
                    >
                      {createMessage.isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Sending…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Send Message <Send className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </motion.div>

          {/* ── Contact Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.14 }}
            className="lg:col-span-2 order-1 lg:order-2 space-y-3"
          >
            {CONTACT_ITEMS.map((item) => (
              <div
                key={item.label}
                 className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[.03] shadow-sm hover:border-primary/25 hover:bg-white/[.05] transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate block"
                    >
                      {item.display}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-foreground">{item.display}</p>
                  )}
                </div>
                {item.copyValue && (
                  <CopyButton value={item.copyValue} label={item.label} />
                )}
              </div>
            ))}

            {/* WhatsApp quick chat CTA */}
             <div className="mt-4 p-5 rounded-xl border border-primary/25 bg-primary/[.08] text-foreground">
              <div className="flex items-start gap-3">
                 <div className="text-primary mt-0.5">
                   <svg viewBox="0 0 24 24" className="w-5 h-5 fill-primary">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.55 4.1 1.515 5.829L.057 23.882a.5.5 0 0 0 .613.613l6.053-1.458A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.96 0-3.8-.53-5.38-1.456l-.386-.228-3.993.962.98-3.895-.251-.4A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Prefer a quick chat?</h4>
                   <p className="text-muted-foreground text-xs mb-3 leading-relaxed">
                    Send a WhatsApp message for faster responses — usually within a few hours.
                  </p>
                  <a
                    href="https://wa.me/2348102344943"
                    target="_blank"
                    rel="noopener noreferrer"
                     className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-[#090a16] text-xs font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Open WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Availability badge */}
             <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[.06]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
               <p className="text-sm text-emerald-300 font-medium">Available for new projects</p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
