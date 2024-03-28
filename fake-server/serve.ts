import { file, serve, sleep } from 'bun'

serve({
  async fetch(req) {
    await sleep(1000)
    return new Response(file('.' + new URL(req.url).pathname + '.json'))
  },
  port: 3001
})
