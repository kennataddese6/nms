import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  Activity,
  Baby,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Coffee,
  ShieldAlert,
  Sparkles,
  Utensils,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChildProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Get logged in Auth identity
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/v1/login");
  }

  // 2. Fetch Child details with room info
  const { data: child, error: childError } = await supabase
    .from("children")
    .select(`
      *,
      rooms (
        name,
        min_age_months,
        max_age_months
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (childError || !child) {
    notFound();
  }

  // 3. Fetch Parent link relationship details
  const { data: parentLinks } = await supabase
    .from("child_parents")
    .select(`
      relationship,
      primary_contact,
      parents (
        address,
        profiles (
          first_name,
          last_name,
          email,
          phone
        )
      )
    `)
    .eq("child_id", child.id);

  // 4. Fetch Child's Daily Activity Logs (chronological descending order)
  const { data: logs } = await supabase
    .from("daily_activity_logs")
    .select("*")
    .eq("child_id", child.id)
    .order("logged_at", { ascending: false });

  // Calculate age from DOB
  const calculateAge = (dobString: string) => {
    if (!dobString) return "N/A";
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    const months = ageDate.getUTCMonth();

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}`;
    }
    return `${months} month${months > 1 ? "s" : ""}`;
  };

  const ageText = calculateAge(child.date_of_birth);

  return (
    <div className="py-6 px-4 md:px-8 space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/parent">
          <Button variant="ghost" size="sm" className="rounded-full">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Button>
        </Link>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">
          Daily Log Tracker
        </Badge>
      </div>

      {/* Child Header Card */}
      <div className="p-6 rounded-3xl border bg-primary/5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <Baby className="h-9 w-9" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              {child.first_name} {child.last_name}
            </h1>
            <p className="text-muted-foreground text-xs mt-0.5">
              Age: {ageText} • DOB: {child.date_of_birth} • Gender: {child.gender}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1.5">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Classroom Assignment</span>
          <Badge className="bg-primary text-primary-foreground font-bold">
            {child.rooms?.name || "Unassigned / Waiting List"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Daily Activity Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Today's Timeline
          </h2>

          {!logs || logs.length === 0 ? (
            <Card className="rounded-3xl border-dashed py-12 text-center">
              <CardContent>
                <Activity className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <h4 className="font-bold text-foreground text-sm">No activity logs recorded today</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                  Activities logged by nursery staff will appear here in real-time.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative pl-6 border-l-2 border-primary/20 ml-3 space-y-6">
              {logs.map((log) => {
                const logTime = new Date(log.logged_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                // Set Icon & styles according to log type
                let icon = <Activity className="h-4 w-4" />;
                let colorClass = "bg-blue-100 text-blue-700 border-blue-200";
                let title = log.activity_type;

                if (log.activity_type === "CHECK_IN") {
                  icon = <CheckCircle2 className="h-4 w-4" />;
                  colorClass = "bg-emerald-100 text-emerald-700 border-emerald-200";
                  title = "Checked In";
                } else if (log.activity_type === "CHECK_OUT") {
                  icon = <XCircle className="h-4 w-4" />;
                  colorClass = "bg-amber-100 text-amber-700 border-amber-200";
                  title = "Checked Out";
                } else if (log.activity_type === "MEAL") {
                  icon = <Utensils className="h-4 w-4" />;
                  colorClass = "bg-pink-100 text-pink-700 border-pink-200";
                  title = log.details?.meal_name || "Meal";
                } else if (log.activity_type === "NAP") {
                  icon = <Coffee className="h-4 w-4" />;
                  colorClass = "bg-indigo-100 text-indigo-700 border-indigo-200";
                  title = "Nap Time";
                } else if (log.activity_type === "DIAPER") {
                  icon = <Baby className="h-4 w-4" />;
                  colorClass = "bg-amber-100 text-amber-700 border-amber-200";
                  title = "Diaper Change";
                } else if (log.activity_type === "OBSERVATION") {
                  icon = <Sparkles className="h-4 w-4" />;
                  colorClass = "bg-purple-100 text-purple-700 border-purple-200";
                  title = log.details?.title || "Learning Observation";
                }

                return (
                  <div key={log.id} className="relative">
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-[35px] top-1.5 h-6 w-6 rounded-full border-2 flex items-center justify-center ${colorClass}`}
                    >
                      {icon}
                    </div>

                    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                          {title}
                        </CardTitle>
                        <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {logTime}
                        </span>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-xs text-muted-foreground space-y-2">
                        {/* Render details layout depending on log type */}
                        {log.activity_type === "MEAL" && (
                          <div className="space-y-1">
                            <div>
                              Portion Eaten:{" "}
                              <Badge variant="outline" className="ml-1 text-[10px]">
                                {log.details?.portion_eaten}
                              </Badge>
                            </div>
                            {log.details?.notes && (
                              <p className="italic mt-1 text-neutral-600">"{log.details.notes}"</p>
                            )}
                          </div>
                        )}
                        {log.activity_type === "NAP" && (
                          <div className="space-y-1">
                            <div>
                              Duration:{" "}
                              <span className="font-bold text-foreground">{log.details?.duration_minutes} minutes</span>
                            </div>
                            <div className="text-[10px]">
                              Time frame: {log.details?.start_time} - {log.details?.end_time}
                            </div>
                            {log.details?.notes && (
                              <p className="italic mt-1 text-neutral-600">"{log.details.notes}"</p>
                            )}
                          </div>
                        )}
                        {log.activity_type === "DIAPER" && (
                          <div className="space-y-1">
                            <div>
                              Status: <span className="font-bold text-foreground">{log.details?.status}</span>
                            </div>
                            {log.details?.notes && (
                              <p className="italic mt-1 text-neutral-600">"{log.details.notes}"</p>
                            )}
                          </div>
                        )}
                        {log.activity_type === "CHECK_IN" && (
                          <div className="space-y-1">
                            <div>
                              Dropped off by:{" "}
                              <span className="font-bold text-foreground">
                                {log.details?.authorized_pickup || "Parent"}
                              </span>
                            </div>
                            {log.details?.notes && (
                              <p className="italic mt-1 text-neutral-600">"{log.details.notes}"</p>
                            )}
                          </div>
                        )}
                        {log.activity_type === "CHECK_OUT" && (
                          <div className="space-y-1">
                            <div>
                              Picked up by:{" "}
                              <span className="font-bold text-foreground">
                                {log.details?.authorized_pickup || "Parent"}
                              </span>
                            </div>
                            {log.details?.notes && (
                              <p className="italic mt-1 text-neutral-600">"{log.details.notes}"</p>
                            )}
                          </div>
                        )}
                        {log.activity_type === "OBSERVATION" && (
                          <div className="space-y-1 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                            <p className="text-foreground font-semibold">{log.details?.description}</p>
                            {log.details?.eyfs_milestone_code && (
                              <Badge className="bg-purple-100 text-purple-700 border-purple-200 mt-1.5 text-[9px]">
                                EYFS Target: {log.details.eyfs_milestone_code}
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Profile Specs, Consents, Contacts */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Child Health & Consents
          </h2>

          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Health & Medical</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Allergies:</span>
                <span className={`font-bold ${child.allergies ? "text-destructive" : "text-emerald-600"}`}>
                  {child.allergies || "None"}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-b pb-2">
                <span className="text-muted-foreground">Medical Conditions / Notes:</span>
                <span className="font-semibold text-foreground">
                  {child.medical_notes || "No medical conditions reported."}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Consents & Approvals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2 items-center">
                <span className="text-muted-foreground">Emergency Medical Care:</span>
                <Badge
                  variant={child.emergency_medical_consent ? "outline" : "destructive"}
                  className={child.emergency_medical_consent ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}
                >
                  {child.emergency_medical_consent ? "GRANTED" : "DENIED"}
                </Badge>
              </div>
              <div className="flex justify-between border-b pb-2 items-center">
                <span className="text-muted-foreground">Photo & Media Consent:</span>
                <Badge
                  variant={child.photo_consent ? "outline" : "secondary"}
                  className={child.photo_consent ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}
                >
                  {child.photo_consent ? "GRANTED" : "DENIED"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Parent Relationships</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!parentLinks || parentLinks.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center">No mapped parent contacts.</p>
              ) : (
                parentLinks.map((link: any, idx: number) => {
                  const p = link.parents?.profiles;
                  if (!p) return null;
                  return (
                    <div key={idx} className="p-3 border rounded-2xl bg-neutral-50/50 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-foreground">
                          {p.first_name} {p.last_name}
                        </span>
                        <Badge variant="outline" className="text-[9px]">
                          {link.relationship}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground space-y-0.5 text-[11px]">
                        <div>Email: {p.email}</div>
                        <div>Phone: {p.phone || "—"}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
