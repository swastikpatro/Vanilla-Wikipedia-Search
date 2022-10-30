const debounce = (func, delay) => {
  let timeoutID;
  return function (...args) {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export default debounce;
