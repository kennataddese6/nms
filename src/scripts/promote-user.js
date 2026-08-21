const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// 1. Parse args
const email = process.argv[2];
const roleName = process.argv[3] || "NURSERY_MANAGER";

if (!email) {
  console.error("Error: Please provide a user email address.");
  console.log("Usage: node src/scripts/promote-user.js <email> [ROLE_NAME]");
  process.exit(1);
}

// 2. Load env vars from .env.local
const envPath = path.join(__dirname, "../../.env.local");
if (!fs.existsSync(envPath)) {
  console.error("Error: .env.local file not found.");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || "";
    // Remove quotes
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[key] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.");
  process.exit(1);
}

// 3. Initialize Supabase Admin client
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function promote() {
  console.log(`Locating profile for: ${email}...`);

  // Query profile
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("id, first_name, last_name")
    .eq("email", email)
    .maybeSingle();

  if (profileErr) {
    console.error("Database query failed:", profileErr.message);
    process.exit(1);
  }

  if (!profile) {
    console.error(`Error: No registered profile found for email: ${email}`);
    process.exit(1);
  }

  console.log(`Found profile: ${profile.first_name} ${profile.last_name} (ID: ${profile.id})`);
  console.log(`Locating role ID for: ${roleName}...`);

  // Get Role ID
  const { data: role, error: roleErr } = await supabase
    .from("roles")
    .select("id")
    .eq("name", roleName.toUpperCase())
    .maybeSingle();

  if (roleErr) {
    console.error("Failed to query roles table:", roleErr.message);
    process.exit(1);
  }

  if (!role) {
    console.error(`Error: Role '${roleName}' does not exist in public.roles table.`);
    process.exit(1);
  }

  console.log(`Role ID: ${role.id}. Assigning user role...`);

  // Check if mapping exists
  const { data: existingMapping } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", profile.id)
    .eq("role_id", role.id)
    .maybeSingle();

  if (existingMapping) {
    console.log(`Success: User already has the '${roleName}' role mapping.`);
    process.exit(0);
  }

  // Insert role mapping
  const { error: insertErr } = await supabase.from("user_roles").insert({
    user_id: profile.id,
    role_id: role.id,
  });

  if (insertErr) {
    console.error("Failed to assign role:", insertErr.message);
    process.exit(1);
  }

  console.log(`Success: Promoted ${email} to ${roleName.toUpperCase()}!`);
}

promote();
