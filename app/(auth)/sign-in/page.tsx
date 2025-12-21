'use client'
import { login } from '@/actions/auth-action'
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
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import useAction from '@/hooks/use-action'
import { loginSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

function SignInPage() {
	const { isLoading, setIsLoading, onError } = useAction()
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof loginSchema>) {
		setIsLoading(true)
		const res = await login(values)

		if (res.serverError || res.validationErrors || !res.data) {
			return onError('Something went wrong')
		}

		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.user) {
			setIsLoading(false)
			toast('Logged in successfully')
			signIn('credentials', { userId: res.data.user._id, callbackUrl: '/' })
		}
	}

	return (
		<Card className='w-1/2 p-4'>
			<h1 className='text-xl font-bold'>Sign in</h1>
			<p className='text-sm text-muted-foreground'>
				Welcome back! Plase sign in to your account
			</p>
			<Separator className='my-2' />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<Label>Email</Label>
								<FormControl>
									<Input
										placeholder='User @gmail.com'
										{...field}
										disabled={isLoading}
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
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage className='text-xs' />
							</FormItem>
						)}
					/>
					<Button type='submit'>Submit</Button>
				</form>
			</Form>
			<div className='mt-4'>
				<div className='text-sm text-muted-foreground'>
					Don&apos;t have an account?{' '}
					<Button asChild variant={'link'} className='p-0' disabled={isLoading}>
						<Link href='/sign-up'>Sign up</Link>
					</Button>
				</div>
			</div>
		</Card>
	)
}

export default SignInPage
