"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

interface UserProfileModalProps {
  open: boolean;
  onComplete: () => void;
}

export function UserProfileModal({ open, onComplete }: UserProfileModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setError("Both first name and last name are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await api.patch("/auth/users/me/", {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });

      onComplete();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={open}
      onClose={() => {}}
      title="Complete Your Profile"
      showClose={false}
    >
      <div className="text-sm text-muted-foreground mb-4">
        Please provide your first name and last name to continue.
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              disabled={isLoading}
              required
            />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
