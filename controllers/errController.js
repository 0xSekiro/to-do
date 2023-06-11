module.exports = (err, req, res, next) => {
  res.status(err.status).json({
    status: "fail",
    message: err.message,
  });
};
