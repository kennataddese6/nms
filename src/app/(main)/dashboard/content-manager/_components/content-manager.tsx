"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  Calendar,
  Check,
  Image as ImageIcon,
  Layers,
  Newspaper,
  Pencil,
  Plus,
  Search,
  Trash2,
  Utensils,
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

const jobSchema = z.object({
  title: z.string().min(3, "Title is required"),
  type: z.string().min(1, "Type is required"),
  salary: z.string().min(1, "Salary is required"),
  room: z.string().min(1, "Room is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().min(5, "At least one requirement is required"),
  branch: z.string().min(1, "Branch selection is required"),
});

type JobFormValues = z.infer<typeof jobSchema>;

const newsEventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  category: z.enum(["news", "event"]),
  eventDate: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  imageUrl: z.string().optional(),
  branch: z.string().min(1, "Branch selection is required"),
});

type NewsEventFormValues = z.infer<typeof newsEventSchema>;

const gallerySchema = z.object({
  title: z.string().min(2, "Title is required"),
  category: z.string().min(1, "Category is required"),
  mediaUrl: z.string().optional(),
  branch: z.string().min(1, "Branch selection is required"),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

const menuSchema = z.object({
  name: z.string().min(3, "Menu name is required"),
  breakfast: z.string().min(3, "Breakfast is required"),
  morning_snack: z.string().min(3, "Morning snack is required"),
  lunchMon: z.string().min(2, "Monday lunch is required"),
  lunchTue: z.string().min(2, "Tuesday lunch is required"),
  lunchWed: z.string().min(2, "Wednesday lunch is required"),
  lunchThu: z.string().min(2, "Thursday lunch is required"),
  lunchFri: z.string().min(2, "Friday lunch is required"),
  dessertMon: z.string().min(2, "Monday dessert is required"),
  dessertTue: z.string().min(2, "Tuesday dessert is required"),
  dessertWed: z.string().min(2, "Wednesday dessert is required"),
  dessertThu: z.string().min(2, "Thursday dessert is required"),
  dessertFri: z.string().min(2, "Friday dessert is required"),
  snackMon: z.string().min(2, "Monday snack is required"),
  snackTue: z.string().min(2, "Tuesday snack is required"),
  snackWed: z.string().min(2, "Wednesday snack is required"),
  snackThu: z.string().min(2, "Thursday snack is required"),
  snackFri: z.string().min(2, "Friday snack is required"),
  teaMon: z.string().min(2, "Monday tea is required"),
  teaTue: z.string().min(2, "Tuesday tea is required"),
  teaWed: z.string().min(2, "Wednesday tea is required"),
  teaThu: z.string().min(2, "Thursday tea is required"),
  teaFri: z.string().min(2, "Friday tea is required"),
  branch: z.string().min(1, "Branch selection is required"),
});

type MenuFormValues = z.infer<typeof menuSchema>;

// ==========================================
// PROPS & MAIN COMPONENT
// ==========================================

interface ContentManagerProps {
  initialJobs: any[];
  initialNewsEvents: any[];
  initialGalleryItems: any[];
  initialMenus: any[];
}

export function ContentManager({
  initialJobs,
  initialNewsEvents,
  initialGalleryItems,
  initialMenus,
}: ContentManagerProps) {
  const supabase = createClient();
  const router = useRouter();

  const [jobs, setJobs] = React.useState(initialJobs);
  const [newsEvents, setNewsEvents] = React.useState(initialNewsEvents);
  const [galleryItems, setGalleryItems] = React.useState(initialGalleryItems);
  const [menus, setMenus] = React.useState(initialMenus);

  const [jobModalOpen, setJobModalOpen] = React.useState(false);
  const [editingJob, setEditingJob] = React.useState<any | null>(null);
  const [newsModalOpen, setNewsModalOpen] = React.useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = React.useState(false);
  const [menuModalOpen, setMenuModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Branch and direct upload states
  const [branchFilter, setBranchFilter] = React.useState<"All" | "Branch 1" | "Branch 2">("All");
  const [newsFile, setNewsFile] = React.useState<File | null>(null);
  const [galleryFile, setGalleryFile] = React.useState<File | null>(null);

  // Sync menu state with props
  React.useEffect(() => {
    setMenus(initialMenus);
  }, [initialMenus]);

  const menuForm = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: "",
      breakfast: "Cereals, Fresh fruit, Porridge, Toast. Served on a rolling basis between 7.30-8.45",
      morning_snack: "Served on a rolling basis from 10am",
      lunchMon: "",
      lunchTue: "",
      lunchWed: "",
      lunchThu: "",
      lunchFri: "",
      dessertMon: "",
      dessertTue: "",
      dessertWed: "",
      dessertThu: "",
      dessertFri: "",
      snackMon: "",
      snackTue: "",
      snackWed: "",
      snackThu: "",
      snackFri: "",
      teaMon: "",
      teaTue: "",
      teaWed: "",
      teaThu: "",
      teaFri: "",
      branch: "Branch 1",
    },
  });

  const onMenuSubmit = async (values: MenuFormValues) => {
    setSubmitting(true);
    try {
      const lunchObj = {
        Monday: values.lunchMon,
        Tuesday: values.lunchTue,
        Wednesday: values.lunchWed,
        Thursday: values.lunchThu,
        Friday: values.lunchFri,
      };
      const dessertObj = {
        Monday: values.dessertMon,
        Tuesday: values.dessertTue,
        Wednesday: values.dessertWed,
        Thursday: values.dessertThu,
        Friday: values.dessertFri,
      };
      const snackObj = {
        Monday: values.snackMon,
        Tuesday: values.snackTue,
        Wednesday: values.snackWed,
        Thursday: values.snackThu,
        Friday: values.snackFri,
      };
      const teaObj = {
        Monday: values.teaMon,
        Tuesday: values.teaTue,
        Wednesday: values.teaWed,
        Thursday: values.teaThu,
        Friday: values.teaFri,
      };

      const { data, error } = await supabase
        .from("nursery_menus")
        .insert({
          name: values.name,
          breakfast: values.breakfast,
          morning_snack: values.morning_snack,
          lunch: lunchObj,
          desserts: dessertObj,
          afternoon_snack: snackObj,
          afternoon_tea: teaObj,
          is_active: false,
        })
        .select()
        .single();

      if (error) throw error;
      setMenus((prev) => [data, ...prev]);
      setMenuModalOpen(false);
      menuForm.reset();
      toast.success("Weekly Menu Added successfully!");
    } catch (err: any) {
      toast.error("Failed to add menu", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMenuActive = async (id: string, currentlyActive: boolean) => {
    if (currentlyActive) {
      toast.warning("At least one menu must remain active. Set another menu active to swap.");
      return;
    }
    try {
      // 1. Set all active to false
      const { error: err1 } = await supabase.from("nursery_menus").update({ is_active: false }).neq("id", id);
      if (err1) throw err1;

      // 2. Set this active
      const { error: err2 } = await supabase.from("nursery_menus").update({ is_active: true }).eq("id", id);
      if (err2) throw err2;

      setMenus((prev) =>
        prev.map((m) => ({
          ...m,
          is_active: m.id === id,
        })),
      );
      toast.success("Active weekly menu updated!");
    } catch (err: any) {
      toast.error("Failed to activate menu", { description: err.message });
    }
  };

  // Sync state with props
  React.useEffect(() => {
    setJobs(initialJobs);
  }, [initialJobs]);

  React.useEffect(() => {
    setNewsEvents(initialNewsEvents);
  }, [initialNewsEvents]);

  React.useEffect(() => {
    setGalleryItems(initialGalleryItems);
  }, [initialGalleryItems]);

  // Forms
  const jobForm = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      type: "Full-time",
      salary: "",
      room: "All Rooms",
      description: "",
      requirements: "",
      branch: "Branch 1",
    },
    mode: "onTouched",
  });

  const newsForm = useForm<NewsEventFormValues>({
    resolver: zodResolver(newsEventSchema),
    defaultValues: {
      title: "",
      category: "news",
      eventDate: "",
      content: "",
      imageUrl: "",
      branch: "Branch 1",
    },
    mode: "onTouched",
  });

  const galleryForm = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: "",
      category: "activities",
      mediaUrl: "",
      branch: "Branch 1",
    },
    mode: "onTouched",
  });

  // Submissions
  const handleCreateJob = () => {
    setEditingJob(null);
    jobForm.reset({
      title: "",
      type: "Full-time",
      salary: "",
      room: "All Rooms",
      description: "",
      requirements: "",
      branch: "Branch 1",
    });
    setJobModalOpen(true);
  };

  const handleEditJob = (job: any) => {
    setEditingJob(job);
    jobForm.reset({
      title: job.title || "",
      type: job.type || "Full-time",
      salary: job.salary || "",
      room: job.room || "All Rooms",
      description: job.description || "",
      requirements: Array.isArray(job.requirements) ? job.requirements.join(", ") : job.requirements || "",
      branch: job.branch || "Branch 1",
    });
    setJobModalOpen(true);
  };

  const onJobSubmit = async (data: JobFormValues) => {
    setSubmitting(true);
    try {
      // Split requirements by commas or newlines
      const reqList = data.requirements
        .split(/[,\n]/)
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      const payload = {
        title: data.title,
        type: data.type,
        salary: data.salary,
        room: data.room,
        description: data.description,
        requirements: reqList,
        branch: data.branch,
      };

      if (editingJob) {
        const { error } = await supabase.from("jobs").update(payload).eq("id", editingJob.id);
        if (error) throw error;

        setJobs((prev) => prev.map((j) => (j.id === editingJob.id ? { ...j, ...payload } : j)));
        toast.success("Job Vacancy Updated Successfully!");
      } else {
        const { data: newJob, error } = await supabase.from("jobs").insert(payload).select().single();
        if (error) throw error;

        setJobs((prev) => [newJob, ...prev]);
        toast.success("Job Vacancy Posted Successfully!");
      }

      jobForm.reset();
      setEditingJob(null);
      setJobModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(editingJob ? "Failed to update job" : "Failed to post job", {
        description: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onNewsSubmit = async (data: NewsEventFormValues) => {
    setSubmitting(true);
    try {
      let uploadedUrl = data.imageUrl || null;

      if (newsFile) {
        const fileExt = newsFile.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `news/${fileName}`;

        const { error: uploadError } = await supabase.storage.from("nursery-assets").upload(filePath, newsFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("nursery-assets").getPublicUrl(filePath);

        uploadedUrl = publicUrl;
      }

      const { error } = await supabase.from("news_events").insert({
        title: data.title,
        category: data.category,
        event_date: data.category === "event" ? data.eventDate || null : null,
        content: data.content,
        image_url: uploadedUrl,
        branch: data.branch,
      });

      if (error) throw error;

      toast.success("News/Event Published Successfully!");
      newsForm.reset();
      setNewsFile(null);
      setNewsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to publish post", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const onGallerySubmit = async (data: GalleryFormValues) => {
    setSubmitting(true);
    try {
      let uploadedUrl = data.mediaUrl || "";

      if (galleryFile) {
        const fileExt = galleryFile.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage.from("nursery-assets").upload(filePath, galleryFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("nursery-assets").getPublicUrl(filePath);

        uploadedUrl = publicUrl;
      } else if (!uploadedUrl) {
        throw new Error("Please select an image file to upload.");
      }

      const { error } = await supabase.from("gallery_media").insert({
        title: data.title,
        category: data.category,
        media_url: uploadedUrl,
        branch: data.branch,
      });

      if (error) throw error;

      toast.success("Gallery Image Added Successfully!");
      galleryForm.reset();
      setGalleryFile(null);
      setGalleryModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to save media", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Action helpers
  const deleteItem = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      toast.success("Item Deleted Successfully!");
      router.refresh();
    } catch (err: any) {
      toast.error("Deletion failed", { description: err.message });
    }
  };

  const filteredJobs = jobs.filter((j) => branchFilter === "All" || j.branch === branchFilter);

  const filteredNewsEvents = newsEvents.filter(
    (n) => branchFilter === "All" || n.branch === branchFilter || n.branch === "Both",
  );

  const filteredGalleryItems = galleryItems.filter((g) => branchFilter === "All" || g.branch === branchFilter);

  const filteredMenus = menus.filter((m) => branchFilter === "All" || m.branch === branchFilter);

  return (
    <div className="space-y-6">
      {/* Branch View Selector Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl border bg-card/60 backdrop-blur-sm shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-foreground">Select Active Branch View</h2>
          <p className="text-[11px] text-muted-foreground">
            Filter Careers, News, Gallery, and Menus by school setting.
          </p>
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
              {b === "All" ? "All Locations" : b === "Branch 1" ? "Branch 1" : "Branch 2"}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
          <TabsTrigger value="jobs" className="rounded-lg flex gap-2">
            <Briefcase className="h-4 w-4" />
            Careers ({filteredJobs.length})
          </TabsTrigger>
          <TabsTrigger value="news" className="rounded-lg flex gap-2">
            <Newspaper className="h-4 w-4" />
            News & Events ({filteredNewsEvents.length})
          </TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-lg flex gap-2">
            <ImageIcon className="h-4 w-4" />
            Gallery ({filteredGalleryItems.length})
          </TabsTrigger>
          <TabsTrigger value="menu" className="rounded-lg flex gap-2">
            <Utensils className="h-4 w-4" />
            Nutrition Menus ({filteredMenus.length})
          </TabsTrigger>
        </TabsList>

        {/* ==========================================
          JOBS TAB CONTENT
         ========================================== */}
        <TabsContent value="jobs" className="focus:outline-none">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Active Career Openings</CardTitle>
                <CardDescription>Manage active job listings shown on the careers page.</CardDescription>
              </div>

              <Dialog
                open={jobModalOpen}
                onOpenChange={(open) => {
                  setJobModalOpen(open);
                  if (!open) setEditingJob(null);
                }}
              >
                <Button size="sm" className="rounded-lg" onClick={handleCreateJob}>
                  <Plus className="h-4 w-4 mr-1" />
                  Create Job Listing
                </Button>
                <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingJob ? "Edit Career Opening" : "Post New Career Opening"}</DialogTitle>
                    <DialogDescription>
                      {editingJob
                        ? "Update the details for this active job vacancy."
                        : "Add a vacancy that will immediately appear in the public /careers section."}
                    </DialogDescription>
                  </DialogHeader>
                  <form noValidate onSubmit={jobForm.handleSubmit(onJobSubmit)} className="space-y-4 py-2">
                    <Controller
                      control={jobForm.control}
                      name="title"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="job-title">Job Title</FieldLabel>
                          <Input {...field} id="job-title" placeholder="E.g. Early Years Educator" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        control={jobForm.control}
                        name="type"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="job-type">Employment Type</FieldLabel>
                            <NativeSelect {...field} id="job-type">
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Apprentice">Apprentice</option>
                            </NativeSelect>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        control={jobForm.control}
                        name="room"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="job-room">Assigned Room</FieldLabel>
                            <Input {...field} id="job-room" placeholder="E.g. Toddlers Room" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>

                    <Controller
                      control={jobForm.control}
                      name="salary"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="job-salary">Salary Band</FieldLabel>
                          <Input {...field} id="job-salary" placeholder="E.g. £28,000 - £32,000 / year" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      control={jobForm.control}
                      name="description"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="job-desc">Job Description</FieldLabel>
                          <Textarea
                            {...field}
                            id="job-desc"
                            placeholder="Detail classroom expectations and daily tasks"
                            rows={3}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      control={jobForm.control}
                      name="requirements"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="job-reqs">Requirements (Comma separated)</FieldLabel>
                          <Textarea
                            {...field}
                            id="job-reqs"
                            placeholder="E.g. Level 3 NVQ, pediatric first aid, clean DBS"
                            rows={2}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      control={jobForm.control}
                      name="branch"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="job-branch">Nursery Branch</FieldLabel>
                          <NativeSelect {...field} id="job-branch">
                            <option value="Branch 1">Branch 1 (Galleywall Road)</option>
                            <option value="Branch 2">Branch 2 (Corbetts Lane)</option>
                          </NativeSelect>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting
                          ? editingJob
                            ? "Updating..."
                            : "Posting..."
                          : editingJob
                            ? "Update Job Opening"
                            : "Post Job Opening"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="px-0">
              {filteredJobs.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No job postings found for this setting view.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b bg-muted-foreground/10 text-xs font-semibold text-muted-foreground">
                        <th className="p-4">Title</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Salary</th>
                        <th className="p-4">Room</th>
                        <th className="p-4">Branch</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-muted/40 transition-colors">
                          <td className="p-4 font-bold text-foreground">{job.title}</td>
                          <td className="p-4">
                            <Badge variant="outline">{job.type}</Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">{job.salary}</td>
                          <td className="p-4 text-muted-foreground">{job.room}</td>
                          <td className="p-4">
                            <Badge variant="secondary">{job.branch}</Badge>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground mr-1"
                              onClick={() => handleEditJob(job)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => deleteItem("jobs", job.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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

        {/* ==========================================
          NEWS & EVENTS TAB CONTENT
         ========================================== */}
        <TabsContent value="news" className="focus:outline-none">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Nursery News & Events</CardTitle>
                <CardDescription>Publish parent notices, holiday calendars, and nursery events.</CardDescription>
              </div>

              <Dialog open={newsModalOpen} onOpenChange={setNewsModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="rounded-lg">
                    <Plus className="h-4 w-4 mr-1" />
                    Publish News/Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Publish News or Event Notice</DialogTitle>
                    <DialogDescription>Fill in details to post to the parent information wall.</DialogDescription>
                  </DialogHeader>
                  <form noValidate onSubmit={newsForm.handleSubmit(onNewsSubmit)} className="space-y-4 py-2">
                    <Controller
                      control={newsForm.control}
                      name="title"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="post-title">Title</FieldLabel>
                          <Input {...field} id="post-title" placeholder="E.g. Summer Outing to London Zoo" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        control={newsForm.control}
                        name="category"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="post-cat">Category</FieldLabel>
                            <NativeSelect {...field} id="post-cat">
                              <option value="news">News Notice</option>
                              <option value="event">Calendar Event</option>
                            </NativeSelect>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        control={newsForm.control}
                        name="eventDate"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="post-date">Event Date (Optional)</FieldLabel>
                            <Input {...field} id="post-date" type="date" />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>

                    <Controller
                      control={newsForm.control}
                      name="content"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="post-content">Message Content</FieldLabel>
                          <Textarea {...field} id="post-content" placeholder="Type notification content..." rows={4} />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Field className="gap-1.5">
                      <FieldLabel htmlFor="post-img-file">Upload Image (Optional)</FieldLabel>
                      <Input
                        id="post-img-file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setNewsFile(file);
                        }}
                      />
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Select an image from your device to upload directly.
                      </p>
                    </Field>

                    <Controller
                      control={newsForm.control}
                      name="branch"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="post-branch">Nursery Branch</FieldLabel>
                          <NativeSelect {...field} id="post-branch">
                            <option value="Branch 1">Branch 1 (Galleywall Road)</option>
                            <option value="Branch 2">Branch 2 (Corbetts Lane)</option>
                            <option value="Both">Both Branches</option>
                          </NativeSelect>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? "Publishing..." : "Publish Post"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="px-0">
              {filteredNewsEvents.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No news or events posted for this setting view.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b bg-muted-foreground/10 text-xs font-semibold text-muted-foreground">
                        <th className="p-4">Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Event Date</th>
                        <th className="p-4">Content Preview</th>
                        <th className="p-4">Branch</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredNewsEvents.map((post) => (
                        <tr key={post.id} className="hover:bg-muted/40 transition-colors">
                          <td className="p-4 font-bold text-foreground">{post.title}</td>
                          <td className="p-4">
                            <Badge
                              variant="outline"
                              className={
                                post.category === "event"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }
                            >
                              {post.category}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">{post.event_date || "—"}</td>
                          <td className="p-4 text-muted-foreground max-w-xs truncate">{post.content}</td>
                          <td className="p-4">
                            <Badge variant="secondary">{post.branch}</Badge>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => deleteItem("news_events", post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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

        {/* ==========================================
          GALLERY TAB CONTENT
         ========================================== */}
        <TabsContent value="gallery" className="focus:outline-none">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Nursery Photo Gallery</CardTitle>
                <CardDescription>Post classroom activity photos for public viewers.</CardDescription>
              </div>

              <Dialog open={galleryModalOpen} onOpenChange={setGalleryModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="rounded-lg">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Gallery Image
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Gallery Image</DialogTitle>
                    <DialogDescription>Provide a title, category, and visual image URL.</DialogDescription>
                  </DialogHeader>
                  <form noValidate onSubmit={galleryForm.handleSubmit(onGallerySubmit)} className="space-y-4 py-2">
                    <Controller
                      control={galleryForm.control}
                      name="title"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="gal-title">Media Title</FieldLabel>
                          <Input {...field} id="gal-title" placeholder="E.g. Mud kitchen play" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      control={galleryForm.control}
                      name="category"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="gal-cat">Gallery Category</FieldLabel>
                          <NativeSelect {...field} id="gal-cat">
                            <option value="classrooms">Classrooms Environments</option>
                            <option value="activities">Daily Play Activities</option>
                            <option value="events">Holiday Events</option>
                          </NativeSelect>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Field className="gap-1.5">
                      <FieldLabel htmlFor="gal-img-file">Upload Image *</FieldLabel>
                      <Input
                        id="gal-img-file"
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setGalleryFile(file);
                        }}
                      />
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Select an image from your device to upload directly.
                      </p>
                    </Field>

                    <Controller
                      control={galleryForm.control}
                      name="branch"
                      render={({ field, fieldState }) => (
                        <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="gal-branch">Nursery Branch</FieldLabel>
                          <NativeSelect {...field} id="gal-branch">
                            <option value="Branch 1">Branch 1 (Galleywall Road)</option>
                            <option value="Branch 2">Branch 2 (Corbetts Lane)</option>
                          </NativeSelect>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? "Saving..." : "Add to Gallery"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="px-0">
              {filteredGalleryItems.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No gallery media found for this setting view.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b bg-muted-foreground/10 text-xs font-semibold text-muted-foreground">
                        <th className="p-4">Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Image Preview</th>
                        <th className="p-4">Branch</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredGalleryItems.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                          <td className="p-4 font-bold text-foreground">{item.title}</td>
                          <td className="p-4">
                            <Badge variant="outline">{item.category}</Badge>
                          </td>
                          <td className="p-4">
                            <img
                              src={item.media_url}
                              alt={item.title}
                              className="h-10 w-16 object-cover rounded-md border"
                            />
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary">{item.branch}</Badge>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => deleteItem("gallery_media", item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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

        {/* ==========================================
          NUTRITION MENU TAB CONTENT
         ========================================== */}
        <TabsContent value="menu" className="focus:outline-none">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Nutrition & Weekly Menus</CardTitle>
                <CardDescription>
                  Create weekly menu structures for breakfast, lunches, teas, and snacks, and toggle the active rotas.
                </CardDescription>
              </div>

              <Dialog open={menuModalOpen} onOpenChange={setMenuModalOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-full shadow-sm">
                    <Plus className="h-4 w-4 mr-1.5" /> Add Weekly Menu
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl">
                  <DialogHeader className="pb-4 border-b">
                    <DialogTitle>Add Weekly Menu</DialogTitle>
                    <DialogDescription>
                      Create a new weekly rota menu. Day meal descriptions are required.
                    </DialogDescription>
                  </DialogHeader>

                  <form noValidate onSubmit={menuForm.handleSubmit(onMenuSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-3">
                      <Controller
                        control={menuForm.control}
                        name="name"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="menu-name">Menu Rota Name *</FieldLabel>
                            <Input {...field} id="menu-name" placeholder="e.g. Autumn Menu 2025 - Week 1" />
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                          </Field>
                        )}
                      />

                      <Controller
                        control={menuForm.control}
                        name="branch"
                        render={({ field, fieldState }) => (
                          <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="menu-branch">Nursery Branch *</FieldLabel>
                            <NativeSelect {...field} id="menu-branch">
                              <option value="Branch 1">Branch 1 (Galleywall Road)</option>
                              <option value="Branch 2">Branch 2 (Corbetts Lane)</option>
                            </NativeSelect>
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                          </Field>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Controller
                          control={menuForm.control}
                          name="breakfast"
                          render={({ field, fieldState }) => (
                            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="menu-breakfast">Breakfast *</FieldLabel>
                              <Textarea {...field} id="menu-breakfast" rows={2} />
                              {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                            </Field>
                          )}
                        />
                        <Controller
                          control={menuForm.control}
                          name="morning_snack"
                          render={({ field, fieldState }) => (
                            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="menu-morning-snack">Morning Snack *</FieldLabel>
                              <Textarea {...field} id="menu-morning-snack" rows={2} />
                              {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                            </Field>
                          )}
                        />
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                          Lunches (Monday - Friday)
                        </h4>
                        <div className="space-y-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                            <Controller
                              key={`lunch${day}`}
                              control={menuForm.control}
                              name={`lunch${day}` as any}
                              render={({ field, fieldState }) => (
                                <div className="flex items-center gap-2">
                                  <span className="w-20 text-xs font-semibold text-muted-foreground">
                                    {day === "Mon"
                                      ? "Monday"
                                      : day === "Tue"
                                        ? "Tuesday"
                                        : day === "Wed"
                                          ? "Wednesday"
                                          : day === "Thu"
                                            ? "Thursday"
                                            : "Friday"}
                                    :
                                  </span>
                                  <div className="flex-1">
                                    <Input
                                      {...field}
                                      placeholder="Lunch meal description..."
                                      className="text-xs py-1 h-8"
                                    />
                                    {fieldState.error && (
                                      <span className="text-[10px] text-destructive block mt-0.5">
                                        {fieldState.error.message}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-xs font-bold text-secondary-foreground uppercase tracking-wider mb-3">
                          Desserts (Monday - Friday)
                        </h4>
                        <div className="space-y-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                            <Controller
                              key={`dessert${day}`}
                              control={menuForm.control}
                              name={`dessert${day}` as any}
                              render={({ field, fieldState }) => (
                                <div className="flex items-center gap-2">
                                  <span className="w-20 text-xs font-semibold text-muted-foreground">
                                    {day === "Mon"
                                      ? "Monday"
                                      : day === "Tue"
                                        ? "Tuesday"
                                        : day === "Wed"
                                          ? "Wednesday"
                                          : day === "Thu"
                                            ? "Thursday"
                                            : "Friday"}
                                    :
                                  </span>
                                  <div className="flex-1">
                                    <Input
                                      {...field}
                                      placeholder="Dessert description..."
                                      className="text-xs py-1 h-8"
                                    />
                                    {fieldState.error && (
                                      <span className="text-[10px] text-destructive block mt-0.5">
                                        {fieldState.error.message}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-xs font-bold text-accent-foreground uppercase tracking-wider mb-3">
                          Afternoon Snacks (Monday - Friday)
                        </h4>
                        <div className="space-y-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                            <Controller
                              key={`snack${day}`}
                              control={menuForm.control}
                              name={`snack${day}` as any}
                              render={({ field, fieldState }) => (
                                <div className="flex items-center gap-2">
                                  <span className="w-20 text-xs font-semibold text-muted-foreground">
                                    {day === "Mon"
                                      ? "Monday"
                                      : day === "Tue"
                                        ? "Tuesday"
                                        : day === "Wed"
                                          ? "Wednesday"
                                          : day === "Thu"
                                            ? "Thursday"
                                            : "Friday"}
                                    :
                                  </span>
                                  <div className="flex-1">
                                    <Input
                                      {...field}
                                      placeholder="Afternoon snack description..."
                                      className="text-xs py-1 h-8"
                                    />
                                    {fieldState.error && (
                                      <span className="text-[10px] text-destructive block mt-0.5">
                                        {fieldState.error.message}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-xs font-bold text-destructive uppercase tracking-wider mb-3">
                          Afternoon Teas (Monday - Friday)
                        </h4>
                        <div className="space-y-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                            <Controller
                              key={`tea${day}`}
                              control={menuForm.control}
                              name={`tea${day}` as any}
                              render={({ field, fieldState }) => (
                                <div className="flex items-center gap-2">
                                  <span className="w-20 text-xs font-semibold text-muted-foreground">
                                    {day === "Mon"
                                      ? "Monday"
                                      : day === "Tue"
                                        ? "Tuesday"
                                        : day === "Wed"
                                          ? "Wednesday"
                                          : day === "Thu"
                                            ? "Thursday"
                                            : "Friday"}
                                    :
                                  </span>
                                  <div className="flex-1">
                                    <Input
                                      {...field}
                                      placeholder="Afternoon tea description..."
                                      className="text-xs py-1 h-8"
                                    />
                                    {fieldState.error && (
                                      <span className="text-[10px] text-destructive block mt-0.5">
                                        {fieldState.error.message}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="pt-4 border-t gap-2">
                      <Button type="button" variant="ghost" onClick={() => setMenuModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Weekly Menu"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-6">
              {filteredMenus.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <p className="text-sm font-semibold">No menus created yet for this setting view.</p>
                  <p className="text-xs mt-1 text-neutral-400">Click "Add Weekly Menu" to populate your rota.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b bg-muted-foreground/10 text-xs font-semibold text-muted-foreground">
                        <th className="p-4">Menu Name</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Branch</th>
                        <th className="p-4">Date Created</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredMenus.map((m) => (
                        <tr key={m.id} className="hover:bg-muted/40 transition-colors">
                          <td className="p-4 font-bold text-foreground">{m.name}</td>
                          <td className="p-4">
                            {m.is_active ? (
                              <Badge className="bg-emerald-500 text-white font-bold flex items-center gap-1 w-max">
                                <Check className="h-3 w-3" /> Active Menu
                              </Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs rounded-full"
                                onClick={() => toggleMenuActive(m.id, m.is_active)}
                              >
                                Set Active
                              </Button>
                            )}
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary">{m.branch}</Badge>
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">
                            {new Date(m.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => deleteItem("nursery_menus", m.id)}
                              disabled={m.is_active}
                            >
                              <Trash2 className="h-4 w-4" />
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
    </div>
  );
}
