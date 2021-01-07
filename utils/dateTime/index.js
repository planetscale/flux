const options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const getLocaleDateTimeString = timeUTC => {
  return new Date(`${timeUTC}`).toLocaleDateString(navigator.language, options);
};

export { getLocaleDateTimeString };
