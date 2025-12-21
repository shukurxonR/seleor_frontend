'use client'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IUser } from '@/types'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
	user: IUser
}

function UserBox({ user }: Props) {
	const [isOpen, setIsOpen] = useState(false)
	const [menuOpen, setMenuOpen] = useState(false)

	return (
		<>
			<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
				<DropdownMenuTrigger asChild>
					<Avatar className='cursor-pointer'>
						<AvatarImage src={user.avatar} alt={user.fullName} />
						<AvatarFallback className='capitalize bg-primary text-white'>
							{user.fullName.slice(0, 2)}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-52 space-y-1'>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{user.role === 'admin' && (
						<DropdownMenuItem className='cursor-pointer'>
							<Link href={'/admin'}>Admin panel</Link>
						</DropdownMenuItem>
					)}
					<DropdownMenuItem className='cursor-pointer'>
						<Link href={'/dashboard'}>Dashboard</Link>
					</DropdownMenuItem>

					<DropdownMenuItem
						className='bg-red-200 cursor-pointer'
						onClick={() => {
							setIsOpen(true)
							setMenuOpen(false)
						}}
					>
						<span>Logout</span> <LogOut />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{/*  */}
			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to log out?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data. can log in later and register again.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => signOut({ callbackUrl: '/sign-in' })}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

export default UserBox
