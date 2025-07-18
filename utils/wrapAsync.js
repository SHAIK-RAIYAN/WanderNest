module.exports = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.error("🔥 ERROR in", fn.name, err);
      next(err);
    }
  };
};
