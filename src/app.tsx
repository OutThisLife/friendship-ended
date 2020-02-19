import download from 'downloadjs'
import html2image from 'html-to-image'
import * as React from 'react'
import { useCallback, useRef } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  text-align: center;

  figure {
    position: relative;
    width: 52vw;
    height: 0px;
    padding-top: 76%;
    margin: auto;
    overflow: hidden;
    background: url(${require('./tmpl.jpg')}) center / cover no-repeat;

    @media (max-width: 1200px) {
      width: 80vw;
    }

    > img {
      pointer-events: none;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      mix-blend-mode: darken;

      &[src='image'] + figcaption {
        opacity: 0;
      }
    }

    figcaption span {
      position: absolute;
      transform-origin: 0 0;

      &:first-of-type {
        top: 0;
        left: 67%;
        right: 0;
        transform: matrix(1, 0, 0, 2, 0, 0);
      }

      &:last-of-type {
        top: 27%;
        left: 43%;
        right: 11%;
        transform: translate(-50%, 0) matrix(1.1, 0, 0, 1.5, 0, 0);
      }
    }
  }

  > a {
    margin: 1em auto 0;
  }
`

export default () => {
  const $wrapper = useRef<HTMLDivElement>(null)

  const convert = useCallback(
    async e => {
      e.preventDefault()

      if (!($wrapper.current instanceof HTMLElement)) {
        return
      }

      const el = $wrapper.current.querySelector('figure') as HTMLElement
      const $img = document.getElementById('output') as HTMLImageElement

      el.style.backgroundImage = 'none'

      $img.src = await html2image.toJpeg(el, {
        quality: 0.4,
        backgroundColor: '#fff'
      })

      el.style.backgroundImage = ''

      download(await html2image.toJpeg(el), `friendship-ended`)

      $img.src = ''
    },
    [$wrapper]
  )

  React.useEffect(() => {
    if (!($wrapper.current instanceof HTMLElement)) {
      return
    }

    let t: number

    const init = new URLSearchParams(location.search)
    const params = new URLSearchParams()

    const k0 = document.querySelector('#meh') as SVGTextElement
    const k1 = document.querySelector('#bff') as SVGTextElement

    if (init.has('meh') && init.has('bff')) {
      k0.textContent = decodeURIComponent(init.get('meh') as string)
      k1.textContent = decodeURIComponent(init.get('bff') as string)
    }

    const watch = () => {
      params.set('meh', k0.textContent as string)
      params.set('bff', k1.textContent as string)

      const s = `?${params.toString()}`

      if (location.search !== s) {
        history.replaceState({}, document.title, `${location.origin}${s}`)
      }

      t = window.requestAnimationFrame(watch)
    }

    t = window.requestAnimationFrame(watch)

    return () => {
      window.cancelAnimationFrame(t)
    }
  }, [$wrapper])

  return (
    <Wrapper ref={$wrapper}>
      <figure>
        <img id="output" />

        <figcaption>
          <Text
            id="meh"
            size={85 / 4}
            x="2%"
            y="10%"
            stops={{
              80: '#c74e19',
              100: '#42b127'
            }}>
            mudasir
          </Text>

          <Text
            id="bff"
            size={58 / 5}
            y={6}
            stops={{
              90: '#AC6867',
              100: '#B74956'
            }}>
            salman
          </Text>
        </figcaption>
      </figure>

      <a href="#" onClick={convert}>
        save
      </a>
    </Wrapper>
  )
}

const Text: React.FC<{
  id: string
  size: number
  x?: string | number
  y?: string | number
  stops: { [key: number]: string }
}> = ({ children, id, size = 1, x = '50', y = '20%', stops = {} }) => {
  const ref = useRef<HTMLElement>(null)

  const onInput = useCallback(
    () =>
      ref.current instanceof HTMLElement &&
      !ref.current.textContent &&
      ((ref.current.querySelector('text') as SVGTextElement).textContent = '_'),
    [ref]
  )

  return (
    <span suppressContentEditableWarning contentEditable {...{ ref, onInput }}>
      <svg viewBox="0 0 100 75" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient
            id={`grad-${size}`}
            x1="0"
            x2="0"
            y1="100%"
            y2="0%"
            gradientUnits="userSpaceOnUse">
            {Object.entries(stops).map(([k, v]) => (
              <stop key={k + v} stopColor={v} offset={`${k}%`} />
            ))}
          </linearGradient>
        </defs>

        <text
          fill={`url(#grad-${size})`}
          stroke="#30115d"
          strokeWidth={Math.min(1, size / 20)}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          textAnchor={parseInt(x as string, 10) !== 50 ? 'left' : 'middle'}
          alignmentBaseline="central"
          dominantBaseline="central"
          fontFamily="Impact"
          fontSize={`${size}px`}
          style={{
            textTransform: 'uppercase',
            filter: 'blur(1px)',
            paintOrder: 'stroke fill'
          }}
          {...{ id, x, y }}>
          {children}
        </text>
      </svg>
    </span>
  )
}
