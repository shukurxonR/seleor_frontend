'use client'
import { updatePassword, updateUser } from '@/actions/user-action'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import useAction from '@/hooks/use-action'
import { passwordSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { signOut } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { z } from 'zod'
function Page() {
	const { isLoading, setIsLoading, onError } = useAction()
	const form = useForm<z.infer<typeof passwordSchema>>({
		resolver: zodResolver(passwordSchema),
		defaultValues: { confirmPassword: '', newPassword: '', oldPassword: '' },
	})

	async function onSubmit(values: z.infer<typeof passwordSchema>) {
		setIsLoading(true)
		const res = await updatePassword(values)
		if (res.serverError || res.validationErrors || !res.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			toast.success('Password updated successfuly')
			setIsLoading(false)
			form.reset()
		}
	}

	async function onDelete() {
		setIsLoading(true)
		const res = await updateUser({ isDeleted: true, deletedAt: new Date() })
		if (res.serverError || res.validationErrors || !res.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			toast.success('Accaunt deleted successfuly')
			signOut({ callbackUrl: '/sign-up' })
			setIsLoading(false)
		}
	}

	return (
		<>
			<h1 className='text-xl font-bold'>Dabger zone</h1>
			<Separator className='my-3' />
			<div className='flex flex-col bg-secondary p-4'>
				<div className='text-lg font-bold'>Dalite account</div>
				<p className='text-sm text-muted-foreground'>
					Deleting your account will remove all your data from our servers. This
					action is irreversible.
				</p>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button className='w-fit' size={'sm'} variant={'destructive'}>
							Delete account
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={onDelete} disabled={isLoading}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
			<div className='p-4 bg-secondary mt-4'>
				<div className='w-1/2'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
							<FormField
								control={form.control}
								name='oldPassword'
								render={({ field }) => (
									<FormItem className='space-y-0'>
										<Label>Old password</Label>
										<FormControl>
											<Input
												placeholder='****'
												type='password'
												className='bg-white'
												{...field}
											/>
										</FormControl>
										<FormMessage className='text-xs text-red-500' />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='newPassword'
								render={({ field }) => (
									<FormItem className='space-y-0'>
										<Label>New password</Label>
										<FormControl>
											<Input
												placeholder='****'
												type='password'
												className='bg-white'
												{...field}
											/>
										</FormControl>
										<FormMessage className='text-xs text-red-500' />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='confirmPassword'
								render={({ field }) => (
									<FormItem className='space-y-0'>
										<Label>Confirm password</Label>
										<FormControl>
											<Input
												placeholder='****'
												type='password'
												className='bg-white'
												{...field}
											/>
										</FormControl>
										<FormMessage className='text-xs text-red-500' />
									</FormItem>
								)}
							/>
							<Button type='submit'>Submit</Button>
						</form>
					</Form>
				</div>
			</div>
		</>
	)
}

export default Page
