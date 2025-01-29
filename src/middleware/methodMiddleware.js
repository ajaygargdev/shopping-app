export const methodMiddleware = (req, res, next) => {
  const _method = req.query?._method;
  req.method = _method ? _method : req.method;
  next();
};
