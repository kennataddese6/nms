const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// 1. Load env vars from .env.local
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
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[key] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Error: Missing Supabase credentials in .env.local.");
  process.exit(1);
}

// 2. Initialize client
const supabase = createClient(supabaseUrl, serviceKey);

async function listUsers() {
  console.log("Fetching registered user profiles...\n");

  // Query profiles with roles joined
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(`
      id,
      email,
      first_name,
      last_name,
      created_at,
      user_roles (
        roles (
          name
        )
      )
    `);

  if (error) {
    console.error("Database query failed:", error.message);
    process.exit(1);
  }

  if (!profiles || profiles.length === 0) {
    console.log("No registered users found in the database.");
    process.exit(0);
  }

  console.log(String.prototype.concat(
    "----------------------------------------------------------------------------------------\n",
    "  FULL NAME              |  EMAIL                    |  ACTIVE ROLES\n",
    "----------------------------------------------------------------------------------------"
  ));

  profiles.forEach((p) => {
    const fullName = `${p.first_name || ""} ${p.last_name || ""}`.padEnd(24);
    const emailStr = (p.email || "N/A").padEnd(25);
    const rolesList = p.user_roles?.map((ur) => ur.roles?.name).filter(Boolean) || [];
    const rolesStr = rolesList.length > 0 ? rolesList.join(", ") : "PARENT (Implicit)";
    console.log(`  ${fullName} |  ${emailStr} |  ${rolesStr}`);
  });

  console.log("----------------------------------------------------------------------------------------");
}

listUsers();
