function TranslateInit() {
  const title = document.querySelector('title')
  title?.classList.add('notranslate')
  // @ts-ignore
  new google.translate.TranslateElement()
}
