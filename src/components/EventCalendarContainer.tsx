import { Suspense } from 'react'
import Image from "next/image"
import EventCalendar from "./EventCalendar"
import EventList from "./EventList"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

interface EventCalendarContainerProps {
  searchParams: { [key: string]: string | undefined }
}

export default function EventCalendarContainer({ searchParams }: EventCalendarContainerProps) {
  const { date } = searchParams

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Event Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-[300px] rounded-md"></div>}>
          <EventCalendar />
        </Suspense>

        <div className="flex items-center justify-between mt-6 mb-4">
          <h2 className="text-xl font-semibold">Events</h2>
          <Button variant="ghost" size="icon" aria-label="More options">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-[200px] rounded-md"></div>}>
          <EventList dateParam={date} />
        </Suspense>
      </CardContent>
    </Card>
  )
}