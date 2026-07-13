import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Store Management",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
        },
        {
          title: "Products",
          url: "/admin/products",
        },
        {
          title: "Categories",
          url: "/admin/category",
        },
        {
          title: "Orders",
          url: "/admin/orders",
        },
        {
          title: "Go back",
          url: "/",
        },
      ],
    },
  ],
};

export function AdminSidebar({ ...props }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1 className="px-4 text-xl font-bold">Admin Panel</h1>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
