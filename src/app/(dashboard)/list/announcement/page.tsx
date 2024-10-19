import { Suspense } from 'react'
import { auth } from "@clerk/nextjs/server"
import FormContainer from "@/components/FormContainer"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import TableSearch from "@/components/TableSearch"
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings"
import { Announcement, Class, Prisma } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Filter, SortAsc } from "lucide-react"

type AnnouncementList = Announcement & { class: Class }

interface AnnouncementListPageProps {
  searchParams: { [key: string]: string | undefined }
}

export default async function AnnouncementListPage({ searchParams }: AnnouncementListPageProps) {
  const { userId, sessionClaims } = auth()
  const role = (sessionClaims?.metadata as { role?: string })?.role
  const currentUserId = userId

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Class", accessor: "class" },
    { header: "Date", accessor: "date", className: "hidden md:table-cell" },
    ...(role === "admin" ? [{ header: "Actions", accessor: "action" }] : []),
  ]

  const renderRow = (item: AnnouncementList) => (
    <tr key={item.id} className="even:bg-muted hover:bg-muted/80">
      <td className="p-2 md:p-4">{item.title}</td>
      <td className="p-2 md:p-4">{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell p-2 md:p-4">
        {new Intl.DateTimeFormat("en-US").format(item.date)}
      </td>
      {role === "admin" && (
        <td className="p-2 md:p-4">
          <div className="flex items-center gap-2">
            <FormContainer table="announcement" type="update" data={item} />
            <FormContainer table="announcement" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  )

  const { page, ...queryParams } = searchParams
  const p = page ? parseInt(page) : 1
  const query: Prisma.AnnouncementWhereInput = {}

  if (queryParams.search) {
    query.title = { contains: queryParams.search, mode: "insensitive" }
  }

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  }

  query.OR = [
    { classId: null },
    { class: roleConditions[role as keyof typeof roleConditions] || {} },
  ]

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: { class: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.announcement.count({ where: query }),
  ])

  return (
    <Card className="m-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">All Announcements</CardTitle>
        <div className="flex items-center space-x-2">
          <Button size="icon" variant="outline" aria-label="Filter">
            <Filter className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" aria-label="Sort">
            <SortAsc className="h-4 w-4" />
          </Button>
          {role === "admin" && (
            <FormContainer table="announcement" type="create" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TableSearch />
          <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded-md"></div>}>
            <Table columns={columns} renderRow={renderRow} data={data} />
          </Suspense>
          <Pagination page={p} count={count} />
        </div>
      </CardContent>
    </Card>
  )
}