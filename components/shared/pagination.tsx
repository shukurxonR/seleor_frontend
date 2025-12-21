'use client'
import { formUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'

interface Props {
	isNext: boolean
	pageSize: number
}
const Pagination = ({ isNext, pageSize }: Props) => {
	const router = useRouter()
	const searchParams = useSearchParams()

	function onNavigation(direction: 'prev' | 'next') {
		const nextOrPrev = direction === 'next' ? pageSize + 1 : pageSize - 1

		const newUrl = formUrlQuery({
			key: 'page',
			params: searchParams.toString(),
			value: nextOrPrev.toString(),
		})
		router.push(newUrl)
	}
	if (!isNext && pageSize === 1) return null

	return (
		<div className='flex w-full items-center justify-center gap-2 mt-4'>
			<Button
				size={'sm'}
				onClick={() => onNavigation('prev')}
				disabled={pageSize === 1}
			>
				Prev
			</Button>
			<p>1</p>
			<Button
				size={'sm'}
				onClick={() => onNavigation('next')}
				disabled={!isNext}
			>
				Next
			</Button>
		</div>
	)
}

export default Pagination
