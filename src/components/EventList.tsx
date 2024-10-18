import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import prisma from "@/lib/prisma"

interface EventListProps {
  dateParam: string | undefined
}

export default async function EventList({ dateParam }: EventListProps) {
  const date = dateParam ? new Date(dateParam) : new Date()

  try {
    const events = await prisma.event.findMany({
      where: {
        startTime: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lte: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    if (events.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No events scheduled for this day.
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {event.title}
              </CardTitle>
              <Badge variant="outline">
                <CalendarIcon className="mr-1 h-3 w-3" />
                {format(event.startTime, "HH:mm")}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  } catch (error) {
    console.error("Failed to fetch events:", error)
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          Failed to load events. Please try again later.
        </CardContent>
      </Card>
    )
  }
}

export function EventListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}