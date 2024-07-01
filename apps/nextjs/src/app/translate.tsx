'use client'

import { useEffect, useState } from 'react'
import { GlobeIcon } from '@radix-ui/react-icons'
import { getCookie, setCookie } from 'cookies-next'

import { cn } from '@a/ui'
import { Button } from '@a/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@a/ui/dropdown-menu'

import Tutip from '~/components/tutip'

import '../../../../node_modules/flag-icons/css/flag-icons.min.css'

const iso639to3166: Record<string, string> = {
  aa: 'dj',
  af: 'za',
  ak: 'gh',
  sq: 'al',
  am: 'et',
  hy: 'am',
  az: 'az',
  bm: 'ml',
  be: 'by',
  bn: 'bd',
  bi: 'vu',
  bs: 'ba',
  bg: 'bg',
  my: 'mm',
  ca: 'ad',
  zh: 'cn',
  hr: 'hr',
  cs: 'cz',
  da: 'dk',
  dv: 'mv',
  nl: 'nl',
  dz: 'bt',
  en: 'gb',
  auto: 'gb',
  et: 'ee',
  fj: 'fj',
  fil: 'ph',
  fi: 'fi',
  fr: 'fr',
  gaa: 'gh',
  ka: 'ge',
  de: 'de',
  el: 'gr',
  gu: 'in',
  ht: 'ht',
  he: 'il',
  hi: 'in',
  ho: 'pg',
  hu: 'hu',
  is: 'is',
  ig: 'ng',
  id: 'id',
  ga: 'ie',
  it: 'it',
  ja: 'jp',
  kr: 'ne',
  kk: 'kz',
  km: 'kh',
  kmb: 'ao',
  rw: 'rw',
  kg: 'cg',
  ko: 'kr',
  kj: 'ao',
  ku: 'iq',
  ky: 'kg',
  lo: 'la',
  la: 'va',
  lv: 'lv',
  ln: 'cg',
  lt: 'lt',
  lu: 'cd',
  lb: 'lu',
  mk: 'mk',
  mg: 'mg',
  ms: 'my',
  mt: 'mt',
  mi: 'nz',
  mh: 'mh',
  mn: 'mn',
  mos: 'bf',
  ne: 'np',
  nd: 'zw',
  nso: 'za',
  no: 'no',
  nb: 'no',
  nn: 'no',
  ny: 'mw',
  pap: 'aw',
  ps: 'af',
  fa: 'ir',
  pl: 'pl',
  pt: 'pt',
  pa: 'in',
  qu: 'wh',
  ro: 'ro',
  rm: 'ch',
  rn: 'bi',
  ru: 'ru',
  sg: 'cf',
  sr: 'rs',
  srr: 'sn',
  sn: 'zw',
  si: 'lk',
  sk: 'sk',
  sl: 'si',
  so: 'so',
  snk: 'sn',
  nr: 'za',
  st: 'ls',
  es: 'es',
  ss: 'sz',
  sv: 'se',
  tl: 'ph',
  tg: 'tj',
  ta: 'lk',
  te: 'in',
  tet: 'tl',
  th: 'th',
  ti: 'er',
  tpi: 'pg',
  ts: 'za',
  tn: 'bw',
  tr: 'tr',
  tk: 'tm',
  uk: 'ua',
  umb: 'ao',
  ur: 'pk',
  uz: 'uz',
  ve: 'za',
  vi: 'vn',
  cy: 'gb',
  wo: 'sn',
  xh: 'za',
  zu: 'za'
}

const languages: Record<string, string> = {
  vi: 'Tiếng Việt',
  auto: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  hi: 'हिन्दी'
}

const GT = 'googtrans'

export default function Translate() {
  const [current, setCurrent] = useState('vi')

  useEffect(() => {
    const lang = getCookie(GT)
    if (lang) {
      const s = lang.split('/')
      if (s.length > 2 && s[2]) {
        setCurrent(s[2])
      }
    } else {
      setCookie(GT, '/auto/vi')
    }
  }, [])
  return (
    <DropdownMenu>
      <Tutip content='Languages' side='right'>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='group size-9 transition-all duration-300 *:transition-all *:duration-300 hover:scale-110 hover:drop-shadow-lg'>
            <span
              className={cn(
                `fi fis fi-${iso639to3166[current]}`,
                'scale-[2.25] rounded-full group-hover:scale-0'
              )}
            />
            <GlobeIcon className='absolute size-0 group-hover:size-8' />
          </Button>
        </DropdownMenuTrigger>
      </Tutip>
      <DropdownMenuContent
        onCloseAutoFocus={e => e.preventDefault()}
        className='mx-2 my-1 transition-all duration-300 hover:drop-shadow-xl'>
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={(value: string) => {
            setCurrent(value)
            setCookie(GT, '/auto/' + value)
            window.location.reload()
          }}>
          {Object.keys(languages).map(lang => (
            <DropdownMenuRadioItem className='notranslate group gap-3' key={lang} value={lang}>
              <span
                className={cn(
                  `fi fis fi-${iso639to3166[lang]}`,
                  'scale-125 rounded-full transition-all duration-500 group-hover:scale-150 group-hover:drop-shadow-lg'
                )}
              />
              {languages[lang]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
