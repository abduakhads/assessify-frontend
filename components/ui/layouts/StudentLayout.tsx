function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Student Dashboard</h1>
      {children}

      <p>This is the student-specific content.</p>
    </div>
  );
}
export default StudentLayout;