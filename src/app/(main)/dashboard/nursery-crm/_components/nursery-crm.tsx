"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Baby,
  Calendar,
  Eye,
  Layers,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { NativeSelect } from "@/components/ui/native-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

// ==========================================
// SCHEMAS
// ==========================================

const parentRegisterSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  emergencyContact: z.string().min(5, "Emergency contact details are required"),
  relationshipStatus: z.string().min(1, "Relationship status is required"),
});

type ParentFormValues = z.infer<typeof parentRegisterSchema>;

const studentRegisterSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender selection is required"),
  branch: z.string().min(1, "Branch selection is required"),
  roomId: z.string().optional(),
  medicalNotes: z.string().optional(),
  allergies: z.string().optional(),
  medicalConsent: z.boolean().refine((val) => val === true, {
    message: "Emergency medical consent is required",
  }),
  photoConsent: z.boolean(),
  parentId: z.string().min(1, "Please link a parent to the child"),
  relationship: z.string().min(2, "Please specify relationship (e.g. Mother, Father)"),
});

type StudentFormValues = z.infer<typeof studentRegisterSchema>;

// ==========================================
// PROPS & COMPONENT
// ==========================================

interface NurseryCrmProps {
  initialParents: any[];
  initialChildren: any[];
  rooms: any[];
}

