"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getThreadMessagesAction(threadId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Log in required.");
  }

  const adminClient = createAdminClient();
  const { data: messages, error } = await adminClient
    .from("chat_messages")
    .select("*, sender:profiles!chat_messages_sender_id_fkey(first_name, last_name, email)")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message || "Failed to load thread messages.");
  }

  return { success: true, messages: messages || [] };
}

export async function sendChatMessageAction(threadId: string, messageText: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Log in required.");
  }

  const adminClient = createAdminClient();
  const { data: newMessage, error } = await adminClient
    .from("chat_messages")
    .insert({
      thread_id: threadId,
      sender_id: user.id,
      message: messageText.trim(),
      is_read: false,
    })
    .select("*, sender:profiles!chat_messages_sender_id_fkey(first_name, last_name, email)")
    .single();

  if (error) {
    throw new Error(error.message || "Failed to send chat message.");
  }

  return { success: true, message: newMessage };
}
