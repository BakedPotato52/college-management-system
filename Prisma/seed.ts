import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

enum Day {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
}

enum UserSex {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

async function main() {
  // ADMIN
  await prisma.admin.create({
    data: {
      id: "admin1",
      username: "admin1",
    },
  });

  // GRADE
  for (let i = 1; i <= 4; i++) {
    await prisma.grade.create({
      data: {
        level: i,
      },
    });
  }

  // CLASS
  for (let i = 1; i <= 4; i++) {
    await prisma.class.create({
      data: {
        name: `${i}A`,
        gradeId: i,
        capacity: 35,
      },
    });
  }

  // SUBJECT
  const subjects = [
    "Operating System",
    "Blockchain Technologies",
    "Cryptography",
    "Theme Project",
    "Machine Learning",
    "Software Engineering",
    "Compiler Design",
    "Database Management",
    "Computer Science",
    "Artificial Intelligence",
  ];

  for (const subject of subjects) {
    await prisma.subject.create({ data: { name: subject } });
  }

  // PARENT
  for (let i = 1; i <= 10; i++) {
    await prisma.parent.create({
      data: {
        id: `parentId${i}`,
        username: `parent${i}`,
        name: `Parent Firstname ${i}`,
        surname: `Parent Surname ${i}`,
        email: `parent${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Parent Address ${i}`,
      },
    });
  }

  // STUDENT
  for (let i = 1; i <= 20; i++) {
    await prisma.student.create({
      data: {
        id: `student${i}`,
        username: `23IUT00200${i}`,
        name: `Student Name ${i}`,
        surname: `Student Surname ${i}`,
        email: `student${i}@example.com`,
        phone: `987-654-321${i}`,
        address: `Student Address ${i}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: `parentId${(i % 10) + 1}`,
        gradeId: (i % 4) + 1,
        classId: (i % 4) + 1,
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
      },
    });
  }

  // TEACHER
  for (let i = 1; i <= 5; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`,
        username: `teacher${i}`,
        name: `Teacher Name ${i}`,
        surname: `Teacher Surname ${i}`,
        email: `teacher${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Teacher Address ${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: (i % subjects.length) + 1 }] },
        classes: { connect: [{ id: (i % 4) + 1 }] },
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      },
    });
  }

  // LESSON
  for (let i = 1; i <= 10; i++) {
    await prisma.lesson.create({
      data: {
        name: `Lesson ${i}`,
        day: Day[Object.keys(Day)[Math.floor(Math.random() * Object.keys(Day).length)] as keyof typeof Day],
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
        subjectId: (i % subjects.length) + 1,
        classId: (i % 4) + 1,
        teacherId: `teacher${(i % 5) + 1}`,
      },
    });
  }

  // EXAM
  for (let i = 1; i <= 5; i++) {
    await prisma.exam.create({
      data: {
        title: `Exam ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        lessonId: (i % 10) + 1,
      },
    });
  }

  // ASSIGNMENT
  for (let i = 1; i <= 5; i++) {
    await prisma.assignment.create({
      data: {
        title: `Assignment ${i}`,
        startDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        lessonId: (i % 10) + 1,
      },
    });
  }

  // RESULT
  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        score: Math.floor(Math.random() * 100),
        studentId: `student${i}`,
        ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
      },
    });
  }

  // ATTENDANCE
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(),
        present: i % 2 === 0,
        studentId: `student${i}`,
        lessonId: (i % 10) + 1,
      },
    });
  }

  // EVENT
  for (let i = 1; i <= 3; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        startTime: new Date(),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        classId: i,
      },
    });
  }

  // ANNOUNCEMENT
  for (let i = 1; i <= 3; i++) {
    await prisma.announcement.create({
      data: {
        title: `Announcement ${i}`,
        description: `Description for Announcement ${i}`,
        date: new Date(),
        classId: i,
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
