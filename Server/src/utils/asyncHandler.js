// بيلف أي controller async، وأي خطأ بيصير جواه بيروح للـ error handler
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};