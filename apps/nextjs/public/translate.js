// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TranslateInit() {
  const title = document.querySelector('title')
  title?.classList.add('notranslate')
  // @ts-expect-error: ok
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  new google.translate.TranslateElement()
}
