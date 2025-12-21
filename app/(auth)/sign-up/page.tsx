'use client'
import { register, sendOtp, verifyOtp } from '@/actions/auth-action'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import { Separator } from '@/components/ui/separator'
import useAction from '@/hooks/use-action'
import { otpSchema, registerSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

function SignUpPage() {
	const { isLoading, setIsLoading, onError } = useAction()
	const [isVerifying, setIsVerifying] = useState(false)
	const [isResend, setIsResend] = useState(false)

	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			fullName: '',
			email: '',
			password: '',
		},
	})
	const otpForm = useForm<z.infer<typeof otpSchema>>({
		resolver: zodResolver(otpSchema),
		defaultValues: {
			otp: '',
		},
	})

	async function onSubmit(values: z.infer<typeof registerSchema>) {
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
			const respons = await register(form.getValues())

			if (respons.serverError || respons.validationErrors || !respons.data) {
				return onError('Something went wrong')
			}

			if (respons.data.failure) {
				return onError(respons.data.failure)
			}
			if (respons.data.user._id) {
				toast.success('User registration successfuly!')
				signIn('credentials', {
					userId: respons.data.user._id,
					callbackUrl: '/',
				})
			}
		}
	}
	return (
		<Card className='w-1/2 p-4'>
			<h1 className='text-xl font-bold'>Sign in</h1>
			<p className='text-sm text-muted-foreground'>
				Welcome to our platform! Plase sign up to create an
			</p>
			<Separator className='my-2' />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
					<FormField
						control={form.control}
						name='fullName'
						render={({ field }) => (
							<FormItem>
								<Label>Full Name</Label>
								<FormControl>
									<Input
										placeholder='your full name'
										{...field}
										disabled={isLoading || isVerifying}
									/>
								</FormControl>
								<FormMessage className='text-xs' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<Label>Email</Label>
								<FormControl>
									<Input
										placeholder='enter your email'
										{...field}
										disabled={isLoading || isVerifying}
									/>
								</FormControl>
								<FormMessage className='text-xs' />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<Label>Password</Label>
								<FormControl>
									<Input
										placeholder='****** '
										type='password'
										{...field}
										disabled={isLoading || isVerifying}
									/>
								</FormControl>
								<FormMessage className='text-xs' />
							</FormItem>
						)}
					/>
					{!isVerifying && <Button type='submit'>Submit</Button>}
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
								Submit
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

			<div className='mt-4'>
				<div className='text-sm text-muted-foreground'>
					Already have an account?{' '}
					<Button asChild variant={'link'} className='p-0' disabled={isLoading}>
						<Link href='/sign-in'>Sign in</Link>
					</Button>
				</div>
			</div>
		</Card>
	)
}

export default SignUpPage
