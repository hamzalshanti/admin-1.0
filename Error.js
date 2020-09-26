class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const sendErrorDevelopment = (err, res) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = (err, res) => {
  if (err.statusCode === 404)
    res.render('errors/404', {
      layout: false,
    });
  else
    res.render('errors/500', {
      layout: false,
    });
};

module.exports = {
  AppError,
  catchAsync,
  sendErrorDevelopment,
  sendErrorProduction,
};
