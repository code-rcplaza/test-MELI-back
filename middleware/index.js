const authorSignature = (req, res, next) => {
  req.author = {
    name: "Ricardo",
    lastname: "Plaza",
  };
  next();
};

const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found: ${req.originalUrl}`);
  next(error);
};

const handleError = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.statuCode = statusCode;
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "prod" ? "⛔" : err.stack,
  });
};

module.exports = {
  authorSignature,
  handleError,
  notFound,
};
