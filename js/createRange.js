function createRange(endNo) {
  return Array.from({ length: endNo }, (_, i) => i + 1);
}

export default createRange;
