import { PrismaClient } from '@prisma/client'
import TeacherList from "./teachers-list"

const prisma = new PrismaClient()

async function getTeachers() {
  const teachers = await prisma.teacher.findMany({
    include: { subjects: true, lessons: true, }
  })
  return teachers.map(teacher => ({
    ...teacher,
    img: teacher.img || undefined, // Convert null to undefined for img
  }))
}

export default async function teachersPage() {
  const teachers = await getTeachers()
  return <TeacherList teachers={teachers} />
}