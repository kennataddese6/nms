"use client";

import * as React from "react";

import { Eye, EyeOff, KeyRound, Lock, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { updateMyPasswordAction } from "../actions";

interface AccountWorkspaceProps {
  userProfile: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  roles: string[];
}

export function AccountWorkspace({ userProfile, roles }: AccountWorkspaceProps) {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);

  const fullName = `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() || "User Account";

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Validation Error", { description: "Please enter your current password." });
      return;
    }

    if (!newPassword) {
      toast.error("Validation Error", { description: "Please enter a new password." });
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Validation Error", { description: "Password must be at least 6 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Validation Error", { description: "New passwords do not match. Please re-enter." });
      return;
    }

    setUpdating(true);
    try {
      await updateMyPasswordAction(currentPassword, newPassword);
      toast.success("Password Updated Successfully!", {
        description: "Your account password has been changed. Use your new password on next login.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error("Failed to update password", {
        description: err.message || "An unexpected error occurred while changing password.",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Title Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <KeyRound className="h-7 w-7 text-primary" /> Account & Security
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your personal account profile details and update login credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* User Info Summary Card */}
        <Card className="md:col-span-4 rounded-3xl h-fit shadow-sm">
          <CardHeader className="text-center pb-2">
            <div className="h-20 w-20 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center font-bold text-2xl mb-3 shadow-inner">
              👤
            </div>
            <CardTitle className="text-lg font-bold">{fullName}</CardTitle>
            <CardDescription className="text-xs truncate">{userProfile.email || "No email on record"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="border-t pt-4 space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Assigned Roles
              </span>
              <div className="flex flex-wrap gap-1.5">
                {roles.length === 0 ? (
                  <Badge variant="outline" className="text-xs">User</Badge>
                ) : (
                  roles.map((r) => (
                    <Badge key={r} variant="secondary" className="text-xs font-bold bg-primary/10 text-primary border-primary/20">
                      {r.replace("_", " ")}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div className="border-t pt-4 space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground">User ID:</span>
              <span className="text-[10px] font-mono block text-muted-foreground truncate">{userProfile.id}</span>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Form Card */}
        <Card className="md:col-span-8 rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> Change Password
            </CardTitle>
            <CardDescription className="text-xs">
              Verify your current password and enter a new secure password for your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-5">
              {/* Current Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground" htmlFor="curr-pwd">
                  Current Password *
                </label>
                <div className="relative">
                  <Input
                    id="curr-pwd"
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your existing password..."
                    className="pr-10 rounded-xl text-xs sm:text-sm h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground" htmlFor="new-pwd">
                  New Password *
                </label>
                <Input
                  id="new-pwd"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters..."
                  className="rounded-xl text-xs sm:text-sm h-11"
                  required
                />
              </div>

              {/* Confirm New Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground" htmlFor="confirm-pwd">
                  Confirm New Password *
                </label>
                <Input
                  id="confirm-pwd"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password..."
                  className="rounded-xl text-xs sm:text-sm h-11"
                  required
                />
              </div>

              {/* Password Requirement Hint */}
              <div className="p-3.5 rounded-2xl bg-muted/40 border text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Password Security Guidelines:
                </div>
                <ul className="text-muted-foreground text-[11px] list-disc list-inside space-y-0.5 font-medium">
                  <li>Minimum 6 characters long</li>
                  <li>Requires verification of your existing password</li>
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={updating}
                  className="rounded-xl font-bold px-6 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-700 text-white shadow-md"
                >
                  {updating ? "Updating Password..." : "Update Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
