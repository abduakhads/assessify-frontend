import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for doesn't exist or you don't have
          permission to access it.
        </p>
        <Link href="/home">
          <Button className="cursor-pointer">Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
}
