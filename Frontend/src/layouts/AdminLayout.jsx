import { Outlet } from "react-router-dom";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";

import { AdminSidebar } from "../components/admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <SidebarTrigger />

          <Separator orientation="vertical" className="h-4" />

          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
