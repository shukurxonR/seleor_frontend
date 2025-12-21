import { getProduct } from '@/actions/user-action'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import CreateOrderButton from '../_components/create-order-btn'

export async function generateMetadata({
	params,
}: {
	params: { productId: string }
}) {
	const res = await getProduct({ id: params.productId })
	const product = res.data?.product

	return {
		title: product?.title,
		description: product?.description,
		openGraph: { images: product?.image },
	}
}

async function Page({ params }: { params: { productId: string } }) {
	const res = await getProduct({ id: params.productId })
	const product = res.data?.product

	if (!product) return notFound()

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
			<div className='bg-secondary relative w-full h-[70vh] col-span-2'>
				<Image
					src={product.image}
					alt={product.title}
					fill
					className='mx-auto object-contain'
				/>
			</div>
			<div className='flex flex-col gap-1 self-center'>
				<h1 className='font-bold text-4xl'>{product.title}</h1>
				<Badge className='w-fit' variant={'secondary'}>
					{product.category}
				</Badge>
				<p className='text-xs text-muted-foreground'> {product.description}</p>
				<p className='font-bold'>{formatPrice(+product.price)}</p>
				<CreateOrderButton />
				<div className='text-xs'>
					Your purchase is secure with us. We do not store any credit card
					information. We use Payme for payment processing.
				</div>
			</div>
		</div>
	)
}

export default Page
