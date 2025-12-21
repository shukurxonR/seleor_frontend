import { getTransactions } from '@/actions/admin-action'
import Filter from '@/components/shared/filter'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { TransactionState } from '@/lib/constants'
import { cn, formatPrice, getStatusText, getStatusVariant } from '@/lib/utils'
import { searchParamsProps } from '@/types'

async function Page({ searchParams }: searchParamsProps) {
	const res = await getTransactions({
		searchQuery: `${searchParams.q || ''}`,
		filter: `${searchParams.filter || ''}`,
		category: `${searchParams.category || ''}`,
		page: `${searchParams.page || '1'}`,
	})

	const transactions = res?.data?.transactions
	const isNext = res?.data?.isNext || false
	console.log(transactions)
	console.log(isNext)
	return (
		<div>
			<div className='flex justify-between items-center w-full'>
				<h1 className='text-xl font-bold'>Payments</h1>
				<Filter />
			</div>
			<Separator className='my-2' />

			<Table>
				<TableCaption>A list of your recent payments.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Product</TableHead>
						<TableHead>Customer</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Provider</TableHead>
						<TableHead className='text-right'>Price</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactions && transactions.length === 0 && (
						<TableRow>
							<TableCell colSpan={6} className='text-center'>
								Orders not found
							</TableCell>
						</TableRow>
					)}
					{transactions &&
						transactions?.map(transaction => (
							<TableRow key={transaction._id}>
								<TableCell>{transaction.product.title}</TableCell>
								<TableCell>{transaction.user.email}</TableCell>
								<TableCell>
									<Badge variant={getStatusVariant(transaction.state)}>
										{getStatusText(transaction.state)}
									</Badge>
								</TableCell>
								<TableCell>{transaction.provider}</TableCell>
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
				{transactions && transactions.length > 0 && (
					<TableFooter>
						<TableRow>
							<TableCell colSpan={4} className='font-bold'>
								Total
							</TableCell>
							<TableCell colSpan={4} className='text-right'>
								<Badge>
									{formatPrice(
										transactions
											.filter(c => c.state === TransactionState.Paid)
											.reduce((acc, curr) => acc + curr.amount, 0)
									)}
								</Badge>
							</TableCell>
						</TableRow>
					</TableFooter>
				)}
			</Table>
		</div>
	)
}

export default Page
