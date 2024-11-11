import { PrismaClient } from '@prisma/client'
import StudentList from "./student-list"

const prisma = new PrismaClient()

async function getStudents() {
  const students = await prisma.student.findMany({
    include: {
      grade: true,
    },
  })
  return students.map(student => ({
    ...student,
    updatedAt: student.updateAt || new Date(), // Provide a default value if updatedAt is null
    img: student.img || undefined, // Convert null to undefined for img
  }))
}

export default async function StudentsPage() {
  const students = await getStudents()
  return <StudentList students={students} />
}