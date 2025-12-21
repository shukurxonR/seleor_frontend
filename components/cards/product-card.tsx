'use client'
import { addFavorite } from '@/actions/user-action'
import useAction from '@/hooks/use-action'
import { formatPrice } from '@/lib/utils'
import { IProduct } from '@/types'
import { NoSSR } from '@kwooshung/react-no-ssr'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { MouseEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'

interface Props {
	product: IProduct
}
function ProductCard({ product }: Props) {
	const router = useRouter()
	const { isLoading, setIsLoading, onError } = useAction()

	async function onFavorite(e: MouseEvent) {
		e.stopPropagation()
		setIsLoading(true)

		const res = await addFavorite({ id: product._id })

		if (res.serverError || res.validationErrors || !res.data) {
			setIsLoading(false)
			return onError('Something went wrong')
		}

		if (res.data.failure) {
			setIsLoading(false)
			return onError(res.data.failure)
		}

		if (res.data.status === 200) {
			toast.success('Added to favorites')
		}

		setIsLoading(false)
	}

	return (
		<div
			onClick={() => router.push(`/product/${product._id}`)}
			className='cursor-pointer'
		>
			<div className='bg-secondary relative group'>
				<Image
					src={product.image!}
					width={300}
					height={300}
					className='mx-auto'
					alt={product.title!}
				/>
				<div className='absolute right-0 top-0 z-50 opacity-0 group-hover:opacity-100 transition-all'>
					<Button size={'icon'} onClick={onFavorite} disabled={isLoading}>
						<Heart />
					</Button>
				</div>
			</div>
			<div className='flex justify-between items-center mt-2 text-sm'>
				<h1 className='font-bold line-clamp-1'>{product.title}</h1>
				<NoSSR>
					<p className='font-medium'>{formatPrice(product.price!)}</p>
				</NoSSR>
			</div>
			<p className='text-xs text-muted-foreground'>{product.category}</p>
		</div>
	)
}

export default ProductCard
