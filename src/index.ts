import { inliner } from './inliner.js'

export {
    inliner
}

export default {
    'svg($path, $selectors: null)': inliner('./', {}),
    'inline-svg($path, $selectors: null)': inliner('./', {})
}
