import { PrismaClient } from '@prisma/client'
import StudentList from "./student-list"

const prisma = new PrismaClient()

async function getStudents() {
  const students = await prisma.student.findMany({
    include: {
      grade: true,
    },
  })
  return students
}

export default async function StudentsPage() {
  const students = await getStudents()
  return <StudentList students={students} />
}