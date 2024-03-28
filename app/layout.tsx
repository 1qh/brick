import { auth } from 'auth'
import { Inter_Tight } from 'next/font/google'
import Script from 'next/script'
import { SessionProvider } from 'next-auth/react'

import { ThemeProvider } from '@/components/theme-provider'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import { Nav } from './nav'
import { Setting } from './setting'
import Translate from './translate'
import User from './user'

import '@/globals.css'

const inter = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata = {
  title: 'Brick AI',
  description: '',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`font-sans ${inter.variable}`}>
        <Script src='/translate.js' strategy='beforeInteractive' />
        <Script
          src='//translate.google.com/translate_a/element.js?cb=TranslateInit'
          strategy='afterInteractive'
        />
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <TooltipProvider delayDuration={0}>
            <SessionProvider session={await auth()}>
              <div className='flex w-screen flex-row'>
                <div className='flex flex-col justify-between border-r py-2'>
                  <div className='grid gap-2 px-2'>
                    <Nav />
                  </div>
                  <div className='grid gap-2.5 px-2'>
                    <Setting />
                    <ThemeSwitcher />
                    <User />
                    <Translate />
                  </div>
                </div>
                <div className='w-full'>{children}</div>
              </div>
            </SessionProvider>
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
