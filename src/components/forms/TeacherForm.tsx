'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useFormState } from "react-dom"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Image from "next/image"
import { CldUploadWidget } from "next-cloudinary"
import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchemas"
import { createTeacher, updateTeacher } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Subject = {
  id: number
  name: string
}

type TeacherFormProps = {
  type: 'create' | 'update'
  data?: Partial<TeacherSchema>
  setOpen: (open: boolean) => void
  relatedData: {
    subjects: Subject[]
  }
}

export default function TeacherForm({ type, data, setOpen, relatedData }: TeacherFormProps = {
  type: 'create',
  setOpen: () => { },
  relatedData: { subjects: [] }
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
    defaultValues: data,
  })

  const [img, setImg] = useState<{ secure_url: string } | null>(null)

  const [state, formAction] = useFormState(
    type === "create" ? createTeacher : updateTeacher,
    {
      success: false,
      error: false,
    }
  )

  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      toast(`Teacher has been ${type === "create" ? "created" : "updated"}!`)
      setOpen(false)
      router.refresh()
    }
  }, [state, router, type, setOpen])

  const onSubmit = handleSubmit((formData) => {
    formAction({ ...formData, img: img?.secure_url })
  })

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>{type === "create" ? "Create a new teacher" : "Update the teacher"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold">Authentication Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...register("username")} />
                {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">First Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Last Name</Label>
                <Input id="surname" {...register("surname")} />
                {errors.surname && <p className="text-sm text-red-500">{errors.surname.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register("address")} />
                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday</Label>
                <Input id="birthday" type="date" {...register("birthday")} />
                {errors.birthday && <p className="text-sm text-red-500">{errors.birthday.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <Select defaultValue={data?.sex} {...register("sex")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sex && <p className="text-sm text-red-500">{errors.sex.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjects">Subjects</Label>
                <Select {...register("subjects")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    {relatedData.subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subjects && <p className="text-sm text-red-500">{errors.subjects.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <CldUploadWidget
                uploadPreset="school"
                onSuccess={(result: any) => {
                  setImg(result.info)
                }}
              >
                {({ open }) => (
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => open()}>
                    <Image src="/upload.png" alt="" width={28} height={28} />
                    <span className="text-sm text-gray-500">Upload a photo</span>
                  </div>
                )}
              </CldUploadWidget>
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