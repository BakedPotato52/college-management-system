'use client'

import { User } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Student = {
    id: string
    username: string
    name: string
    surname: string
    email: string | null
    phone: string | null
    address: string
    img?: string
    createdAt: Date
    updatedAt: Date
    birthday: Date
    grade: {
        id: number
        level: number
    }
}

export default function StudentList({ students }: { students: Student[] }) {
    return (
        <div className="container mx-auto dark:text-white p-4">
            <h1 className="text-2xl font-bold mb-4">Student List</h1>
            <ul className="space-y-2">
                {students.map((student) => (
                    <li key={student.id} className="bg-card text-card-foreground rounded-lg p-4 shadow-sm transition-all duration-300 ease-in-out hover:bg-accent hover:shadow-md hover:scale-[1.02] focus-within:bg-accent focus-within:shadow-md focus-within:scale-[1.02]">
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <div className="flex items-center space-x-4 cursor-pointer">
                                    <Avatar>
                                        <AvatarImage src={student.img} alt={student.name} />
                                        <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <p className="font-medium">{student.name} {student.surname}</p>
                                        <p className="text-sm text-muted-foreground">{student.email || 'No email provided'}</p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">Grade: {student.grade.level}</div>
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold">{student.name} {student.surname}</h4>
                                    <p className="text-sm">Username: {student.username}</p>
                                    <p className="text-sm">Email: {student.email || 'Not provided'}</p>
                                    <p className="text-sm">Phone: {student.phone || 'Not provided'}</p>
                                    <p className="text-sm">Address: {student.address}</p>
                                    <p className="text-sm">Birthday: {student.birthday.toLocaleDateString()}</p>
                                    <p className="text-sm">Grade Level: {student.grade.level}</p>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </li>
                ))}
            </ul>
        </div>
    )
}