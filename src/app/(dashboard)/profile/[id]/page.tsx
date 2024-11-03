'use client'

import { useEffect, useState } from 'react'
import ProfileDisplay from '@/components/ProfileDisplay'
import ProfileEdit from '@/components/ProfileEdit'

export default function ProfilePage({ params }: { params: { id: string } }) {
    const [user, setUser] = useState(null)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`/api/users/${params.id}`)
            const data = await response.json()
            setUser(data)
        }
        fetchUser()
    }, [params.id])

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = async (updatedData: any) => {
        const response = await fetch(`/api/users/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        const updatedUser = await response.json()
        setUser(updatedUser)
        setIsEditing(false)
    }

    if (!user) return <div>Loading...</div>

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Profile</h1>
            {isEditing ? (
                <ProfileEdit user={user} onSave={handleSave} />
            ) : (
                <ProfileDisplay user={user} onEdit={handleEdit} />
            )}
        </div>
    )
}