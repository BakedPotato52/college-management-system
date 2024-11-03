import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            student: true,
            teacher: true,
            admin: true,
        },
    })

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const json = await request.json()

    const updatedUser = await prisma.user.update({
        where: { id },
        data: json,
    })

    return NextResponse.json(updatedUser)
}