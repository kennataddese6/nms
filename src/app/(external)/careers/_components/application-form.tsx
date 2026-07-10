"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle, FileText, UploadCloud } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

const applicationSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required." }),
  lastName: z.string().min(2, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(5, { message: "Phone number is required." }),
  position: z.string().min(2, { message: "Please select a position." }),
  message: z.string().min(10, { message: "Brief cover note must be at least 10 characters." }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export function ApplicationForm() {
  const [file, setFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "Early Years Educator (Level 3)",
      message: "",
    },
    mode: "onTouched",
  });

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Validate and set file
  const validateAndSetFile = (selectedFile: File) => {
    setFileError(null);
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setFileError("Only PDF or Word documents (.doc, .docx) are allowed.");
      setFile(null);
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError("File size exceeds 5MB limit.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file select change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: ApplicationFormValues) => {
    if (!file) {
      setFileError("Please upload your CV/Resume to apply.");
      return;
    }
    setSubmitting(true);

    try {
      // Mock submit latency
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Application Submitted!", {
        description: `Thank you, ${data.firstName}. We have received your application for the ${data.position} role.`,
      });

      // Reset form
      form.reset();
      setFile(null);
      setFileError(null);
    } catch (err) {
      toast.error("Application Error", {
        description: "Failed to submit application. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          control={form.control}
          name="firstName"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <Input {...field} id="firstName" placeholder="John" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="lastName"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <Input {...field} id="lastName" placeholder="Smith" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input {...field} id="email" type="email" placeholder="john.smith@example.com" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input {...field} id="phone" placeholder="+44 7123 456789" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Controller
        control={form.control}
        name="position"
        render={({ field, fieldState }) => (
          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="position">Position Applied For</FieldLabel>
            <NativeSelect {...field} id="position">
              <option value="Early Years Educator (Level 3)">Early Years Educator (Level 3)</option>
              <option value="Nursery Room Leader">Nursery Room Leader</option>
              <option value="Apprentice Nursery Practitioner">Apprentice Nursery Practitioner</option>
            </NativeSelect>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="message"
        render={({ field, fieldState }) => (
          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="message">Cover Note & Summary</FieldLabel>
            <Textarea
              {...field}
              id="message"
              placeholder="Tell us briefly about your early years childcare experience, why you love teaching children, and when you can start."
              rows={4}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Drag & Drop File Upload */}
      <div className="space-y-1.5">
        <label htmlFor="cv-upload-input" className="text-sm font-medium text-foreground">
          Upload CV / Resume (PDF or Word)
        </label>
        <input
          id="cv-upload-input"
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
        />
        <button
          type="button"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-200 ${
            dragActive
              ? "border-primary bg-primary/5 scale-[0.99]"
              : file
                ? "border-secondary bg-secondary/5"
                : "border-neutral-200 hover:border-primary/50 hover:bg-neutral-50"
          }`}
        >
          {file ? (
            <div className="text-center space-y-2">
              <CheckCircle className="h-10 w-10 text-secondary-foreground mx-auto" />
              <div className="flex items-center gap-1.5 justify-center text-sm font-bold text-foreground">
                <FileText className="h-4.5 w-4.5" />
                {file.name}
              </div>
              <span className="block text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • Click to replace file
              </span>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto" />
              <span className="block text-sm font-bold text-foreground">Drag and drop your CV file here</span>
              <span className="block text-xs text-muted-foreground">Or click to browse files (max 5MB)</span>
            </div>
          )}
        </button>

        {fileError && (
          <div className="flex gap-2 items-center text-xs text-destructive mt-1">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{fileError}</span>
          </div>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitting}>
        {submitting ? "Submitting Application..." : "Submit Online Application"}
      </Button>
    </form>
  );
}
