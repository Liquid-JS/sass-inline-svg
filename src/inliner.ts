import { readFileSync } from 'fs'
import { join } from 'path'
import { CustomFunction, SassMap, SassString, Value } from 'sass'
import { optimize } from 'svgo'
import { changeStyle, encode, EncodingFormat } from './utils.js'

export interface InlinerOptions {
    optimize: boolean
    encodingFormat: EncodingFormat
}

const defaultOptions: InlinerOptions = {
    optimize: false,
    encodingFormat: 'base64'
}

export function inliner(basePath: string, options?: Partial<InlinerOptions>): CustomFunction<'sync'> {
    const config = { ...defaultOptions, ...options }

    return (args: Value[]) => {
        const [path, selectors] = [args[0] as SassString, args[1] as SassMap | undefined]

        try {
            let content = readFileSync(join(basePath, path.text))

            if (selectors?.contents?.count())
                content = changeStyle(content, selectors)

            if (config.optimize)
                content = Buffer.from(optimize(content.toString('utf8')).data, 'utf8')

            return encode(content, config.encodingFormat)
        } catch (err) {
            console.error(err)
            throw err
        }
    }
}
