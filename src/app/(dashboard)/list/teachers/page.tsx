import { PrismaClient } from '@prisma/client'
import TeachersList from "./teachers-list"

const prisma = new PrismaClient()

async function getTeachers() {
  const teachers = await prisma.teacher.findMany({
    include: {
      subjects: true,
      classes: true,
    },
  })
  return teachers.map(teacher => ({
    ...teacher,
    img: teacher.img || undefined,
    createdAt: teacher.createdAt,
    birthday: teacher.birthday,
    updatedAt: teacher.updateAt || new Date(), // Provide a default value if updatedAt is null
    subjects: teacher.subjects.map(subject => ({
      id: subject.id,
      name: subject.name,
    })),
    classes: teacher.classes.map(class_ => ({
      id: class_.id,
      name: class_.name,
    })),
  }))
}

export default async function TeachersPage() {
  const teachers = await getTeachers()
  return <TeachersList teachers={teachers} />
}