'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useFormState } from "react-dom"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { classSchema, ClassSchema } from "@/lib/formValidationSchemas"
import { createClass, updateClass } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Teacher = {
  id: string
  name: string
  surname: string
}

type Grade = {
  id: number
  level: number
}

type ClassFormProps = {
  type: 'create' | 'update'
  data?: Partial<ClassSchema>
  setOpen: (open: boolean) => void
  relatedData: {
    teachers: Teacher[]
    grades: Grade[]
  }
}

export default function ClassForm({ type, data, setOpen, relatedData }: ClassFormProps = {
  type: 'create',
  setOpen: () => { },
  relatedData: { teachers: [], grades: [] }
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: data,
  })

  const [state, formAction] = useFormState(
    type === "create" ? createClass : updateClass,
    {
      success: false,
      error: false,
    }
  )

  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      toast(`Class has been ${type === "create" ? "created" : "updated"}!`)
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
          <CardTitle>{type === "create" ? "Create a new class" : "Update the class"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Class name</Label>
              <Input id="name" {...register("name")} defaultValue={data?.name} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" {...register("capacity")} defaultValue={data?.capacity} />
              {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supervisor">Supervisor</Label>
              <Select defaultValue={data?.supervisorId} {...register("supervisorId")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a supervisor" />
                </SelectTrigger>
                <SelectContent>
                  {relatedData.teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {`${teacher.name} ${teacher.surname}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.supervisorId && <p className="text-sm text-red-500">{errors.supervisorId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select defaultValue={data?.gradeId?.toString()} {...register("gradeId")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a grade" />
                </SelectTrigger>
                <SelectContent>
                  {relatedData.grades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id.toString()}>
                      {grade.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gradeId && <p className="text-sm text-red-500">{errors.gradeId.message}</p>}
            </div>
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