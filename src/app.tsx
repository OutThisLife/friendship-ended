import * as React from 'react'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  canvas {
    z-index: 1;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  form {
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
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

    const render = () => {
      if (!('im' in state)) {
        const im = new Image()

        im.onload = setBG
        im.src = require('./tmpl.jpg')

        Object.assign(state, { im })
        return
      }

      setBG()

      const { cx, cy, r, width, height } = state.im

      ctx.save()
      ctx.scale(1, 1.7)

      const strokeGradient = ctx.createLinearGradient(0, 0, cv.width, 0)
      strokeGradient.addColorStop(0, 'blue')
      strokeGradient.addColorStop(1.0, 'red')

      ctx.strokeStyle = strokeGradient

      // MUDASIR
      {
        const x = cx + (width / 1.5) * r
        const y = (cy - 8 * r) / 1.7
        const s = 60 * r

        const gradient = ctx.createLinearGradient(x, y, x, y + s)
        gradient.addColorStop(0, '#C34E19')
        gradient.addColorStop(1, '#37AD1E')

        ctx.fillStyle = gradient
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'

        ctx.font = `${s}px impact`

        ctx.fillText('MUDASIR', x, y)
        ctx.strokeText('MUDASIR', x, y)
      }

      // SALMAN
      {
        const x = cx + (width / 2.2) * r
        const y = (cy + (height / 2.5) * r) / 1.7
        const s = 40 * r

        const gradient = ctx.createLinearGradient(x, y, y, y)
        gradient.addColorStop(0, '#0f0')
        gradient.addColorStop(1, '#00d')

        ctx.fillStyle = gradient
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'

        ctx.font = `${s}px impact`

        ctx.fillText('SALMAN', x, y)
        ctx.strokeText('SALMAN', x, y)
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
      <form>
        {vars.map(v => (
          <input key={v} type="text" name="meh" />
        ))}
      </form>
    </Wrapper>
  )
}
