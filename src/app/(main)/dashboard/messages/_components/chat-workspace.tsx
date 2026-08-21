"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { AlertCircle, Clock, Inbox, Mail, MessageSquare, Phone, Plus, Search, Send, Trash2, User } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

import { deleteMessageAction, deleteThreadAction, getThreadMessagesAction, sendChatMessageAction } from "../actions";

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
  const router = useRouter();

  const [threads, setThreads] = React.useState<Thread[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = React.useState<string | null>(
    initialThreads.length > 0 ? initialThreads[0].id : null,
  );
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = React.useState("");
  const [loadingMessages, setLoadingMessages] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");

  // New thread form states
  const [newThreadSubject, setNewThreadSubject] = React.useState("");
  const [newThreadFirstMessage, setNewThreadFirstMessage] = React.useState("");
  const [creatingThread, setCreatingThread] = React.useState(false);

  const activeThread = threads.find((t) => t.id === activeThreadId);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Filtered threads
  const filteredThreads = React.useMemo(() => {
    if (!searchQuery.trim()) return threads;
    const q = searchQuery.toLowerCase();
    return threads.filter((t) => {
      const subjectMatch = (t.subject || "").toLowerCase().includes(q);
      const parentName = `${t.parents?.profiles?.first_name || ""} ${t.parents?.profiles?.last_name || ""}`.toLowerCase();
      const parentEmail = (t.parents?.profiles?.email || "").toLowerCase();
      return subjectMatch || parentName.includes(q) || parentEmail.includes(q);
    });
  }, [threads, searchQuery]);

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

  // Send message submit handler (Staff & Parent)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeThreadId) return;

    const messageToSend = newMessageText.trim();
    setNewMessageText("");

    try {
      const res = await sendChatMessageAction(activeThreadId, messageToSend);
      if (res.message) {
        setMessages((prev) => [...prev, res.message]);
      }
    } catch (err: any) {
      toast.error("Failed to send message", { description: err.message });
      setNewMessageText(messageToSend);
    }
  };

  // Delete Thread Handler (Staff)
  const handleDeleteThread = async (threadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this entire message thread?")) return;

    try {
      await deleteThreadAction(threadId);
      setThreads((prev) => prev.filter((t) => t.id !== threadId));
      if (activeThreadId === threadId) {
        const remaining = threads.filter((t) => t.id !== threadId);
        setActiveThreadId(remaining.length > 0 ? remaining[0].id : null);
      }
      toast.success("Message Thread Deleted");
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to delete thread", { description: err.message });
    }
  };

  // Delete Single Message Handler (Staff)
  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMessageAction(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      toast.success("Message deleted");
    } catch (err: any) {
      toast.error("Failed to delete message", { description: err.message });
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

      const { error: msgErr } = await supabase.from("chat_messages").insert({
        thread_id: threadData.id,
        sender_id: currentUserProfile.id,
        message: newThreadFirstMessage.trim(),
      });

      if (msgErr) throw msgErr;

      setThreads((prev) => [threadData, ...prev]);
      setActiveThreadId(threadData.id);
      setIsDrawerOpen(false);

      setNewThreadSubject("");
      setNewThreadFirstMessage("");

      toast.success("Enquiry Sent", {
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
            <MessageSquare className="h-8 w-8 text-primary" /> Messages & Enquiries
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isStaff
              ? "Review incoming parent enquiries, respond directly, or manage message records."
              : "Communicate directly with Bubbly Day Nursery admissions & office team."}
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
      <div className="flex-1 min-h-0 border rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 bg-card shadow-sm">
        {/* Left Side: Threads Sidebar */}
        <div className="md:col-span-4 border-r flex flex-col h-full bg-neutral-50/50 dark:bg-neutral-950/20">
          <div className="p-4 border-b shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Inbox className="h-4 w-4 text-primary" /> Conversations ({filteredThreads.length})
              </h3>
            </div>
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search subject or parent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">No conversations found.</div>
            ) : (
              filteredThreads.map((t) => {
                const isSelected = t.id === activeThreadId;
                const contactName = isStaff
                  ? `${t.parents?.profiles?.first_name || ""} ${t.parents?.profiles?.last_name || ""}`
                  : "Nursery Office / Staff";

                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveThreadId(t.id)}
                    className={`p-4 cursor-pointer hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 transition-colors group relative ${
                      isSelected ? "bg-white dark:bg-neutral-900/40 border-l-4 border-primary" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-xs text-foreground line-clamp-1 pr-6">{t.subject}</span>
                      <span className="text-[9px] text-muted-foreground font-semibold shrink-0">
                        {new Date(t.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground truncate">{contactName}</span>

                      {/* Staff Quick Delete Action */}
                      {isStaff && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteThread(t.id, e)}
                          title="Delete thread"
                          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-opacity"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
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
              <div className="p-4 border-b shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/20 dark:bg-neutral-900/25">
                <div>
                  <h3 className="font-bold text-base text-foreground">{activeThread.subject}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <span>
                      From: {activeThread.parents?.profiles?.first_name} {activeThread.parents?.profiles?.last_name}
                    </span>
                    <span>•</span>
                    <span>{new Date(activeThread.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isStaff && activeThread.parents?.profiles?.email && (
                    <a
                      href={`mailto:${activeThread.parents.profiles.email}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-full"
                    >
                      <Mail className="h-3.5 w-3.5" /> Direct Email
                    </a>
                  )}

                  {/* Delete Conversation Button for Staff */}
                  {isStaff && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold text-destructive hover:bg-destructive/10 rounded-full h-8"
                      onClick={() => handleDeleteThread(activeThread.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Thread
                    </Button>
                  )}
                </div>
              </div>

              {/* Chat Message Logs */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingMessages ? (
                  <div className="text-center text-xs text-muted-foreground py-8">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-muted-foreground py-8">No messages in this thread.</div>
                ) : (
                  messages.map((msg) => {
                    const isOwnMessage = msg.sender_id === currentUserProfile?.id;
                    const senderName = isOwnMessage
                      ? "Me"
                      : `${msg.sender?.first_name || ""} ${msg.sender?.last_name || ""}`;
                    const msgTime = new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col group ${isOwnMessage ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center gap-2 max-w-lg">
                          {/* Staff individual message delete */}
                          {isStaff && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(msg.id)}
                              title="Delete message"
                              className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-opacity"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <div
                            className={`rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                              isOwnMessage
                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-tl-none border"
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 font-medium px-1">
                          {senderName} • {msgTime}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Response Input Form for Both Staff and Parents */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t shrink-0 flex gap-2 bg-neutral-50/20 dark:bg-neutral-900/25"
              >
                <Input
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder={isStaff ? "Type a reply to parent..." : "Type your message..."}
                  className="rounded-full text-xs"
                  required
                />
                <Button type="submit" size="icon" className="rounded-full shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Inbox className="h-10 w-10 text-neutral-300 mb-2" />
              <h4 className="font-bold text-foreground text-sm">No conversation selected</h4>
              <p className="text-xs max-w-xs mx-auto mt-1">
                Select an enquiry from the sidebar list to view the message history.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
