'use server'

import type { Company, Mail, ProfileSuggest, Source } from '~/types'
import { env } from '~/env'

const get = async (path: string) => {
  const url = env.ENDPOINT + path
  console.log('GET |', url)
  const res = await fetch(url)
  return (await res.json()) as unknown
}
const getForm = async (path: string, form: Record<string, string>) =>
  get(path + new URLSearchParams(form).toString())

const getCompanies = async (
  prevState: {
    id: string
    data: Company[]
  },
  form: {
    query: string
    source: Source
    user: string
  }
) =>
  getForm('/company?', form) as Promise<{
    id: string
    data: Company[]
  }>

const url2keyword = async (
  prevState: [],
  form: {
    url: string
    user: string
  }
): Promise<string[]> => getForm('/url2keyword?', form) as Promise<string[]>

const file2keyword = async (prevState: [], form: FormData): Promise<string[]> => {
  const url = env.ENDPOINT + '/file2keyword'
  // const url = 'http://localhost:8000/file2keyword'
  console.log('POST |', url, form)
  const res = await fetch(url, {
    method: 'POST',
    body: form
  })
  return (await res.json()) as string[]
}
const url2profile = async (
  prevState: object,
  form: {
    url: string
    user: string
  }
): Promise<ProfileSuggest> => getForm('/url2profile?', form) as Promise<ProfileSuggest>

const file2profile = async (prevState: object, form: FormData): Promise<ProfileSuggest> => {
  const url = env.ENDPOINT + '/file2profile'
  console.log('POST |', url, form)
  const res = await fetch(url, {
    method: 'POST',
    body: form
  })
  return (await res.json()) as ProfileSuggest
}

const getEmployees = async (user: string, ids: string) =>
  get('/employee?ids=' + ids + '&user=' + user)

const getContact = async (user: string, id: string) => get('/contact?id=' + id + '&user=' + user)

const getHistory = async (user: string, id: string) => get('/history?id=' + id + '&user=' + user)

const genMail = async (input: Record<string, string>) =>
  get('/genmail?' + new URLSearchParams(input).toString()) as Promise<{ content: string }>

const sendEmails = async (form: Mail) => {
  console.log('POST |', form)

  // const url = process.env.ENDPOINT + '/mail'
  // console.log('POST |', url)
  // const res = await fetch(url, {
  // method: 'POST',
  // headers: {
  // 'Content-Type': 'application/json'
  // },
  // body: JSON.stringify(form)
  // })
  // return await res.json()

  await new Promise(resolve => setTimeout(resolve, 1000))
  return true
}

export {
  getCompanies,
  getContact,
  getEmployees,
  getHistory,
  sendEmails,
  url2keyword,
  file2keyword,
  url2profile,
  file2profile,
  genMail
}
