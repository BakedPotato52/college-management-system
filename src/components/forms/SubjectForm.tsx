'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useFormState } from "react-dom"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas"
import { createSubject, updateSubject } from "@/lib/actions"
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

type SubjectFormProps = {
  type: 'create' | 'update'
  data?: Partial<SubjectSchema>
  setOpen: (open: boolean) => void
  relatedData: {
    teachers: Teacher[]
  }
}

export default function SubjectForm({ type, data, setOpen, relatedData }: SubjectFormProps = {
  type: 'create',
  setOpen: () => { },
  relatedData: { teachers: [] }
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: data,
  })

  const [state, formAction] = useFormState(
    type === "create" ? createSubject : updateSubject,
    {
      success: false,
      error: false,
    }
  )

  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      toast(`Subject has been ${type === "create" ? "created" : "updated"}!`)
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
          <CardTitle>{type === "create" ? "Create a new subject" : "Update the subject"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject name</Label>
            <Input id="name" {...register("name")} defaultValue={data?.name} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="teachers">Teachers</Label>
            <Select {...register("teachers")} multiple>
              <SelectTrigger>
                <SelectValue placeholder="Select teachers" />
              </SelectTrigger>
              <SelectContent>
                {relatedData.teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {`${teacher.name} ${teacher.surname}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teachers && <p className="text-sm text-red-500">{errors.teachers.message}</p>}
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