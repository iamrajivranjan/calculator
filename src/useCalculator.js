const useCalculator = () => {
  const addition = (a, b) => {
    return a + b;
  };

  const subtraction = (a, b) => {
    return a - b;
  };

  const multiplication = (a, b) => {
    return parseFloat((a * b).toFixed(2));
  };

  const division = (a, b) => {
    if (b === 0) return "Err";
    return parseFloat((a / b).toFixed(2));
  };

  return { addition, subtraction, multiplication, division };
};

export default useCalculator;
