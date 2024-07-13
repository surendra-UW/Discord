"use client";
import { Role } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "../../../types";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, UserPlus, Settings, Users, Trash, LogOut } from "lucide-react";
import { useModal } from "@/hooks/use-model-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: Role
}

export const ServerHeader = ({
    server, 
    role
}: ServerHeaderProps) => {

    const { onOpen } = useModal();
    const isAdmin = role === Role.ADMIN;
    const isModerator = isAdmin || role === Role.MODERATOR;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
            className="focus:outline-none"
            asChild>
            <button
            className="w-full text-md font-semibold px-3 flex items-center
                    h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
                    dark:hover:bg-zinc-700/50 transition">
                {server.name}
                <ChevronDown className="h-5 w-5 ml-auto">
                </ChevronDown>
            </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
            className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
                {isModerator && (
                    <DropdownMenuItem
                    className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                    onClick={() => onOpen("invite", { server })}>
                        Invite People
                        <UserPlus className="w-4 h-4 ml-auto"/>
                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <DropdownMenuItem
                    className="px-3 py-2 text-sm cursor-pointer"
                    onClick={() => onOpen("EditServer", { server })}>
                        Server Settings
                        <Settings className="w-4 h-4 ml-auto"/>
                    </DropdownMenuItem>
                )}

                {isAdmin  && (
                    <DropdownMenuItem
                    className="px-3 py-2 text-sm cursor-pointer"
                    onClick={() => onOpen("members", { server })}>
                        Manage Members
                        <Users className="w-4 h-4 ml-auto"/>
                    </DropdownMenuItem>
                )}

                {isModerator  && (
                    <DropdownMenuItem
                    className="px-3 py-2 text-sm cursor-pointer">
                        Create Channel
                        <Users className="w-4 h-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {
                    isModerator && (
                        <DropdownMenuSeparator/>
                    )
                }
                {isAdmin  && (
                    <DropdownMenuItem
                    className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
                         Delete Server
                        <Trash className="w-4 h-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {!isAdmin  && (
                    <DropdownMenuItem
                    className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
                         Leave Server
                        <LogOut className="w-4 h-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>

    );
}