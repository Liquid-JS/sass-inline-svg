import { readFileSync } from 'fs'
import { join } from 'path'
import { suite, test } from '@testdeck/mocha'
import { expect } from 'chai'
import { compileString } from 'sass'
import svgToTinyDataUri from 'mini-svg-data-uri'
import { inliner } from './inliner.js'
import { cleanNewLines } from './utils.js'

const fixturesPath = join(import.meta.dirname, '../test/fixtures')

@suite('Inliner')
export class IndexTest {
    @test('should inline svg image as base64')
    inlineAsBase64() {
        const result = compileString('.sass{background: svg("test.svg");}', {
            functions: {
                'svg($path, $selectors: null)': inliner(fixturesPath)
            }
        })

        const expectedResult = cleanNewLines(readFileSync(join(fixturesPath, 'test.svg'))).toString('base64')

        expect(result.css).to.equal(`.sass {
  background: 'url("data:image/svg+xml;base64,${expectedResult}")';
}`)
    }

    @test('should inline svg image as uri')
    inlineAsUri() {
        const result = compileString('.sass{background: svg("test.svg");}', {
            functions: {
                'svg($path, $selectors: null)': inliner(fixturesPath, {
                    encodingFormat: 'uri'
                })
            }
        })

        const expectedResult = svgToTinyDataUri(readFileSync(join(fixturesPath, 'test.svg')).toString('utf8'))

        expect(result.css).to.equal(`.sass {
  background: "url(\\"${expectedResult}\\")";
}`)
    }

    @test('should apply style to svg image')
    applyStyle() {
        const result = compileString('.sass{background: svg("path-optimized.svg", (path: (fill: #000)));}', {
            functions: {
                'svg($path, $selectors: null)': inliner(fixturesPath)
            }
        })

        const expectedResult = Buffer.from('<svg height="210" width="400"><path fill="#000" d="M150 0L75 200h150z"/></svg>\n', 'utf8').toString('base64')

        expect(result.css).to.equal(`.sass {
  background: 'url("data:image/svg+xml;base64,${expectedResult}")';
}`)
    }

    @test('should apply alpha value if set in the colour')
    applyStyleAlpha() {
        const result = compileString('.sass{background: svg("path-optimized.svg", (path: (fill: rgba(0,0,0,0.5))));}', {
            functions: {
                'svg($path, $selectors: null)': inliner(fixturesPath)
            }
        })

        const expectedResult = Buffer.from('<svg height="210" width="400"><path fill="rgba(0, 0, 0, 0.5)" d="M150 0L75 200h150z"/></svg>\n', 'utf8').toString('base64')

        expect(result.css).to.equal(`.sass {
  background: 'url("data:image/svg+xml;base64,${expectedResult}")';
}`)
    }

    @test('should optimize svg')
    optimizeSvg() {
        const result = compileString('.sass{background: svg("path.svg")}', {
            functions: {
                'svg($path, $selectors: null)': inliner(fixturesPath, {
                    optimize: true
                })
            }
        })

        const expectedResult = Buffer.from('<svg width="400" height="210"><path fill="red" d="M150 0 75 200h150Z"/></svg>', 'utf8').toString('base64')

        expect(result.css).to.equal(`.sass {
  background: 'url("data:image/svg+xml;base64,${expectedResult}")';
}`)
    }

    @test('should optimize svg with styling')
    optimizeSvgStyle() {
        const result = compileString('.sass{background: svg("path.svg", (path: (fill: #fff)))}', {
            functions: {
                'svg($path, $selectors: null)': inliner(fixturesPath, {
                    optimize: true
                })
            }
        })

        const expectedResult = Buffer.from('<svg width="400" height="210"><path fill="#fff" d="M150 0 75 200h150Z"/></svg>', 'utf8').toString('base64')

        expect(result.css).to.equal(`.sass {
  background: 'url("data:image/svg+xml;base64,${expectedResult}")';
}`)
    }
}
