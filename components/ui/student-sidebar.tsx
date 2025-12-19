"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Archive,
  LogOut,
  User,
  Menu,
  ArrowLeft,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigation } from "@/contexts/NavigationContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { logout } from "@/utils/auth";

interface StudentSidebarProps {
  className?: string;
}

export function StudentSidebar({ className }: StudentSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { backButton } = useNavigation();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  const handleClassroomsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (pathname === "/home/classrooms") {
      // If already on classrooms page, do a full page reload
      window.location.href = "/home/classrooms";
    } else {
      router.push("/home/classrooms");
    }
  };

  const NavigationLinks = () => (
    <>
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 cursor-pointer"
        onClick={handleClassroomsClick}
      >
        <Home className="h-4 w-4" />
        Classrooms
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2"
        asChild
        onClick={() => setOpen(false)}
      >
        <Link href="/home/archived">
          <Archive className="h-4 w-4" />
          Archived Quizzes
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2"
        asChild
        onClick={() => setOpen(false)}
      >
        <Link href="/home/profile">
          <User className="h-4 w-4" />
          Profile
        </Link>
      </Button>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 border-b bg-background/60 backdrop-blur-md">
        <div className="flex items-center min-w-[140px]">
          {backButton?.show ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={backButton.onClick}
              className="cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backButton.label}
            </Button>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe">
        <div className="mx-4 mb-4">
          <div className="bg-background/30 backdrop-blur-md border border-white/10 rounded-full shadow-xl p-3">
            <div className="flex items-center justify-around gap-1">
              <button
                onClick={handleClassroomsClick}
                className="flex flex-col items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors min-w-[65px]"
              >
                <Home className="h-5 w-5" />
                <span className="text-xs mt-1">Home</span>
              </button>
              <Link
                href="/home/archived"
                className="flex flex-col items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors min-w-[65px]"
              >
                <Archive className="h-5 w-5" />
                <span className="text-xs mt-1">Archived</span>
              </Link>
              <Link
                href="/home/profile"
                className="flex flex-col items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors min-w-[65px]"
              >
                <User className="h-5 w-5" />
                <span className="text-xs mt-1">Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed top-0 left-0 w-64 flex-col my-4 ml-4 h-[calc(100vh-2rem)] rounded-2xl border border-white/10 bg-background/80 backdrop-blur-md shadow-xl",
          className
        )}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-center py-2 w-full h-[60px]">
            <Image
              src="/logo.svg"
              alt="Assessify Logo"
              width={120}
              height={60}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex flex-col flex-1 p-4 gap-2 mt-4">
          <NavigationLinks />
        </nav>

        {/* Theme & Logout Section */}
        <div className="p-4">
          <Separator className="mb-4" />
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 hover:bg-white/10 cursor-pointer mb-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 hover:bg-white/10 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
