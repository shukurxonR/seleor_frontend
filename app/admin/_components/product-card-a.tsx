'use client'
import { deleteProduct } from '@/actions/admin-action'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import useAction from '@/hooks/use-action'
import { useProduct } from '@/hooks/use-product'
import { IProduct } from '@/types'
import { NoSSR } from '@kwooshung/react-no-ssr'
import Image from 'next/image'
import { toast } from 'sonner'
interface Props {
	product: IProduct
}

function ProductCardA({ product }: Props) {
	const { onError, isLoading, setIsLoading } = useAction()
	const { setOpen, setProduct } = useProduct()

	function onOpen() {
		setOpen(true)
		setProduct(product)
	}

	async function onDelete(id: string) {
		setIsLoading(true)
		const res = await deleteProduct({ id })

		if ((res.serverError || res.validationErrors, !res.data)) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			setIsLoading(false)
			toast.success('Product deleted successfuly')
		}
	}

	return (
		<div className='flex flex-col justify-between relative border'>
			<div className='bg-secondary relative '>
				<Image
					src={product.image!}
					width={200}
					height={200}
					alt={product.imageKey!}
					className='mx-auto'
				/>
				<Badge className='absolute top-0 left-0'>{product.category}</Badge>
			</div>
			<div className='p-2'>
				<div className='flex items-center justify-between text-sm'>
					<h1 className='font-bold'>{product.title}</h1>
					<NoSSR>
						<p className='font-medium'>{product.price}</p>
					</NoSSR>
				</div>

				<p className='text-xs text-muted-foreground line-clamp-4'>
					{product.description}
				</p>
				<Separator className='my-2' />
				<div className='grid grid-cols-2 gap-2 pb-2 px-2'>
					<Button variant={'secondary'} onClick={onOpen}>
						Edit
					</Button>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant={'outline'}>Delete</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete
									your account and remove your data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => onDelete(product._id)}
									disabled={isLoading}
								>
									Continue
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</div>
	)
}

export default ProductCardA
