'use client'
import {
	createProduct,
	deleteFile,
	updateProduct,
} from '@/actions/admin-action'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import useAction from '@/hooks/use-action'
import { useProduct } from '@/hooks/use-product'
import { categories } from '@/lib/constants'
import { UploadDropzone } from '@/lib/uploadthing'
import { formatPrice } from '@/lib/utils'
import { productSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

function AddProduct() {
	const { isLoading, setIsLoading, onError } = useAction()
	const { open, product, setProduct, setOpen } = useProduct()

	const form = useForm<z.infer<typeof productSchema>>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			title: '',
			price: '',
			description: '',
			category: '',
			image: '',
			imageKey: '',
		},
	})
	async function onSubmit(values: z.infer<typeof productSchema>) {
		if (!form.watch('image')) {
			return toast.error('Please upload a picture of the product.')
		}
		setIsLoading(true)

		let res
		if (product?._id) {
			res = await updateProduct({ ...values, id: product._id })
		} else {
			res = await createProduct(values)
		}

		if ((res.serverError || res.validationErrors, !res.data)) {
			return onError('Something went wrong')
		}

		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 201) {
			toast.success('Product created successfuly')
			setOpen(false)
			form.reset()
			setIsLoading(false)
		}
		if (res.data.status === 200) {
			toast.success('Product updated successfuly')
			setOpen(false)
			form.reset()
			setIsLoading(false)
		}
	}

	function onOpen() {
		setOpen(true)
		setProduct({
			_id: '',
			title: '',
			description: '',
			category: '',
			image: '',
			imageKey: '',
			price: 0,
		})
	}

	function onDeleteImage() {
		deleteFile(form.getValues('imageKey'))
		form.setValue('image', '')
		form.setValue('imageKey', '')
	}

	useEffect(() => {
		if (product) {
			form.reset({ ...product, price: product.price.toString() })
		}
	}, [product])

	return (
		<>
			<Button size={'sm'} onClick={onOpen}>
				<span>Add product</span>
				<PlusCircle />
			</Button>

			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Manage your product</SheetTitle>
						<SheetDescription>
							Field market width * are required fields and must be filled
						</SheetDescription>
					</SheetHeader>
					<Separator className='my-2' />
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
							<FormField
								control={form.control}
								name='title'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm'>Title</FormLabel>
										<FormControl>
											<Input
												{...field}
												className='bg-secondary'
												placeholder='Adidas shoes'
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage className='text-red-500 text-sm' />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm'>Description</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												className='bg-secondary'
												placeholder='Adidas shoes are you product description'
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage className='text-sm text-red-500' />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='category'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm'>Category</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											disabled={isLoading}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select Category' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categories.slice(1).map(category => (
													<SelectItem value={category} key={category}>
														{category}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage className='text-sm text-red-500' />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='price'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm'>
											{!form.watch('price')
												? 'Price'
												: `Price ${formatPrice(Number(form.watch('price')))}`}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												className='bg-secondary'
												type='number'
												placeholder='100.000 UZS'
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage className='text-sm text-red-500' />
									</FormItem>
								)}
							/>
							{form.watch('image') && (
								<div className='w-full h-[160px] bg-secondary flex justify-center items-center relative'>
									<Image
										src={form.watch('image')}
										alt={'product image'}
										fill
										className='object-contain'
									/>
									<Button
										className='absolute top-0 right-0'
										size={'icon'}
										variant={'destructive'}
										type='button'
										onClick={onDeleteImage}
									>
										<X />
									</Button>
								</div>
							)}
							{!form.watch('image') && (
								<UploadDropzone
									className='cursor-pointer'
									endpoint={'imageUploader'}
									onClientUploadComplete={res => {
										form.setValue('image', res[0].url)
										form.setValue('imageKey', res[0].key)
									}}
									config={{ appendOnPaste: true, mode: 'auto' }}
									appearance={{ container: { height: 160, padding: 10 } }}
								/>
							)}
							<Button type='submit' className='w-full' disabled={isLoading}>
								Submit
							</Button>
						</form>
					</Form>
				</SheetContent>
			</Sheet>
		</>
	)
}

export default AddProduct
