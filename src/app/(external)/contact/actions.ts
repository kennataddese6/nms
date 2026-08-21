"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface PublicEnquiryInput {
  type: "ENQUIRY" | "TOUR";
  name: string;
  email: string;
  phone: string;
  message?: string;
  classroom?: string;
  visitDate?: string;
  timeSlot?: string;
  childAge?: string;
  branch?: string;
}

export async function submitContactFormAction(data: PublicEnquiryInput) {
  const adminClient = createAdminClient();

  const nameParts = data.name.trim().split(" ");
  const firstName = nameParts[0] || data.name.trim();
  const lastName = nameParts.slice(1).join(" ") || "(Enquiry Visitor)";
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanPhone = data.phone.trim();

  // 1. Find or create profile record for email
  let profileId: string | null = null;
  const { data: existingProfiles } = await adminClient.from("profiles").select("id").eq("email", cleanEmail);

  if (existingProfiles && existingProfiles.length > 0) {
    profileId = existingProfiles[0].id;
  } else {
    // Create new profile record
    const { data: newProfile, error: profileErr } = await adminClient
      .from("profiles")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: cleanEmail,
        phone: cleanPhone,
      })
      .select("id")
      .single();

    if (profileErr || !newProfile) {
      throw new Error(profileErr?.message || "Failed to create visitor profile.");
    }
    profileId = newProfile.id;
  }

  // 2. Find or create parent record for profile
  let parentId: string | null = null;
  const { data: existingParents } = await adminClient.from("parents").select("id").eq("profile_id", profileId);

  if (existingParents && existingParents.length > 0) {
    parentId = existingParents[0].id;
  } else {
    const { data: newParent, error: parentErr } = await adminClient
      .from("parents")
      .insert({
        profile_id: profileId,
      })
      .select("id")
      .single();

    if (parentErr || !newParent) {
      throw new Error(parentErr?.message || "Failed to create parent record.");
    }
    parentId = newParent.id;
  }

  // 3. Create chat thread
  const isTour = data.type === "TOUR";
  const subject = isTour
    ? `[Nursery Tour Request] ${data.visitDate || ""} (${data.timeSlot || ""})`
    : `[Website General Enquiry] ${firstName} ${lastName}`;

  const { data: thread, error: threadErr } = await adminClient
    .from("chat_threads")
    .insert({
      parent_id: parentId,
      subject,
    })
    .select("id")
    .single();

  if (threadErr || !thread) {
    throw new Error(threadErr?.message || "Failed to create message thread.");
  }

  // 4. Build message content body
  let messageContent = "";
  if (isTour) {
    messageContent =
      `🎒 NURSERY TOUR BOOKING REQUEST\n\n` +
      `• Parent Name: ${data.name}\n` +
      `• Email: ${cleanEmail}\n` +
      `• Phone: ${cleanPhone}\n` +
      `• Preferred Visit Date: ${data.visitDate || "N/A"}\n` +
      `• Time Slot: ${data.timeSlot || "N/A"}\n` +
      `• Classroom Interest: ${data.classroom || "N/A"}\n` +
      `• Child's Age / Start: ${data.childAge || "N/A"}\n` +
      `• Branch Location: ${data.branch || "Branch 1"}\n\n` +
      `Submitted via Bubbly Day Nursery public website.`;
  } else {
    messageContent =
      `✉️ WEBSITE GENERAL ENQUIRY\n\n` +
      `• Sender: ${data.name}\n` +
      `• Email: ${cleanEmail}\n` +
      `• Phone: ${cleanPhone}\n\n` +
      `Message Details:\n${data.message || "(No message provided)"}\n\n` +
      `Submitted via Bubbly Day Nursery public website.`;
  }

  // 5. Insert first message into thread
  const { error: msgErr } = await adminClient.from("chat_messages").insert({
    thread_id: thread.id,
    sender_id: profileId,
    message: messageContent,
    is_read: false,
  });

  if (msgErr) {
    throw new Error(msgErr.message || "Failed to record message body.");
  }

  return { success: true, threadId: thread.id };
}
