import { inliner, InlinerOptions } from './inliner.js'
import { EncodingFormat } from './utils.js'

export { inliner, type EncodingFormat, type InlinerOptions }

export default {
    'svg($path, $selectors: null)': inliner('./', {}),
    'inline-svg($path, $selectors: null)': inliner('./', {})
}
