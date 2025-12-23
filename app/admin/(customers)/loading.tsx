import Filter from '@/components/shared/filter'
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
import { Loader } from 'lucide-react'
import { Suspense } from 'react'

async function Loading() {
	return (
		<div>
			<div className='flex justify-between items-center w-full'>
				<h1 className='text-xl font-bold'>Customers</h1>
				<Suspense>
					<Filter />
				</Suspense>
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
					<TableRow>
						<TableCell colSpan={6} className='text-center'>
							<div className='flex justify-center'>
								<Loader size={16} className='animate-spin' />
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	)
}

export default Loading
