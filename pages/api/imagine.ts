// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Midjourney } from 'midjourney'
// import { ResponseError } from '../../interfaces'
export const config = {
	runtime: 'edge',
}

const handler = async (req: Request) => {
	// const { theme, petType, image } = await req.json()

	// const prompt = `${image} ${theme} ${petType}`

	const prompt =
		'https://firebasestorage.googleapis.com/v0/b/sendit-stack.appspot.com/o/images%2FFarley1.jpg?alt=media&token=740d5c2c-0728-46cd-8162-562a5fc17c17 fat cat'

	console.log('imagine.handler', prompt)
	const client = new Midjourney({
		ServerId: <string>process.env.MDJRNY_SERVER_ID,
		ChannelId: <string>process.env.MDJRNY_CHANNEL_ID,
		SalaiToken: <string>process.env.MDJRNY_SALAI_TOKEN,
		Debug: true,
		Ws: process.env.WS === 'true',
	})
	await client.init()
	const encoder = new TextEncoder()
	const readable = new ReadableStream({
		start(controller) {
			console.log('imagine.start', prompt)
			client
				.Imagine(prompt, (uri: string, progress: string) => {
					console.log('imagine.loading', uri)
					controller.enqueue(encoder.encode(JSON.stringify({ uri, progress })))
				})
				.then((msg: any) => {
					console.log('imagine.done', msg)
					controller.enqueue(encoder.encode(JSON.stringify(msg)))
					client.Close()
					controller.close()
				})
				.catch((err: any) => {
					console.log('imagine.error', err)
					client.Close()
					controller.close()
				})
		},
	})
	return new Response(readable, {})
}
export default handler
