import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH (req: Request, 
    {params}: {params: {serverId: string}}) {

    try {
        const {name, imageUrl} = await req.json();
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("UnAuthorized", {status: 401});
        }

        const server = await db.server.update({
            where:{
                profileId: profile.id,
                id: params.serverId
            },
            data: {
                name,
                imageUrl
            }
        });

        return NextResponse.json(server, {status: 200});
    } catch (error) {
        console.error("[SERVER_ID_PATCH]", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
} 