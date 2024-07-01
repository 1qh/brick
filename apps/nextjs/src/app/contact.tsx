import { useState } from 'react'
import {
  BackpackIcon,
  CheckCircledIcon,
  EnvelopeClosedIcon,
  EyeNoneIcon,
  EyeOpenIcon,
  InfoCircledIcon,
  MobileIcon,
  PersonIcon,
  SewingPinIcon
} from '@radix-ui/react-icons'

import { Button } from '@a/ui/button'
import { TableCell, TableRow } from '@a/ui/table'

import type { Employee } from '~/types'
import { TableBody } from '~/components/table'
import Tutip from '~/components/tutip'

interface ContactProps {
  employee: Employee
  className?: string
}

export default function Contact({ employee, className }: ContactProps) {
  const [hide, setHide] = useState(true)

  return (
    <TableBody className={className}>
      <TableRow>
        <TableCell className='flex items-center gap-1.5'>
          <div className='rounded-full bg-muted p-2'>
            <SewingPinIcon className='size-5' />
          </div>
          Location
        </TableCell>
        <TableCell>{employee.location}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className='flex items-center gap-1.5'>
          <Tutip content={employee.verified ? 'Email verified' : 'Email not verified'} side='right'>
            <div className='rounded-full bg-muted p-2'>
              <EnvelopeClosedIcon className='size-5' />
              <div className='absolute -mt-1.5 ml-4 rounded-full bg-background'>
                {employee.verified ? (
                  <CheckCircledIcon className='text-green-500' />
                ) : (
                  <InfoCircledIcon className='text-yellow-500' />
                )}
              </div>
            </div>
          </Tutip>
          Mail
        </TableCell>
        <TableCell className={hide ? 'select-none blur-sm' : ''}>{employee.mail}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className='flex items-center gap-1.5'>
          <Tutip content={employee.work ? 'Work number' : 'Personal number'} side='right'>
            <div className='rounded-full bg-muted p-2'>
              <MobileIcon className='size-5' />
              <div className='absolute -mt-1.5 ml-4 rounded-full bg-background p-px'>
                <BackpackIcon className={employee.work ? 'text-purple-500' : 'hidden'} />
                <PersonIcon className={employee.work ? 'hidden' : 'text-blue-500'} />
              </div>
            </div>
          </Tutip>
          Phone
        </TableCell>
        <TableCell className={hide ? 'select-none blur-sm' : ''}>{employee.phone}</TableCell>
      </TableRow>
      <div className='mt-5 w-full px-2'>
        <Button
          variant={hide ? 'default' : 'outline'}
          className='w-full gap-2 transition-all duration-500'
          onClick={() => setHide(!hide)}>
          <EyeOpenIcon className={hide ? 'hidden' : 'size-5'} />
          <EyeNoneIcon className={hide ? 'size-5' : 'hidden'} />
          <p className={hide ? 'hidden' : ''}>Hide Contact</p>
          <p className={hide ? '' : 'hidden'}>Show Contact</p>
        </Button>
      </div>
    </TableBody>
  )
}
