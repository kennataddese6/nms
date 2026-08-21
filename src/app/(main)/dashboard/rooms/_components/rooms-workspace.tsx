"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { AlertCircle, Baby, Clock, DoorOpen, Layers, Pencil, Plus, ShieldAlert, Trash2, Users, X } from "lucide-react";
import { toast } from "sonner";

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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

import {
  createRoomAction,
  deleteRoomAction,
  deleteRoutineItemAction,
  saveRoutineItemAction,
  updateRoomAction,
} from "../actions";

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  status: string;
  allergies?: string;
}

interface Staff {
  id: string;
  room_id: string | null;
  profiles: any;
}

export interface Room {
  id: string;
  name: string;
  min_age_months?: number;
  max_age_months?: number;
  capacity: number;
  description?: string;
  branch: string;
  image_url?: string;
  children: Child[];
}

export interface RoutineItem {
  id: string;
  room_id: string | null;
  age_group: string;
  time: string;
  activity: string;
  details: string;
  display_order: number;
}

interface RoomsWorkspaceProps {
  initialRooms: Room[];
  initialStaff: Staff[];
  initialRoutines?: RoutineItem[];
}

export function formatAgeRange(minMonths?: number, maxMonths?: number): string {
  if (minMonths === undefined || maxMonths === undefined) return "All Ages";
  const formatMonths = (m: number) => {
    if (m < 12) return `${m}m`;
    const y = Math.floor(m / 12);
    const rem = m % 12;
    return rem > 0 ? `${y}y ${rem}m` : `${y}y`;
  };
  return `${formatMonths(minMonths)} - ${formatMonths(maxMonths)}`;
}

