import { selectAll, selectOne } from 'css-select'
import render from 'dom-serializer'
import type { Element, Node } from 'domhandler'
import { parseDocument } from 'htmlparser2'
import svgToTinyDataUri from 'mini-svg-data-uri'
import { SassMap, SassString } from 'sass'

export type EncodingFormat = 'base64' | 'uri'

export function encode(content: Buffer, format: EncodingFormat) {
    content = cleanNewLines(content)
    switch (format) {
        case 'uri':
            return new SassString(`url("${svgToTinyDataUri(content.toString('utf8'))}")`)

        case 'base64':
            return new SassString(`url("data:image/svg+xml;base64,${content.toString('base64')}")`)

        default:
            throw new Error(`encodingFormat ${format} is not supported`)
    }
}

export function cleanNewLines(content: Buffer) {
    return Buffer.from(content.toString('utf8').replace(/[\r\n]+/g, '\n'), 'utf8')
}

export function changeStyle(source: Buffer, selectors: SassMap) {
    const dom = parseDocument(source.toString('utf8'), {
        xmlMode: true
    })
    const svg = dom ? selectOne<Node, Element>('svg', dom) : null

    if (!svg) {
        throw Error('Invalid svg file')
    }

    const parsedSelectors = mapToObj(selectors)

    Object.entries(parsedSelectors).forEach(([selector, value]) => {
        const elements = selectAll<Node, Element>(selector, svg)

        elements.forEach((element) => {
            Object.assign(element.attribs, value)
        })
    })

    return Buffer.from(render(dom), 'utf8')
}

interface JSSassMap {
    [key: string]: string | JSSassMap
}

function mapToObj(map: SassMap) {
    const obj: JSSassMap = {}

    map.contents.forEach((value, key) => {
        const k = key.toString()
        if (value instanceof SassMap) {
            obj[k] = mapToObj(value)
            return
        }

        obj[k] = value.toString()
    })

    return obj
}
