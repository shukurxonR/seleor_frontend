import { getFavorites } from '@/actions/user-action'
import WatchListCard from '@/components/cards/watch-list.card'
import Filter from '@/components/shared/filter'
import Pagination from '@/components/shared/pagination'
import { Separator } from '@/components/ui/separator'
import { searchParamsProps } from '@/types'

async function Page({ searchParams }: searchParamsProps) {
	const res = await getFavorites({
		searchQuery: `${searchParams.q || ''}`,
		filter: `${searchParams.filter || ''}`,
		category: `${searchParams.category || ''}`,
		page: `${searchParams.page || '1'}`,
	})

	const products = res?.data?.products || false
	const isNext = res?.data?.isNext || false

	console.log('PRODTTTTTTTTTTT', products)

	return (
		<>
			<h1 className='text-xl font-bold'>Watch list</h1>
			<Separator className='my-3' />
			<Filter showCategory />
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-3'>
				{products &&
					products.map(product => (
						<WatchListCard key={product._id} product={product} />
					))}
			</div>
			<Pagination
				isNext={isNext}
				pageSize={searchParams.page ? +searchParams.page : 1}
			/>
		</>
	)
}

export default Page
