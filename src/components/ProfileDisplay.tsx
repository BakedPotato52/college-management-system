import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfileDisplay({ user, onEdit }) {
    const userType = user.student ? 'Student' : user.teacher ? 'Teacher' : 'Admin'

    return (
        <Card>
            <CardHeader>
                <CardTitle>{userType} Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    {user.student && (
                        <>
                            <p><strong>Student ID:</strong> {user.student.studentId}</p>
                            <p><strong>Grade:</strong> {user.student.grade}</p>
                        </>
                    )}
                    {user.teacher && (
                        <>
                            <p><strong>Teacher ID:</strong> {user.teacher.teacherId}</p>
                            <p><strong>Subject:</strong> {user.teacher.subject}</p>
                        </>
                    )}
                    {user.admin && (
                        <p><strong>Admin Role:</strong> {user.admin.role}</p>
                    )}
                </div>
                <Button onClick={onEdit} className="mt-4">Edit Profile</Button>
            </CardContent>
        </Card>
    )
}