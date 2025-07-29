function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Teacher Dashboard</h1>
      {children}
      <p>This is a protected page for teachers.</p>
    </div>
  );
}
export default TeacherLayout;
