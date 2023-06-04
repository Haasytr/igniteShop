import { createStitches } from '@stitches/react'

export const { config, css, styled, globalCss, keyframes, getCssText, theme, createTheme } = createStitches({
  theme: {
    colors: {
      white: '#fff',

      gray900: "#121214",
      gray800: '#202024',
      gray700: '#c4c4cc',
      gray100: '#e1e1e6',

      green500: '#80875f',
      green300: '#00b37e',
    },

    fontSizes: {
      md: '1.125rem',
      lg: '1.25rem',
      xl: '1.5rem',
      xxl: '2rem',
    }
  }
})