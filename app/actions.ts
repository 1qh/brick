'use server'

export async function getCompanies(
  prevState: any,
  form: {
    query: string
    setting: string
    user: string
  }
) {
  const url: string =
    process.env.ENDPOINT +
    '/company?query=' +
    form.query +
    '&' +
    new URLSearchParams(JSON.parse(form.setting)).toString() +
    '&user=' +
    form.user

  console.log('GET |', url)

  return await (await fetch(url)).json()
}
