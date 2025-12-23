import CardLoader from '@/components/loaders/card-loader'
import Filter from '@/components/shared/filter'
import { Separator } from '@/components/ui/separator'
import { Suspense } from 'react'

function Loading() {
	return (
		<>
			<h1 className='text-xl font-bold'>Watch list</h1>
			<Separator className='my-3' />
			<Suspense>
				<Filter showCategory />
			</Suspense>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-3'>
				{Array.from({ length: 6 }).map((_, i) => (
					<CardLoader key={i} isAdmin />
				))}
			</div>
		</>
	)
}

export default Loading
