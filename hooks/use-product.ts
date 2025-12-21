import { IProduct } from '@/types'
import { create } from 'zustand'

interface Store {
	product: IProduct | null
	setProduct: (product: IProduct | null) => void
	open: boolean
	setOpen: (open: boolean) => void
}

export const useProduct = create<Store>()(set => ({
	product: null,
	open: false,
	setProduct: product => set({ product }),
	setOpen: open => set({ open }),
}))
