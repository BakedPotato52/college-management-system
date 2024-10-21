import { Suspense } from 'react'
import Announcements from "@/components/Announcements"
import AttendanceChartContainer from "@/components/AttendanceChartContainer"
import CountChartContainer from "@/components/CountChartContainer"
import EventCalendarContainer from "@/components/EventCalendarContainer"
import UserCard from "@/components/UserCard"

interface AdminDashboardProps {
    searchParams: { [key: string]: string | undefined }
}

export default function AdminDashboard({ searchParams }: AdminDashboardProps) {
    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold text-primary mb-6">Admin Dashboard</h1>

            <section aria-label="User Statistics" className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <UserCard type="admin" />
                <UserCard type="teacher" />
                <UserCard type="student" />
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
                <section aria-label="Charts and Statistics" className="lg:col-span-2 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">

                        <div className="h-[480px] flex justify-center items-center mt-6">
                            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-full rounded-md"></div>}>
                                <CountChartContainer />
                            </Suspense>
                        </div>

                        <div className="h-[480px]">
                            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-full rounded-md"></div>}>
                                <AttendanceChartContainer />
                            </Suspense>
                        </div>

                    </div>
                </section>

                <aside aria-label="Events and Announcements" className="space-y-6">

                    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-[300px] rounded-md"></div>}>
                        <EventCalendarContainer searchParams={searchParams} />
                    </Suspense>


                    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-[200px] rounded-md"></div>}>
                        <Announcements />
                    </Suspense>

                </aside>
            </div>
        </div>
    )
}