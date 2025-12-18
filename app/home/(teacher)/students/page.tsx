import StudentsClient from "./StudentsClient";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default function StudentsPage() {
  return <StudentsClient />;
}
