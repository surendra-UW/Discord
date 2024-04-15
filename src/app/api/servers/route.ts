import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid";
import {Role} from "@prisma/client"

export async function POST (req: Request) {

    console.log(req);
    try {
        const {name, imageUrl, s3Url} = await req.json();
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("UnAuthorized", {status: 401});
        }

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                s3Url,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                       { name: "general", profileId:profile.id}
                    ]
                },
                members: {
                    create: [
                        {profileId: profile.id, role: Role.ADMIN}
                    ]
                }
            }
        });

        return new NextResponse("Success", {status: 200});
    } catch (error) {
        console.error("[SERVERS_POST]", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
} 