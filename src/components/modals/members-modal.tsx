"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-model-store';
import { ServerWithMembersWithProfiles } from '../../../types';

export const MembersModal = () => {
    const {onOpen, isOpen, onClose, type, data} = useModal();

    const isModalOpen = isOpen && type === "members";
    const { server } = data as {server: ServerWithMembersWithProfiles} ;

    return (

        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className='text-2xl text-center'>
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )

}