'use client'
function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimeSlot {
  courseCode: string
  teacher: string
  room?: string
}

interface DaySchedule {
  [key: number]: TimeSlot | null
}

interface TimetableProps {
  schedule: {
    [key: string]: DaySchedule
  }
}

export default function Component({ schedule = defaultSchedule }: TimetableProps) {
  const [selectedDay, setSelectedDay] = useState("Mo")

  const periods = [
    { id: 1, time: "9:00 - 10:00 AM" },
    { id: 2, time: "10:10 - 11:00 AM" },
    { id: 3, time: "11:10 - 11:55 AM" },
    { id: 4, time: "12:00 - 12:50 PM" },
    { id: 5, time: "12:55 - 1:45 PM" },
    { id: 6, time: "1:50 - 2:40 PM" },
    { id: 7, time: "3:30 - 4:00 PM" },
    { id: 8, time: "4:30 - 4:30 PM" },
  ]

  const days = [
    { id: "Monday", name: "Monday" },
    { id: "Tuesday", name: "Tuesday" },
    { id: "Wednesday", name: "Wednesday" },
    { id: "Thursday", name: "Thursday" },
    { id: "Friday", name: "Friday" },
  ]

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <img src="/logo.png" alt="ICFAI Univesity" className='w-10 h-10 bg-transparent' />
        <h2 className="text-2xl font-bold text-center">Lateral CSE 3rd Year Sem 1</h2>
        <h3 className="text-sm text-muted-foreground text-center">ICFAI UNIVERSITY TRIPURA, Kamalghat, Mohanpur, Agartala</h3>

        {/* Mobile View */}
        <div className="md:hidden">
          <Select onValueChange={setSelectedDay} defaultValue={selectedDay}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day.id} value={day.id}>
                  {day.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-4 space-y-4">
            {periods.map((period) => {
              const slot = schedule[selectedDay]?.[period.id]
              return (
                <div key={period.id} className="border rounded-md p-3">
                  <div className="font-medium">Period {period.id}</div>
                  <div className="text-sm text-muted-foreground">{period.time}</div>
                  {slot ? (
                    <div className="mt-2">
                      <div className="font-medium">{slot.courseCode}</div>
                      <div className="text-sm">{slot.teacher}</div>
                      {slot.room && <div className="text-sm text-muted-foreground">{slot.room}</div>}
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-muted-foreground">No class</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[100px_repeat(8,1fr)] gap-2">
              {/* Period Headers */}
              <div className="h-16" />
              {periods.map((period) => (
                <div key={period.id} className="text-center p-2 bg-primary/5 rounded-md">
                  <div className="font-medium text-sm">PERIOD {period.id}</div>
                  <div className="text-xs text-muted-foreground">{period.time}</div>
                </div>
              ))}

              {/* Days and Slots */}
              {days.map((day) => (
                <>
                  <div key={`day-${day.id}`} className="flex items-center font-medium text-primary">
                    {day.id}
                  </div>
                  {periods.map((period) => {
                    const slot = schedule[day.id]?.[period.id]
                    return (
                      <div
                        key={`${day.id}-${period.id}`}
                        className="p-2 border rounded-md min-h-[80px] text-center group hover:bg-accent transition-colors"
                      >
                        {slot?.room && (
                          <div className="text-xs text-muted-foreground mb-1">{slot.room}</div>
                        )}
                        {slot?.courseCode && (
                          <>
                            <div className="font-medium text-sm">{slot.courseCode}</div>
                            <div className="text-xs text-muted-foreground mt-1">{slot.teacher}</div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </>
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-right mt-4">
          Timetable generated on {formatDate(new Date())}
        </div>
      </div>
    </Card>
  )
}

// Default schedule data based on the image
const defaultSchedule = {
  "Monday": {
    1: { courseCode: "CSE325", teacher: "ARUNANGSHU PAL", room: "ACC307" },
    3: { courseCode: "CSE307", teacher: "RAKTIM DEB", room: "ACC307" },
    7: { courseCode: "CSE303", teacher: "DIPANJOY MAJUMDER", room: "ACC307" },
    8: { courseCode: "CS408", teacher: "Dipanwita Das", room: "ACC307" },
  },
  "Tuesday": {
    1: { courseCode: "CSE303", teacher: "DIPANJOY MAJUMDER", room: "ACC307" },
    3: { courseCode: "CS325", teacher: "ARUNANGSHU PAL", room: "ACC307" },
    4: { courseCode: "CSE302", teacher: "SUKANYA SAHA", room: "ACC307" },
    7: { courseCode: "CS408", teacher: "Dipanwita Das", room: "ACC307" },
    8: { courseCode: "CSE302", teacher: "SUKANYA SAHA", room: "ACC307" },
  },
  "Wednesday": {
    1: { courseCode: "CSE302", teacher: "SUKANYA SAHA", room: "ACC307" },
    3: { courseCode: "CSE303", teacher: "DIPANJOY MAJUMDER", room: "ACC307" },
    4: { courseCode: "CSE301", teacher: "JOYIAL SARKAR", room: "ACC307" },
    7: { courseCode: "CS325", teacher: "ARUNANGSHU PAL", room: "ACC307" },
  },
  "Thursday": {
    1: { courseCode: "CSE302", teacher: "SUKANYA SAHA", room: "ACC307" },
    2: { courseCode: "CSE301", teacher: "JOYIAL SARKAR", room: "ACC307" },
    3: { courseCode: "CS408", teacher: "Dipanwita Das", room: "ACC307" },
    5: { courseCode: "CSE307", teacher: "RAKTIM DEB", room: "ACC307" },
  },
  "Friday": {
    1: { courseCode: "CSE307", teacher: "RAKTIM DEB", room: "ACC307" },
    3: { courseCode: "CSE303", teacher: "DIPANJOY MAJUMDER", room: "ACC307" },
    7: { courseCode: "CSE301", teacher: "JOYIAL SARKAR", room: "ACC307" },
    8: { courseCode: "CRT303", teacher: "JOYDEEP DAS", room: "ACC307" },
  }
}