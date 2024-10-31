import { auth } from "@clerk/nextjs/server";
import { Filter, SortAsc } from "lucide-react";
import type { Class, Event, Prisma } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";

type EventList = Event & { class: Class };

export default async function EventListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Class", accessor: "class" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    { header: "Start Time", accessor: "startTime", className: "hidden md:table-cell" },
    { header: "End Time", accessor: "endTime", className: "hidden md:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: EventList) => (
    <tr
      key={item.id}
      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
    >
      <td className="p-4 align-middle font-medium">{item.title}</td>
      <td className="p-4 align-middle">{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell p-4 align-middle">
        {new Intl.DateTimeFormat("en-US").format(item.startTime)}
      </td>
      <td className="hidden md:table-cell p-4 align-middle">
        {item.startTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </td>
      <td className="hidden md:table-cell p-4 align-middle">
        {item.endTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </td>
      {role === "admin" && (
        <td className="p-4 align-middle">
          <div className="flex items-center gap-2">
            <FormContainer table="event" type="update" data={item} />
            <FormContainer table="event" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.EventWhereInput = {};

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
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  query.OR = [
    { classId: null },
    {
      class: roleConditions[role as keyof typeof roleConditions] || {},
    },
  ];

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
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
    prisma.event.count({
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">Events</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage and view upcoming events
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <TableSearch />
          <Button variant="outline" size="icon" title="Filter events">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter events</span>
          </Button>
          <Button variant="outline" size="icon" title="Sort events">
            <SortAsc className="h-4 w-4" />
            <span className="sr-only">Sort events</span>
          </Button>
          {role === "admin" && (
            <FormContainer table="event" type="create" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table columns={columns} renderRow={renderRow} data={data} />
        </div>
        <div className="mt-4 flex justify-center">
          <Pagination page={p} count={count} />
        </div>
      </CardContent>
    </Card>
  );
}