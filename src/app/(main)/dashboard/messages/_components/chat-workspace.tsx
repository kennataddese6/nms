"use client";

import * as React from "react";

import { AlertCircle, Clock, HelpCircle, Inbox, MessageSquare, Plus, Send, User } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { getThreadMessagesAction, sendChatMessageAction } from "../actions";

interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface Thread {
  id: string;
  parent_id: string;
  room_id: string | null;
  subject: string;
  created_at: string;
  parents: {
    id: string;
    profiles: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

interface ChatWorkspaceProps {
  initialThreads: Thread[];
  currentUserProfile: any;
  isStaff: boolean;
  parentRecordId: string | null;
}

export function ChatWorkspace({ initialThreads, currentUserProfile, isStaff, parentRecordId }: ChatWorkspaceProps) {
  const supabase = createClient();
  const [threads, setThreads] = React.useState<Thread[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = React.useState<string | null>(
    initialThreads.length > 0 ? initialThreads[0].id : null,
  );
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = React.useState("");
  const [loadingMessages, setLoadingMessages] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // New thread form states
  const [newThreadSubject, setNewThreadSubject] = React.useState("");
  const [newThreadFirstMessage, setNewThreadFirstMessage] = React.useState("");
  const [creatingThread, setCreatingThread] = React.useState(false);

  const activeThread = threads.find((t) => t.id === activeThreadId);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages helper
  const fetchMessages = React.useCallback(async () => {
    if (!activeThreadId) return;
    try {
      const res = await getThreadMessagesAction(activeThreadId);
      setMessages(res.messages || []);
    } catch (err: any) {
      console.error("Failed to load messages:", err.message);
    }
  }, [activeThreadId]);

  // Handle active thread message loading and Realtime subscription
  React.useEffect(() => {
    if (!activeThreadId) return;

    setLoadingMessages(true);
    fetchMessages().finally(() => setLoadingMessages(false));

    // Subscribe to chat_messages insertions in real-time
    const channel = supabase
      .channel(`thread:${activeThreadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `thread_id=eq.${activeThreadId}`,
        },
        () => {
          // Re-fetch to get messages + joined profile metadata
          fetchMessages();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeThreadId, fetchMessages, supabase]);

  // Scroll to bottom whenever messages list updates
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message submit handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeThreadId) return;

    const messageToSend = newMessageText.trim();
    setNewMessageText(""); // optimistic clear

    try {
      const res = await sendChatMessageAction(activeThreadId, messageToSend);
      if (res.message) {
        setMessages((prev) => [...prev, res.message]);
      }
    } catch (err: any) {
      toast.error("Failed to send message", { description: err.message });
      setNewMessageText(messageToSend); // restore on error
    }
  };

  // Create new thread submit handler (Parent only)
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadSubject.trim() || !newThreadFirstMessage.trim() || !parentRecordId) {
      toast.error("Validation Error", {
        description: "Please enter a subject and your first message.",
      });
      return;
    }

    setCreatingThread(true);
    try {
      // 1. Insert Thread
      const { data: threadData, error: threadErr } = await supabase
        .from("chat_threads")
        .insert({
          parent_id: parentRecordId,
          subject: newThreadSubject.trim(),
        })
        .select(`
          *,
          parents!chat_threads_parent_id_fkey (
            id,
            profiles (
              first_name,
              last_name,
              email
            )
          )
        `)
        .single();

      if (threadErr) throw threadErr;

      // 2. Insert First Message
      const { error: msgErr } = await supabase.from("chat_messages").insert({
        thread_id: threadData.id,
        sender_id: currentUserProfile.id,
        message: newThreadFirstMessage.trim(),
      });

      if (msgErr) throw msgErr;

      // Update state
      setThreads((prev) => [threadData, ...prev]);
      setActiveThreadId(threadData.id);
      setIsDrawerOpen(false);

      // Clear forms
      setNewThreadSubject("");
      setNewThreadFirstMessage("");

      toast.success("Thread Started", {
        description: "Your enquiry has been submitted. A nursery representative will respond shortly.",
      });
    } catch (err: any) {
      toast.error("Enquiry failed", {
        description: err.message || "Could not start chat thread.",
      });
    } finally {
      setCreatingThread(false);
    }
  };

  return (
    <div className="py-6 px-4 md:px-8 space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      {/* Title section */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" /> Messages
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time admissions and nursery support messaging board.
          </p>
        </div>

        {/* Start Chat Button (Only visible to parents to initiate enquiries) */}
        {!isStaff && parentRecordId && (
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button className="rounded-full shrink-0">
                <Plus className="h-4 w-4 mr-1.5" /> New Enquiry
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md rounded-l-3xl">
              <SheetHeader className="pb-4 border-b">
                <SheetTitle>Start a New Enquiry</SheetTitle>
                <SheetDescription>Send a query to the Bubbly Day Nursery office team.</SheetDescription>
              </SheetHeader>
              <form onSubmit={handleCreateThread} className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground" htmlFor="subject">
                    Subject / Topic *
                  </label>
                  <Input
                    id="subject"
                    value={newThreadSubject}
                    onChange={(e) => setNewThreadSubject(e.target.value)}
                    placeholder="e.g. Schedule adjustment or Billing query"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground" htmlFor="message">
                    Your Message *
                  </label>
                  <Textarea
                    id="message"
                    value={newThreadFirstMessage}
                    onChange={(e) => setNewThreadFirstMessage(e.target.value)}
                    placeholder="Describe your enquiry details..."
                    rows={5}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="ghost" onClick={() => setIsDrawerOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creatingThread}>
                    {creatingThread ? "Submitting..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Main chat layout */}
      <div className="flex-1 min-h-0 border rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 bg-card">
        {/* Left Side: Threads Sidebar */}
        <div className="md:col-span-4 border-r flex flex-col h-full bg-neutral-50/50 dark:bg-neutral-950/20">
          <div className="p-4 border-b shrink-0">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <Inbox className="h-4 w-4 text-primary" /> Active Enquiries
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y">
            {threads.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">No active conversations found.</div>
            ) : (
              threads.map((t) => {
                const isSelected = t.id === activeThreadId;
                const contactName = isStaff
                  ? `${t.parents?.profiles?.first_name || ""} ${t.parents?.profiles?.last_name || ""}`
                  : "Nursery Office / Staff";

                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveThreadId(t.id)}
                    className={`p-4 cursor-pointer hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 transition-colors ${
                      isSelected ? "bg-white dark:bg-neutral-900/40 border-l-4 border-primary" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-xs text-foreground line-clamp-1">{t.subject}</span>
                      <span className="text-[9px] text-muted-foreground font-semibold shrink-0">
                        {new Date(t.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 block">{contactName}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-neutral-900/20">
          {activeThread ? (
            <>
              {/* Header */}
              <div className="p-4 border-b shrink-0 flex items-center justify-between bg-neutral-50/20 dark:bg-neutral-900/25">
                <div>
                  <h3 className="font-bold text-sm text-foreground">{activeThread.subject}</h3>
                  <span className="text-[10px] text-muted-foreground">
                    Thread Started: {new Date(activeThread.created_at).toLocaleString()}
                  </span>
                </div>
                {isStaff && (
                  <Badge variant="outline" className="text-[10px]">
                    Client: {activeThread.parents?.profiles?.first_name} {activeThread.parents?.profiles?.last_name}
                  </Badge>
                )}
              </div>

              {/* Chat Message Logs */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingMessages ? (
                  <div className="text-center text-xs text-muted-foreground py-8">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-muted-foreground py-8">No messages in this thread.</div>
                ) : (
                  messages.map((msg) => {
                    const isOwnMessage = msg.sender_id === currentUserProfile.id;
                    const senderName = isOwnMessage
                      ? "Me"
                      : `${msg.sender?.first_name || ""} ${msg.sender?.last_name || ""}`;
                    const msgTime = new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div key={msg.id} className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
                        <div
                          className={`max-w-md rounded-2xl p-3 text-xs leading-relaxed ${
                            isOwnMessage
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-tl-none border"
                          }`}
                        >
                          {msg.message}
                        </div>
                        <span className="text-[9px] text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                          {senderName} • {msgTime}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form (Parent Only) / Staff Quick Contact Banner */}
              {isStaff ? (
                <div className="p-4 border-t shrink-0 bg-muted/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <span className="text-sm">📞</span>
                    <span>
                      Contact parent directly via phone or email.
                    </span>
                  </div>
                  {activeThread?.parents?.profiles?.email && (
                    <a
                      href={`mailto:${activeThread.parents.profiles.email}`}
                      className="inline-flex items-center gap-1 font-bold text-primary hover:underline bg-primary/10 px-3.5 py-1.5 rounded-full"
                    >
                      ✉️ Email Parent Direct
                    </a>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t shrink-0 flex gap-2 bg-neutral-50/20 dark:bg-neutral-900/25"
                >
                  <Input
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type your message here..."
                    className="rounded-full text-xs"
                    required
                  />
                  <Button type="submit" size="icon" className="rounded-full shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Inbox className="h-10 w-10 text-neutral-300 mb-2" />
              <h4 className="font-bold text-foreground text-sm">No selected conversation</h4>
              <p className="text-xs max-w-xs mx-auto mt-1">
                Select an enquiry thread from the sidebar list, or click "New Enquiry" to start a chat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
