"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  Briefcase, 
  Newspaper, 
  Image as ImageIcon, 
  Plus, 
  Search, 
  Trash2,
  Calendar,
  Layers
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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
});

type JobFormValues = z.infer<typeof jobSchema>;

const newsEventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  category: z.enum(["news", "event"]),
  eventDate: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  imageUrl: z.string().url("Invalid image URL").or(z.literal("")),
});

type NewsEventFormValues = z.infer<typeof newsEventSchema>;

const gallerySchema = z.object({
  title: z.string().min(2, "Title is required"),
  category: z.string().min(1, "Category is required"),
  mediaUrl: z.string().url("Please enter a valid media image URL"),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

// ==========================================
// PROPS & MAIN COMPONENT
// ==========================================

interface ContentManagerProps {
  initialJobs: any[];
  initialNewsEvents: any[];
  initialGalleryItems: any[];
}

export function ContentManager({ initialJobs, initialNewsEvents, initialGalleryItems }: ContentManagerProps) {
  const supabase = createClient();
  const router = useRouter();

  const [jobs, setJobs] = React.useState(initialJobs);
  const [newsEvents, setNewsEvents] = React.useState(initialNewsEvents);
  const [galleryItems, setGalleryItems] = React.useState(initialGalleryItems);

  const [jobModalOpen, setJobModalOpen] = React.useState(false);
  const [newsModalOpen, setNewsModalOpen] = React.useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

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
    },
    mode: "onTouched",
  });

  const galleryForm = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: "",
      category: "activities",
      mediaUrl: "",
    },
    mode: "onTouched",
  });

  // Submissions
  const onJobSubmit = async (data: JobFormValues) => {
    setSubmitting(true);
    try {
      // Split requirements by commas or newlines
      const reqList = data.requirements
        .split(/[,\n]/)
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      const { error } = await supabase
        .from("jobs")
        .insert({
          title: data.title,
          type: data.type,
          salary: data.salary,
          room: data.room,
          description: data.description,
          requirements: reqList,
        });

      if (error) throw error;

      toast.success("Job Vacancy Posted Successfully!");
      jobForm.reset();
      setJobModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to post job", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const onNewsSubmit = async (data: NewsEventFormValues) => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("news_events")
        .insert({
          title: data.title,
          category: data.category,
          event_date: data.category === "event" ? data.eventDate || null : null,
          content: data.content,
          image_url: data.imageUrl || null,
        });

      if (error) throw error;

      toast.success("News/Event Published Successfully!");
      newsForm.reset();
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
      const { error } = await supabase
        .from("gallery_media")
        .insert({
          title: data.title,
          category: data.category,
          media_url: data.mediaUrl,
        });

      if (error) throw error;

      toast.success("Gallery Image Added Successfully!");
      galleryForm.reset();
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

  return (
    <Tabs defaultValue="jobs" className="space-y-4">
      <TabsList className="bg-neutral-100 p-1 rounded-xl">
        <TabsTrigger value="jobs" className="rounded-lg flex gap-2">
          <Briefcase className="h-4 w-4" />
          Careers ({jobs.length})
        </TabsTrigger>
        <TabsTrigger value="news" className="rounded-lg flex gap-2">
          <Newspaper className="h-4 w-4" />
          News & Events ({newsEvents.length})
        </TabsTrigger>
        <TabsTrigger value="gallery" className="rounded-lg flex gap-2">
          <ImageIcon className="h-4 w-4" />
          Gallery ({galleryItems.length})
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
            
            <Dialog open={jobModalOpen} onOpenChange={setJobModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-lg">
                  <Plus className="h-4 w-4 mr-1" />
                  Create Job Listing
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Post New Career Opening</DialogTitle>
                  <DialogDescription>
                    Add a vacancy that will immediately appear in the public /careers section.
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
                        <Textarea {...field} id="job-desc" placeholder="Detail classroom expectations and daily tasks" rows={3} />
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
                        <Textarea {...field} id="job-reqs" placeholder="E.g. Level 3 NVQ, pediatric first aid, clean DBS" rows={2} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Posting..." : "Post Job Opening"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="px-0">
            {jobs.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No job postings found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b bg-neutral-50/50 text-xs font-semibold text-muted-foreground">
                      <th className="p-4">Title</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Salary</th>
                      <th className="p-4">Room</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4 font-bold text-foreground">{job.title}</td>
                        <td className="p-4"><Badge variant="outline">{job.type}</Badge></td>
                        <td className="p-4 text-muted-foreground">{job.salary}</td>
                        <td className="p-4 text-muted-foreground">{job.room}</td>
                        <td className="p-4 text-right">
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
                  <DialogDescription>
                    Fill in details to post to the parent information wall.
                  </DialogDescription>
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

                  <Controller
                    control={newsForm.control}
                    name="imageUrl"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="post-img">Image URL (Optional)</FieldLabel>
                        <Input {...field} id="post-img" placeholder="https://unsplash.com/..." />
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
            {newsEvents.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No news or events posted.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b bg-neutral-50/50 text-xs font-semibold text-muted-foreground">
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Event Date</th>
                      <th className="p-4">Content Preview</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {newsEvents.map((post) => (
                      <tr key={post.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4 font-bold text-foreground">{post.title}</td>
                        <td className="p-4">
                          <Badge variant={post.category === "event" ? "accent" : "success"}>
                            {post.category}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{post.event_date || "—"}</td>
                        <td className="p-4 text-muted-foreground max-w-xs truncate">{post.content}</td>
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
                  <DialogDescription>
                    Provide a title, category, and visual image URL.
                  </DialogDescription>
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

                  <Controller
                    control={galleryForm.control}
                    name="mediaUrl"
                    render={({ field, fieldState }) => (
                      <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="gal-url">Image URL (Unsplash / Hosted)</FieldLabel>
                        <Input {...field} id="gal-url" placeholder="https://images.unsplash.com/..." />
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
            {galleryItems.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No gallery media found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b bg-neutral-50/50 text-xs font-semibold text-muted-foreground">
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Image Preview</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {galleryItems.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4 font-bold text-foreground">{item.title}</td>
                        <td className="p-4"><Badge variant="outline">{item.category}</Badge></td>
                        <td className="p-4">
                          <img src={item.media_url} alt={item.title} className="h-10 w-16 object-cover rounded-md border" />
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
    </Tabs>
  );
}
