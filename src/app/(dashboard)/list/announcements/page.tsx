import { auth } from "@clerk/nextjs/server";
import { Filter, SortAsc } from "lucide-react";
import type { Announcement, Class, Prisma } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";

type AnnouncementList = Announcement & { class: Class };

export default async function AnnouncementListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Class", accessor: "class" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: AnnouncementList) => (
    <tr
      key={item.id}
      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
    >
      <td className="p-4 align-middle">{item.title}</td>
      <td className="p-4 align-middle">{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell p-4 align-middle">
        {new Intl.DateTimeFormat("en-US").format(new Date(item.date))}
      </td>
      {role === "admin" && (
        <td className="p-4 align-middle">
          <div className="flex items-center gap-2">
            <FormContainer table="announcement" type="update" data={item} />
            <FormContainer table="announcement" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.AnnouncementWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };

  query.OR = [
    { classId: null },
    role && userId ? { class: roleConditions[role as keyof typeof roleConditions] || {} } : {},
  ];

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      orderBy: { date: "desc" },
      where: {
        ...(role !== "admin" && {
          OR: [
            { classId: null },
            { class: roleConditions[role as keyof typeof roleConditions] || {} },
          ],
        }),
      },
      include: { class: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.announcement.count({
      where: {
        ...(role !== "admin" && {
          OR: [
            { classId: null },
            { class: roleConditions[role as keyof typeof roleConditions] || {} },
          ],
        }),
      },
    }),
  ]);

  return (
    <Card className="mx-4 mt-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-2xl font-bold">Announcements</CardTitle>
        <div className="flex items-center space-x-4">
          <div className="relative w-full md:w-auto">
            <TableSearch />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <SortAsc className="h-4 w-4" />
            </Button>
            {role === "admin" && (<FormContainer table="announcement" type="create" />)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md pb-4  border">
          <Table columns={columns} renderRow={renderRow} data={data} />
        </div>

        <Pagination page={p} count={count} />
      </CardContent>
    </Card>
  );
}
