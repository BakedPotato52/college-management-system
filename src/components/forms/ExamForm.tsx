'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useFormState } from "react-dom"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { examSchema, ExamSchema } from "@/lib/formValidationSchemas"
import { createExam, updateExam } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Lesson = {
  id: number
  name: string
}

type ExamFormProps = {
  type: 'create' | 'update'
  data?: Partial<ExamSchema>
  setOpen: (open: boolean) => void
  relatedData: {
    lessons: Lesson[]
  }
}

export default function ExamForm({ type, data, setOpen, relatedData }: ExamFormProps = {
  type: 'create',
  setOpen: () => { },
  relatedData: { lessons: [] }
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
    defaultValues: data,
  })

  const [state, formAction] = useFormState(
    type === "create" ? createExam : updateExam,
    {
      success: false,
      error: false,
    }
  )

  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      toast(`Exam has been ${type === "create" ? "created" : "updated"}!`)
      setOpen(false)
      router.refresh()
    }
  }, [state, router, type, setOpen])

  const onSubmit = handleSubmit((formData) => {
    formAction(formData)
  })

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>{type === "create" ? "Create a new exam" : "Update the exam"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Exam title</Label>
            <Input id="title" {...register("title")} defaultValue={data?.title} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Date</Label>
              <Input
                id="startTime"
                type="datetime-local"
                {...register("startTime")}
                defaultValue={data?.startTime ? new Date(data.startTime).toISOString().slice(0, 16) : undefined}
              />
              {errors.startTime && <p className="text-sm text-red-500">{errors.startTime.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Date</Label>
              <Input
                id="endTime"
                type="datetime-local"
                {...register("endTime")}
                defaultValue={data?.endTime ? new Date(data.endTime).toISOString().slice(0, 16) : undefined}
              />
              {errors.endTime && <p className="text-sm text-red-500">{errors.endTime.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lesson">Lesson</Label>
            <Select defaultValue={data?.lessonId?.toString()} {...register("lessonId")}>
              <SelectTrigger>
                <SelectValue placeholder="Select a lesson" />
              </SelectTrigger>
              <SelectContent>
                {relatedData.lessons.map((lesson) => (
                  <SelectItem key={lesson.id} value={lesson.id.toString()}>
                    {lesson.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.lessonId && <p className="text-sm text-red-500">{errors.lessonId.message}</p>}
          </div>
          {data && (
            <Input type="hidden" {...register("id")} defaultValue={data.id} />
          )}
        </CardContent>
        <CardFooter>
          {state.error && <p className="text-sm text-red-500">Something went wrong!</p>}
          <Button type="submit" className="ml-auto">
            {type === "create" ? "Create" : "Update"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}