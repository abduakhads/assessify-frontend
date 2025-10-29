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
import { logout } from "@/utils/auth";

interface TeacherSidebarProps {
  className?: string;
}

export function TeacherSidebar({ className }: TeacherSidebarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center px-4 py-2 w-[140px] h-[40px]">
          <Image
            src="/logo.png"
            alt="Assessify Logo"
            width={140}
            height={40}
            className="object-contain"
            priority
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
              <div className="flex items-center justify-center py-2 w-full h-[60px]">
                <Image
                  src="/logo.png"
                  alt="Assessify Logo"
                  width={120}
                  height={60}
                  className="object-contain"
                  priority
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
          <div className="flex items-center justify-center py-2 w-full h-[60px]">
            <Image
              src="/logo.png"
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
