"use client";
function WorkerLayoutContent({ children }: { children: React.ReactNode }) {
  
  return (
    <>{children}</>
  );
}
export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WorkerLayoutContent>{children}</WorkerLayoutContent>;
}
