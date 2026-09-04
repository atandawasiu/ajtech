import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdminLogin } from "@workspace/api-client-react";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useAdminLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    login.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Welcome back, AJ" });
        setLocation("/admin/dashboard");
      },
      onError: () => {
        form.setError("password", { message: "Incorrect password" });
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: "Check your password and try again.",
        });
      }
    });
  };

  return (
    <div className="site-shell min-h-[100dvh] bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient mesh backdrop inspired by DESIGN.md */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-accent/6 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/4 blur-[140px]" />
      </div>

      <div className="w-full max-w-[420px] relative">
        {/* Back link */}
        <button
          data-testid="button-login-back"
          onClick={() => setLocation("/")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to site
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 mb-5 shadow-[0_0_35px_rgba(104,167,255,.14)]">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <p className="eyebrow mb-3">Private workspace</p>
          <h1 className="text-3xl font-bold tracking-tight mb-1.5 text-slate-100">Admin Access</h1>
          <p className="text-muted-foreground text-sm">Enter your password to manage the AJTech studio.</p>
        </div>

        {/* Card */}
         <div className="glass-panel rounded-2xl p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <input
                type="text"
                name="username"
                value="admin"
                readOnly
                autoComplete="username"
                tabIndex={-1}
                className="sr-only"
                data-testid="input-admin-username"
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••••"
                        autoComplete="current-password"
                        className="h-11"
                         data-testid="input-admin-password"
                         {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 rounded-full text-sm font-medium"
                disabled={login.isPending}
                data-testid="button-admin-login"
              >
                {login.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Verifying…
                  </span>
                ) : "Sign in"}
              </Button>
            </form>
          </Form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          ajTech Admin · Portfolio CMS
        </p>
      </div>
    </div>
  );
}
