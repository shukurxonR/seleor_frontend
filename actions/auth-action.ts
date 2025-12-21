'use server'

import { clientAxios } from '@/http/axios'
import { actionClient } from '@/lib/safe-action'
import {
	emailSchema,
	loginSchema,
	registerSchema,
	verifyOtpSchema,
} from '@/lib/validation'
import { ReturnActionType } from '@/types'

export const login = actionClient
	.schema(loginSchema)
	.action<ReturnActionType>(async ({ parsedInput }) => {
		const { data } = await clientAxios.post('/api/auth/login', parsedInput)
		return JSON.parse(JSON.stringify(data))
	})

export const register = actionClient
	.schema(registerSchema)
	.action<ReturnActionType>(async ({ parsedInput }) => {
		const { data } = await clientAxios.post('/api/auth/register', parsedInput)
		return JSON.parse(JSON.stringify(data))
	})

export const sendOtp = actionClient
	.schema(emailSchema)
	.action<ReturnActionType>(async ({ parsedInput }) => {
		const { data } = await clientAxios.post('/api/otp/send', parsedInput)
		return JSON.parse(JSON.stringify(data))
	})

export const verifyOtp = actionClient
	.schema(verifyOtpSchema)
	.action<ReturnActionType>(async ({ parsedInput }) => {
		const { data } = await clientAxios.post('/api/otp/verify', parsedInput)
		return JSON.parse(JSON.stringify(data))
	})
