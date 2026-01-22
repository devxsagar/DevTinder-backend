const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      const err = new Error("Authentication token missing");
      err.statusCode = 401;
      throw err;
    }

    // Verity jwt token and extract id from token
    const decodeObj = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodeObj;

    const user = await User.findById(_id);

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    next(err)
  }
};

module.exports = {
  userAuth,
};
