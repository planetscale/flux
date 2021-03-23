import { css } from '@emotion/react';

const theme = {
  sizes: {
    tablet: 900,
    phone: 750,
    maxWidth: '90ch',
  },
};

export function initTheme() {
  if (getTheme() === null) {
    localStorage.setItem('theme', 'system');
  } else {
    setTheme(getTheme());
  }
}

export function getTheme() {
  return localStorage.getItem('theme');
}

export function setTheme(themeName) {
  localStorage.setItem('theme', themeName);
  const root = document.querySelector('html');

  if (themeName === 'system') {
    root.classList.toggle('dark', false);
    root.classList.toggle('light', false);
  } else if (themeName === 'dark') {
    root.classList.toggle('dark', true);
    root.classList.toggle('light', false);
  } else {
    root.classList.toggle('dark', false);
    root.classList.toggle('light', true);
  }
}

export const media = Object.keys(theme.sizes).reduce((accumulator, label) => {
  const emSize = theme.sizes[label] / 16;

  accumulator[label] = (...args) => css`
    @media (max-width: calc(${emSize}em)) {
      ${css(...args)};
    }
  `;
  return accumulator;
}, {});
