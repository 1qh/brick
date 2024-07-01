import { file, serve, sleep } from 'bun'

serve({
  async fetch(req) {
    const url = new URL(req.url)
    let f = url.pathname
    await sleep(0)
    if (f !== '/user') {
      await sleep(1000)
    }
    const source = url.searchParams.get('source')
    if (source) {
      f += '&' + new URLSearchParams({ source }).toString()
    }
    console.log(f)

    const res = file(`.${f}.json`)

    if (f.startsWith('/company')) {
      return new Response(
        JSON.stringify({
          id: 'fake-' + crypto.randomUUID(),
          data: await res.json()
        })
      )
    }

    if (f === '/employee') {
      const employees: Record<string, Object> = {}
      const ids = url.searchParams.get('ids')?.split(',')
      const data = await res.json()
      const limit = data.length
      const chunk = 20
      ids?.forEach((id, i) => {
        const begin = (i * chunk) % limit
        const end = Math.min(begin + chunk, limit)
        return (employees[id] = data.slice(begin, end))
      })
      return new Response(JSON.stringify(employees))
    }
    return new Response(res)
  },
  port: 3001
})
