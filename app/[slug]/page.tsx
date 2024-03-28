export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className='flex h-screen'>
      <div className='m-auto'>Page {params.slug}</div>
    </div>
  )
}
