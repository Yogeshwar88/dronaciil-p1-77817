// src/components/ResetPassword.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [canUpdate, setCanUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Parse session/token from URL. This will set the session if token present.
    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          // Not fatal — show message and let user know
          toast.error("Invalid or expired reset link. Try again.");
          setCanUpdate(false);
        } else if (data?.session) {
          // session exists and password recovery flow started
          setCanUpdate(true);
          toast.success("You can now set a new password.");
        } else {
          // no session found in URL; but sometimes onAuthStateChange will handle it — allow form but warn
          setCanUpdate(true);
        }
      } catch (err) {
        setCanUpdate(false);
        toast.error("Error processing reset link.");
      }
    };
    init();
    // no cleanup needed
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      // updateUser requires an active session from the recovery token
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated — you can now login.");
        setNewPassword("");
        // optionally redirect to login
        window.location.href = "/login";
      }
    } catch (err) {
      toast.error("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Set a new password</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />
          </div>
          <Button type="submit" disabled={!canUpdate || loading} className="w-full">
            {loading ? "Updating..." : "Update password"}
          </Button>
          {!canUpdate && (
            <p className="text-sm text-muted-foreground mt-2">
              If you did not arrive here from a password reset link, request a new reset email from the login page.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
