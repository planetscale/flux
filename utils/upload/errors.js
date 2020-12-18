function notValidError(message) {
  const error = new Error(message);

  // Code for Unprocessable Entry.
  error.code = '422';
  return error;
}

export { notValidError };
