"use client";

import * as React from "react";

import { AlertCircle, Baby, DoorOpen, Layers, Plus, ShieldAlert, Users, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

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

interface Room {
  id: string;
  name: string;
  age_group: string;
  capacity: number;
  description?: string;
  branch: string;
  children: Child[];
}

interface RoomsWorkspaceProps {
  initialRooms: Room[];
  initialStaff: Staff[];
}

export function RoomsWorkspace({ initialRooms, initialStaff }: RoomsWorkspaceProps) {
  const supabase = createClient();
  const [rooms, setRooms] = React.useState<Room[]>(initialRooms);
  const [selectedRoomId, setSelectedRoomId] = React.useState<string | null>(
    initialRooms.length > 0 ? initialRooms[0].id : null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // New room form state
  const [newRoomName, setNewRoomName] = React.useState("");
  const [newAgeGroup, setNewAgeGroup] = React.useState("");
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
    if (!newRoomName || !newAgeGroup || newCapacity <= 0) {
      toast.error("Validation Error", {
        description: "Please fill out all required fields with valid values.",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("rooms")
        .insert({
          name: newRoomName,
          age_group: newAgeGroup,
          capacity: newCapacity,
          description: newDescription || null,
          branch: newBranch,
        })
        .select()
        .single();

      if (error) throw error;

      const createdRoom: Room = {
        ...data,
        children: [],
      };

      setRooms((prev) => [...prev, createdRoom]);
      setSelectedRoomId(createdRoom.id);
      setIsDrawerOpen(false);

      // Reset form
      setNewRoomName("");
      setNewAgeGroup("");
      setNewCapacity(15);
      setNewDescription("");
      setNewBranch("Branch 1");

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
          <SheetContent className="sm:max-w-md rounded-l-3xl">
            <SheetHeader className="pb-4 border-b">
              <SheetTitle>New Classroom Room</SheetTitle>
              <SheetDescription>Create a new room listing in Bubbly Day Nursery.</SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreateRoom} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="room-name">
                  Room Name *
                </label>
                <Input
                  id="room-name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g. Forest School Hub"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="age-group">
                  Age Group Target *
                </label>
                <Input
                  id="age-group"
                  value={newAgeGroup}
                  onChange={(e) => setNewAgeGroup(e.target.value)}
                  placeholder="e.g. 3 - 5 years"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="capacity">
                  Max Capacity *
                </label>
                <Input
                  id="capacity"
                  type="number"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  min={1}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="description">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Classroom specs or notes..."
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="room-branch">
                  Nursery Branch *
                </label>
                <select
                  id="room-branch"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  required
                >
                  <option value="Branch 1">Branch 1 (Galleywall Road, SE16 3PB)</option>
                  <option value="Branch 2">Branch 2 (Corbetts Lane, SE16 2BQ)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={() => setIsDrawerOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Save Classroom"}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Branch Filter Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl border bg-card/60 backdrop-blur-sm shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-foreground">Select Active Branch View</h2>
          <p className="text-[11px] text-muted-foreground">Filter classrooms by nursery location.</p>
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

      {/* Classrooms Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms
          .filter((room) => branchFilter === "All" || room.branch === branchFilter)
          .map((room) => {
            const enrolledCount = room.children?.length || 0;
            const capacityPercent = Math.min(100, Math.round((enrolledCount / room.capacity) * 100));
            const roomStaff = initialStaff.filter((s) => s.room_id === room.id);
            const isSelected = room.id === selectedRoomId;

            // Determine progress bar colors based on capacity utilization
            let barColor = "bg-emerald-500";
            if (capacityPercent >= 90) {
              barColor = "bg-destructive";
            } else if (capacityPercent >= 75) {
              barColor = "bg-amber-500";
            }

            return (
              <Card
                key={room.id}
                className={`rounded-3xl cursor-pointer hover:shadow-md transition-all duration-200 border-2 ${
                  isSelected ? "border-primary bg-primary/5" : "border-neutral-200"
                }`}
                onClick={() => setSelectedRoomId(room.id)}
              >
                <CardHeader className="p-6 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold">{room.name}</CardTitle>
                      <CardDescription className="text-xs">{room.age_group}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="secondary" className="font-bold text-xs">
                        {enrolledCount} / {room.capacity}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {room.branch}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  {/* Capacity meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                      <span>Capacity Load</span>
                      <span>{capacityPercent}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                        style={{ width: `${capacityPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Assigned Staff */}
                  <div className="pt-3 border-t text-xs">
                    <span className="text-muted-foreground block mb-1">Room Staff:</span>
                    {roomStaff.length === 0 ? (
                      <span className="text-xs text-neutral-400 italic">No assigned staff</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {roomStaff.map((s, idx) => {
                          const prof = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
                          if (!prof) return null;
                          return (
                            <Badge key={idx} variant="outline" className="text-[10px]">
                              {prof.first_name} {prof.last_name[0]}.
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Selected Room Details Roster */}
      {activeRoom && (
        <Card className="rounded-3xl shadow-sm border border-neutral-200">
          <CardHeader className="border-b p-6 flex flex-row justify-between items-center bg-neutral-50/50">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <DoorOpen className="h-5 w-5 text-primary" /> Roster: {activeRoom.name}
              </CardTitle>
              <CardDescription className="text-xs">Active student enrollment list.</CardDescription>
            </div>
            <Badge variant="outline" className="font-bold bg-white">
              {activeRoom.children?.length || 0} Registered
            </Badge>
          </CardHeader>
          <CardContent className="p-6">
            {!activeRoom.children || activeRoom.children.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
                <AlertCircle className="h-8 w-8 text-neutral-300" />
                <h4 className="font-bold text-foreground text-sm">No children assigned to this room</h4>
                <p className="text-xs max-w-xs mx-auto">
                  You can register a child and select this room preference in the Nursery CRM.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-xs uppercase font-bold text-muted-foreground bg-neutral-50/20">
                      <th className="p-3">Child Name</th>
                      <th className="p-3">Age</th>
                      <th className="p-3">Gender</th>
                      <th className="p-3">Allergies</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs">
                    {activeRoom.children.map((child) => (
                      <tr key={child.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-3 font-bold text-foreground">
                          {child.first_name} {child.last_name}
                        </td>
                        <td className="p-3 text-muted-foreground">{calculateAge(child.date_of_birth)}</td>
                        <td className="p-3 text-muted-foreground">{child.gender}</td>
                        <td className="p-3">
                          {child.allergies ? (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-destructive border-red-200 font-bold flex items-center gap-1 w-max"
                            >
                              <ShieldAlert className="h-3 w-3" /> {child.allergies}
                            </Badge>
                          ) : (
                            <span className="text-neutral-400">None</span>
                          )}
                        </td>
                        <td className="p-3">
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
