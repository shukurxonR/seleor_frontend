'use client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { adminSidebar } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function Sidebar() {
	const pathname = usePathname()
	return (
		<div className='shadow-lg p-4'>
			<div>Admin</div>
			<Separator className='my-2' />
			<div className='flex flex-col mt-2'>
				{adminSidebar.map(item => (
					<Button
						key={item.route}
						asChild
						variant={pathname == item.route ? 'secondary' : 'ghost'}
						className={cn(
							'flex justify-start',
							pathname == item.route && 'font-bold'
						)}
					>
						<Link href={item.route}>
							<item.icon />
							<span>{item.name}</span>
						</Link>
					</Button>
				))}
			</div>
		</div>
	)
}

export default Sidebar
// adminSidebar
