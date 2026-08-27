"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Baby, ExternalLink, Eye, KeyRound, Mail, MessageSquare, Pencil, Phone, Plus, Search, ShieldCheck, Trash2, UserCheck, Users, Briefcase, CheckSquare } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { resetUserPasswordAction } from "@/app/(main)/dashboard/account/actions";

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

import { deleteStaffAction, deleteStudentAction, registerParentAction, registerStaffAction, registerStudentAction, updateStudentAction } from "../actions";

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

const staffRegisterSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    preferredName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    mobileNumber: z.string().min(5, "Mobile number is required"),
    niNumber: z.string().min(5, "National Insurance number is required"),
    jobTitle: z.string().min(2, "Job title / role is required"),
    nurseryBranch: z.string().min(2, "Nursery location / branch is required"),
    roomDepartment: z.string().min(2, "Room / department is required"),
    employmentType: z.string().min(1, "Employment type is required"),
    dbsCertificateNumber: z.string().min(5, "DBS certificate number is required"),
    username: z.string().min(3, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
    emergencyContactName: z.string().min(2, "Emergency contact name is required"),
    emergencyContactRelationship: z.string().min(2, "Relationship is required"),
    emergencyContactNumber: z.string().min(5, "Emergency contact number is required"),
    confirmCorrect: z.boolean().refine((val) => val === true, { message: "Confirmation is required" }),
    agreePolicies: z.boolean().refine((val) => val === true, { message: "Agreement to policies is required" }),
    agreeTerms: z.boolean().refine((val) => val === true, { message: "Agreement to terms is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type StaffFormValues = z.infer<typeof staffRegisterSchema>;

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
  staffId: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentRegisterSchema>;

const studentEditSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender selection is required"),
  branch: z.string().min(1, "Branch selection is required"),
  status: z.string().min(1, "Status selection is required"),
  roomId: z.string().optional(),
  medicalNotes: z.string().optional(),
  allergies: z.string().optional(),
  parentId: z.string().optional(),
  relationship: z.string().optional(),
  staffId: z.string().optional(),
});

type StudentEditFormValues = z.infer<typeof studentEditSchema>;

// ==========================================
// PROPS & COMPONENT
// ==========================================

interface NurseryCrmProps {
  initialParents: any[];
  initialChildren: any[];
  initialStaff?: any[];
  rooms: any[];
}

export function NurseryCrm({ initialParents, initialChildren, initialStaff = [], rooms }: NurseryCrmProps) {
  const _supabase = createClient();
  const router = useRouter();

  const [parents, setParents] = React.useState(initialParents);
  const [children, setChildren] = React.useState(initialChildren);
  const [staffList, setStaffList] = React.useState(initialStaff);

  const [parentSearch, setParentSearch] = React.useState("");
  const [studentSearch, setStudentSearch] = React.useState("");
  const [staffSearch, setStaffSearch] = React.useState("");
  const [branchFilter, setBranchFilter] = React.useState<"All" | "Branch 1" | "Branch 2">("All");

  const [parentModalOpen, setParentModalOpen] = React.useState(false);
  const [studentModalOpen, setStudentModalOpen] = React.useState(false);
  const [staffModalOpen, setStaffModalOpen] = React.useState(false);
  // Reset user password state
  const [resettingParent, setResettingParent] = React.useState<any | null>(null);
  const [targetNewPassword, setTargetNewPassword] = React.useState("");
  const [resettingPasswordLoading, setResettingPasswordLoading] = React.useState(false);
  const [viewingChild, setViewingChild] = React.useState<any | null>(null);
  const [editingChild, setEditingChild] = React.useState<any | null>(null);
  const [deletingChild, setDeletingChild] = React.useState<any | null>(null);
  const [deletingStaff, setDeletingStaff] = React.useState<any | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleDeleteStudent = async () => {
    if (!deletingChild) return;
    setSubmitting(true);
    try {
      await deleteStudentAction(deletingChild.id);
      toast.success("Student deleted successfully!");
      if (viewingChild?.id === deletingChild.id) setViewingChild(null);
      if (editingChild?.id === deletingChild.id) setEditingChild(null);
      setDeletingChild(null);
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to delete student", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStaff = async () => {
    if (!deletingStaff) return;
    setSubmitting(true);
    try {
      await deleteStaffAction(deletingStaff.id);
      toast.success("Staff record removed successfully!");
      setDeletingStaff(null);
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to remove staff", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const studentEditForm = useForm<StudentEditFormValues>({
    resolver: zodResolver(studentEditSchema),
  });

  const handleOpenEditStudent = (child: any) => {
    setEditingChild(child);
    const primaryParentLink = child.child_parents?.[0];
    studentEditForm.reset({
      firstName: child.first_name || "",
      lastName: child.last_name || "",
      dob: child.date_of_birth || "",
      gender: child.gender || "Boy",
      branch: child.branch || "Branch 1",
      status: child.status || "WAITING_LIST",
      roomId: child.room_id || "",
      medicalNotes: child.medical_notes || "",
      allergies: child.allergies || "",
      parentId: primaryParentLink?.parent_id || "",
      relationship: primaryParentLink?.relationship || "Mother",
    });
  };

  const onStudentEditSubmit = async (data: StudentEditFormValues) => {
    if (!editingChild) return;
    setSubmitting(true);
    try {
      await updateStudentAction({
        id: editingChild.id,
        ...data,
      });
      toast.success("Student details updated successfully!");
      setEditingChild(null);
      setViewingChild(null);
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to update student", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendGmailToParent = (parentEmail: string, childName: string) => {
    const subject = `Update regarding ${childName} - Bubbly Day Nursery`;
    const body = `Dear Parent,\n\nI am writing to update you regarding ${childName}.\n\nBest regards,\nBubbly Day Nursery Admissions & Care Team`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(parentEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  // Sync state if props change
  React.useEffect(() => {
    setParents(initialParents);
  }, [initialParents]);

  React.useEffect(() => {
    setChildren(initialChildren);
  }, [initialChildren]);

  React.useEffect(() => {
    setStaffList(initialStaff);
  }, [initialStaff]);

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

  const staffForm = useForm<StaffFormValues>({
    resolver: zodResolver(staffRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      preferredName: "",
      email: "",
      mobileNumber: "",
      niNumber: "",
      jobTitle: "",
      nurseryBranch: "Bubbly Day Nursery - Main Branch",
      roomDepartment: "Toddler Room (2-3 Yrs)",
      employmentType: "Full-time",
      dbsCertificateNumber: "",
      username: "",
      password: "",
      confirmPassword: "",
      emergencyContactName: "",
      emergencyContactRelationship: "Spouse",
      emergencyContactNumber: "",
      confirmCorrect: false,
      agreePolicies: false,
      agreeTerms: false,
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
      staffId: "",
    },
    mode: "onTouched",
  });

  // Handle Staff Submission
  const onStaffSubmit = async (data: StaffFormValues) => {
    setSubmitting(true);
    try {
      await registerStaffAction(data);
      toast.success("Bubbly Day Nursery Staff Member Registered!");
      staffForm.reset();
      setStaffModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error("Staff registration failed", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Parent Submission
  const onParentSubmit = async (data: ParentFormValues) => {
    setSubmitting(true);
    try {
      await registerParentAction(data);
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
      await registerStudentAction(data);
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

  const filteredStaff = staffList.filter((s) => {
    const name = `${s.profiles?.first_name || ""} ${s.profiles?.last_name || ""} ${s.preferred_name || ""} ${s.username || ""}`.toLowerCase();
    const role = (s.job_title || "").toLowerCase();
    const branch = (s.nursery_branch || "").toLowerCase();
    const query = staffSearch.toLowerCase();
    return name.includes(query) || role.includes(query) || branch.includes(query);
  });

  return (
    <div className="space-y-6">
      {/* Branch View Selector Banner */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border bg-card/60 p-5 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="font-bold text-foreground text-sm">Select Active Branch View</h2>
          <p className="text-[11px] text-muted-foreground">Filter enrolled children by school setting.</p>
        </div>
        <div className="flex gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
          {(["All", "Branch 1", "Branch 2"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBranchFilter(b)}
              className={`rounded-lg px-3 py-1.5 font-semibold text-xs transition-all ${
                branchFilter === b
                  ? "bg-white text-foreground shadow-sm dark:bg-neutral-900"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {b === "All" ? "All Locations" : b}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList className="rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
          <TabsTrigger value="staff" className="flex gap-2 rounded-lg">
            <UserCheck className="h-4 w-4" />
            Staff ({filteredStaff.length})
          </TabsTrigger>
          <TabsTrigger value="students" className="flex gap-2 rounded-lg">
            <Baby className="h-4 w-4" />
            Students ({filteredChildren.length})
          </TabsTrigger>
          <TabsTrigger value="parents" className="flex gap-2 rounded-lg">
            <Users className="h-4 w-4" />
            Parents ({parents.length})
          </TabsTrigger>
        </TabsList>

        {/* ==========================================
          STAFF TAB CONTENT
         ========================================== */}
        <TabsContent value="staff" className="space-y-4 focus:outline-none">
          <Card>
            <CardHeader className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <CardTitle>Staff Directory & Registration</CardTitle>
                <CardDescription>Manage Bubbly Day Nursery staff members, DBS checks, and key worker assignments (max 3 students per staff).</CardDescription>
              </div>
              <div className="flex gap-2">
                <InputGroup className="w-full md:w-64">
                  <InputGroupAddon align="inline-start">
                    <Search className="h-4 w-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Search staff members..."
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                  />
                </InputGroup>

                {/* Staff Registration Dialog */}
                <Dialog open={staffModalOpen} onOpenChange={setStaffModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="rounded-lg">
                      <Plus className="mr-1 h-4 w-4" />
                      Register Staff
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Bubbly Day Nursery Staff Registration</DialogTitle>
                      <DialogDescription>
                        Complete all 6 sections to register a new staff member into the nursery system.
                      </DialogDescription>
                    </DialogHeader>
                    <form noValidate onSubmit={staffForm.handleSubmit(onStaffSubmit)} className="space-y-6 py-2">
                      {/* 1. Personal Details */}
                      <div className="rounded-xl border p-4 space-y-3 bg-muted/20">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                          <Users className="h-4 w-4" /> 1. Personal Details
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <Controller
                            control={staffForm.control}
                            name="firstName"
                            render={({ field, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="staff-fn" className="text-xs">First Name *</FieldLabel>
                                <Input {...field} id="staff-fn" placeholder="Sarah" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                          <Controller
                            control={staffForm.control}
                            name="lastName"
                            render={({ field, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="staff-ln" className="text-xs">Last Name *</FieldLabel>
                                <Input {...field} id="staff-ln" placeholder="Jenkins" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Controller
                            control={staffForm.control}
                            name="preferredName"
                            render={({ field }) => (
                              <Field className="gap-1">
                                <FieldLabel htmlFor="staff-pn" className="text-xs">Preferred Name</FieldLabel>
                                <Input {...field} id="staff-pn" placeholder="Sarah" />
                              </Field>
                            )}
                          />
                          <Controller
                            control={staffForm.control}
                            name="niNumber"
                            render={({ field, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="staff-ni" className="text-xs">National Insurance Number *</FieldLabel>
                                <Input {...field} id="staff-ni" placeholder="QQ 12 34 56 A font-mono" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Controller
                            control={staffForm.control}
                            name="email"
                            render={({ field, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="staff-email" className="text-xs">Email Address *</FieldLabel>
                                <Input {...field} id="staff-email" type="email" placeholder="sarah.j@bubblynursery.co.uk" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                          <Controller
                            control={staffForm.control}
                            name="mobileNumber"
                            render={({ field, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="staff-phone" className="text-xs">Mobile Number *</FieldLabel>
                                <Input {...field} id="staff-phone" placeholder="07700 900123" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                        </div>
                      </div>

                      {/* 2. Work Details */}
                      <div className="rounded-xl border p-4 space-y-3 bg-muted/20">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                          <Briefcase className="h-4 w-4" /> 2. Work Details
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <Controller
                            control={staffForm.control}
                            name="jobTitle"
                            render={({ field, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="staff-title" className="text-xs">Job Title / Role *</FieldLabel>
                                <Input {...field} id="staff-title" placeholder="Senior Nursery Practitioner" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                          <Controller
                            control={staffForm.control}
                            name="nurseryBranch"
                            render={({ field, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="staff-branch" className="text-xs">Nursery Location / Branch *</FieldLabel>
                                <Input {...field} id="staff-branch" placeholder="Bubbly Day Nursery - Main Branch" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Controller
                            control={staffForm.control}
                            name="roomDepartment"
                            render={({ field, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="staff-room" className="text-xs">Room / Department *</FieldLabel>
                                <Input {...field} id="staff-room" placeholder="Toddler Room (2-3 Yrs)" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                          <Controller
                            control={staffForm.control}
                            name="employmentType"
                            render={({ field, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="staff-emp" className="text-xs">Employment Type *</FieldLabel>
                                <NativeSelect {...field} id="staff-emp">
                                  <option value="Full-time">Full-time</option>
                                  <option value="Part-time">Part-time</option>
                                  <option value="Apprenticeship">Apprenticeship</option>
                                  <option value="Bank">Bank</option>
                                  <option value="Agency">Agency</option>
                                  <option value="Volunteer">Volunteer</option>
                                </NativeSelect>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                        </div>
                      </div>

                      {/* 3. DBS Details */}
                      <div className="rounded-xl border p-4 space-y-3 bg-muted/20">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4" /> 3. DBS Details
                        </h4>
                        <Controller
                          control={staffForm.control}
                          name="dbsCertificateNumber"
                          render={({ field, fieldState }) => (
                            <Field className="gap-1" data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="staff-dbs" className="text-xs">DBS Certificate Number *</FieldLabel>
                              <Input {...field} id="staff-dbs" placeholder="001594830129" className="font-mono" />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                      </div>

                      {/* 4. Account Details */}
                      <div className="rounded-xl border p-4 space-y-3 bg-muted/20">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                          <KeyRound className="h-4 w-4" /> 4. Account Details
                        </h4>
                        <Controller
                          control={staffForm.control}
                          name="username"
                          render={({ field, fieldState }) => (
                            <Field className="gap-1" data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="staff-un" className="text-xs">Username *</FieldLabel>
                              <Input {...field} id="staff-un" placeholder="sjenkins" className="font-mono" />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Controller
                            control={staffForm.control}
                            name="password"
                            render={({ field, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="staff-pass" className="text-xs">Password *</FieldLabel>
                                <Input {...field} id="staff-pass" type="password" placeholder="••••••••" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                          <Controller
                            control={staffForm.control}
                            name="confirmPassword"
                            render={({ field, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="staff-cpass" className="text-xs">Confirm Password *</FieldLabel>
                                <Input {...field} id="staff-cpass" type="password" placeholder="••••••••" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                        </div>
                      </div>

                      {/* 5. Emergency Contact */}
                      <div className="rounded-xl border p-4 space-y-3 bg-muted/20">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                          <Phone className="h-4 w-4" /> 5. Emergency Contact
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <Controller
                            control={staffForm.control}
                            name="emergencyContactName"
                            render={({ field, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="staff-ecn" className="text-xs">Contact Name *</FieldLabel>
                                <Input {...field} id="staff-ecn" placeholder="David Jenkins" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                          <Controller
                            control={staffForm.control}
                            name="emergencyContactRelationship"
                            render={({ field, fieldState }) => (
                              <Field className="gap-1" data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="staff-ecr" className="text-xs">Relationship *</FieldLabel>
                                <Input {...field} id="staff-ecr" placeholder="Spouse" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                              </Field>
                            )}
                          />
                        </div>
                        <Controller
                          control={staffForm.control}
                          name="emergencyContactNumber"
                          render={({ field, fieldState }) => (
                            <Field className="gap-1" data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="staff-ecnum" className="text-xs">Emergency Phone Number *</FieldLabel>
                              <Input {...field} id="staff-ecnum" placeholder="07700 900456" />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          )}
                        />
                      </div>

                      {/* 6. Confirmation */}
                      <div className="rounded-xl border border-primary/30 p-4 space-y-3 bg-primary/5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                          <CheckSquare className="h-4 w-4" /> 6. Confirmation & Policy Agreements
                        </h4>

                        <Controller
                          control={staffForm.control}
                          name="confirmCorrect"
                          render={({ field, fieldState }) => (
                            <label className="flex items-start space-x-2 text-xs font-medium cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="mt-0.5 rounded border-input text-primary"
                              />
                              <span>I confirm the information provided is correct.</span>
                            </label>
                          )}
                        />

                        <Controller
                          control={staffForm.control}
                          name="agreePolicies"
                          render={({ field, fieldState }) => (
                            <label className="flex items-start space-x-2 text-xs font-medium cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="mt-0.5 rounded border-input text-primary"
                              />
                              <span>I agree to follow Bubbly Day Nursery’s staff policies and confidentiality requirements.</span>
                            </label>
                          )}
                        />

                        <Controller
                          control={staffForm.control}
                          name="agreeTerms"
                          render={({ field, fieldState }) => (
                            <label className="flex items-start space-x-2 text-xs font-medium cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="mt-0.5 rounded border-input text-primary"
                              />
                              <span>I agree to the Privacy Policy and Terms of Use.</span>
                            </label>
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setStaffModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                          {submitting ? "Registering..." : "Submit Registration"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent>
              {filteredStaff.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No staff members registered. Click &quot;Register Staff&quot; above to add your first staff member.
                </div>
              ) : (
                <div className="divide-y border-t">
                  {filteredStaff.map((st) => {
                    const assignedChildren = st.child_staff || [];
                    const assignedCount = assignedChildren.length;
                    const maxCapacity = 3;

                    const name = st.profiles
                      ? `${st.profiles.first_name || ""} ${st.profiles.last_name || ""}`.trim()
                      : st.username || "Staff Member";

                    return (
                      <div key={st.id} className="flex flex-col justify-between gap-4 py-4 md:flex-row md:items-center">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-foreground">{name}</span>
                            {st.preferred_name && (
                              <span className="text-xs text-muted-foreground">(&quot;{st.preferred_name}&quot;)</span>
                            )}
                            <Badge variant="secondary" className="capitalize text-[10px] font-semibold">
                              {st.employment_type || "Full-time"}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <span>💼 {st.job_title || "Staff Practitioner"}</span> • <span>📍 {st.room_department || "General"} ({st.nursery_branch || "Main"})</span>
                          </div>
                          <div className="flex items-center space-x-3 text-[11px] text-muted-foreground font-mono pt-0.5">
                            <span className="text-emerald-500 font-semibold">DBS: {st.dbs_certificate_number || "Verified"}</span>
                            <span>NI: {st.ni_number || "On file"}</span>
                            <span>📱 {st.mobile_number || st.profiles?.phone || "N/A"}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <Badge
                              variant={assignedCount >= maxCapacity ? "destructive" : "outline"}
                              className="text-xs font-bold"
                            >
                              {assignedCount} / {maxCapacity} Children Assigned
                            </Badge>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {assignedCount >= maxCapacity ? "Full Capacity" : `${maxCapacity - assignedCount} slots available`}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => setDeletingStaff(st)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==========================================
          STUDENTS TAB CONTENT
         ========================================== */}
        <TabsContent value="students" className="space-y-4 focus:outline-none">
          <Card>
            <CardHeader className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
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
                      <Plus className="mr-1 h-4 w-4" />
                      Register Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] max-w-md overflow-y-auto">
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
                                    {r.name}
                                    {r.min_age_months !== undefined && r.max_age_months !== undefined
                                      ? ` (${r.min_age_months}-${r.max_age_months} mos)`
                                      : ""}
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
                        name="staffId"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="child-staff">Assign Key Worker Staff (Max 3)</FieldLabel>
                            <NativeSelect {...field} id="child-staff">
                              <option value="">-- Unassigned --</option>
                              {staffList.map((st) => {
                                const assignedCount = (st.child_staff || []).length;
                                const isFull = assignedCount >= 3;
                                const name = st.profiles ? `${st.profiles.first_name || ""} ${st.profiles.last_name || ""}`.trim() : st.username || "Staff Member";
                                return (
                                  <option key={st.id} value={st.id} disabled={isFull}>
                                    {name} ({st.job_title || "Staff"}) — {isFull ? "⚠️ FULL (3/3 Students)" : `${assignedCount}/3 Students Assigned`}
                                  </option>
                                );
                              })}
                            </NativeSelect>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />

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

                      <div className="space-y-2 rounded-xl border bg-neutral-50/50 p-3">
                        <Controller
                          control={studentForm.control}
                          name="medicalConsent"
                          render={({ field, fieldState }) => (
                            <div className="space-y-1">
                              <label className="flex cursor-pointer items-center gap-2 font-semibold text-xs">
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
                            <label className="flex cursor-pointer items-center gap-2 font-semibold text-xs">
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
                      <tr className="border-b bg-neutral-50/50 font-semibold text-muted-foreground text-xs">
                        <th className="p-4">Name</th>
                        <th className="p-4">Date of Birth</th>
                        <th className="p-4">Gender</th>
                        <th className="p-4">Branch</th>
                        <th className="p-4">Room Preference</th>
                        <th className="p-4">Parents Linked</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredChildren.map((child) => {
                        const activeRoom = rooms.find((r) => r.id === child.room_id);
                        return (
                          <tr key={child.id} className="transition-colors hover:bg-neutral-50/50">
                            <td
                              className="p-4 font-bold text-foreground cursor-pointer hover:underline"
                              onClick={() => setViewingChild(child)}
                            >
                              {child.first_name} {child.last_name}
                            </td>
                            <td className="p-4 text-muted-foreground">{child.date_of_birth}</td>
                            <td className="p-4 text-muted-foreground">{child.gender}</td>
                            <td className="p-4">
                              <Badge variant="secondary">{child.branch || "—"}</Badge>
                            </td>
                            <td className="p-4 font-semibold text-muted-foreground">
                              {activeRoom
                                ? `${activeRoom.name}${
                                    activeRoom.min_age_months !== undefined && activeRoom.max_age_months !== undefined
                                      ? ` (${activeRoom.min_age_months}-${activeRoom.max_age_months} mos)`
                                      : ""
                                  }`
                                : "Waitlist"}
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
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-amber-200 bg-amber-50 text-amber-700"
                                }
                              >
                                {child.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-foreground"
                                  onClick={() => setViewingChild(child)}
                                  title="View Student Detail"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-foreground"
                                  onClick={() => handleOpenEditStudent(child)}
                                  title="Edit Student Record"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-muted-foreground hover:text-destructive text-destructive/80"
                                  onClick={() => setDeletingChild(child)}
                                  title="Delete Student Record"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
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
            <CardHeader className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
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
                      <Plus className="mr-1 h-4 w-4" />
                      Register Parent
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] max-w-md overflow-y-auto">
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
                      <tr className="border-b bg-neutral-50/50 font-semibold text-muted-foreground text-xs">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Address</th>
                        <th className="p-4">Emergency Contact</th>
                        <th className="p-4">Marital Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredParents.map((parent) => (
                        <tr key={parent.id} className="transition-colors hover:bg-neutral-50/50">
                          <td className="p-4 font-bold text-foreground">
                            {parent.profiles?.first_name} {parent.profiles?.last_name}
                          </td>
                          <td className="p-4 text-muted-foreground">{parent.profiles?.email}</td>
                          <td className="p-4 text-muted-foreground">{parent.profiles?.phone || "—"}</td>
                          <td className="p-4 text-muted-foreground">{parent.address}</td>
                          <td className="p-4 text-muted-foreground">{parent.emergency_contact}</td>
                          <td className="p-4 text-muted-foreground">
                            <Badge variant="outline">{parent.relationship_status}</Badge>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                              onClick={() => setResettingParent(parent)}
                              title="Reset User Password"
                            >
                              <KeyRound className="h-3.5 w-3.5 mr-1" /> Reset Password
                            </Button>
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
      {/* Admin Reset User Password Modal */}
      <Dialog open={!!resettingParent} onOpenChange={(open) => !open && setResettingParent(null)}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <KeyRound className="h-5 w-5 text-primary" /> Reset User Password
            </DialogTitle>
            <DialogDescription>
              Set a new password for {resettingParent?.profiles?.first_name} {resettingParent?.profiles?.last_name} ({resettingParent?.profiles?.email}).
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!resettingParent?.profiles?.id || !targetNewPassword) return;
              if (targetNewPassword.length < 6) {
                toast.error("Validation Error", { description: "Password must be at least 6 characters." });
                return;
              }

              setResettingPasswordLoading(true);
              try {
                await resetUserPasswordAction(resettingParent.profiles.id, targetNewPassword);
                toast.success("User Password Reset Successfully!", {
                  description: `Password updated for ${resettingParent.profiles.first_name} ${resettingParent.profiles.last_name}.`,
                });
                setResettingParent(null);
                setTargetNewPassword("");
              } catch (err: any) {
                toast.error("Failed to reset password", { description: err.message });
              } finally {
                setResettingPasswordLoading(false);
              }
            }}
            className="space-y-4 py-2"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="reset-user-pwd">
                New Password *
              </label>
              <Input
                id="reset-user-pwd"
                type="password"
                value={targetNewPassword}
                onChange={(e) => setTargetNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)..."
                required
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setResettingParent(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={resettingPasswordLoading}>
                {resettingPasswordLoading ? "Saving..." : "Set New Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Student Detail Modal */}
      <Dialog open={!!viewingChild} onOpenChange={(open) => !open && setViewingChild(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2 text-xl font-bold">
              <span className="flex items-center gap-2">
                👶 {viewingChild?.first_name} {viewingChild?.last_name}
              </span>
              <Badge variant="outline" className="text-xs">
                {viewingChild?.status}
              </Badge>
            </DialogTitle>
            <DialogDescription>Registered student profile details and parent contact management.</DialogDescription>
          </DialogHeader>

          {viewingChild && (
            <div className="space-y-6 py-2 text-sm">
              {/* Student Metadata Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30 p-4 rounded-2xl border">
                <div>
                  <span className="block text-[10px] font-bold text-muted-foreground uppercase">Date of Birth</span>
                  <span className="font-semibold text-foreground text-xs">{viewingChild.date_of_birth}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-muted-foreground uppercase">Gender</span>
                  <span className="font-semibold text-foreground text-xs">{viewingChild.gender}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-muted-foreground uppercase">Branch</span>
                  <span className="font-semibold text-foreground text-xs">{viewingChild.branch || "Branch 1"}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-muted-foreground uppercase">Room Assignment</span>
                  <span className="font-semibold text-primary text-xs">
                    {rooms.find((r) => r.id === viewingChild.room_id)?.name || "Waitlist"}
                  </span>
                </div>
              </div>

              {/* Medical & Allergy Notes */}
              {(viewingChild.allergies || viewingChild.medical_notes) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Medical & Health Notes
                  </h4>
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 p-3.5 rounded-xl text-xs space-y-1">
                    {viewingChild.allergies && (
                      <p>
                        <strong className="text-amber-800 dark:text-amber-300">Allergies:</strong>{" "}
                        {viewingChild.allergies}
                      </p>
                    )}
                    {viewingChild.medical_notes && (
                      <p>
                        <strong className="text-amber-800 dark:text-amber-300">Medical Notes:</strong>{" "}
                        {viewingChild.medical_notes}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Linked Parent Information & Direct Contact Options */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Linked Parent(s) & Direct Contact Options
                </h4>
                {!viewingChild.child_parents || viewingChild.child_parents.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    No linked parent profile registered for this student.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {viewingChild.child_parents.map((cp: any, idx: number) => {
                      const parentProfile = cp.parents?.profiles;
                      const parentEmail = parentProfile?.email;
                      const parentPhone = parentProfile?.phone;
                      const parentName = parentProfile
                        ? `${parentProfile.first_name} ${parentProfile.last_name}`
                        : "Parent / Guardian";

                      return (
                        <div key={idx} className="p-4 border rounded-2xl bg-card space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                                👤 {parentName}
                                <span className="text-xs text-muted-foreground font-normal">({cp.relationship})</span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                ✉️ {parentEmail || "No email on record"} {parentPhone ? `• 📞 ${parentPhone}` : ""}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {parentPhone && (
                                <>
                                  <Button
                                    asChild
                                    size="sm"
                                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm"
                                  >
                                    <a href={`tel:${parentPhone}`}>
                                      <Phone className="h-3.5 w-3.5" />
                                      Call
                                    </a>
                                  </Button>

                                  <Button
                                    asChild
                                    size="sm"
                                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-sm"
                                  >
                                    <a
                                      href={`sms:${parentPhone}?body=${encodeURIComponent(`Hello, regarding ${viewingChild.first_name} ${viewingChild.last_name}: `)}`}
                                    >
                                      <MessageSquare className="h-3.5 w-3.5" />
                                      Text SMS
                                    </a>
                                  </Button>
                                </>
                              )}

                              {parentEmail && (
                                <>
                                  <Button
                                    size="sm"
                                    className="rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs gap-1.5 shadow-sm"
                                    onClick={() =>
                                      handleSendGmailToParent(
                                        parentEmail,
                                        `${viewingChild.first_name} ${viewingChild.last_name}`,
                                      )
                                    }
                                  >
                                    <Mail className="h-3.5 w-3.5" />
                                    Open Gmail
                                    <ExternalLink className="h-3 w-3 opacity-80" />
                                  </Button>

                                  <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full text-xs font-semibold gap-1"
                                  >
                                    <a
                                      href={`mailto:${parentEmail}?subject=${encodeURIComponent(`Update regarding ${viewingChild.first_name} ${viewingChild.last_name}`)}`}
                                    >
                                      Default Mail
                                    </a>
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="destructive"
              className="gap-1.5"
              onClick={() => {
                const target = viewingChild;
                setViewingChild(null);
                setDeletingChild(target);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete Student
            </Button>
            <Button variant="outline" onClick={() => setViewingChild(null)}>
              Close
            </Button>
            <Button
              className="gap-1.5"
              onClick={() => {
                const target = viewingChild;
                setViewingChild(null);
                handleOpenEditStudent(target);
              }}
            >
              <Pencil className="h-4 w-4" />
              Edit Student Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog open={!!editingChild} onOpenChange={(open) => !open && setEditingChild(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Student Record</DialogTitle>
            <DialogDescription>Update child details, room assignment, and status.</DialogDescription>
          </DialogHeader>

          <form noValidate onSubmit={studentEditForm.handleSubmit(onStudentEditSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={studentEditForm.control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-child-fn">First Name *</FieldLabel>
                    <Input {...field} id="edit-child-fn" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={studentEditForm.control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-child-ln">Last Name *</FieldLabel>
                    <Input {...field} id="edit-child-ln" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={studentEditForm.control}
                name="dob"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-child-dob">Date of Birth *</FieldLabel>
                    <Input {...field} id="edit-child-dob" type="date" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={studentEditForm.control}
                name="gender"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-child-gender">Gender *</FieldLabel>
                    <NativeSelect {...field} id="edit-child-gender">
                      <option value="Boy">Boy</option>
                      <option value="Girl">Girl</option>
                      <option value="Other">Other</option>
                    </NativeSelect>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={studentEditForm.control}
                name="branch"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-child-branch">Branch Location *</FieldLabel>
                    <NativeSelect {...field} id="edit-child-branch">
                      <option value="Branch 1">Branch 1 (Galleywall Road)</option>
                      <option value="Branch 2">Branch 2 (Corbetts Lane)</option>
                    </NativeSelect>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={studentEditForm.control}
                name="status"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-child-status">Enrollment Status *</FieldLabel>
                    <NativeSelect {...field} id="edit-child-status">
                      <option value="ACTIVE">ACTIVE (Enrolled)</option>
                      <option value="WAITING_LIST">WAITING_LIST</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </NativeSelect>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={studentEditForm.control}
              name="roomId"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-child-room">Classroom Assignment</FieldLabel>
                  <NativeSelect {...field} id="edit-child-room">
                    <option value="">No Room (Waitlist)</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                        {r.min_age_months !== undefined && r.max_age_months !== undefined
                          ? ` (${r.min_age_months}-${r.max_age_months} mos)`
                          : ""}
                      </option>
                    ))}
                  </NativeSelect>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={studentEditForm.control}
              name="allergies"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-child-allergies">Allergies & Dietary Restrictions</FieldLabel>
                  <Input {...field} id="edit-child-allergies" placeholder="e.g. Nuts, Dairy" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={studentEditForm.control}
              name="medicalNotes"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-child-medical">Medical Notes</FieldLabel>
                  <Textarea {...field} id="edit-child-medical" rows={2} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <DialogFooter className="pt-4 border-t gap-2 flex justify-between sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                className="gap-1.5"
                onClick={() => {
                  const target = editingChild;
                  setEditingChild(null);
                  setDeletingChild(target);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingChild(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Update Student Record"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Student Confirmation Dialog */}
      <Dialog open={!!deletingChild} onOpenChange={(open) => !open && setDeletingChild(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Delete Student Record
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                {deletingChild?.first_name} {deletingChild?.last_name}
              </strong>
              ? This action cannot be undone and will permanently delete the student profile.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeletingChild(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent} disabled={submitting}>
              {submitting ? "Deleting..." : "Delete Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
