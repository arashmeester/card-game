import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'
import { faMagnifyingGlass, faHeart as fasHeart, faTimes } from '@fortawesome/free-solid-svg-icons'

// This is important (prevents Nuxt from loading the CSS automatically)
config.autoAddCss = false

// Add icons to library
library.add(faMagnifyingGlass, fasHeart, farHeart, faTimes)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})