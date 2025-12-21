'use client'

import { sendOtp, verifyOtp } from '@/actions/auth-action'
import { updateUser } from '@/actions/user-action'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import useAction from '@/hooks/use-action'
import { emailSchema, otpSchema } from '@/lib/validation'
import { IUser } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface Props {
	user: IUser
}

const EmailForm = ({ user }: Props) => {
	const { isLoading, setIsLoading, onError } = useAction()

	const [isVerifying, setIsVerifying] = useState(false)
	const [isResend, setIsResend] = useState(false)

	const form = useForm<z.infer<typeof emailSchema>>({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: user.email },
	})

	const otpForm = useForm<z.infer<typeof otpSchema>>({
		resolver: zodResolver(otpSchema),
		defaultValues: {
			otp: '',
		},
	})

	async function onSubmit(values: z.infer<typeof emailSchema>) {
		setIsLoading(true)

		const res = await sendOtp({ email: values.email })

		if (res.serverError || res.validationErrors || !res.data) {
			return onError('Something went wrong')
		}

		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			toast.success('OTP send successfuly')
			setIsVerifying(true)
			setIsLoading(false)
			setIsResend(false)
		}
	}
	async function onVerify(values: z.infer<typeof otpSchema>) {
		setIsLoading(true)
		const res = await verifyOtp({
			otp: values.otp,
			email: form.getValues('email'),
		})
		if (res.serverError || res.validationErrors || !res.data) {
			return onError('Something went wrong')
		}

		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 301) {
			setIsResend(true)
			setIsLoading(false)
			toast('OTP timeout has expired, please try again.')
		}
		if (res.data.status === 200) {
			const respons = await updateUser({ email: form.getValues('email') })

			if (respons.serverError || respons.validationErrors || !respons.data) {
				return onError('Something went wrong')
			}

			if (respons.data.failure) {
				return onError(respons.data.failure)
			}
			if (respons.data.status === 200) {
				toast.success('Email updated successfuly!')
				signOut({ callbackUrl: '/sign-in' })
			}
		}
	}
	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem className='space-y-0'>
								<Label className='text-xs'>Email</Label>
								<FormControl>
									<Input
										disabled={isVerifying || isLoading}
										placeholder='example@gmail.com'
										className='bg-white'
										{...field}
									/>
								</FormControl>
								<FormMessage className='text-xs text-red-500' />
							</FormItem>
						)}
					/>
					{!isVerifying && (
						<Button
							type='submit'
							className='self-end mb-0.5'
							size={'sm'}
							disabled={isLoading}
						>
							Submit
						</Button>
					)}
				</form>
			</Form>
			{isVerifying && (
				<Form {...otpForm}>
					<form
						onSubmit={otpForm.handleSubmit(onVerify)}
						className='space-y-2 mt-2'
					>
						<FormField
							control={otpForm.control}
							name='otp'
							render={({ field }) => (
								<FormItem className='space-y-0 '>
									<Label className='text-sm'>
										Enter the code sent to your email.
									</Label>
									<FormControl>
										<InputOTP maxLength={6} {...field}>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
											</InputOTPGroup>
											<InputOTPSeparator />
											<InputOTPGroup>
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormMessage className='text-sm text-red-500' />
								</FormItem>
							)}
						/>
						<div className='flex items-center gap-1'>
							<Button type='submit' disabled={isLoading || isResend}>
								Submit 2
							</Button>
							{isResend && (
								<Button
									type='button'
									onClick={() => onSubmit(form.getValues())}
									disabled={isLoading}
								>
									Resend Otp
								</Button>
							)}
						</div>
					</form>
				</Form>
			)}
		</>
	)
}

export default EmailForm
