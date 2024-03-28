export async function GET(request: Request, { params }: { params: { id: string } }) {
  const url: string = process.env.ENDPOINT + '/employee?id=' + params.id
  console.log('GET |', url)
  return Response.json(await (await fetch(url)).json())
}
