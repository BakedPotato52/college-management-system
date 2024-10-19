"use client";

import { role } from "@/lib/data";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
    const { user } = useUser();
    console.log(user)
    const router = useRouter();

    useEffect(() => {
        const role = user?.publicMetadata.role;
        console.log(role)
        if (role) {
            router.push(`/${role}`);
        }
    }, [router, role]);

    return (
        <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
            <SignIn.Root>
                <SignIn.Step
                    name="start"
                    className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
                >
                    <div className="mb-6 text-center">
                        <Image src="/logo.png" alt="SchooLama Logo" width={48} height={48} className="mx-auto mb-2" />
                        <h1 className="text-2xl font-bold">SchooLama</h1>
                        <h2 className="text-gray-500 text-sm">Sign in to your account</h2>
                    </div>

                    <Clerk.GlobalError className="text-sm text-red-400" />
                    <Clerk.Field name="identifier" className="flex flex-col gap-2">
                        <Clerk.Label className="text-xs text-gray-500">
                            Username
                        </Clerk.Label>
                        <Clerk.Input
                            type="text"
                            required
                            className="p-2 rounded-md ring-1 ring-gray-300"
                        />
                        <Clerk.FieldError className="text-xs text-red-400" />
                    </Clerk.Field>
                    <Clerk.Field name="password" className="flex flex-col gap-2">
                        <Clerk.Label className="text-xs text-gray-500">
                            password
                        </Clerk.Label>
                        <Clerk.Input
                            type="text"
                            required
                            className="p-2 rounded-md ring-1 ring-gray-300"
                        />
                        <Clerk.FieldError className="text-xs text-red-400" />
                    </Clerk.Field>
                    <SignIn.Action
                        submit
                        className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px]"
                    >
                        Sign In
                    </SignIn.Action>
                </SignIn.Step>
            </SignIn.Root>
        </div>
    );
};

export default LoginPage;
