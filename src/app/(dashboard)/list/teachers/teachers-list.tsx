'use client'

import { User } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Teacher = {
    id: string
    username: string
    name: string
    surname: string
    email: string | null
    phone: string | null
    address: string
    bloodType: string
    img?: string
    createdAt: Date
    updatedAt: Date
    birthday: Date
    subject: {
        id: number,
        name: string
    }
    lesson: {
        id: number,
        name: string,
        startTime: Date,
        endTime: Date
    }

}

export default function teacherList({ teachers }: { teachers: Teacher[] }) {
    return (
        <div className="container mx-auto p-4 dark:text-white">
            <h1 className="text-2xl font-bold mb-4">teacher List</h1>
            <ul className="space-y-2">
                {teachers.map((teacher) => (
                    <li key={teacher.id} className="bg-card text-card-foreground rounded-lg p-4 shadow-sm transition-all duration-300 ease-in-out hover:bg-accent hover:shadow-md hover:scale-[1.02] focus-within:bg-accent focus-within:shadow-md focus-within:scale-[1.02]">
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <div className="flex items-center space-x-4 cursor-pointer">
                                    <Avatar>
                                        <AvatarImage src={teacher.img} alt={`${teacher.name} ${teacher.surname}`} />
                                        <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <p className="font-medium">{teacher.name} {teacher.surname}</p>
                                        <p className="text-sm text-muted-foreground">{teacher.email || 'No email provided'}</p>
                                    </div>
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold">{teacher.name} {teacher.surname}</h4>
                                    <p className="text-sm">Username: {teacher.username}</p>
                                    <p className="text-sm">Email: {teacher.email || 'Not provided'}</p>
                                    <p className="text-sm">Phone: {teacher.phone || 'Not provided'}</p>
                                    <p className="text-sm">Address: {teacher.address}</p>
                                    <p className="text-sm">Birthday: {new Date(teacher.birthday).toLocaleDateString()}</p>
                                    <p className='text-sm'>Blood Type: {teacher.bloodType}</p>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </li>
                ))}
            </ul>
        </div>
    )
}