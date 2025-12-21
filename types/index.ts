export interface ChildProps {
	children: React.ReactNode
}
export interface QueryProps {
	params: string
	key: string
	value?: string | null
}
export interface IProduct {
	title: string
	category: string
	price: number
	image: string
	description: string
	imageKey: string
	_id: string
}
export interface ReturnActionType {
	user: IUser
	failure: string
	status: number
	checkoutUrl: string
	isNext: boolean
	products: IProduct[]
	product: IProduct
	customers: IUser[]
	orders: IOrder[]
	transactions: ITransaction[]
	statistics: {
		totalOrders: number
		totalTransactions: number
		totalFavorites: number
	}
}

export interface IUser {
	_id: string
	email: string
	fullName: string
	password: string
	role: string
	orderCount: number
	totalPrice: number
	avatar: string
	avatarKey: string
	isDeleted: boolean
	deletedAt: Date
	favorites: IProduct[]
}
export interface IOrder {
	_id: string
	user: IUser
	product: IProduct
	createdAt: Date
	price: number
	status: string
	updatedAt: Date
}

export interface searchParamsProps {
	searchParams: { [key: string]: string | undefined }
}

export interface ITransaction {
	_id: string
	id: string
	user: IUser
	product: IProduct
	state: number
	amount: number
	create_time: number
	perform_time: number
	cancel_time: number
	reason: number
	provider: string
}
