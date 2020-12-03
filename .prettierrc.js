// These are the custom format overrides for https://prettier.io
module.exports = {
  // Single quotes over double is purely a cosmetic choice
  singleQuote: true,
  // For markdown files only, makes for better diffs and simpler writing experience
  proseWrap: 'never',
  // The default is 2, but there seems to be an issue that came up randomly where it a tab was 4 spaces.
  tabWidth: 2,
  // With prettier upgrade to v2, wrapping arrow params in parens is default value.  Disable for now, considering turning on later.
  arrowParens: 'avoid',
  trailingComma: "es5",
  semi: true,
  printWidth: 80
};
