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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface TeacherSidebarProps {
  className?: string;
}

export function TeacherSidebar({ className }: TeacherSidebarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/logout");
  };

  const NavigationLinks = () => (
    <>
      <Button
        variant="ghost"
        className="w-full justify-start gap-2"
        asChild
        onClick={() => setOpen(false)}
      >
        <Link href="/home/dashboard">
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2"
        asChild
        onClick={() => setOpen(false)}
      >
        <Link href="/home/quizzes">
          <BookOpen className="h-4 w-4" />
          Quizzes
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2"
        asChild
        onClick={() => setOpen(false)}
      >
        <Link href="/home/quizzes/create">
          <Plus className="h-4 w-4" />
          Create Quiz
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
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Assessify Logo"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Assessify Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </SheetHeader>
            <nav className="flex flex-col flex-1 p-4 gap-2 mt-4">
              <NavigationLinks />
            </nav>
            <div className="p-4 absolute bottom-0 left-0 right-0">
              <Separator className="mb-4" />
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex h-screen w-64 flex-col border-r bg-background",
          className
        )}
      >
        {/* Logo Section */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Assessify Logo"
              width={56}
              height={56}
              className="object-contain"
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
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
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
