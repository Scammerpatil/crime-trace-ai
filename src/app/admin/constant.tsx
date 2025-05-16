import { SideNavItem } from "@/types/types";
import {
  IconHome,
  IconUsers,
  IconUserSearch,
  IconFolderSearch,
  IconFingerprint,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Manage Investigators",
    path: "/admin/investigators",
    icon: <IconUsers width="24" height="24" />,
  },
  {
    title: "Manage Suspects",
    path: "/admin/suspects",
    icon: <IconUserSearch width="24" height="24" />,
  },
  {
    title: "Manage Cases",
    path: "/admin/cases",
    icon: <IconFolderSearch width="24" height="24" />,
  },
  {
    title: "Find Suspects",
    path: "/admin/find-suspects",
    icon: <IconFingerprint width="24" height="24" />,
  },
];
