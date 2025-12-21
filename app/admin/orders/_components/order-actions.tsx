'use client'
import { updateOrder } from '@/actions/admin-action'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import useAction from '@/hooks/use-action'
import { IOrder } from '@/types'
import { EllipsisVertical } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
	order: IOrder
}

function OrderActions({ order }: Props) {
	const { isLoading, setIsLoading, onError } = useAction()
	const [open, setOpen] = useState(false)

	async function onUpdateStatus(status: string) {
		setIsLoading(true)
		const res = await updateOrder({ id: order._id, status })

		if (res.serverError || res.validationErrors || !res.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		toast.success('Order updated successfuly')
		setIsLoading(false)
		setOpen(false)
	}

	return (
		<div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger>
					<Button className='size-6' variant={'outline'} size={'icon'}>
						<EllipsisVertical />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-40 p-1' side='right'>
					<div className='flex flex-col space-y-0'>
						<Button
							size='sm'
							className='justify-start'
							disabled={isLoading || order.status === 'Order confirmed'}
							onClick={() => onUpdateStatus('Order confirmed')}
						>
							1. Confirm order
						</Button>

						<Button
							size='sm'
							className='justify-start'
							disabled={
								isLoading || order.status === 'Order started to delivery'
							}
							onClick={() => onUpdateStatus('Order started to delivery')}
						>
							2. Start delivery
						</Button>

						<Button
							size='sm'
							className='justify-start'
							disabled={isLoading || order.status === 'Delivery in progress'}
							onClick={() => onUpdateStatus('Delivery in progress')}
						>
							3. Delivery in progress
						</Button>

						<Button
							size='sm'
							className='justify-start'
							disabled={isLoading || order.status === 'Delivery completed'}
							onClick={() => onUpdateStatus('Delivery completed')}
						>
							4. Complete delivery
						</Button>

						<Button
							size='sm'
							className='justify-start'
							disabled={isLoading || order.status === 'Order delivered'}
							onClick={() => onUpdateStatus('Order delivered')}
						>
							5. Mark as delivered
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}

export default OrderActions
