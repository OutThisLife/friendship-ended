import * as React from 'react'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  canvas {
    z-index: 0;
    position: relative;
    width: 100vw;
    height: 100vh;
  }

  img {
    opacity: 0;
    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    &::selection {
      background: none;
    }
  }

  form > div {
    z-index: 1;
    position: fixed;
    left: 0;
    right: calc(var(--cx) + 1em);
    mix-blend-mode: overlay;

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
      display: block;
      width: 100%;
      height: var(--tw);
      caret-color: #fff;
      color: transparent;
      font-size: calc(var(--tw) / 1.4);
      font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      border: 1px solid;
      border-width: 1px 2px;
      transform: scale(0.93, 1.7);
      transform-origin: 5% center;
      background: none;

      &:focus {
        outline: none;
        border-color: #0366d6;
        background: #0366d633;
      }
    }
  }
`

export default () => {
  const $wrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!($wrapper.current instanceof HTMLElement)) {
      return
    }

    const $img = $wrapper.current.querySelector('img') as HTMLImageElement
    const cv = $wrapper.current.querySelector('canvas') as HTMLCanvasElement
    const ctx = cv.getContext('2d') as CanvasRenderingContext2D

    const state: any = {
      params: new URLSearchParams(location.search)
    }

    const update = () => {
      ctx.clearRect(0, 0, cv.width, cv.height)

      cv.width = window.innerWidth
      cv.height = window.innerHeight

      const s = `?${state.params.toString()}`

      if (location.search !== s) {
        history.replaceState({}, document.title, `${location.origin}${s}`)
      }
    }

    const setBG = () => {
      const { im } = state

      const s = window.innerWidth < 1025 ? 1 : 1.2
      const r = Math.min(cv.width / im.width / s, cv.height / im.height / s)
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

      Object.assign(im, { s, r, cx, cy })
    }

    const saveImage = () => {
      const { cx, cy, r, width, height } = state.im
      const im = new Image()

      im.crossOrigin = 'anonymous'
      im.onload = () => {
        const tmp = document.createElement('canvas') as HTMLCanvasElement
        const tctx = tmp.getContext('2d') as CanvasRenderingContext2D

        tmp.width = width * r
        tmp.height = height * r

        tctx.drawImage(
          im,
          cx,
          cy,
          tmp.width,
          tmp.height,
          0,
          0,
          tmp.width,
          tmp.height
        )

        $img.src = tmp.toDataURL('image/jpeg', 0.5)
        $img.setAttribute('data-from', state.params.toString())
      }

      im.src = cv.toDataURL()
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
      try {
        const { params } = state

        ctx.font = `${s}px Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif`
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'

        const tw = ctx.measureText('M')
        const fillGradient = ctx.createLinearGradient(x, y, x, y + tw.width)
        const strokeGradient = ctx.createLinearGradient(x, y, x, y + tw.width)
        const thinStrokeGrad = ctx.createLinearGradient(x, y, x, y + tw.width)

        const el = [].slice.call($wrapper.current.querySelectorAll('form div'))[
          i
        ] as HTMLElement
        const $input = el.firstElementChild as HTMLInputElement

        el.style.setProperty('--tx', `${x}px`)
        el.style.setProperty('--ty', `${y * 1.7}px`)
        el.style.setProperty('--tw', `${tw.width * 2}px`)

        const k = $input.name
        const v = $input.value.trim().toUpperCase()
        const vl = v.toLowerCase()

        if (!params.has(k) || params.get(k) !== vl) {
          params.set(k, vl)
        }

        return [
          { tw, fillGradient, strokeGradient },
          () => {
            {
              ctx.lineWidth = 3
              ctx.fillStyle = fillGradient
              ctx.strokeStyle = strokeGradient
              ctx.strokeText(v, x, y)
            }

            {
              ctx.lineWidth = 1
              ctx.strokeStyle = thinStrokeGrad

              thinStrokeGrad.addColorStop(0.8, '#1E3278ee')
              thinStrokeGrad.addColorStop(0.5, '#1E3278ee')

              ctx.strokeText(v, x, y)
            }

            ctx.fillText(v, x, y)
          }
        ]
      } catch (e) {
        console.warn(e)
        return [{}, () => null]
      }
    }

    const render = () => {
      setBG()

      const { params } = state
      const { cx, cy, r, width, height } = state.im

      if ($wrapper.current instanceof HTMLElement) {
        $wrapper.current.style.setProperty('--cx', `${cx}px`)
        $wrapper.current.style.setProperty('--cy', `${cy}px`)
        $wrapper.current.style.setProperty('--w', `${width}px`)
        $wrapper.current.style.setProperty('--h', `${height}px`)
      }

      ctx.save()
      ctx.scale(1, 1 + 0.7)

      // MUDASIR
      {
        const x = cx + (width / 1.49) * r
        const y = (cy - 6 * r) / 1.7
        const s = 52 * r

        if (x) {
          const [{ fillGradient, strokeGradient }, draw] = addText(0, x, y, s)

          if (fillGradient instanceof CanvasGradient) {
            fillGradient.addColorStop(0, '#C34E19')
            fillGradient.addColorStop(1, '#37AD1E')
          }

          if (strokeGradient instanceof CanvasGradient) {
            strokeGradient.addColorStop(0, '#3C225300')
            strokeGradient.addColorStop(0.5, '#3C225355')
            strokeGradient.addColorStop(0.8, '#1E327855')
            strokeGradient.addColorStop(1.0, '#1E3278')
          }

          draw()
        }
      }

      // SALMAN
      {
        const x = cx + (width / 2.2) * r
        const y = (cy + (height / 3.9) * r) / 1.7
        const s = 40 * r

        if (x) {
          const [{ fillGradient, strokeGradient }, draw] = addText(1, x, y, s)

          ctx.textAlign = 'center'

          if (fillGradient instanceof CanvasGradient) {
            fillGradient.addColorStop(0, '#AC6867')
            fillGradient.addColorStop(1, '#B74956')
          }

          if (strokeGradient instanceof CanvasGradient) {
            strokeGradient.addColorStop(0, '#3C2253')
            strokeGradient.addColorStop(0.5, '#3C225355')
            strokeGradient.addColorStop(0.8, '#1E327855')
            strokeGradient.addColorStop(1.0, '#1E3278')
          }

          draw()
        }
      }

      ctx.restore()
    }

    const loop = async () => {
      update()

      if (!('im' in state)) {
        const im = new Image()

        im.onload = setBG
        im.src = require('./tmpl.jpg')

        Object.assign(state, { im })
      } else {
        render()
      }

      raf = window.requestAnimationFrame(loop)
    }

    const $inputs = document.getElementsByTagName('input') as any

    for (const $input of $inputs) {
      if ($input instanceof HTMLInputElement) {
        if (state.params.has($input.name)) {
          $input.value = state.params.get($input.name)
        }

        $input.addEventListener(
          'keydown',
          e => /enter|escape/i.test(e.key) && $input.blur()
        )

        $input.addEventListener('blur', saveImage)
      }
    }

    let raf = window.requestAnimationFrame(loop)
    setTimeout(() => window.requestAnimationFrame(saveImage), 1e3)

    return () => {
      window.cancelAnimationFrame(raf)
    }
  }, [$wrapper])

  return (
    <Wrapper ref={$wrapper}>
      <img />
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
