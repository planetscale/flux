const getLocaleDateTimeString = timeUTC => {
  return new Date(`${timeUTC}`).toLocaleString();
};

export { getLocaleDateTimeString };
