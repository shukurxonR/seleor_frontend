import { getTransactions } from '@/actions/user-action'
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
import { TransactionState } from '@/lib/constants'
import { cn, formatPrice, getStatusText, getStatusVariant } from '@/lib/utils'
import { searchParamsProps } from '@/types'
import Image from 'next/image'

async function Page({ searchParams }: searchParamsProps) {
	const res = await getTransactions({
		searchQuery: `${searchParams.q || ''}`,
		filter: `${searchParams.filter || ''}`,
		category: `${searchParams.category || ''}`,
		page: `${searchParams.page || '1'}`,
	})

	const transactions = res?.data?.transactions || false
	const isNext = res?.data?.isNext || false

	console.log(transactions)

	return (
		<>
			<div className='flex justify-between items-center w-full'>
				<h1 className='text-xl font-bold'>Payments</h1>
				<Filter />
			</div>

			<Separator className='my-3' />

			<Table className='text-sm'>
				<TableCaption>A list of your recent orders.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Image</TableHead>
						<TableHead>Product</TableHead>
						<TableHead>Provider</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className='text-right'>Price</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactions && transactions.length === 0 && (
						<TableRow>
							<TableCell colSpan={4} className='text-center'>
								Orders not found
							</TableCell>
						</TableRow>
					)}
					{transactions &&
						transactions.map(transaction => (
							<TableRow key={transaction._id}>
								<TableCell>
									<Image
										src={transaction.product.image}
										alt={transaction.provider}
										width={50}
										height={50}
									/>
								</TableCell>
								<TableCell>{transaction.product.title}</TableCell>
								<TableCell>
									<Badge className='capitalize' variant={'secondary'}>
										{transaction.provider}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge variant={getStatusVariant(transaction.state)}>
										{getStatusText(transaction.state)}
									</Badge>
								</TableCell>
								<TableCell className='text-right'>
									<Badge
										variant={'secondary'}
										className={cn(
											transaction.state === TransactionState.PaidCanceled &&
												'text-red-600 font-bold'
										)}
									>
										{formatPrice(transaction.amount)}
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
		</>
	)
}

export default Page
