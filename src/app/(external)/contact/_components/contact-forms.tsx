"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, MessageSquare, Sparkles } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

// ==========================================
// SCHEMAS & TYPES
// ==========================================

const enquirySchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(5, { message: "Phone number is required." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

const tourSchema = z.object({
  parentName: z.string().min(2, { message: "Parent name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(5, { message: "Phone number is required." }),
  classroom: z.string().min(1, { message: "Please select a classroom." }),
  visitDate: z.string().refine(
    (val) => {
      const selectedDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if in the past
      if (selectedDate < today) return false;

      // Check if weekend (0 = Sunday, 6 = Saturday)
      const day = selectedDate.getDay();
      return day !== 0 && day !== 6;
    },
    {
      message: "Tours can only be scheduled for future weekdays (Monday - Friday).",
    },
  ),
  timeSlot: z.string().min(1, { message: "Please select a time slot." }),
  childAge: z.string().min(1, { message: "Please specify child age / age range." }),
  branch: z.string().min(1, { message: "Please select a branch location." }),
});

type TourFormValues = z.infer<typeof tourSchema>;

// ==========================================
// MAIN COMPONENT
// ==========================================

export function ContactForms() {
  const [activeForm, setActiveForm] = React.useState<"enquiry" | "tour">("enquiry");
  const [submitting, setSubmitting] = React.useState(false);

  const enquiryForm = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    mode: "onTouched",
  });

  const tourForm = useForm<TourFormValues>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      parentName: "",
      email: "",
      phone: "",
      classroom: "Babies Room (3m - 2y)",
      visitDate: "",
      timeSlot: "10:00 AM - 11:00 AM",
      childAge: "",
      branch: "Branch 1 (Manor Methodist Church, Galleywall Road, SE16 3PB)",
    },
    mode: "onTouched",
  });

  const onEnquirySubmit = async (data: EnquiryFormValues) => {
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success("Enquiry Sent!", {
        description: `Thank you, ${data.name}. Our admissions office will email you shortly at ${data.email}.`,
      });
      enquiryForm.reset();
    } catch {
      toast.error("Error sending enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onTourSubmit = async (data: TourFormValues) => {
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success("Tour Visit Requested!", {
        description: `Your booking request for ${data.visitDate} at ${data.timeSlot} has been received. We will confirm via phone shortly!`,
      });
      tourForm.reset();
    } catch {
      toast.error("Error booking tour. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Tabs Switcher */}
      <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setActiveForm("enquiry")}
          className={`w-1/2 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
            activeForm === "enquiry"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="h-4.5 w-4.5" />
          General Enquiry
        </button>
        <button
          type="button"
          onClick={() => setActiveForm("tour")}
          className={`w-1/2 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
            activeForm === "tour"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="h-4.5 w-4.5" />
          Book a Nursery Tour
        </button>
      </div>

      {/* Render Active Form */}
      {activeForm === "enquiry" ? (
        <form noValidate onSubmit={enquiryForm.handleSubmit(onEnquirySubmit)} className="space-y-4">
          <Controller
            control={enquiryForm.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="enquiry-name">Full Name</FieldLabel>
                <Input {...field} id="enquiry-name" placeholder="Sarah Green" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              control={enquiryForm.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="enquiry-email">Email Address</FieldLabel>
                  <Input {...field} id="enquiry-email" type="email" placeholder="sarah.green@example.com" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={enquiryForm.control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="enquiry-phone">Phone Number</FieldLabel>
                  <Input {...field} id="enquiry-phone" placeholder="+44 7123 456789" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            control={enquiryForm.control}
            name="message"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="enquiry-message">Your Message</FieldLabel>
                <Textarea
                  {...field}
                  id="enquiry-message"
                  placeholder="Ask us anything about admissions, curriculum, fees, or classroom setups..."
                  rows={4}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button type="submit" className="w-full rounded-full" disabled={submitting}>
            {submitting ? "Sending Enquiry..." : "Send General Enquiry"}
          </Button>
        </form>
      ) : (
        <form noValidate onSubmit={tourForm.handleSubmit(onTourSubmit)} className="space-y-4">
          <div className="bg-secondary/10 border border-secondary-foreground/10 rounded-2xl p-4 flex gap-3 items-start mb-2">
            <Sparkles className="h-5 w-5 text-secondary-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tours last 30-45 minutes and are scheduled during active nursery sessions (**10:00 AM** or **02:00 PM**)
              so you can observe classrooms in motion while avoiding nap schedules.
            </p>
          </div>

          <Controller
            control={tourForm.control}
            name="parentName"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="tour-parentName">Parent Name</FieldLabel>
                <Input {...field} id="tour-parentName" placeholder="Thomas Miller" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              control={tourForm.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tour-email">Email Address</FieldLabel>
                  <Input {...field} id="tour-email" type="email" placeholder="thomas.miller@example.com" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={tourForm.control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tour-phone">Phone Number</FieldLabel>
                  <Input {...field} id="tour-phone" placeholder="+44 7987 654321" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              control={tourForm.control}
              name="classroom"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tour-classroom">Classroom of Interest</FieldLabel>
                  <NativeSelect {...field} id="tour-classroom">
                    <option value="Babies Room (3m - 2y)">Babies Room (3m - 2y)</option>
                    <option value="Toddlers Room (2y - 3y)">Toddlers Room (2y - 3y)</option>
                    <option value="Preschool Room (3y - 5y)">Preschool Room (3y - 5y)</option>
                  </NativeSelect>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={tourForm.control}
              name="childAge"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tour-childAge">Child's Age / Expected Start</FieldLabel>
                  <Input {...field} id="tour-childAge" placeholder="E.g., 18 months / Sept 2026" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            control={tourForm.control}
            name="branch"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="tour-branch">Select Nursery Branch Location</FieldLabel>
                <NativeSelect {...field} id="tour-branch">
                  <option value="Branch 1 (Manor Methodist Church, Galleywall Road, SE16 3PB)">
                    Branch 1: Manor Methodist Church, Galleywall Road, SE16 3PB
                  </option>
                  <option value="Branch 2 (St Gertrudes Church Hall, Corbetts Lane, London, SE16 2BQ)">
                    Branch 2: St Gertrudes Church Hall, Corbetts Lane, London, SE16 2BQ
                  </option>
                </NativeSelect>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              control={tourForm.control}
              name="visitDate"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tour-visitDate">Preferred Visit Date</FieldLabel>
                  <Input {...field} id="tour-visitDate" type="date" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={tourForm.control}
              name="timeSlot"
              render={({ field, fieldState }) => (
                <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tour-timeSlot">Preferred Time Slot</FieldLabel>
                  <NativeSelect {...field} id="tour-timeSlot">
                    <option value="10:00 AM - 11:00 AM">Morning Session (10:00 AM - 11:00 AM)</option>
                    <option value="02:00 PM - 03:00 PM">Afternoon Session (02:00 PM - 03:00 PM)</option>
                  </NativeSelect>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitting}>
            {submitting ? "Booking Tour..." : "Request Tour Booking"}
          </Button>
        </form>
      )}
    </div>
  );
}
