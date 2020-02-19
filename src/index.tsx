import * as React from 'react'
import { render } from 'react-dom'
import { createGlobalStyle } from 'styled-components'

import App from './app'

const GlobalStyles = createGlobalStyle`
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #fafafa;
  }

  a {
    color: #0000ee;
    font-family: monospace;
    letter-spacing: 0.03em;
  }
`

render(
  <>
    <GlobalStyles />
    <App />
  </>,
  document.getElementById('root')
)
