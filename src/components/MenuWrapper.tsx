import { currentUser } from "@clerk/nextjs/server";
import Menu from "./Menu";

export default async function MenuWrapper() {
    const user = await currentUser();
    const role = user?.publicMetadata.role as "admin" | "teacher" | "student" | "parent";

    return <Menu role={role} />;
}