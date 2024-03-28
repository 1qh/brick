'use client'

import { useEffect, useState } from 'react'
import { CheckCircledIcon, CheckIcon, MixerHorizontalIcon } from '@radix-ui/react-icons'
import { toast } from 'sonner'
import { Setting } from 'types'
import { cn } from 'utils'

import { Tutip } from '@/components/tutip'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const models = ['gpt-3.5-turbo-0125', 'gpt-4-0125-preview']

let setting: Setting = {
  model: models[0],
  alpha: 4,
  beta: 5
}

function SettingMenu({ className }: { className?: string }) {
  if (typeof window !== 'undefined') {
    const _setting = localStorage.getItem('setting')
    if (_setting) {
      setting = JSON.parse(_setting)
    }
  }
  function saveSetting(setting: Setting) {
    localStorage.setItem('setting', JSON.stringify(setting))
  }
  const [model, setModel] = useState(setting.model)
  const [alpha, setAlpha] = useState([setting.alpha])
  const [beta, setBeta] = useState([setting.beta])

  const [saved, setSaved] = useState(true)

  useEffect(() => {
    saveSetting(setting)
  })
  return (
    <Popover>
      <Tutip content='Setting'>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className={cn(
              className,
              'group size-9 transition-all duration-200 hover:scale-110 hover:drop-shadow-lg'
            )}>
            <MixerHorizontalIcon className='size-6 transition-all duration-300 group-hover:-scale-x-100' />
          </Button>
        </PopoverTrigger>
      </Tutip>
      <PopoverContent className='notranslate group mx-2 my-1 transition-all duration-300 hover:drop-shadow-xl'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='w-full justify-evenly'>
              <p className='opacity-50'>Model</p>
              <p className='transition-all duration-500 group-hover:scale-110'>{model}</p>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='top'>
            <DropdownMenuRadioGroup
              value={model}
              onValueChange={value => {
                setModel(value)
                setSaved(false)
              }}>
              {models.map((model, index) => (
                <DropdownMenuRadioItem key={index} value={model}>
                  {model}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className='mx-2 mt-6 flex items-center justify-between text-sm'>
          <div className='flex flex-row items-center gap-2'>
            <p className='text-base font-medium'>α</p>
            <p className='text-xs opacity-50'>Alpha</p>
          </div>
          {alpha}
        </div>
        <Slider
          className='mx-auto my-1 w-11/12 transition-all duration-500 group-hover:scale-105'
          max={30}
          min={2}
          defaultValue={alpha}
          step={1}
          onValueChange={value => {
            setAlpha(value)
            setSaved(false)
          }}
        />
        <div className='mx-2 mt-6 flex items-center justify-between text-sm'>
          <div className='flex flex-row items-center gap-2'>
            <p className='text-base font-medium'>β</p>
            <p className='text-xs opacity-50'>Beta</p>
          </div>
          {beta}
        </div>
        <Slider
          className='mx-auto my-1 w-11/12 transition-all duration-500 group-hover:scale-105'
          max={30}
          min={2}
          defaultValue={beta}
          step={1}
          onValueChange={value => {
            setBeta(value)
            setSaved(false)
          }}
        />
        <Button
          disabled={saved}
          variant={saved ? 'outline' : 'default'}
          onClick={() => {
            saveSetting({
              model,
              alpha: alpha[0],
              beta: beta[0]
            })
            setSaved(true)
            toast(
              <div>
                <div className='mb-1 flex flex-row items-center gap-2'>
                  <CheckCircledIcon />
                  <p className='text-base'>Configurations saved</p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='pl-6'>Model</TableHead>
                      <TableHead className='pl-6'>α</TableHead>
                      <TableHead className='pl-6'>β</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className='pl-6'>{model}</TableCell>
                      <TableCell className='pl-6'>{alpha}</TableCell>
                      <TableCell className='pl-6'>{beta}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )
          }}
          className='mt-10 w-full drop-shadow'>
          {saved ? (
            <p className='flex flex-row items-center gap-1'>
              Saved
              <CheckIcon />
            </p>
          ) : (
            <p className='transition-all duration-500 group-hover:scale-110'>Save</p>
          )}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
export { SettingMenu as Setting }