export function RoomsWorkspace({ initialRooms, initialStaff, initialRoutines = [] }: RoomsWorkspaceProps) {
  const router = useRouter();
  const [rooms, setRooms] = React.useState<Room[]>(initialRooms);
  const [selectedRoomId, setSelectedRoomId] = React.useState<string | null>(
    initialRooms.length > 0 ? initialRooms[0].id : null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [editingRoom, setEditingRoom] = React.useState<Room | null>(null);
  const [loading, setLoading] = React.useState(false);

  // New room form state
  const [newRoomName, setNewRoomName] = React.useState("");
  const [newMinAgeMonths, setNewMinAgeMonths] = React.useState(3);
  const [newMaxAgeMonths, setNewMaxAgeMonths] = React.useState(24);
  const [newCapacity, setNewCapacity] = React.useState(15);
  const [newDescription, setNewDescription] = React.useState("");
  const [newBranch, setNewBranch] = React.useState("Branch 1");
  const [roomImageUrl, setRoomImageUrl] = React.useState("");
  const [roomImageFile, setRoomImageFile] = React.useState<File | null>(null);
  const [branchFilter, setBranchFilter] = React.useState<"All" | "Branch 1" | "Branch 2">("All");

  // Routine management state
  const [routines, setRoutines] = React.useState<RoutineItem[]>(initialRoutines);
  const [routineModalOpen, setRoutineModalOpen] = React.useState(false);
  const [editingRoutine, setEditingRoutine] = React.useState<RoutineItem | null>(null);
  const [routineTime, setRoutineTime] = React.useState("");
  const [routineActivity, setRoutineActivity] = React.useState("");
  const [routineDetails, setRoutineDetails] = React.useState("");
  const [routineOrder, setRoutineOrder] = React.useState(1);
  const [routineSubmitting, setRoutineSubmitting] = React.useState(false);

  React.useEffect(() => {
    setRoutines(initialRoutines);
  }, [initialRoutines]);

  const activeRoom = rooms.find((r) => r.id === selectedRoomId);

  const getAgeKeyForRoom = (room?: Room | null) => {
    if (!room) return "babies";
    const nameLower = (room.name || "").toLowerCase();
    const maxMonths = room.max_age_months ?? 24;
    if (nameLower.includes("baby") || nameLower.includes("babies") || maxMonths <= 24) return "babies";
    if (nameLower.includes("preschool") || maxMonths > 36) return "preschool";
    return "toddlers";
  };

  const activeAgeKey = getAgeKeyForRoom(activeRoom);

  const roomSpecificRoutines = routines.filter(
    (r) => activeRoom?.id && r.room_id === activeRoom.id,
  );
  const ageGroupRoutines = routines.filter(
    (r) => r.age_group === activeAgeKey && !r.room_id,
  );

  const activeRoomRoutines =
    roomSpecificRoutines.length > 0 ? roomSpecificRoutines : ageGroupRoutines;

  const handleOpenAddRoutine = () => {
    setEditingRoutine(null);
    setRoutineTime("");
    setRoutineActivity("");
    setRoutineDetails("");
    setRoutineOrder(activeRoomRoutines.length + 1);
    setRoutineModalOpen(true);
  };

  const handleOpenEditRoutine = (item: RoutineItem) => {
    setEditingRoutine(item);
    setRoutineTime(item.time);
    setRoutineActivity(item.activity);
    setRoutineDetails(item.details || "");
    setRoutineOrder(item.display_order || 1);
    setRoutineModalOpen(true);
  };

  const handleSaveRoutineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineTime.trim() || !routineActivity.trim()) {
      toast.error("Please enter a valid time and activity title.");
      return;
    }
    setRoutineSubmitting(true);
    try {
      await saveRoutineItemAction({
        id: editingRoutine?.id,
        roomId: activeRoom?.id,
        ageGroup: activeAgeKey,
        time: routineTime,
        activity: routineActivity,
        details: routineDetails,
        displayOrder: Number(routineOrder),
      });
      toast.success(editingRoutine ? "Routine updated successfully!" : "Routine item added successfully!");
      setRoutineModalOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to save routine item", { description: err.message });
    } finally {
      setRoutineSubmitting(false);
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    if (!confirm("Are you sure you want to delete this routine step?")) return;
    try {
      await deleteRoutineItemAction(id);
      toast.success("Routine step deleted successfully!");
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to delete routine item", { description: err.message });
    }
  };

  // Calculate age utility
  const calculateAge = (dobString: string) => {
    if (!dobString) return "N/A";
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    const months = ageDate.getUTCMonth();

    if (years > 0) {
      return `${years}y ${months}m`;
    }
    return `${months}m`;
  };

  const handleOpenAddModal = () => {
    setEditingRoom(null);
    setNewRoomName("");
    setNewMinAgeMonths(3);
    setNewMaxAgeMonths(24);
    setNewCapacity(15);
    setNewDescription("");
    setNewBranch("Branch 1");
    setRoomImageUrl("");
    setRoomImageFile(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditModal = (room: Room) => {
    setEditingRoom(room);
    setNewRoomName(room.name);
    setNewMinAgeMonths(room.min_age_months ?? 3);
    setNewMaxAgeMonths(room.max_age_months ?? 24);
    setNewCapacity(room.capacity);
    setNewDescription(room.description || "");
    setNewBranch(room.branch || "Branch 1");
    setRoomImageUrl(room.image_url || "");
    setRoomImageFile(null);
    setIsDrawerOpen(true);
  };

  const handleDeleteRoom = async (room: Room) => {
    if (room.children?.length && room.children.length > 0) {
      toast.error("Cannot delete room", {
        description: "Please reassign or remove enrolled children first.",
      });
      return;
    }
    if (!confirm(`Are you sure you want to delete ${room.name}?`)) return;
    try {
      await deleteRoomAction(room.id);
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
      setSelectedRoomId((prev) => (prev === room.id ? null : prev));
      toast.success("Room Deleted", { description: `${room.name} has been removed.` });
      router.refresh();
    } catch (err: any) {
      toast.error("Failed to delete room", { description: err.message });
    }
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || newCapacity <= 0) {
      toast.error("Validation Error", {
        description: "Please enter a valid classroom name and capacity.",
      });
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = roomImageUrl || undefined;

      if (roomImageFile) {
        const supabase = createClient();
        const fileExt = roomImageFile.name.split(".").pop();
        const fileName = `room-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `rooms/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("nursery-assets")
          .upload(filePath, roomImageFile);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("nursery-assets").getPublicUrl(filePath);

        uploadedImageUrl = publicUrl;
      }

      if (editingRoom) {
        const res = await updateRoomAction({
          id: editingRoom.id,
          name: newRoomName.trim(),
          minAgeMonths: newMinAgeMonths,
          maxAgeMonths: newMaxAgeMonths,
          capacity: newCapacity,
          description: newDescription.trim() || undefined,
          branch: newBranch,
          imageUrl: uploadedImageUrl,
        });

        setRooms((prev) => prev.map((r) => (r.id === editingRoom.id ? { ...r, ...res.room } : r)));
        toast.success("Room Updated", {
          description: `Successfully updated ${res.room.name}.`,
        });
      } else {
        const res = await createRoomAction({
          name: newRoomName.trim(),
          minAgeMonths: newMinAgeMonths,
          maxAgeMonths: newMaxAgeMonths,
          capacity: newCapacity,
          description: newDescription.trim() || undefined,
          branch: newBranch,
          imageUrl: uploadedImageUrl,
        });

        const createdRoom: Room = {
          ...res.room,
          children: [],
        };

        setRooms((prev) => [...prev, createdRoom]);
        setSelectedRoomId(createdRoom.id);
        toast.success("Room Created", {
          description: `Successfully added ${createdRoom.name} to classroom directory.`,
        });
      }

      setIsDrawerOpen(false);
      setEditingRoom(null);
      router.refresh();
    } catch (err: any) {
      toast.error(editingRoom ? "Failed to update room" : "Failed to create room", {
        description: err.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter((r) => branchFilter === "All" || r.branch === branchFilter);

  return (
    <div className="py-6 px-4 md:px-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="h-8 w-8 text-primary" /> Rooms Manager
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage classroom configurations, review enrollments, and check child capacities.
          </p>
        </div>

        <Sheet
          open={isDrawerOpen}
          onOpenChange={(open) => {
            setIsDrawerOpen(open);
            if (!open) setEditingRoom(null);
          }}
        >
          <Button className="rounded-full shrink-0" onClick={handleOpenAddModal}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Classroom
          </Button>
          <SheetContent className="sm:max-w-lg p-6 sm:p-8 overflow-y-auto space-y-6 rounded-l-3xl">
            <SheetHeader className="pb-4 border-b">
              <SheetTitle className="text-xl font-bold">
                {editingRoom ? "Edit Classroom Room" : "New Classroom Room"}
              </SheetTitle>
              <SheetDescription className="text-xs">
                {editingRoom
                  ? `Update configuration for ${editingRoom.name}.`
                  : "Create a new classroom listing in Bubbly Day Nursery."}
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSaveRoom} className="space-y-5 px-1 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block" htmlFor="room-name">
                  Classroom Name *
                </label>
                <Input
                  id="room-name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g. Forest School Hub"
                  className="rounded-xl"
                  required
                />
              </div>

              {/* Age Range Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground block" htmlFor="min-age">
                    Min Age (Months) *
                  </label>
                  <Input
                    id="min-age"
                    type="number"
                    value={newMinAgeMonths}
                    onChange={(e) => setNewMinAgeMonths(Number(e.target.value))}
                    min={0}
                    max={72}
                    className="rounded-xl"
                    required
                  />
                  <span className="text-[10px] text-muted-foreground">e.g. 3 (for 3 months)</span>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground block" htmlFor="max-age">
                    Max Age (Months) *
                  </label>
                  <Input
                    id="max-age"
                    type="number"
                    value={newMaxAgeMonths}
                    onChange={(e) => setNewMaxAgeMonths(Number(e.target.value))}
                    min={1}
                    max={72}
                    className="rounded-xl"
                    required
                  />
                  <span className="text-[10px] text-muted-foreground">e.g. 24 (for 2 years)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block" htmlFor="capacity">
                  Max Child Capacity *
                </label>
                <Input
                  id="capacity"
                  type="number"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  min={1}
                  className="rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block" htmlFor="description">
                  Classroom Description
                </label>
                <Textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Classroom environment, equipment, and features..."
                  rows={3}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block" htmlFor="room-branch">
                  Nursery Setting Branch *
                </label>
                <NativeSelect
                  id="room-branch"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  className="rounded-xl"
                  required
                >
                  <option value="Branch 1">Branch 1 (Galleywall Road, SE16 3PB)</option>
                  <option value="Branch 2">Branch 2 (Corbetts Lane, SE16 2BQ)</option>
                </NativeSelect>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block" htmlFor="room-image">
                  Classroom Photo / Image
                </label>
                {roomImageUrl && (
                  <div className="relative h-32 w-full overflow-hidden rounded-xl border mb-2">
                    <img src={roomImageUrl} alt="Classroom preview" className="h-full w-full object-cover" />
                  </div>
                )}
                <Input
                  id="room-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setRoomImageFile(file);
                  }}
                  className="rounded-xl text-xs cursor-pointer"
                />
                <p className="text-[10px] text-muted-foreground">
                  Upload a photo of this classroom. This image will be displayed on the public website rooms page.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t">
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsDrawerOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="rounded-xl font-bold">
                  {loading
                    ? editingRoom
                      ? "Saving..."
                      : "Creating..."
                    : editingRoom
                      ? "Update Classroom"
                      : "Save Classroom"}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Branch Filter Switcher */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border bg-card/60 backdrop-blur-sm">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Filter Classrooms by Setting:
        </span>
        <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl gap-1">
          {(["All", "Branch 1", "Branch 2"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBranchFilter(b)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                branchFilter === b
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Rooms */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
            Active Classroom List ({filteredRooms.length})
          </h2>

          {filteredRooms.length === 0 ? (
            <Card className="rounded-2xl border border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <DoorOpen className="h-10 w-10 mx-auto mb-2 text-neutral-400" />
                <p className="text-sm font-semibold">No rooms found.</p>
                <p className="text-xs mt-1">Click "Add Classroom" to create one.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredRooms.map((room) => {
                const isSelected = room.id === selectedRoomId;
                const childCount = room.children?.length || 0;
                const isFull = childCount >= room.capacity;
                const ratio = Math.round((childCount / room.capacity) * 100);

                return (
                  <Card
                    key={room.id}
                    className={`cursor-pointer transition-all duration-200 rounded-2xl border ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "hover:border-neutral-300 dark:hover:border-neutral-700 bg-card"
                    }`}
                    onClick={() => setSelectedRoomId(room.id)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base font-bold flex items-center gap-2">
                            <DoorOpen className="h-4 w-4 text-primary shrink-0" />
                            {room.name}
                          </CardTitle>
                          <CardDescription className="text-xs mt-0.5">
                            Target Age: {formatAgeRange(room.min_age_months, room.max_age_months)}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {room.branch}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t">
                        <span className="flex items-center gap-1 text-muted-foreground font-medium">
                          <Users className="h-3.5 w-3.5" /> Capacity
                        </span>
                        <span className="font-bold">
                          {childCount} / {room.capacity} children
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isFull ? "bg-red-500" : ratio > 80 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(ratio, 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Room Detail Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          {activeRoom ? (
            <Card className="rounded-3xl border shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-bold">
                        {activeRoom.branch}
                      </Badge>
                      <Badge variant="outline" className="text-xs font-bold">
                        Age: {formatAgeRange(activeRoom.min_age_months, activeRoom.max_age_months)}
                      </Badge>
                    </div>
                    {activeRoom.image_url && (
                      <div className="relative h-40 w-full rounded-2xl overflow-hidden border my-3 shadow-sm">
                        <img src={activeRoom.image_url} alt={activeRoom.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                    {activeRoom.description && (
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{activeRoom.description}</p>
                    )}

                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl h-8 text-xs font-bold"
                        onClick={() => handleOpenEditModal(activeRoom)}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" /> Edit Room
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl h-8 text-xs font-bold text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteRoom(activeRoom)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>

                  <div className="text-right shrink-0 bg-background border p-3 rounded-2xl">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                      Enrolled Children
                    </span>
                    <span className="text-2xl font-black text-primary">
                      {activeRoom.children?.length || 0}
                      <span className="text-xs text-muted-foreground font-normal"> / {activeRoom.capacity}</span>
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Staff assigned to room */}
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" /> Assigned Staff
                  </h3>
                  {initialStaff.filter((s) => s.room_id === activeRoom.id).length === 0 ? (
                    <p className="text-xs text-muted-foreground italic bg-neutral-50 dark:bg-neutral-900 p-3 rounded-xl border">
                      No keyworkers explicitly assigned to this room yet.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {initialStaff
                        .filter((s) => s.room_id === activeRoom.id)
                        .map((s) => (
                          <Badge key={s.id} variant="secondary" className="px-3 py-1 rounded-xl text-xs">
                            👤 {s.profiles?.first_name} {s.profiles?.last_name}
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>

                {/* Enrolled children list */}
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Baby className="h-4 w-4 text-primary" /> Enrolled Children ({activeRoom.children?.length || 0})
                  </h3>

                  {!activeRoom.children || activeRoom.children.length === 0 ? (
                    <div className="text-center py-10 border border-dashed rounded-2xl text-muted-foreground">
                      <Baby className="h-8 w-8 mx-auto mb-2 text-neutral-400" />
                      <p className="text-xs font-semibold">No children assigned to this room yet.</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Register students from Nursery CRM to assign them here.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border">
                      <table className="w-full border-collapse text-left text-xs">
                        <thead>
                          <tr className="border-b bg-muted/40 font-semibold text-muted-foreground">
                            <th className="p-3">Child Name</th>
                            <th className="p-3">Age</th>
                            <th className="p-3">Gender</th>
                            <th className="p-3">Allergies / Medical</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {activeRoom.children.map((child) => (
                            <tr key={child.id} className="hover:bg-muted/20">
                              <td className="p-3 font-bold text-foreground">
                                {child.first_name} {child.last_name}
                              </td>
                              <td className="p-3 text-muted-foreground">{calculateAge(child.date_of_birth)}</td>
                              <td className="p-3 capitalize text-muted-foreground">{child.gender}</td>
                              <td className="p-3">
                                {child.allergies ? (
                                  <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 border border-red-200 px-2 py-0.5 rounded-full text-[10px]">
                                    <ShieldAlert className="h-3 w-3" /> {child.allergies}
                                  </span>
                                ) : (
                                  <span className="text-neutral-400">None</span>
                                )}
                              </td>
                              <td className="p-3">
                                <Badge variant="outline" className="text-[10px]">
                                  {child.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Daily Classroom Routine Timeline & Management */}
                <div className="pt-6 border-t space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" /> Daily Classroom Routine ({activeRoomRoutines.length})
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-lg text-xs gap-1"
                      onClick={handleOpenAddRoutine}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Routine Step
                    </Button>
                  </div>

                  {activeRoomRoutines.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-2xl text-muted-foreground bg-neutral-50/50 dark:bg-neutral-900/50">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-neutral-400" />
                      <p className="text-xs font-semibold">No routine steps registered for this room.</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Click "Add Routine Step" above to customize the schedule for this classroom.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeRoomRoutines.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-4 p-4 rounded-2xl border bg-card/60 transition-all hover:bg-card"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="font-bold text-xs bg-primary/10 text-primary">
                                🕒 {item.time}
                              </Badge>
                              <h4 className="font-bold text-foreground text-sm">{item.activity}</h4>
                            </div>
                            {item.details && (
                              <p className="text-xs text-muted-foreground leading-relaxed">{item.details}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => handleOpenEditRoutine(item)}
                              title="Edit routine step"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleDeleteRoutine(item.id)}
                              title="Delete routine step"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-3xl border border-dashed p-12 text-center text-muted-foreground">
              <DoorOpen className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
              <h3 className="text-base font-bold text-foreground mb-1">Select a classroom</h3>
              <p className="text-xs">Choose a classroom from the left to view child rosters and staff.</p>
            </Card>
          )}
        </div>
      </div>
      {/* Routine Item Add / Edit Dialog */}
      <Dialog open={routineModalOpen} onOpenChange={setRoutineModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRoutine ? "Edit Routine Step" : "Add New Routine Step"}
            </DialogTitle>
            <DialogDescription>
              Customize the daily classroom schedule timeline for {activeRoom?.name || "this room"}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveRoutineSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label htmlFor="routine-time" className="text-xs font-bold text-foreground">
                Time Window (e.g. 08:30 - 09:15)
              </label>
              <Input
                id="routine-time"
                placeholder="08:30 - 09:15"
                value={routineTime}
                onChange={(e) => setRoutineTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="routine-activity" className="text-xs font-bold text-foreground">
                Activity Title
              </label>
              <Input
                id="routine-activity"
                placeholder="e.g. Circle Time & Phonics"
                value={routineActivity}
                onChange={(e) => setRoutineActivity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="routine-details" className="text-xs font-bold text-foreground">
                Description / Details
              </label>
              <Textarea
                id="routine-details"
                placeholder="Details about what children do during this period..."
                value={routineDetails}
                onChange={(e) => setRoutineDetails(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="routine-order" className="text-xs font-bold text-foreground">
                Display Order
              </label>
              <Input
                id="routine-order"
                type="number"
                min={1}
                value={routineOrder}
                onChange={(e) => setRoutineOrder(Number(e.target.value))}
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="outline" onClick={() => setRoutineModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={routineSubmitting}>
                {routineSubmitting ? "Saving..." : editingRoutine ? "Update Step" : "Add Step"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
