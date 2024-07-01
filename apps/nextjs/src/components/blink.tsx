import GradientIcon from '~/components/gradient-icon'
import Tutip from '~/components/tutip'

const Blink = () => (
  <Tutip content='Suggested by AI' side='left'>
    <div className='group relative size-8 drop-shadow-md transition-all'>
      <div className='text-[10px] font-light group-hover:text-base group-hover:font-normal'>
        <p className='absolute -top-0.5 left-1.5 text-purple-600 duration-300 group-hover:-left-0.5 group-hover:-top-2.5'>
          ✶
        </p>
        <p className='absolute -bottom-0.5 right-1.5 text-purple-300 duration-300 group-hover:-bottom-2.5 group-hover:-right-0.5'>
          ✶
        </p>
      </div>
      <GradientIcon
        className='duration-300 group-hover:scale-150 group-hover:drop-shadow-lg'
        stops={[{ color: 'blue' }, { color: 'pink' }]}>
        <path d='m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' />
      </GradientIcon>
    </div>
  </Tutip>
)
export default Blink
