const wrapError = handler => async (req, res, next) => {
  try {
    return await handler(req, res, next);
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

module.exports = wrapError;
