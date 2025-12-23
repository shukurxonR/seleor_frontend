import CardLoader from '@/components/loaders/card-loader'
import Filter from '@/components/shared/filter'
import { Separator } from '@/components/ui/separator'
import AddProduct from '../_components/add-product'

function Loading() {
	return (
		<div>
			<div className='flex justify-between items-center w-100'>
				<h1>Products</h1>
				<AddProduct />
			</div>

			<Separator className='my-2' />
			<Filter showCategory />

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-3'>
				{Array.from({ length: 6 }).map((_, i) => (
					<CardLoader key={i} isAdmin />
				))}
			</div>
		</div>
	)
}

export default Loading
