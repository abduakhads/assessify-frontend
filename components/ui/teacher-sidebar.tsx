"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Archive,
  LogOut,
  User,
  BookOpen,
  Users,
  BarChart3,
  Plus,
  Menu,
  ArrowLeft,
} from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { logout } from "@/utils/auth";

interface TeacherSidebarProps {
  className?: string;
}

export function TeacherSidebar({ className }: TeacherSidebarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { backButton } = useNavigation();

  const handleLogout = async () => {
    await logout();
  };

  const NavigationLinks = () => (
    <>
      <Button
        variant="ghost"
        className="w-full justify-start gap-2"
        asChild
        onClick={() => setOpen(false)}
      >
        <Link href="/home/classrooms">
          <Home className="h-4 w-4" />
          Classrooms
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2"
        asChild
        onClick={() => setOpen(false)}
      >
        <Link href="/home/students">
          <Users className="h-4 w-4" />
          Students
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2"
        asChild
        onClick={() => setOpen(false)}
      >
        <Link href="/home/analytics">
          <BarChart3 className="h-4 w-4" />
          Analytics
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
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe">
        <div className="mx-4 mb-4">
          <div className="bg-background/30 backdrop-blur-md border border-white/10 rounded-full shadow-xl p-3">
            <div className="flex items-center justify-around gap-1">
              <Link
                href="/home/classrooms"
                className="flex flex-col items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors min-w-[65px]"
              >
                <Home className="h-5 w-5" />
                <span className="text-xs mt-1">Home</span>
              </Link>
              <Link
                href="/home/students"
                className="flex flex-col items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors min-w-[65px]"
              >
                <Users className="h-5 w-5" />
                <span className="text-xs mt-1">Students</span>
              </Link>
              <Link
                href="/home/analytics"
                className="flex flex-col items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors min-w-[65px]"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs mt-1">Analytics</span>
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

        {/* Logout Section */}
        <div className="p-4">
          <Separator className="mb-4" />
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
