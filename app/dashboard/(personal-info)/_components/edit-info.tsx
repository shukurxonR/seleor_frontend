'use client'

import { updateUser } from '@/actions/user-action'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import useAction from '@/hooks/use-action'
import { UploadDropzone } from '@/lib/uploadthing'
import { IUser } from '@/types'
import { Edit2, Loader } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'sonner'
import EmailForm from './email-form'
import FullNameForm from './full-name-form'

interface Props {
	user: IUser
}

function EditInformation({ user }: Props) {
	const { isLoading, setIsLoading, onError } = useAction()
	const { update } = useSession()
	const [open, setOpen] = useState(false)

	async function onUpdateAvatar(avatar: string, avatarKey: string) {
		setIsLoading(true)
		const res = await updateUser({ avatar, avatarKey })

		if (res.serverError || res.validationErrors || !res.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status) {
			toast.success('Avatar updated successfuly')
			update()
		}
		setOpen(false)
		setIsLoading(false)
	}
	return (
		<>
			<div className='w-full h-52 bg-secondary flex justify-center items-center'>
				<div className='relative'>
					{isLoading && (
						<Skeleton className='bg-secondary inset-0 absolute z-50 flex justify-center items-center'>
							<Loader className='animate-spin' />
						</Skeleton>
					)}
					<Avatar className='size-32'>
						<AvatarImage src={user.avatar} alt={user.avatarKey} />
						<AvatarFallback className='bg-primary text-white text-6xl'>
							{user.fullName.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<Button
						size={'icon'}
						className='absolute right-0 bottom-0 rounded-full border border-primary'
						variant={'secondary'}
						onClick={() => setOpen(true)}
					>
						<Edit2 />
					</Button>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle />
								<UploadDropzone
									endpoint={'imageUploader'}
									config={{ appendOnPaste: true, mode: 'auto' }}
									appearance={{ container: { height: 200, padding: 10 } }}
									onClientUploadComplete={res =>
										onUpdateAvatar(res[0].url, res[0].key)
									}
								/>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			{/*  //////////////////////////////////////////////////////////////////////////*/}
			<div className='bg-secondary px-4 my-3'>
				<Accordion type='single' collapsible>
					<AccordionItem value='item-1'>
						<AccordionTrigger>
							<div className='flex flex-col space-y-0'>
								<h2 className='font-bold'>Full Name</h2>
								<p className='text-muted-foreground'>{user.fullName}</p>
							</div>
						</AccordionTrigger>
						<AccordionContent className='border-l border-l-primary pl-4'>
							<FullNameForm user={user} />
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='item-2'>
						<AccordionTrigger>
							<div className='flex flex-col space-y-0'>
								<h2 className='font-bold'>Emal</h2>
								<p className='text-muted-foreground'>{user.email}</p>
							</div>
						</AccordionTrigger>
						<AccordionContent className='border-l border-l-primary pl-4'>
							<EmailForm user={user} />
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</>
	)
}

export default EditInformation
