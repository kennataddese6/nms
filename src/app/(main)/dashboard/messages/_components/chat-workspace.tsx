"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import {
  ChevronDown,
  ChevronUp,
  Inbox,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Search,
  Send,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      phone?: string;
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
  const [expandedId, setExpandedId] = React.useState<string | null>(
    initialThreads.length > 0 ? initialThreads[0].id : null,
  );
  const [messagesMap, setMessagesMap] = React.useState<Record<string, Message[]>>({});
  const [loadingMap, setLoadingMap] = React.useState<Record<string, boolean>>({});

  const [replyTextMap, setReplyTextMap] = React.useState<Record<string, string>>({});
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // New thread form states
  const [newThreadSubject, setNewThreadSubject] = React.useState("");
  const [newThreadFirstMessage, setNewThreadFirstMessage] = React.useState("");
  const [creatingThread, setCreatingThread] = React.useState(false);

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

  // Fetch thread messages helper
  const loadThreadMessages = React.useCallback(async (threadId: string) => {
    setLoadingMap((prev) => ({ ...prev, [threadId]: true }));
    try {
      const res = await getThreadMessagesAction(threadId);
      setMessagesMap((prev) => ({ ...prev, [threadId]: res.messages || [] }));
    } catch (err: any) {
      console.error("Failed to load messages:", err.message);
    } finally {
      setLoadingMap((prev) => ({ ...prev, [threadId]: false }));
    }
  }, []);

  // Expand / Toggle thread accordion card
  const toggleAccordion = (threadId: string) => {
    if (expandedId === threadId) {
      setExpandedId(null);
    } else {
      setExpandedId(threadId);
      if (!messagesMap[threadId]) {
        loadThreadMessages(threadId);
      }
    }
  };

  // Auto load expanded thread messages on initial render or active thread change
  React.useEffect(() => {
    if (expandedId && !messagesMap[expandedId]) {
      loadThreadMessages(expandedId);
    }
  }, [expandedId, loadThreadMessages, messagesMap]);

  // Send message reply handler
  const handleSendReply = async (threadId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = replyTextMap[threadId]?.trim();
    if (!text) return;

    setReplyTextMap((prev) => ({ ...prev, [threadId]: "" }));

    try {
      const res = await sendChatMessageAction(threadId, text);
      if (res.message) {
        setMessagesMap((prev) => ({
          ...prev,
          [threadId]: [...(prev[threadId] || []), res.message],
        }));
      }
    } catch (err: any) {
      toast.error("Failed to send message", { description: err.message });
      setReplyTextMap((prev) => ({ ...prev, [threadId]: text }));
    }
  };

  // Delete Thread Handler
  const handleDeleteThread = async (threadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this enquiry message?")) return;

    try {
      await deleteThreadAction(threadId);
      setThreads((prev) => prev.filter((t) => t.id !== threadId));
      if (expandedId === threadId) {
        setExpandedId(null);
      }
      toast.success("Enquiry deleted successfully");
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to delete enquiry", { description: err.message });
    }
  };

  // Delete Single Message Handler
  const handleDeleteMessage = async (threadId: string, messageId: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMessageAction(messageId);
      setMessagesMap((prev) => ({
        ...prev,
        [threadId]: (prev[threadId] || []).filter((m) => m.id !== messageId),
      }));
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
        description: "Please enter a subject and your message.",
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
              email,
              phone
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
      setExpandedId(threadData.id);
      loadThreadMessages(threadData.id);
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
    <div className="py-6 px-4 md:px-8 space-y-6 max-w-6xl mx-auto">
      {/* Title & Controls Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" /> Parent Messages & Enquiries
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isStaff
              ? "Simple message cards list. Click any row to expand details, respond, or delete."
              : "Send and review messages with the Bubbly Day Nursery office team."}
          </p>
        </div>

        {/* Start New Enquiry Button (Parent) */}
        {!isStaff && parentRecordId && (
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button className="rounded-full shrink-0">
                <Plus className="h-4 w-4 mr-1.5" /> Send New Enquiry
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md rounded-l-3xl">
              <SheetHeader className="pb-4 border-b">
                <SheetTitle>Send New Enquiry</SheetTitle>
                <SheetDescription>Submit a message to Bubbly Day Nursery office.</SheetDescription>
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search enquiries by subject, parent name, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 h-11 text-xs sm:text-sm rounded-2xl border-2"
        />
      </div>

      {/* Accordion List of Messages (1 Horizontal Line per Card) */}
      <div className="space-y-3">
        {filteredThreads.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground border-dashed rounded-3xl">
            <Inbox className="h-10 w-10 mx-auto mb-2 text-neutral-300" />
            <h3 className="font-bold text-foreground text-base">No messages found</h3>
            <p className="text-xs mt-1">There are no parent enquiry messages matching your view.</p>
          </Card>
        ) : (
          filteredThreads.map((t) => {
            const isExpanded = expandedId === t.id;
            const parentProfile = t.parents?.profiles;
            const parentName = isStaff
              ? `${parentProfile?.first_name || ""} ${parentProfile?.last_name || ""}`.trim() || "Parent"
              : "Nursery Office";
            const parentEmail = parentProfile?.email;
            const parentPhone = parentProfile?.phone;

            const threadMsgs = messagesMap[t.id] || [];
            const isLoading = loadingMap[t.id];

            return (
              <div
                key={t.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-card ${
                  isExpanded ? "ring-2 ring-primary/30 shadow-md" : "hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                {/* Accordion Header Bar (One Horizontal Line) */}
                <div
                  onClick={() => toggleAccordion(t.id)}
                  className="flex items-center justify-between p-4 cursor-pointer select-none gap-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* User Icon */}
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      👤
                    </div>

                    {/* Sender & Subject Line */}
                    <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-12 items-center gap-2">
                      <div className="md:col-span-4 min-w-0">
                        <span className="font-extrabold text-sm text-foreground truncate block">
                          {parentName}
                        </span>
                        {isStaff && parentEmail && (
                          <span className="text-[11px] text-muted-foreground truncate block">{parentEmail}</span>
                        )}
                      </div>

                      <div className="md:col-span-8 min-w-0 flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-bold shrink-0 hidden sm:inline-flex">
                          Enquiry
                        </Badge>
                        <span className="font-medium text-xs text-foreground/90 truncate">{t.subject}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Date, Delete Button, Expand Arrow */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-semibold text-muted-foreground hidden sm:inline-block">
                      {new Date(t.created_at).toLocaleDateString()}
                    </span>

                    {/* Quick Delete Icon (Staff) */}
                    {isStaff && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                        onClick={(e) => handleDeleteThread(t.id, e)}
                        title="Delete Enquiry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Accordion Body */}
                {isExpanded && (
                  <div className="border-t bg-muted/10 p-5 sm:p-6 space-y-5 animate-in fade-in duration-150">
                    {/* Staff Direct Contact Buttons */}
                    {isStaff && (
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-card border text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                          <span>Contact Parent:</span>
                          <span className="font-bold text-foreground">{parentName}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {parentEmail && (
                            <a
                              href={`mailto:${parentEmail}`}
                              className="inline-flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors"
                            >
                              <Mail className="h-3.5 w-3.5" /> Email
                            </a>
                          )}
                          {parentPhone && (
                            <>
                              <a
                                href={`tel:${parentPhone}`}
                                className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors border border-emerald-200"
                              >
                                <Phone className="h-3.5 w-3.5" /> Call
                              </a>
                              <a
                                href={`sms:${parentPhone}`}
                                className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 hover:bg-sky-100 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors border border-sky-200"
                              >
                                💬 SMS
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Messages List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Message Details & History
                      </h4>

                      {isLoading ? (
                        <div className="py-6 text-center text-xs text-muted-foreground">Loading message details...</div>
                      ) : threadMsgs.length === 0 ? (
                        <div className="py-4 text-center text-xs text-muted-foreground">No message text found.</div>
                      ) : (
                        threadMsgs.map((msg) => {
                          const isOwnMessage = msg.sender_id === currentUserProfile?.id;
                          const senderLabel = isOwnMessage
                            ? "Me"
                            : `${msg.sender?.first_name || ""} ${msg.sender?.last_name || ""}`.trim() || "Sender";

                          return (
                            <div
                              key={msg.id}
                              className={`p-4 rounded-2xl border space-y-2 relative group ${
                                isOwnMessage
                                  ? "bg-primary/5 border-primary/20 ml-4 sm:ml-8"
                                  : "bg-card border-border mr-4 sm:mr-8"
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-foreground flex items-center gap-1.5">
                                  <span>{isOwnMessage ? "💬" : "👤"}</span>
                                  {senderLabel}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-muted-foreground">
                                    {new Date(msg.created_at).toLocaleString()}
                                  </span>
                                  {isStaff && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteMessage(t.id, msg.id)}
                                      title="Delete message"
                                      className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-opacity"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                {msg.message}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Reply Bar & Delete Conversation Footer */}
                    <div className="pt-3 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <form
                        onSubmit={(e) => handleSendReply(t.id, e)}
                        className="flex-1 flex gap-2"
                      >
                        <Input
                          placeholder={isStaff ? "Type reply to parent..." : "Type reply..."}
                          value={replyTextMap[t.id] || ""}
                          onChange={(e) => setReplyTextMap((prev) => ({ ...prev, [t.id]: e.target.value }))}
                          className="rounded-xl text-xs flex-1"
                        />
                        <Button type="submit" size="sm" className="rounded-xl font-bold gap-1 shrink-0">
                          <Send className="h-3.5 w-3.5" /> Reply
                        </Button>
                      </form>

                      {isStaff && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-xl font-bold text-xs gap-1.5 shrink-0"
                          onClick={() => handleDeleteThread(t.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete Enquiry
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
