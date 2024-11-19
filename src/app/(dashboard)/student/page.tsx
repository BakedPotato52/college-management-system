import { auth } from "@clerk/nextjs/server";
import { Calendar, MessageSquare } from "lucide-react";
import Timetable from "../list/lessons/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Announcements from "@/components/Announcements";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";

export default async function StudentPage() {
  const { userId } = auth();
  console.log("the user id is ", userId)
  const classItems = await prisma.class.findMany({

  });

  if (classItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Classes Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You are not enrolled in any classes at the moment. Please contact your administrator for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 dark:text-white">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          </CardHeader>
          <CardContent>
            <Timetable />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <EventCalendar />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Announcements />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}