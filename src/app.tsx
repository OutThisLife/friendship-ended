import download from 'downloadjs'
import html2image from 'html-to-image'
import * as React from 'react'
import { useCallback, useRef } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  text-align: center;

  figure {
    position: relative;
    width: 70vw;
    height: 0px;
    padding-top: 76%;
    margin: auto;
    overflow: hidden;
    background: url(${require('./tmpl.jpg')}) center / cover no-repeat;

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
  const $wrapper = useRef<HTMLElement>(null)

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

      download(
        await html2image.toJpeg(el),
        `friendship-ended-${
          document.querySelector('[contenteditable]:first-of-type')?.textContent
        }`
      )

      $img.src = ''
    },
    [$wrapper]
  )

  return (
    <Wrapper ref={$wrapper}>
      <figure>
        <img id="output" />

        <figcaption>
          <Text
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
  size: number
  x?: string | number
  y?: string | number
  stops: { [key: number]: string }
}> = ({ children, size = 1, x = '50', y = '20%', stops = {} }) => {
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
          {...{ x, y }}>
          {children}
        </text>
      </svg>
    </span>
  )
}
