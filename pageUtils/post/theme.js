import { css } from '@emotion/react';

const theme = {
  sizes: {
    tablet: 900,
    phone: 750,
    maxWidth: '90ch',
  },

  colorMode: {
    light: {
      background: '#fff',
      foreground: '#000',
      accent: '#ccc',
      accent2: '#eee',
      accent3: '#f7f7f7',
      link: '#007BC7',
      text: 'rgb(60, 66, 87)',
      shadow:
        '0px 0px 4px rgba(0, 0, 0, 0.04), 0px 4px 13px rgba(0, 0, 0, 0.08)',
      highlight: '#c56a86',
    },
    dark: {
      background: '#131516',
      foreground: 'rgba(255, 255, 255, 0.9)',
      accent: '#666',
      accent2: '#1e1e1e',
      accent3: '#0c0c0c',
      link: '#009AFA',
      text: '#ccc',
      shadow:
        '0px 0px 4px rgba(0, 0, 0, 0.04), 0px 4px 13px rgba(0, 0, 0, 0.08)',
      highlight: '#c56a86',
    },
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
  let root = typeof document !== 'undefined' && document.documentElement;

  if (themeName === 'system') {
    root.style.removeProperty('--background');
    root.style.removeProperty('--foreground');
    root.style.removeProperty('--accent');
    root.style.removeProperty('--accent2');
    root.style.removeProperty('--accent3');
    root.style.removeProperty('--link');
    root.style.removeProperty('--text');
    root.style.removeProperty('--shadow');
    root.style.removeProperty('--highlight');
  } else {
    root.style.setProperty(
      '--background',
      theme.colorMode[themeName].background
    );
    root.style.setProperty(
      '--foreground',
      theme.colorMode[themeName].foreground
    );
    root.style.setProperty('--accent', theme.colorMode[themeName].accent);
    root.style.setProperty('--accent2', theme.colorMode[themeName].accent2);
    root.style.setProperty('--accent3', theme.colorMode[themeName].accent3);
    root.style.setProperty('--link', theme.colorMode[themeName].link);
    root.style.setProperty('--text', theme.colorMode[themeName].text);
    root.style.setProperty('--shadow', theme.colorMode[themeName].shadow);
    root.style.setProperty('--highlight', theme.colorMode[themeName].highlight);
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