export function NurseryCrm({ initialParents, initialChildren, rooms }: NurseryCrmProps) {
  const supabase = createClient();
  const router = useRouter();

  const [parents, setParents] = React.useState(initialParents);
  const [children, setChildren] = React.useState(initialChildren);

  const [parentSearch, setParentSearch] = React.useState("");
  const [studentSearch, setStudentSearch] = React.useState("");
  const [branchFilter, setBranchFilter] = React.useState<"All" | "Branch 1" | "Branch 2">("All");

  const [parentModalOpen, setParentModalOpen] = React.useState(false);
  const [studentModalOpen, setStudentModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Sync state if props change
  React.useEffect(() => {
    setParents(initialParents);
  }, [initialParents]);

  React.useEffect(() => {
    setChildren(initialChildren);
  }, [initialChildren]);

  // Forms Setup
  const parentForm = useForm<ParentFormValues>({
    resolver: zodResolver(parentRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      emergencyContact: "",
      relationshipStatus: "Married",
    },
    mode: "onTouched",
  });

  const studentForm = useForm<StudentFormValues>({
    resolver: zodResolver(studentRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      gender: "Male",
      branch: "Branch 1",
      roomId: "",
      medicalNotes: "",
      allergies: "",
      medicalConsent: false,
      photoConsent: false,
      parentId: "",
      relationship: "Mother",
    },
    mode: "onTouched",
  });

  // Handle Parent Submission
  const onParentSubmit = async (data: ParentFormValues) => {
    setSubmitting(true);
    try {
      // 1. Create User profile mapping
      const { data: newProfile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone_number: data.phone,
          role: "PARENT",
        })
        .select("id")
        .single();

      if (profileError || !newProfile) {
        throw new Error(profileError?.message || "Failed to create profile record.");
      }

      // 2. Create Parent detail record
      const { error: parentError } = await supabase.from("parents").insert({
        profile_id: newProfile.id,
        address: data.address,
        emergency_contact: data.emergencyContact,
        relationship_status: data.relationshipStatus,
      });

      if (parentError) throw parentError;

      toast.success("Parent Registered Successfully!");
      parentForm.reset();
      setParentModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error("Registration failed", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Student Submission
  const onStudentSubmit = async (data: StudentFormValues) => {
    setSubmitting(true);
    try {
      // 1. Insert child record
      const { data: newChild, error: childError } = await supabase
        .from("children")
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          date_of_birth: data.dob,
          gender: data.gender,
          branch: data.branch,
          medical_notes: data.medicalNotes || null,
          allergies: data.allergies || null,
          photo_consent: data.photoConsent,
          emergency_medical_consent: data.medicalConsent,
          status: "WAITING_LIST",
          room_id: data.roomId || null,
        })
        .select("id")
        .single();

      if (childError || !newChild) {
        throw new Error(childError?.message || "Failed to create child record.");
      }

      // 2. Insert child-parent link relationship mapping
      const { error: linkError } = await supabase.from("child_parents").insert({
        child_id: newChild.id,
        parent_id: data.parentId,
        relationship: data.relationship,
      });

      if (linkError) throw linkError;

      toast.success("Student Registered Successfully!");
      studentForm.reset();
      setStudentModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error("Registration failed", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter lists based on searches and branch
  const filteredParents = parents.filter((p) => {
    const name = `${p.profiles?.first_name || ""} ${p.profiles?.last_name || ""}`.toLowerCase();
    const email = (p.profiles?.email || "").toLowerCase();
    return name.includes(parentSearch.toLowerCase()) || email.includes(parentSearch.toLowerCase());
  });

  const filteredChildren = children.filter((c) => {
    const name = `${c.first_name || ""} ${c.last_name || ""}`.toLowerCase();
    const matchesSearch = name.includes(studentSearch.toLowerCase());
    const matchesBranch = branchFilter === "All" || c.branch === branchFilter;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-6">
      {/* Branch View Selector Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl border bg-card/60 backdrop-blur-sm shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-foreground">Select Active Branch View</h2>
          <p className="text-[11px] text-muted-foreground">Filter enrolled children by school setting.</p>
        </div>
        <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl gap-1">
          {(["All", "Branch 1", "Branch 2"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBranchFilter(b)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                branchFilter === b
                  ? "bg-white dark:bg-neutral-900 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {b === "All" ? "All Locations" : b}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
          <TabsTrigger value="students" className="rounded-lg flex gap-2">
            <Baby className="h-4 w-4" />
            Students ({filteredChildren.length})
          </TabsTrigger>
          <TabsTrigger value="parents" className="rounded-lg flex gap-2">
            <Users className="h-4 w-4" />
            Parents ({parents.length})
          </TabsTrigger>
        </TabsList>

        {/* ==========================================
          STUDENTS TAB CONTENT
         ========================================== */}
        <TabsContent value="students" className="space-y-4 focus:outline-none">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Enrolled Children</CardTitle>
                <CardDescription>Manage waitlisted and attending nursery students.</CardDescription>
              </div>
              <div className="flex gap-2">
                <InputGroup className="w-full md:w-64">
                  <InputGroupAddon align="inline-start">
                    <Search className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Search children..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                </InputGroup>

                {/* Student Registration Modal */}
                <Dialog open={studentModalOpen} onOpenChange={setStudentModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="rounded-lg">
                      <Plus className="h-4 w-4 mr-1" />
                      Register Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Register New Student</DialogTitle>
                      <DialogDescription>
                        Add a child record and link them to an existing registered parent profile.
                      </DialogDescription>
                    </DialogHeader>
                    <form noValidate onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-4 py-2">
                      <div className="grid grid-cols-2 gap-4">
                        <Controller
                          control={studentForm.control}
                          name="firstName"
                          render={({ field, fieldState }) => (
                            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="child-fn">First Name</FieldLabel>
                              <Input {...field} id="child-fn" />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                        <Controller
                          control={studentForm.control}
                          name="lastName"
                          render={({ field, fieldState }) => (
                            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="child-ln">Last Name</FieldLabel>
                              <Input {...field} id="child-ln" />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Controller
                          control={studentForm.control}
                          name="dob"
                          render={({ field, fieldState }) => (
                            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="child-dob">Date of Birth</FieldLabel>
                              <Input {...field} id="child-dob" type="date" />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                        <Controller
                          control={studentForm.control}
                          name="gender"
                          render={({ field, fieldState }) => (
                            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="child-gender">Gender</FieldLabel>
                              <NativeSelect {...field} id="child-gender">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </NativeSelect>
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Controller
                          control={studentForm.control}
                          name="roomId"
                          render={({ field, fieldState }) => (
                            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="child-room">Room Preference</FieldLabel>
                              <NativeSelect {...field} id="child-room">
                                <option value="">Unassigned / Waitlist</option>
                                {rooms.map((r) => (
                                  <option key={r.id} value={r.id}>
                                    {r.name} ({r.age_group})
                                  </option>
                                ))}
                              </NativeSelect>
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                        <Controller
                          control={studentForm.control}
                          name="parentId"
                          render={({ field, fieldState }) => (
                            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="child-parent">Link Parent</FieldLabel>
                              <NativeSelect {...field} id="child-parent">
                                <option value="">-- Select Parent --</option>
                                {parents.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.profiles?.first_name} {p.profiles?.last_name}
                                  </option>
                                ))}
                              </NativeSelect>
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                      </div>

                      <Controller
                        control={studentForm.control}
                        name="branch"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="child-branch">Nursery Branch</FieldLabel>
                            <NativeSelect {...field} id="child-branch">
                              <option value="Branch 1">Branch 1 (Galleywall Road)</option>
                              <option value="Branch 2">Branch 2 (Corbetts Lane)</option>
                            </NativeSelect>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        control={studentForm.control}
                        name="relationship"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="child-rel">Relationship</FieldLabel>
                            <NativeSelect {...field} id="child-rel">
                              <option value="Mother">Mother</option>
                              <option value="Father">Father</option>
                              <option value="Guardian">Guardian</option>
                            </NativeSelect>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        control={studentForm.control}
                        name="allergies"
                        render={({ field }) => (
                          <Field className="gap-1.5">
                            <FieldLabel htmlFor="child-allergies">Allergies</FieldLabel>
                            <Input {...field} id="child-allergies" placeholder="E.g. Nuts, Dairy" />
                          </Field>
                        )}
                      />

                      <Controller
                        control={studentForm.control}
                        name="medicalNotes"
                        render={({ field }) => (
                          <Field className="gap-1.5">
                            <FieldLabel htmlFor="child-med">Medical Notes</FieldLabel>
                            <Textarea
                              {...field}
                              id="child-med"
                              placeholder="Special medication details or asthma info"
                              rows={2}
                            />
                          </Field>
                        )}
                      />

                      <div className="space-y-2 border p-3 rounded-xl bg-neutral-50/50">
                        <Controller
                          control={studentForm.control}
                          name="medicalConsent"
                          render={({ field, fieldState }) => (
                            <div className="space-y-1">
                              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                                <input type="checkbox" checked={field.value} onChange={field.onChange} />
                                Confirm Emergency Medical Consent
                              </label>
                              {fieldState.invalid && (
                                <p className="text-[10px] text-destructive">{fieldState.error?.message}</p>
                              )}
                            </div>
                          )}
                        />
                        <Controller
                          control={studentForm.control}
                          name="photoConsent"
                          render={({ field }) => (
                            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                              <input type="checkbox" checked={field.value} onChange={field.onChange} />
                              Confirm Photo/Media Consent (Optional)
                            </label>
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="submit" className="w-full" disabled={submitting}>
                          {submitting ? "Saving Student..." : "Register Child"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              {filteredChildren.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">No students found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b bg-neutral-50/50 text-xs font-semibold text-muted-foreground">
                        <th className="p-4">Name</th>
                        <th className="p-4">Date of Birth</th>
                        <th className="p-4">Gender</th>
                        <th className="p-4">Branch</th>
                        <th className="p-4">Room Preference</th>
                        <th className="p-4">Parents Linked</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredChildren.map((child) => {
                        const activeRoom = rooms.find((r) => r.id === child.room_id);
                        return (
                          <tr key={child.id} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="p-4 font-bold text-foreground">
                              {child.first_name} {child.last_name}
                            </td>
                            <td className="p-4 text-muted-foreground">{child.date_of_birth}</td>
                            <td className="p-4 text-muted-foreground">{child.gender}</td>
                            <td className="p-4">
                              <Badge variant="secondary">{child.branch || "—"}</Badge>
                            </td>
                            <td className="p-4 text-muted-foreground font-semibold">
                              {activeRoom ? `${activeRoom.name} (${activeRoom.age_group})` : "Waitlist"}
                            </td>
                            <td className="p-4 text-muted-foreground">
                              {child.child_parents?.map((cp: any, idx: number) => (
                                <div key={idx} className="text-xs">
                                  {cp.parents?.profiles?.first_name} {cp.parents?.profiles?.last_name} (
                                  {cp.relationship})
                                </div>
                              )) || "None"}
                            </td>
                            <td className="p-4">
                              <Badge
                                variant="outline"
                                className={
                                  child.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }
                              >
                                {child.status}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==========================================
          PARENTS TAB CONTENT
         ========================================== */}
        <TabsContent value="parents" className="space-y-4 focus:outline-none">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Registered Parents</CardTitle>
                <CardDescription>View parent profile cards, emails, and address logs.</CardDescription>
              </div>
              <div className="flex gap-2">
                <InputGroup className="w-full md:w-64">
                  <InputGroupAddon align="inline-start">
                    <Search className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Search parents..."
                    value={parentSearch}
                    onChange={(e) => setParentSearch(e.target.value)}
                  />
                </InputGroup>

                {/* Parent Registration Modal */}
                <Dialog open={parentModalOpen} onOpenChange={setParentModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="rounded-lg">
                      <Plus className="h-4 w-4 mr-1" />
                      Register Parent
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Register New Parent</DialogTitle>
                      <DialogDescription>
                        Create a login identity profile and emergency card for a parent.
                      </DialogDescription>
                    </DialogHeader>
                    <form noValidate onSubmit={parentForm.handleSubmit(onParentSubmit)} className="space-y-4 py-2">
                      <div className="grid grid-cols-2 gap-4">
                        <Controller
                          control={parentForm.control}
                          name="firstName"
                          render={({ field, fieldState }) => (
                            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="parent-fn">First Name</FieldLabel>
                              <Input {...field} id="parent-fn" />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                        <Controller
                          control={parentForm.control}
                          name="lastName"
                          render={({ field, fieldState }) => (
                            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="parent-ln">Last Name</FieldLabel>
                              <Input {...field} id="parent-ln" />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                      </div>

                      <Controller
                        control={parentForm.control}
                        name="email"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="parent-email">Email Address</FieldLabel>
                            <Input {...field} id="parent-email" type="email" placeholder="E.g. parent@example.com" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        control={parentForm.control}
                        name="phone"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="parent-phone">Phone Number</FieldLabel>
                            <Input {...field} id="parent-phone" placeholder="+44 7123 456789" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        control={parentForm.control}
                        name="address"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="parent-addr">Home Address</FieldLabel>
                            <Input {...field} id="parent-addr" placeholder="12 Green Lane, London" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        control={parentForm.control}
                        name="emergencyContact"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="parent-emergency">Emergency Contact Details</FieldLabel>
                            <Input {...field} id="parent-emergency" placeholder="Name / phone / relation" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <Controller
                        control={parentForm.control}
                        name="relationshipStatus"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="parent-status">Relationship Status</FieldLabel>
                            <NativeSelect {...field} id="parent-status">
                              <option value="Married">Married</option>
                              <option value="Single">Single</option>
                              <option value="Co-parenting">Co-parenting</option>
                              <option value="Divorced">Divorced</option>
                            </NativeSelect>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

                      <DialogFooter>
                        <Button type="submit" className="w-full" disabled={submitting}>
                          {submitting ? "Saving Parent..." : "Register Parent"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              {filteredParents.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">No parents found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b bg-neutral-50/50 text-xs font-semibold text-muted-foreground">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Address</th>
                        <th className="p-4">Emergency Contact</th>
                        <th className="p-4">Marital Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredParents.map((parent) => (
                        <tr key={parent.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="p-4 font-bold text-foreground">
                            {parent.profiles?.first_name} {parent.profiles?.last_name}
                          </td>
                          <td className="p-4 text-muted-foreground">{parent.profiles?.email}</td>
                          <td className="p-4 text-muted-foreground">{parent.profiles?.phone_number || "—"}</td>
                          <td className="p-4 text-muted-foreground">{parent.address}</td>
                          <td className="p-4 text-muted-foreground">{parent.emergency_contact}</td>
                          <td className="p-4 text-muted-foreground">
                            <Badge variant="outline">{parent.relationship_status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
