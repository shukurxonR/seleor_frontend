import { getCustomers } from '@/actions/admin-action'
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

async function Page({ searchParams }: searchParamsProps) {
	const res = await getCustomers({
		searchQuery: `${searchParams.q || ''}`,
		filter: `${searchParams.filter || ''}`,
		category: `${searchParams.category || ''}`,
		page: `${searchParams.page || '1'}`,
	})

	const isNext = res?.data?.isNext || false
	const customers = res?.data?.customers || false

	return (
		<div>
			<div className='flex justify-between items-center w-full'>
				<h1 className='text-xl font-bold'>Customers</h1>
				<Filter />
			</div>
			<Separator className='my-2' />
			<Table>
				<TableCaption>A list of your recent customers.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Full Name</TableHead>
						<TableHead>Orders</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className='text-right'>Payments</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{customers && customers.length === 0 && (
						<TableRow>
							<TableCell colSpan={6} className='text-center'>
								Customers not found
							</TableCell>
						</TableRow>
					)}
					{customers &&
						customers.map((customer, index) => (
							<TableRow key={customer._id}>
								<TableCell>{index + 1}</TableCell>
								<TableCell>{customer.email}</TableCell>
								<TableCell>{customer.fullName}</TableCell>
								<TableCell>
									<Badge>{customer.orderCount}</Badge>
								</TableCell>
								<TableCell>
									<Badge
										variant={customer.isDeleted ? 'destructive' : 'secondary'}
									>
										{customer.isDeleted ? 'Deleted' : 'Active'}
									</Badge>
								</TableCell>
								<TableCell className='text-right'>
									<Badge variant={'outline'}>
										{formatPrice(customer.totalPrice)}
									</Badge>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
			<Pagination
				isNext={isNext}
				pageSize={searchParams.page ? +searchParams.page : 1}
			/>
		</div>
	)
}

export default Page
