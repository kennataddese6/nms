"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Baby, DoorOpen, Layers, Plus, ShieldAlert, Users, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import { createRoomAction } from "../actions";

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
  children: Child[];
}

interface RoomsWorkspaceProps {
  initialRooms: Room[];
  initialStaff: Staff[];
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

export function RoomsWorkspace({ initialRooms, initialStaff }: RoomsWorkspaceProps) {
  const router = useRouter();
  const [rooms, setRooms] = React.useState<Room[]>(initialRooms);
  const [selectedRoomId, setSelectedRoomId] = React.useState<string | null>(
    initialRooms.length > 0 ? initialRooms[0].id : null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // New room form state
  const [newRoomName, setNewRoomName] = React.useState("");
  const [newMinAgeMonths, setNewMinAgeMonths] = React.useState(3);
  const [newMaxAgeMonths, setNewMaxAgeMonths] = React.useState(24);
  const [newCapacity, setNewCapacity] = React.useState(15);
  const [newDescription, setNewDescription] = React.useState("");
  const [newBranch, setNewBranch] = React.useState("Branch 1");
  const [branchFilter, setBranchFilter] = React.useState<"All" | "Branch 1" | "Branch 2">("All");

  const activeRoom = rooms.find((r) => r.id === selectedRoomId);

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

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || newCapacity <= 0) {
      toast.error("Validation Error", {
        description: "Please enter a valid classroom name and capacity.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await createRoomAction({
        name: newRoomName.trim(),
        minAgeMonths: newMinAgeMonths,
        maxAgeMonths: newMaxAgeMonths,
        capacity: newCapacity,
        description: newDescription.trim() || undefined,
        branch: newBranch,
      });

      const createdRoom: Room = {
        ...res.room,
        children: [],
      };

      setRooms((prev) => [...prev, createdRoom]);
      setSelectedRoomId(createdRoom.id);
      setIsDrawerOpen(false);

      // Reset form
      setNewRoomName("");
      setNewMinAgeMonths(3);
      setNewMaxAgeMonths(24);
      setNewCapacity(15);
      setNewDescription("");
      setNewBranch("Branch 1");

      router.refresh();

      toast.success("Room Created", {
        description: `Successfully added ${createdRoom.name} to classroom directory.`,
      });
    } catch (err: any) {
      toast.error("Failed to create room", {
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

        {/* Create Room Sheet Drawer */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger asChild>
            <Button className="rounded-full shrink-0">
              <Plus className="h-4 w-4 mr-1.5" /> Add Classroom
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg p-6 sm:p-8 overflow-y-auto space-y-6 rounded-l-3xl">
            <SheetHeader className="pb-4 border-b">
              <SheetTitle className="text-xl font-bold">New Classroom Room</SheetTitle>
              <SheetDescription className="text-xs">
                Create a new classroom listing in Bubbly Day Nursery.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreateRoom} className="space-y-5 px-1 py-2">
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

              <div className="flex justify-end gap-3 pt-5 border-t">
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsDrawerOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="rounded-xl font-bold">
                  {loading ? "Creating..." : "Save Classroom"}
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
                    <CardTitle className="text-2xl font-bold mt-2">{activeRoom.name}</CardTitle>
                    {activeRoom.description && (
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {activeRoom.description}
                      </p>
                    )}
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
                    <Baby className="h-4 w-4 text-primary" /> Enrolled Children (
                    {activeRoom.children?.length || 0})
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
    </div>
  );
}
