import tippy from 'tippy.js'
const TippyUtils = () => {
  tippy('#facebook', {
    content: 'Facebook',
    animation: 'fade',
    delay: [200, 200],
  })
  tippy('#instagram', {
    content: 'Instagram',
    animation: 'fade',
    delay: [200, 200],
  })
  tippy('#whatsapp', {
    content: 'Whatsapp',
    animation: 'fade',
    delay: [200, 200],
  })
  tippy('#twitter', {
    content: 'Twitter',
    animation: 'fade',
    delay: [200, 200],
  })
}

export default TippyUtils
