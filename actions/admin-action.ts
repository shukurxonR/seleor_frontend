'use server'

import { clientAxios } from '@/http/axios'
import { authOptions } from '@/lib/auth-options'
import { generateToken } from '@/lib/generate-token'
import { actionClient } from '@/lib/safe-action'
import {
	idSchema,
	productSchema,
	searchParamsSchema,
	updateProductSchema,
	updateStatusSchema,
} from '@/lib/validation'
import { ReturnActionType } from '@/types'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { UTApi } from 'uploadthing/server'

const utapi = new UTApi()

export const deleteFile = async (key: string) => {
	await utapi.deleteFiles(key)
}

export const getProducts = actionClient
	.schema(searchParamsSchema)
	.action<ReturnActionType>(async ({ parsedInput }) => {
		const session = await getServerSession(authOptions)
		const token = await generateToken(session!.currentUser!._id!)

		const { data } = await clientAxios.get('/api/admin/products', {
			headers: { Authorization: `Bearer ${token}` },
			params: parsedInput,
		})
		return JSON.parse(JSON.stringify(data))
	})

export const getCustomers = actionClient
	.schema(searchParamsSchema)
	.action<ReturnActionType>(async ({ parsedInput }) => {
		const session = await getServerSession(authOptions)
		const token = await generateToken(session!.currentUser!._id!)

		const { data } = await clientAxios.get(`/api/admin/customers`, {
			headers: { Authorization: `Bearer ${token}` },
			params: parsedInput,
		})

		return JSON.parse(JSON.stringify(data))
	})
export const getOrders = actionClient
	.schema(searchParamsSchema)
	.action<ReturnActionType>(async ({ parsedInput }) => {
		const session = await getServerSession(authOptions)
		const token = await generateToken(session!.currentUser!._id!)

		const { data } = await clientAxios.get(`/api/admin/orders`, {
			headers: { Authorization: `Bearer ${token}` },
			params: parsedInput,
		})

		return JSON.parse(JSON.stringify(data))
	})
export const getTransactions = actionClient
	.schema(searchParamsSchema)
	.action<ReturnActionType>(async ({ parsedInput }) => {
		const session = await getServerSession(authOptions)
		const token = await generateToken(session!.currentUser!._id!)

		const { data } = await clientAxios.get(`/api/admin/transactions`, {
			headers: { Authorization: `Bearer ${token}` },
			params: parsedInput,
		})

		return JSON.parse(JSON.stringify(data))
	})

export const createProduct = actionClient
	.schema(productSchema)
	.action<ReturnActionType>(async ({ parsedInput }) => {
		const session = await getServerSession(authOptions)
		const token = await generateToken(session!.currentUser!._id!)

		const { data } = await clientAxios.post(
			'/api/admin/create-product',
			{
				...parsedInput,
				price: parseFloat(parsedInput.price),
			},
			{ headers: { Authorization: `Bearer ${token}` } }
		)
		revalidatePath('/admin/products')
		return JSON.parse(JSON.stringify(data))
	})

export const updateProduct = actionClient
	.schema(updateProductSchema)
	.action<ReturnActionType>(async ({ parsedInput }) => {
		const session = await getServerSession(authOptions)
		const token = await generateToken(session!.currentUser!._id!)

		const { data } = await clientAxios.put(
			`/api/admin/update-product/${parsedInput.id}`,
			{
				...parsedInput,
				price: parseFloat(parsedInput.price),
			},
			{ headers: { Authorization: `Bearer ${token}` } }
		)

		revalidatePath('/admin/products')
		return JSON.parse(JSON.stringify(data))
	})
export const updateOrder = actionClient
	.schema(updateStatusSchema)
	.action<ReturnActionType>(async ({ parsedInput }) => {
		const session = await getServerSession(authOptions)
		const token = await generateToken(session!.currentUser!._id!)
		const { id, status } = parsedInput

		const { data } = await clientAxios.put(
			`/api/admin/update-orders/${id}`,
			{ status },
			{ headers: { Authorization: `Bearer ${token}` } }
		)

		revalidatePath('/admin/orders')
		return JSON.parse(JSON.stringify(data))
	})

export const deleteProduct = actionClient
	.schema(idSchema)
	.action<ReturnActionType>(async ({ parsedInput }) => {
		const session = await getServerSession(authOptions)
		const token = await generateToken(session!.currentUser!._id!)

		const { data } = await clientAxios.delete(
			`/api/admin/delete-product/${parsedInput.id}`,
			{ headers: { Authorization: `Bearer ${token}` } }
		)

		revalidatePath('/admin/products')
		return JSON.parse(JSON.stringify(data))
	})
