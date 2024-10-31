import { auth } from "@clerk/nextjs/server";
import { Filter, Plus, SortAsc, Users } from "lucide-react";
import type { Class, Prisma, Teacher } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";

type ClassList = Class & { supervisor: Teacher };

export default async function ClassListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    { header: "Class Name", accessor: "name" },
    { header: "Capacity", accessor: "capacity", className: "hidden md:table-cell" },
    { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
    { header: "Supervisor", accessor: "supervisor", className: "hidden md:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: ClassList) => (
    <tr
      key={item.id}
      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
    >
      <td className="p-4 align-middle">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{item.name}</span>
        </div>
      </td>
      <td className="hidden md:table-cell p-4 align-middle">
        <Badge variant="secondary">{item.capacity}</Badge>
      </td>
      <td className="hidden md:table-cell p-4 align-middle">{item.name[0]}</td>
      <td className="hidden md:table-cell p-4 align-middle">
        {item.supervisor ? `${item.supervisor.name} ${item.supervisor.surname}` : 'N/A'}
      </td>
      {role === "admin" && (
        <td className="p-4 align-middle">
          <div className="flex items-center gap-2">
            <FormContainer table="class" type="update" data={item} />
            <FormContainer table="class" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.ClassWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "supervisorId":
            query.supervisorId = value;
            break;
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: { supervisor: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.class.count({ where: query }),
  ]);

  return (
    <Card className="mx-4 mt-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">Classes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage and view all classes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <TableSearch />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter classes</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filter classes</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <SortAsc className="h-4 w-4" />
                  <span className="sr-only">Sort classes</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sort classes</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {role === "admin" && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Class
            </Button>
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