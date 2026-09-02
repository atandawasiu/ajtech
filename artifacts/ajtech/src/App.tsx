import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";

import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";

import Home from "@/pages/public/Home";
import About from "@/pages/public/About";
import Projects from "@/pages/public/Projects";
import ProjectDetail from "@/pages/public/ProjectDetail";
import Services from "@/pages/public/Services";
import Blog from "@/pages/public/Blog";
import BlogDetail from "@/pages/public/BlogDetail";
import Contact from "@/pages/public/Contact";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminProjectForm from "@/pages/admin/AdminProjectForm";
import AdminBlog from "@/pages/admin/AdminBlog";
import AdminBlogForm from "@/pages/admin/AdminBlogForm";
import AdminMessages from "@/pages/admin/AdminMessages";
import AdminServices from "@/pages/admin/AdminServices";
import AdminServiceForm from "@/pages/admin/AdminServiceForm";
import AdminSettings from "@/pages/admin/AdminSettings";

import { useGetAdminMe, getGetAdminMeQueryKey, setBaseUrl } from "@workspace/api-client-react";
import { useEffect } from "react";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
if (configuredApiUrl) {
  setBaseUrl(configuredApiUrl);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: 30_000 },
  },
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType<any> }) {
  const [, setLocation] = useLocation();
  const { data: admin, isLoading } = useGetAdminMe({
    query: { queryKey: getGetAdminMeQueryKey(), retry: false }
  });

  useEffect(() => {
    if (!isLoading && !admin?.authenticated) setLocation("/admin/login");
  }, [admin, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!admin?.authenticated) return null;
  return <Component />;
}

function AdminRedirect() {
  const [, s] = useLocation();
  useEffect(() => { s("/admin/dashboard"); }, []);
  return null;
}

function AdminRouter() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin"                    component={AdminRedirect} />
        <Route path="/admin/login"              component={AdminLogin} />
        <Route path="/admin/dashboard"          component={() => <ProtectedRoute component={AdminDashboard} />} />
        <Route path="/admin/projects/new"       component={() => <ProtectedRoute component={AdminProjectForm} />} />
        <Route path="/admin/projects/:id/edit"  component={() => <ProtectedRoute component={AdminProjectForm} />} />
        <Route path="/admin/projects"           component={() => <ProtectedRoute component={AdminProjects} />} />
        <Route path="/admin/blog/new"           component={() => <ProtectedRoute component={AdminBlogForm} />} />
        <Route path="/admin/blog/:id/edit"      component={() => <ProtectedRoute component={AdminBlogForm} />} />
        <Route path="/admin/blog"               component={() => <ProtectedRoute component={AdminBlog} />} />
        <Route path="/admin/messages"           component={() => <ProtectedRoute component={AdminMessages} />} />
        <Route path="/admin/services/new"       component={() => <ProtectedRoute component={AdminServiceForm} />} />
        <Route path="/admin/services/:id/edit"  component={() => <ProtectedRoute component={AdminServiceForm} />} />
        <Route path="/admin/services"           component={() => <ProtectedRoute component={AdminServices} />} />
        <Route path="/admin/settings"           component={() => <ProtectedRoute component={AdminSettings} />} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function PublicRouter() {
  return (
    <PublicLayout>
      <Switch>
        <Route path="/"             component={Home} />
        <Route path="/about"        component={About} />
        <Route path="/projects"     component={Projects} />
        <Route path="/projects/:id" component={ProjectDetail} />
        <Route path="/services"     component={Services} />
        <Route path="/blog"         component={Blog} />
        <Route path="/blog/:id"     component={BlogDetail} />
        <Route path="/contact"      component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

function Router() {
  const [location] = useLocation();
  if (location.startsWith("/admin")) return <AdminRouter />;
  return <PublicRouter />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="ajtech-theme">
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
