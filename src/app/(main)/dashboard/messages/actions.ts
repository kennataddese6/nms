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

export async function deleteThreadAction(threadId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Log in required.");
  }

  const { data: roleMappings } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id);

  const roleNames =
    ((roleMappings as unknown) as Array<{ roles: { name: string } | null }>)
      ?.map((rm) => rm.roles?.name)
      .filter(Boolean) || [];
  const isStaff =
    roleNames.includes("NURSERY_MANAGER") || roleNames.includes("STAFF") || roleNames.includes("SUPER_ADMIN");

  if (!isStaff) {
    throw new Error("Forbidden: Only staff can delete message threads.");
  }

  const adminClient = createAdminClient();

  // First delete associated messages
  await adminClient.from("chat_messages").delete().eq("thread_id", threadId);

  // Then delete thread
  const { error } = await adminClient.from("chat_threads").delete().eq("id", threadId);

  if (error) {
    throw new Error(error.message || "Failed to delete message thread.");
  }

  return { success: true };
}

export async function deleteMessageAction(messageId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Log in required.");
  }

  const { data: roleMappings } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id);

  const roleNames =
    ((roleMappings as unknown) as Array<{ roles: { name: string } | null }>)
      ?.map((rm) => rm.roles?.name)
      .filter(Boolean) || [];
  const isStaff =
    roleNames.includes("NURSERY_MANAGER") || roleNames.includes("STAFF") || roleNames.includes("SUPER_ADMIN");

  if (!isStaff) {
    throw new Error("Forbidden: Only staff can delete messages.");
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("chat_messages").delete().eq("id", messageId);

  if (error) {
    throw new Error(error.message || "Failed to delete message.");
  }

  return { success: true };
}
