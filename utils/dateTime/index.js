const getISODateTimeString = timeUTC => {
  return new Date(`${timeUTC}`).toLocaleString();
};

export { getISODateTimeString };
