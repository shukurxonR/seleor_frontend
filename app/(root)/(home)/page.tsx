import { getProducts } from '@/actions/user-action'
import ProductCard from '@/components/cards/product-card'
import Filter from '@/components/shared/filter'
import Pagination from '@/components/shared/pagination'
import { Separator } from '@/components/ui/separator'
import { searchParamsProps } from '@/types'

async function Page({ searchParams }: searchParamsProps) {
	const res = await getProducts({
		searchQuery: `${searchParams.q || ''}`,
		filter: `${searchParams.filter || ''}`,
		category: `${searchParams.category || ''}`,
		page: `${searchParams.page || '1'}`,
	})

	const isNext = res?.data?.isNext || false
	const products = res?.data?.products || false

	return (
		<>
			<div className='flex justify-between items-center'>
				<div className='font-bold text-xl'>Products</div>
				<Filter showCategory={true} />
			</div>
			<Separator className='my-3' />
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
				{products &&
					products.map(product => (
						<ProductCard key={product._id} product={product} />
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
