import { css } from '@emotion/react';

const theme = {
  sizes: {
    tablet: 900,
    phone: 750,
    maxWidth: '1170px',
  },

  colorMode: {
    light: {
      background1: '#fff',
      foreground1: '#000',
      accent: '#eee',
      accent2: '#ccc',
      link: '#007BC7',
      text: '#555',
      brightness: 'brightness(100%)',
      shadow1:
        '0px 0px 4px rgba(0, 0, 0, 0.04), 0px 4px 13px rgba(0, 0, 0, 0.08)',
    },
    dark: {
      background1: '#090909',
      foreground1: 'rgba(255, 255, 255, 0.9)',
      accent: '#1e1e1e',
      accent2: '#333',
      link: '#009AFA',
      text: '#ccc',
      brightness: 'brightness(85%)',
      shadow1:
        '0px 0px 4px rgba(0, 0, 0, 0.04), 0px 4px 13px rgba(0, 0, 0, 0.08)',
    },
  },
};

export const media = Object.keys(theme.sizes).reduce((accumulator, label) => {
  const emSize = theme.sizes[label] / 16;

  accumulator[label] = (...args) => css`
    @media (max-width: calc(${emSize}em)) {
      ${css(...args)};
    }
  `;
  return accumulator;
}, {});
