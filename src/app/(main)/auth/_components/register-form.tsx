"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

// Multi-step form schema validation
const parentRegisterSchema = z
  .object({
    // Step 1: Account & Parent Details
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters." }),
    parentFirstName: z.string().min(2, { message: "First name is required." }),
    parentLastName: z.string().min(2, { message: "Last name is required." }),
    parentPhone: z.string().min(5, { message: "Phone number is required." }),
    parentAddress: z.string().min(5, { message: "Address is required." }),
    parentRelationship: z.string().min(2, { message: "Relationship to child is required (e.g. Mother, Father)." }),
    parentEmergencyContact: z.string().min(5, { message: "Emergency contact details are required." }),
    parentRelationshipStatus: z.string(),

    // Step 2: Child Details
    childFirstName: z.string().min(2, { message: "Child first name is required." }),
    childLastName: z.string().min(2, { message: "Child last name is required." }),
    childDob: z.string().min(5, { message: "Child date of birth is required." }),
    childGender: z.string(),
    childMedicalNotes: z.string(),
    childAllergies: z.string(),
    childRoomId: z.string(),

    // Step 3: Consents
    photoConsent: z.boolean(),
    medicalConsent: z.boolean().refine((val) => val === true, {
      message: "You must consent to emergency medical actions to register.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ParentRegisterFormValues = z.infer<typeof parentRegisterSchema>;

export function RegisterForm() {
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [rooms, setRooms] = React.useState<{ id: string; name: string }[]>([]);
  const supabase = createClient();
  const router = useRouter();

  const form = useForm<ParentRegisterFormValues>({
    resolver: zodResolver(parentRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      parentFirstName: "",
      parentLastName: "",
      parentPhone: "",
      parentAddress: "",
      parentRelationship: "Mother",
      parentEmergencyContact: "",
      parentRelationshipStatus: "Married",
      childFirstName: "",
      childLastName: "",
      childDob: "",
      childGender: "Male",
      childMedicalNotes: "",
      childAllergies: "",
      childRoomId: "",
      photoConsent: false,
      medicalConsent: false,
    },
    mode: "onTouched",
  });

  // Fetch rooms on mount
  React.useEffect(() => {
    async function loadRooms() {
      const { data, error } = await supabase.from("rooms").select("id, name");
      if (error) {
        // Fallback placeholder rooms if none seeded yet
        setRooms([
          { id: "babies", name: "Babies Room (3m - 2y)" },
          { id: "toddlers", name: "Toddlers Room (2y - 3y)" },
          { id: "preschool", name: "Preschool Room (3y - 5y)" },
        ]);
        return;
      }
      if (data && data.length > 0) {
        setRooms(data);
      } else {
        setRooms([
          { id: "babies", name: "Babies Room (3m - 2y)" },
          { id: "toddlers", name: "Toddlers Room (2y - 3y)" },
          { id: "preschool", name: "Preschool Room (3y - 5y)" },
        ]);
      }
    }
    void loadRooms();
  }, [supabase]);

  // Handle Step Navigation Validation
  const nextStep = async () => {
    let fieldsToValidate: (keyof ParentRegisterFormValues)[] = [];

    if (step === 1) {
      fieldsToValidate = [
        "email",
        "password",
        "confirmPassword",
        "parentFirstName",
        "parentLastName",
        "parentPhone",
        "parentAddress",
        "parentRelationship",
        "parentEmergencyContact",
      ];
    } else if (step === 2) {
      fieldsToValidate = ["childFirstName", "childLastName", "childDob"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    } else {
      toast.error("Please fill in all required fields correctly before moving on.");
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: ParentRegisterFormValues) => {
    setLoading(true);
    try {
      // 1. Supabase Auth signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.parentFirstName,
            last_name: data.parentLastName,
          },
        },
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || "Failed to create authentication account.");
      }

      const userId = authData.user.id;

      // 2. Update user profile details
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          phone: data.parentPhone,
        })
        .eq("id", userId);

      if (profileError) {
        throw new Error(profileError.message);
      }

      // 3. Create parent profile record
      const { data: parentData, error: parentError } = await supabase
        .from("parents")
        .insert({
          profile_id: userId,
          address: data.parentAddress,
          emergency_contact: data.parentEmergencyContact,
          relationship_status: data.parentRelationshipStatus,
        })
        .select("id")
        .single();

      if (parentError || !parentData) {
        throw new Error(parentError?.message || "Failed to create parent profile.");
      }

      // 4. Create child profile record
      // Map room_id to null if placeholder was selected
      const cleanRoomId =
        data.childRoomId === "babies" || data.childRoomId === "toddlers" || data.childRoomId === "preschool"
          ? null
          : data.childRoomId;

      const { data: childData, error: childError } = await supabase
        .from("children")
        .insert({
          first_name: data.childFirstName,
          last_name: data.childLastName,
          date_of_birth: data.childDob,
          gender: data.childGender,
          medical_notes: data.childMedicalNotes,
          allergies: data.childAllergies,
          photo_consent: data.photoConsent,
          emergency_medical_consent: data.medicalConsent,
          status: "WAITING_LIST",
          room_id: cleanRoomId ?? null,
        })
        .select("id")
        .single();

      if (childError || !childData) {
        throw new Error(childError?.message || "Failed to register child record.");
      }

      // 5. Link child and parent in child_parents
      const { error: linkError } = await supabase.from("child_parents").insert({
        child_id: childData.id,
        parent_id: parentData.id,
        relationship: data.parentRelationship,
        primary_contact: true,
      });

      if (linkError) {
        throw new Error(linkError.message);
      }

      // 6. Assign PARENT role
      const { data: roleData } = await supabase.from("roles").select("id").eq("name", "PARENT").single();

      if (roleData) {
        await supabase.from("user_roles").insert({
          user_id: userId,
          role_id: roleData.id,
        });
      }

      toast.success("Account Created!", {
        description: "Welcome to Bubbly Nursery. Redirecting to your portal...",
      });

      // Clear form and route to parent zone dashboard
      router.refresh();
      router.push("/dashboard/default");
    } catch (err: any) {
      toast.error("Registration failed", {
        description: err.message || "An unexpected error occurred during signup.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between border-b pb-4 mb-2">
        <span className="text-sm font-semibold text-primary uppercase tracking-wider">Step {step} of 3</span>
        <div className="flex gap-1">
          <div className={`h-2 w-8 rounded-full ${step >= 1 ? "bg-primary" : "bg-neutral-200"}`} />
          <div className={`h-2 w-8 rounded-full ${step >= 2 ? "bg-primary" : "bg-neutral-200"}`} />
          <div className={`h-2 w-8 rounded-full ${step >= 3 ? "bg-primary" : "bg-neutral-200"}`} />
        </div>
      </div>

      <FieldGroup className="gap-4">
        {/* ==========================================
            STEP 1: ACCOUNT & PARENT DETAILS
            ========================================== */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="parentFirstName"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="parentFirstName">First Name</FieldLabel>
                    <Input {...field} id="parentFirstName" placeholder="Jane" autoComplete="given-name" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="parentLastName"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="parentLastName">Last Name</FieldLabel>
                    <Input {...field} id="parentLastName" placeholder="Doe" autoComplete="family-name" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-email">Email Address</FieldLabel>
                  <Input
                    {...field}
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-confirm-password">Confirm Password</FieldLabel>
                    <Input
                      {...field}
                      id="register-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="parentPhone"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="parentPhone">Phone Number</FieldLabel>
                    <Input {...field} id="parentPhone" placeholder="+44 7123 456789" autoComplete="tel" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="parentRelationship"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="parentRelationship">Relationship</FieldLabel>
                    <NativeSelect {...field} id="parentRelationship">
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Guardian">Guardian / Other</option>
                    </NativeSelect>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="parentAddress"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="parentAddress">Home Address</FieldLabel>
                  <Textarea {...field} id="parentAddress" placeholder="12 Bubbles Road, London, SW1A 1AA" rows={2} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="parentEmergencyContact"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="parentEmergencyContact">Emergency Contact Details</FieldLabel>
                    <Input {...field} id="parentEmergencyContact" placeholder="Grandmother: +44 7987 654321" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="parentRelationshipStatus"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="parentRelationshipStatus">Marital Status</FieldLabel>
                    <NativeSelect {...field} id="parentRelationshipStatus">
                      <option value="Married">Married</option>
                      <option value="Single">Single</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Other">Other</option>
                    </NativeSelect>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </>
        )}

        {/* ==========================================
            STEP 2: CHILD DETAILS
            ========================================== */}
        {step === 2 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="childFirstName"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="childFirstName">Child's First Name</FieldLabel>
                    <Input {...field} id="childFirstName" placeholder="Leo" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="childLastName"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="childLastName">Child's Last Name</FieldLabel>
                    <Input {...field} id="childLastName" placeholder="Doe" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="childDob"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="childDob">Date of Birth</FieldLabel>
                    <Input {...field} id="childDob" type="date" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="childGender"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="childGender">Gender</FieldLabel>
                    <NativeSelect {...field} id="childGender">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </NativeSelect>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="childRoomId"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="childRoomId">Classroom / Room Preference</FieldLabel>
                  <NativeSelect {...field} id="childRoomId">
                    <option value="">Select a Room</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </NativeSelect>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="childMedicalNotes"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="childMedicalNotes">Medical Notes</FieldLabel>
                  <Textarea
                    {...field}
                    id="childMedicalNotes"
                    placeholder="E.g., Asthma inhaler inside backpack, eczema treatments."
                    rows={2}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="childAllergies"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="childAllergies">Allergies</FieldLabel>
                  <Textarea {...field} id="childAllergies" placeholder="E.g., Peanuts, dairy intolerance." rows={2} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </>
        )}

        {/* ==========================================
            STEP 3: CONSENTS & AGREEMENTS
            ========================================== */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-foreground text-lg mb-2">Consent Agreements</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Please review and accept our standard regulatory permissions to finalize registration.
              </p>
            </div>

            <Controller
              control={form.control}
              name="medicalConsent"
              render={({ field, fieldState }) => (
                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                  <Checkbox
                    id="medicalConsent"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="medicalConsent" className="font-bold text-sm">
                      Emergency Medical Action Consent <span className="text-destructive">*</span>
                    </FieldLabel>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                      I consent to Bubbly Day Nursery taking appropriate emergency medical actions, including seeking
                      advice from first-aid certified practitioners or calling emergency services, if my child suffers
                      an accident or sudden illness.
                    </p>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="photoConsent"
              render={({ field, fieldState }) => (
                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                  <Checkbox
                    id="photoConsent"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="photoConsent" className="font-bold text-sm">
                      Photo & Media Consent (Optional)
                    </FieldLabel>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                      I consent to Bubbly Day Nursery taking photos or recording videos of my child during classroom
                      play and outdoor learning, solely to document progress within their secure, private online
                      learning journal.
                    </p>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />
          </div>
        )}
      </FieldGroup>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        {step > 1 && (
          <Button type="button" variant="outline" className="w-1/2" onClick={prevStep} disabled={loading}>
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button type="button" className={`w-full ${step > 1 ? "w-1/2" : ""}`} onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button type="submit" className="w-1/2 flex-grow" disabled={loading}>
            {loading ? "Registering..." : "Submit Registration"}
          </Button>
        )}
      </div>
    </form>
  );
}
