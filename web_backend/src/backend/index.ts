import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'

const app = new Hono()

app.get('/*', (c) => {
    const req_path = c.req.path
	return c.text(`Hello BEW from Hono! ${req_path}`)
})

export const handler = handle(app)