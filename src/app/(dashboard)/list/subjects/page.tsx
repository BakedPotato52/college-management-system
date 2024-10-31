import { auth } from "@clerk/nextjs/server";
import { BookOpen, Filter, Plus, SortAsc } from "lucide-react";
import type { Prisma, Subject, Teacher } from "@prisma/client";

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

type SubjectList = Subject & { teachers: Teacher[] };

export default async function SubjectListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    { header: "Subject Name", accessor: "name" },
    { header: "Teachers", accessor: "teachers", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (item: SubjectList) => (
    <tr
      key={item.id}
      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
    >
      <td className="p-4 align-middle">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{item.name}</span>
        </div>
      </td>
      <td className="hidden md:table-cell p-4 align-middle">
        <div className="flex flex-wrap gap-1">
          {item.teachers.map((teacher) => (
            <Badge key={teacher.id} variant="secondary">
              {teacher.name + " " + teacher.surname}
            </Badge>
          ))}
        </div>
      </td>
      <td className="p-4 align-middle">
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <FormContainer table="subject" type="update" data={item} />
                    <FormContainer table="subject" type="delete" id={item.id} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Manage subject</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.SubjectWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
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
    prisma.subject.findMany({
      where: query,
      include: { teachers: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.subject.count({ where: query }),
  ]);

  return (
    <Card className="mx-4 mt-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">Subjects</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage and view all academic subjects
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <TableSearch />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter subjects</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filter subjects</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <SortAsc className="h-4 w-4" />
                  <span className="sr-only">Sort subjects</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sort subjects</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {role === "admin" && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Subject
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