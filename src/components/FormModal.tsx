"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import dynamic from "next/dynamic";

import {
  deleteClass,
  deleteExam,
  deleteStudent,
  deleteSubject,
  deleteTeacher
} from "@/lib/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface FormContainerProps {
  table: string;
  type: "create" | "update" | "delete";
  data?: any;
  id?: string | number;
}

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
};

const formComponents = {
  teacher: dynamic(() => import("./forms/TeacherForm"), { ssr: false }),
  student: dynamic(() => import("./forms/StudentForm"), { ssr: false }),
  subject: dynamic(() => import("./forms/SubjectForm"), { ssr: false }),
  class: dynamic(() => import("./forms/ClassForm"), { ssr: false }),
  exam: dynamic(() => import("./forms/ExamForm"), { ssr: false }),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const FormComponent = formComponents[table];

  const handleDelete = async (formData: FormData) => {
    const deleteAction = deleteActionMap[table];
    if (!deleteAction) {
      toast.error(`Delete action not found for ${table}`);
      return { success: false, error: true };
    }

    try {
      await deleteAction(formData);
      toast.success(`${table} has been deleted!`);
      setOpen(false);
      router.refresh();
      return { success: true, error: false };
    } catch (error) {
      toast.error(`Failed to delete ${table}`);
      return { success: false, error: true };
    }
  };

  const [state, formAction] = useFormState(handleDelete, {
    success: false,
    error: false,
  });

  useEffect(() => {
    if (state.error) {
      toast.error(`An error occurred while deleting the ${table}`);
    }
  }, [state, table]);

  const renderIcon = () => {
    switch (type) {
      case "create":
        return <Plus className="w-4 h-4" />;
      case "update":
        return <Pencil className="w-4 h-4" />;
      case "delete":
        return <Trash2 className="w-4 h-4" />;
    }
  };

  const buttonColor = type === "create" ? "bg-yellow-400" : type === "update" ? "bg-sky-400" : "bg-purple-400";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={`${buttonColor} p-2 rounded-full`}
          onClick={() => setOpen(true)}
          aria-label={`${type} ${table}`}
        >
          {renderIcon()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{type === "delete" ? `Delete ${table}` : `${type === "create" ? "Create" : "Update"} ${table}`}</DialogTitle>
          <DialogDescription>
            {type === "delete" ? "This action cannot be undone." : `Enter the details to ${type} the ${table}.`}
          </DialogDescription>
        </DialogHeader>
        {type === "delete" && id ? (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="id" value={id} />
            <p className="text-center font-medium">
              Are you sure you want to delete this {table}? All related data will be lost.
            </p>
            <Button type="submit" variant="destructive" className="w-full">
              Delete
            </Button>
          </form>
        ) : (type === "create" || type === "update") && FormComponent ? (
          <FormComponent
            type={type}
            data={data}
            setOpen={setOpen}
            relatedData={relatedData}
          />
        ) : (
          <p>Form not found!</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;