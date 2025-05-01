export const addition = (a, b) => {
  return a + b;
};

export const subtraction = (a, b) => {
  return a - b;
};

export const multiplication = (a, b) => {
  return parseFloat((a * b).toFixed(2));
};

export const division = (a, b) => {
  if (b === 0) return "Err";
  return parseFloat((a / b).toFixed(2));
};
