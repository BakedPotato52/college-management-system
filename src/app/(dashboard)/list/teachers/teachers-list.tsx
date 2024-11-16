'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { UserSex } from '@prisma/client'

interface Teacher {
    id: string
    username: string
    name: string
    surname: string
    email: string | null
    phone: string | null
    address: string
    img?: string
    bloodType: string
    sex: UserSex
    createdAt: Date
    updateAt: Date
    birthday: Date
    subjects: { id: number; name: string }[]
    classes: { id: number; name: string }[]
}

interface TeachersListProps {
    teachers: Teacher[]
}

export default function TeachersList({ teachers }: TeachersListProps) {
    const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>(teachers)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const teachersPerPage = 10

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value.toLowerCase()
        setSearchTerm(term)
        const results = teachers.filter(teacher =>
            teacher.name.toLowerCase().includes(term) ||
            teacher.surname.toLowerCase().includes(term)
        )
        setFilteredTeachers(results)
        setCurrentPage(1)
    }

    const indexOfLastTeacher = currentPage * teachersPerPage
    const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage
    const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    return (
        <div className="container mx-auto p-4 dark:text-white">
            <h1 className="text-2xl font-bold mb-4">Teachers List</h1>
            <Input
                type="text"
                placeholder="Search by name or surname"
                value={searchTerm}
                onChange={handleSearch}
                className="mb-4"
            />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Blood Type</TableHead>
                        <TableHead>Sex</TableHead>
                        <TableHead>Subjects</TableHead>
                        <TableHead>Classes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentTeachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                            <TableCell>{teacher.name} {teacher.surname}</TableCell>
                            <TableCell>{teacher.email || 'N/A'}</TableCell>
                            <TableCell>{teacher.phone || 'N/A'}</TableCell>
                            <TableCell>{teacher.address}</TableCell>
                            <TableCell>{teacher.bloodType}</TableCell>
                            <TableCell>{teacher.sex}</TableCell>
                            <TableCell>{teacher.subjects.map(subject => subject.name).join(', ')}</TableCell>
                            <TableCell>{teacher.classes.map(class_ => class_.name).join(', ')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="mt-4 flex justify-center">
                {Array.from({ length: Math.ceil(filteredTeachers.length / teachersPerPage) }, (_, i) => (
                    <Button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        className="mx-1"
                    >
                        {i + 1}
                    </Button>
                ))}
            </div>
        </div>
    )
}