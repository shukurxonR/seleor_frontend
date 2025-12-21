import { getProducts } from '@/actions/admin-action'
import Filter from '@/components/shared/filter'
import Pagination from '@/components/shared/pagination'
import { Separator } from '@/components/ui/separator'
import { searchParamsProps } from '@/types'
import AddProduct from '../_components/add-product'
import ProductCardA from '../_components/product-card-a'

async function Page({ searchParams }: searchParamsProps) {
	const res = await getProducts({
		searchQuery: `${searchParams.q || ''}`,
		filter: `${searchParams.filter || ''}`,
		category: `${searchParams.category || ''}`,
		page: `${searchParams.page || '1'}`,
	})

	const products = res?.data?.products
	const isNext = res?.data?.isNext || false
	return (
		<div>
			<div className='flex justify-between items-center w-100'>
				<h1>Products</h1>
				<AddProduct />
			</div>

			<Separator className='my-2' />
			<Filter showCategory />

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-3'>
				{products && products.length === 0 && (
					<h1 className='felx items-center justify-center'>
						Product not found
					</h1>
				)}
				{products &&
					products?.map(product => (
						<ProductCardA key={product._id} product={product} />
					))}
			</div>

			<Pagination
				isNext={isNext}
				pageSize={searchParams.page ? +searchParams.page : 1}
			/>
		</div>
	)
}

export default Page
