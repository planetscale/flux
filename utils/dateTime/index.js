const options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const getLocaleDateTimeString = timeUTC => {
  return new Date(`${timeUTC}`)
    .toLocaleDateString(process.env.language, options)
    .toLocaleLowerCase();
};

export { getLocaleDateTimeString };
