import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
			{/* IMAGE */}
			<div className='bg-secondary relative w-full h-[70vh] col-span-2 flex items-center justify-center'>
				<Skeleton className='w-full h-full' />
			</div>

			{/* CONTENT */}
			<div className='flex flex-col gap-2 self-center'>
				<Skeleton className='h-10 w-3/4' /> {/* title */}
				<Badge variant='secondary' className='w-fit'>
					<Skeleton className='h-4 w-20' />
				</Badge>
				<div className='space-y-1'>
					<Skeleton className='h-3 w-full' />
					<Skeleton className='h-3 w-5/6' />
					<Skeleton className='h-3 w-4/6' />
				</div>
				<Skeleton className='h-6 w-32' /> {/* price */}
				<Skeleton className='h-10 w-full rounded-md' /> {/* button */}
				<Skeleton className='h-3 w-full mt-2' />
			</div>
		</div>
	)
}
