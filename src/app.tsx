import * as React from 'react'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  canvas {
    z-index: 0;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  form > div {
    z-index: 1;
    position: fixed;
    left: 0;
    right: calc(var(--cx) + 1em);
    mix-blend-mode: luminosity;

    &:first-child {
      top: calc(var(--cy));
      left: calc(var(--tx) - 0.3em);
    }

    &:last-child {
      top: calc(var(--ty) + 0.3em);
      left: calc(var(--cx) + 1em);

      input {
        text-align: center;
        text-indent: -0.5em;
      }
    }

    input {
      user-select: none;
      display: block;
      width: 100%;
      height: var(--tw);
      caret-color: #fff;
      color: transparent;
      font-size: calc(var(--tw) / 1.4);
      font-family: Impact;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      border: 0;
      background: none;
      transform-origin: 5% center;
      transform: scale(0.93, 1.7);

      &:focus {
        outline: 2px dashed #fff;
        background: #ffffff22;
      }

      &::selection {
        color: transparent;
        background: #fff;
      }
    }
  }
`

export default () => {
  const $wrapper = useRef<HTMLDivElement>(null)
  const vars = ['meh', 'bff']

  useEffect(() => {
    if (!($wrapper.current instanceof HTMLElement)) {
      return
    }

    const cv = $wrapper.current.firstElementChild as HTMLCanvasElement
    const ctx = cv.getContext('2d') as CanvasRenderingContext2D
    const state: any = {}

    const update = () => {
      ctx.clearRect(0, 0, cv.width, cv.height)

      cv.width = window.innerWidth
      cv.height = window.innerHeight
    }

    const setBG = () => {
      const { im } = state

      const r = Math.min(cv.width / im.width / 1.2, cv.height / im.height / 1.2)
      const cx = (cv.width - im.width * r) / 2
      const cy = (cv.height - im.height * r) / 2

      ctx.drawImage(
        im,
        0,
        0,
        im.width,
        im.height,
        cx,
        cy,
        im.width * r,
        im.height * r
      )

      Object.assign(im, { r, cx, cy })
    }

    const addText = (
      i: number,
      x: number,
      y: number,
      s: number
    ): [
      {
        tw: TextMetrics
        fillGradient: CanvasGradient
        strokeGradient: CanvasGradient
      },
      () => void
    ] => {
      if (!($wrapper.current instanceof HTMLElement)) {
        return [{}, () => null]
      }

      ctx.font = `${s}px impact`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'

      const tw = ctx.measureText('M')
      const fillGradient = ctx.createLinearGradient(x, y, x, y + tw.width)
      const strokeGradient = ctx.createLinearGradient(x, y, x, y + tw.width)
      const thinStrokeGrad = ctx.createLinearGradient(x, y, x, y + tw.width)

      const el = [].slice.call($wrapper.current.querySelectorAll('form div'))[
        i
      ] as HTMLElement

      el.style.setProperty('--tx', `${x}px`)
      el.style.setProperty('--ty', `${y * 1.7}px`)
      el.style.setProperty('--tw', `${tw.width * 2}px`)

      const text = (el.firstElementChild as HTMLInputElement).value
        .trim()
        .toUpperCase()

      return [
        { tw, fillGradient, strokeGradient },
        () => {
          {
            ctx.lineWidth = 3
            ctx.fillStyle = fillGradient
            ctx.strokeStyle = strokeGradient
            ctx.strokeText(text, x, y)
          }

          {
            ctx.lineWidth = 1
            ctx.strokeStyle = thinStrokeGrad

            thinStrokeGrad.addColorStop(0.8, '#1E3278ee')
            thinStrokeGrad.addColorStop(0.5, '#1E3278ee')

            ctx.strokeText(text, x, y)
          }

          ctx.fillText(text, x, y)
        }
      ]
    }

    const render = () => {
      if (!('im' in state)) {
        const im = new Image()

        im.onload = setBG
        im.src = require('./tmpl.jpg')

        return Object.assign(state, { im })
      }

      const { cx, cy, r, width, height } = state.im

      if ($wrapper.current instanceof HTMLElement) {
        $wrapper.current.style.setProperty('--cx', `${cx}px`)
        $wrapper.current.style.setProperty('--cy', `${cy}px`)
        $wrapper.current.style.setProperty('--w', `${width}px`)
        $wrapper.current.style.setProperty('--h', `${height}px`)
      }

      setBG()

      ctx.save()
      ctx.scale(1, 1.7)

      // MUDASIR
      {
        const x = cx + (width / 1.49) * r
        const y = (cy - 6 * r) / 1.7
        const s = 52 * r

        const [{ fillGradient, strokeGradient }, draw] = addText(0, x, y, s)

        fillGradient.addColorStop(0, '#C34E19')
        fillGradient.addColorStop(1, '#37AD1E')

        strokeGradient.addColorStop(0, '#3C225300')
        strokeGradient.addColorStop(0.5, '#3C225355')
        strokeGradient.addColorStop(0.8, '#1E327855')
        strokeGradient.addColorStop(1.0, '#1E3278')

        draw()
      }

      // SALMAN
      {
        const x = cx + (width / 2.2) * r
        const y = (cy + (height / 3.9) * r) / 1.7
        const s = 40 * r

        const [{ fillGradient, strokeGradient }, draw] = addText(1, x, y, s)

        ctx.textAlign = 'center'
        fillGradient.addColorStop(0, '#AC6867')
        fillGradient.addColorStop(1, '#B74956')

        strokeGradient.addColorStop(0, '#3C2253')
        strokeGradient.addColorStop(0.5, '#3C225355')
        strokeGradient.addColorStop(0.8, '#1E327855')
        strokeGradient.addColorStop(1.0, '#1E3278')

        draw()
      }

      ctx.restore()
    }

    const loop = async () => {
      update()
      render()

      raf = window.requestAnimationFrame(loop)
    }

    let raf = window.requestAnimationFrame(loop)

    return () => {
      window.cancelAnimationFrame(raf)
    }
  }, [$wrapper])

  return (
    <Wrapper ref={$wrapper}>
      <canvas />

      <form method="post" action="#">
        <div>
          <input
            type="text"
            name="meh"
            defaultValue="mudasir"
            autoComplete="off"
            spellCheck="false"
            maxLength={8}
          />
        </div>

        <div>
          <input
            type="text"
            name="bff"
            defaultValue="salaman"
            autoComplete="off"
            spellCheck="false"
            maxLength={32}
          />
        </div>
      </form>
    </Wrapper>
  )
}
