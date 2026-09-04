import { useListMessages, useMarkMessageRead, getListMessagesQueryKey, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, Calendar, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminMessages() {
  const { data: messages, isLoading, isError } = useListMessages();
  const markRead = useMarkMessageRead();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const handleMarkRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    markRead.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        toast({ title: "Marked as read" });
      },
      onError: () => toast({
        variant: "destructive",
        title: "Couldn't mark as read",
        description: "Please try again.",
      }),
    });
  };

  const handleOpenMessage = (msg: any) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      handleMarkRead(msg.id);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Messages</h2>
        <p className="text-muted-foreground">Inquiries from the contact form.</p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading messages...</div>
        ) : isError ? (
          <div className="p-10 text-center text-destructive">
            Messages could not be loaded. Refresh and try again.
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="divide-y divide-border">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 flex items-start gap-4 transition-colors cursor-pointer hover:bg-muted/50 ${
                  !msg.read ? "bg-primary/5" : ""
                }`}
              >
                <div className="mt-1">
                  {!msg.read ? (
                    <Mail className="w-5 h-5 text-primary" />
                  ) : (
                    <MailOpen className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className={`font-medium truncate ${!msg.read ? "text-foreground" : "text-muted-foreground"}`}>
                      {msg.name} <span className="text-sm font-normal text-muted-foreground ml-2">&lt;{msg.email}&gt;</span>
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm truncate mb-1 ${!msg.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                    {msg.subject || "No Subject"}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {msg.body}
                  </p>
                </div>
                {!msg.read && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="shrink-0"
                    onClick={(e) => handleMarkRead(msg.id, e)}
                    disabled={markRead.isPending}
                  >
                    Mark read
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MailOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Inbox Empty</h3>
            <p className="text-muted-foreground">You don't have any messages yet.</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedMessage?.subject || "No Subject"}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {selectedMessage?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{selectedMessage?.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <a href={`mailto:${selectedMessage?.email}`} className="hover:text-primary">
                      {selectedMessage?.email}
                    </a>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {selectedMessage && new Date(selectedMessage.createdAt).toLocaleString()}
              </div>
            </div>
            
            <div className="p-6 rounded-lg border border-border bg-card whitespace-pre-wrap text-sm md:text-base">
              {selectedMessage?.body}
            </div>
            
            <div className="flex justify-end">
              <Button asChild>
                <a href={`mailto:${selectedMessage?.email}?subject=Re: ${selectedMessage?.subject || 'Your inquiry'}`}>
                  Reply via Email
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
