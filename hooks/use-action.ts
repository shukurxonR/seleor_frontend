'use client'
import { useState } from 'react'
import { toast } from 'sonner'

function useAction() {
	const [isLoading, setIsLoading] = useState(false)

	function onError(message: string) {
		setIsLoading(false)
		toast.error(message)
	}

	return { isLoading, setIsLoading, onError }
}
export default useAction
