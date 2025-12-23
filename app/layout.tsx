import SessionProvider from '@/components/providers/session-provider'
import Navbar from '@/components/shared/navbar'
import { Toaster } from '@/components/ui/sonner'
import { ChildProps } from '@/types'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { FC } from 'react'
import './globals.css'

const montserrat = Montserrat({
	weight: ['400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Seleor e-commerce',
	description: 'Seleor e-commerce website built with Next.js',
	icons: { icon: '/favicon.png' },
}

const RootLayout: FC<ChildProps> = ({ children }) => {
	return (
		<SessionProvider>
			<html lang='en'>
				<body className={`${montserrat.className} antialiased`}>
					<Navbar />
					<NextTopLoader showSpinner={false} />
					<main className='container max-w-6xl mt-24'>{children}</main>
					<Toaster position='bottom-right' />
				</body>
			</html>
		</SessionProvider>
	)
}

export default RootLayout

//https://youtu.be/mviBKFUdlBc?si=abHbpzDhXhE3SusR
