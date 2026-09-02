import { Settings, User, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettings() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Settings</h2>
        <p className="text-muted-foreground">Manage your account and platform preferences.</p>
      </div>

      <div className="grid gap-6">
        <div className="p-6 md:p-8 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
            <User className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold">Profile Settings</h3>
          </div>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-sm font-medium mb-1 block">Display Name</label>
              <input 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value="AJ"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value="atandawasiu13@email.com"
                readOnly
              />
            </div>
            <Button className="mt-4" disabled>Save Changes</Button>
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
            <Shield className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold">Security</h3>
          </div>
          <div className="space-y-4 max-w-md">
            <p className="text-sm text-muted-foreground mb-4">
              Update your admin password to keep your portfolio secure.
            </p>
            <div>
              <label className="text-sm font-medium mb-1 block">Current Password</label>
              <input 
                type="password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">New Password</label>
              <input 
                type="password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Button className="mt-4" disabled>Update Password</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
