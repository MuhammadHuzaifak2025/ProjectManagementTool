const ServerErrorMiddleWare = (req, res, next) => {
  const err = new Error("Not Found on server");
  err.statuscode = 404;
  next(err);
};
const ErrorHandlerMiddleWare = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error); // ✔️ Prevents duplicate response
  }

  res.status(error.statuscode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    errors: error.errors || [],
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined, 
  });
};

export { ErrorHandlerMiddleWare, ServerErrorMiddleWare };
