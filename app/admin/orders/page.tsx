import { getOrders } from '@/actions/admin-action'
import Filter from '@/components/shared/filter'
import Pagination from '@/components/shared/pagination'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { formatPrice } from '@/lib/utils'
import { searchParamsProps } from '@/types'
import { format } from 'date-fns'
import OrderActions from './_components/order-actions'

async function Page({ searchParams }: searchParamsProps) {
	const res = await getOrders({
		searchQuery: `${searchParams.q || ''}`,
		filter: `${searchParams.filter || ''}`,
		category: `${searchParams.category || ''}`,
		page: `${searchParams.page || '1'}`,
	})

	const orders = res?.data?.orders || false
	const isNext = res?.data?.isNext || false

	return (
		<>
			<div className='flex justify-between items-center w-full'>
				<h1 className='text-xl font-bold'>Orders</h1>
				<Filter />
			</div>
			<Separator className='my-2' />
			<Table>
				<TableCaption>A list of your recent orders.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Product</TableHead>
						<TableHead>Customer</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created at</TableHead>
						<TableHead className='text-right'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{orders && orders.length === 0 && (
						<TableRow>
							<TableCell colSpan={6} className='text-center'>
								Orders not found
							</TableCell>
						</TableRow>
					)}
					{orders &&
						orders?.map(order => (
							<TableRow key={order._id}>
								<TableCell>{order.product.title}</TableCell>
								<TableCell>{order.user.email.slice(0, 10) + '...'}</TableCell>
								<TableCell>{formatPrice(order.price)}</TableCell>
								<TableCell>
									<Badge>{order.status}</Badge>
								</TableCell>
								<TableCell>
									{format(new Date(order.createdAt), 'dd/MM/yyyy')}
								</TableCell>
								<TableCell className='text-right'>
									<OrderActions order={order} />
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
			<Pagination
				isNext={isNext}
				pageSize={searchParams.page ? +searchParams.page : 1}
			/>
		</>
	)
}

export default Page
