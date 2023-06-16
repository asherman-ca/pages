import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Imagine } from '@/request'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	const [prog, setProg] = useState(null)
	const [img, setImg] = useState('')
	const handleClick = async () => {
		await Imagine(
			JSON.stringify({
				theme: 'a fat',
				petType: 'cat',
				image:
					'https://firebasestorage.googleapis.com/v0/b/sendit-stack.appspot.com/o/images%2FFarley1.jpg?alt=media&token=740d5c2c-0728-46cd-8162-562a5fc17c17',
			}),
			(data) => {
				console.log('data', data)
				setProg(data.progress)
				setImg(data.uri)
			}
		)
	}

	return (
		<main
			className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
		>
			<button onClick={handleClick}>Click</button>
			<span>{prog}</span>
			{img && <img src={img} alt='' />}
		</main>
	)
}
