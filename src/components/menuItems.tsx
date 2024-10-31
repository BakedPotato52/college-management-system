import {
    Home,
    Users,
    GraduationCap,
    BookOpen,
    School,
    BookMarked,
    FileSpreadsheet,
    ClipboardList,
    BarChart2,
    CalendarCheck,
    Calendar,
    MessageSquare,
    Bell,
    UserCircle,
    Settings,
    LogOut,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type MenuItem = {
    icon: LucideIcon;
    label: string;
    href: string;
    visible: Array<"admin" | "teacher" | "student" | "parent">;
};

type MenuSection = {
    title: string;
    items: MenuItem[];
};

const menuItems: MenuSection[] = [
    {
        title: "MENU",
        items: [
            {
                icon: Home,
                label: "Home",
                href: "/",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: Users,
                label: "Teachers",
                href: "/teacherslist",
                visible: ["admin", "teacher"],
            },
            {
                icon: GraduationCap,
                label: "Students",
                href: "/studentslist",
                visible: ["admin", "teacher"],
            },
            {
                icon: BookOpen,
                label: "Subjects",
                href: "/list/subjects",
                visible: ["admin"],
            },
            {
                icon: School,
                label: "Classes",
                href: "/list/classes",
                visible: ["admin", "teacher"],
            },
            {
                icon: BookMarked,
                label: "Lessons",
                href: "/list/lessons",
                visible: ["admin", "teacher"],
            },
            {
                icon: FileSpreadsheet,
                label: "Exams",
                href: "/list/exams",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: ClipboardList,
                label: "Assignments",
                href: "/list/assignments",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: BarChart2,
                label: "Results",
                href: "/list/results",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: CalendarCheck,
                label: "Attendance",
                href: "/list/attendance",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: Calendar,
                label: "Events",
                href: "/list/events",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: MessageSquare,
                label: "Messages",
                href: "/list/messages",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: Bell,
                label: "Announcements",
                href: "/list/announcements",
                visible: ["admin", "teacher", "student", "parent"],
            },
        ],
    },
    {
        title: "OTHER",
        items: [
            {
                icon: UserCircle,
                label: "Profile",
                href: "/list/student/:id",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: Settings,
                label: "Settings",
                href: "/settings",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: LogOut,
                label: "Logout",
                href: "/logout",
                visible: ["admin", "teacher", "student", "parent"],
            },
        ],
    },
];

export default menuItems;