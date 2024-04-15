"use client";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { FileUpload } from '../file-upload';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-model-store';
import { Label } from '../ui/label';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';

export const InviteModal = () => {
    const {onOpen, isOpen, onClose, type, data} = useModal();
    const origin = useOrigin();
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const isModalOpen = isOpen && type === "invite";
    const { server } = data;
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }

    const onNew = async () => {
        try{
            setLoading(true);
            const response = await axios.patch(`api/servers/${server.id}/invite-code`);

            onOpen("invite", {server: response.data});
        }catch(error) {
            console.error(error);
        } finally {
            setLoading(true);
        }
    }

    return (

        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className='p-6'>
                    <Label
                    className='uppercase text-xs font-bold text-zinc-500
                    dark:text-secondary/70'>
                        Server invite Link
                    </Label>
                    <div className='flex items-center mt-2 gap-x-2'>
                        <Input className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black
                        focus-visible:ring-offset-0'
                        value={inviteUrl}
                        disabled={loading}/>
                        <Button size="icon" onClick={onCopy}>
                            {copied? 
                            <Check className='w-4 h-4'/> : 
                            <Copy className='w-4 h-4'/>
                            }
                        </Button>
                    </div>
                    <Button className='text-xs text-zinc-500 mt-4'
                    variant='link'
                    size="sm"
                    onClick={onNew}>
                        Generate a new link
                        <RefreshCw className='w-4 h-4 ml-2'/>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )

}