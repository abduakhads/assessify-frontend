"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toast } from "@/components/ui/toast";
import { User, Lock, Mail, Trash2, Eye, EyeOff } from "lucide-react";
import { User as UserType } from "@/types";
import { logout, clearTokens } from "@/utils/auth";
import api from "@/lib/axios";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Profile edit state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Username change state
  const [newUsername, setNewUsername] = useState("");
  const [usernamePassword, setUsernamePassword] = useState("");
  const [showUsernamePassword, setShowUsernamePassword] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get("/auth/users/me/");
      setUser(res.data);
      setFirstName(res.data.first_name);
      setLastName(res.data.last_name);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setToast(null);

    try {
      await api.patch("/auth/users/me/", {
        first_name: firstName,
        last_name: lastName,
      });

      // Refetch user data to get updated profile
      await fetchUserData();
      setToast({ message: "Profile updated successfully!", type: "success" });
      setIsEditingProfile(false);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setToast({
        message: err?.response?.data?.detail || "Failed to update profile",
        type: "error",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setToast(null);

    if (newPassword !== confirmPassword) {
      setToast({ message: "New passwords do not match", type: "error" });
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setToast({
        message: "Password must be at least 8 characters long",
        type: "error",
      });
      setPasswordLoading(false);
      return;
    }

    try {
      await api.post("/auth/users/set_password/", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      setToast({
        message: "Password changed successfully!",
        type: "success",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error changing password:", err);
      const data = err?.response?.data;
      if (data?.current_password) {
        setToast({
          message: `Current password: ${data.current_password[0]}`,
          type: "error",
        });
      } else if (data?.new_password) {
        setToast({
          message: `New password: ${data.new_password[0]}`,
          type: "error",
        });
      } else {
        setToast({
          message: data?.detail || "Failed to change password",
          type: "error",
        });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameLoading(true);
    setToast(null);

    if (!newUsername.trim()) {
      setToast({ message: "Username cannot be empty", type: "error" });
      setUsernameLoading(false);
      return;
    }

    try {
      await api.post("/auth/users/set_username/", {
        current_password: usernamePassword,
        new_username: newUsername,
      });

      // Refetch user data to get updated username
      await fetchUserData();
      setToast({
        message: "Username changed successfully!",
        type: "success",
      });
      setNewUsername("");
      setUsernamePassword("");
    } catch (err: any) {
      console.error("Error changing username:", err);
      const data = err?.response?.data;
      if (data?.current_password) {
        setToast({
          message: `Password: ${data.current_password[0]}`,
          type: "error",
        });
      } else if (data?.new_username) {
        setToast({
          message: `Username: ${data.new_username[0]}`,
          type: "error",
        });
      } else {
        setToast({
          message: data?.detail || "Failed to change username",
          type: "error",
        });
      }
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Log out user and redirect to reset password page
    clearTokens();
    router.push("/reset/password");
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setToast(null);

    if (!deletePassword) {
      setToast({
        message: "Please enter your password to confirm deletion",
        type: "error",
      });
      setDeleteLoading(false);
      return;
    }

    try {
      await api.delete("/auth/users/me/", {
        data: {
          current_password: deletePassword,
        },
      });

      clearTokens();
      router.push("/login");
    } catch (err: any) {
      console.error("Error deleting account:", err);
      const data = err?.response?.data;
      if (data?.current_password) {
        setToast({
          message: data.current_password[0],
          type: "error",
        });
      } else if (err?.response?.status === 400) {
        // 400 with empty body likely means incorrect password
        setToast({
          message: "Incorrect password. Please try again.",
          type: "error",
        });
      } else {
        setToast({
          message:
            data?.detail ||
            `Failed to delete account (Status: ${err?.response?.status})`,
          type: "error",
        });
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
          <p className="text-muted-foreground">Fetching your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Information */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          {!isEditingProfile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Username</Label>
                  <p className="font-medium">{user?.username}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Role</Label>
                  <p className="font-medium capitalize">{user?.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">First Name</Label>
                  <p className="font-medium">{user?.first_name || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Name</Label>
                  <p className="font-medium">{user?.last_name || "Not set"}</p>
                </div>
              </div>
              <Button
                onClick={() => setIsEditingProfile(true)}
                className="cursor-pointer"
              >
                Edit Profile
              </Button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={profileLoading}
                  className="cursor-pointer"
                >
                  {profileLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditingProfile(false);
                    setFirstName(user?.first_name || "");
                    setLastName(user?.last_name || "");
                  }}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Change Username */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Change Username</CardTitle>
          </div>
          <CardDescription>
            Update your username (requires password confirmation)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangeUsername} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-username">New Username</Label>
              <Input
                id="new-username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter new username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="username-password"
                  type={showUsernamePassword ? "text" : "password"}
                  value={usernamePassword}
                  onChange={(e) => setUsernamePassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowUsernamePassword(!showUsernamePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showUsernamePassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={usernameLoading}
              className="cursor-pointer"
            >
              {usernameLoading ? "Changing..." : "Change Username"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <CardTitle>Change Password</CardTitle>
          </div>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password-input">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password-input"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password-input">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password-input"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={passwordLoading}
                className="cursor-pointer"
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </Button>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary underline underline-offset-4 hover:no-underline cursor-pointer"
              >
                Forgot your password?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <CardTitle>Delete Account</CardTitle>
          </div>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showDeleteConfirm ? (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="cursor-pointer"
            >
              Delete Account
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800 font-medium mb-2">
                  Are you absolutely sure?
                </p>
                <p className="text-sm text-red-700">
                  This action cannot be undone. This will permanently delete
                  your account and remove all your data from our servers.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delete-password">
                  Enter your password to confirm
                </Label>
                <div className="relative">
                  <Input
                    id="delete-password"
                    type={showDeletePassword ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter your password"
                    className="border-red-300 focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showDeletePassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="cursor-pointer"
                >
                  {deleteLoading ? "Deleting..." : "Yes, Delete My Account"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletePassword("");
                  }}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
