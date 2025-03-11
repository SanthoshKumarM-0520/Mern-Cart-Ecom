const JWT = require('jsonwebtoken')

const generateToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPRESS_TIME
  })
}

const sendToken = (user, statusCode, res) => {
  const token = generateToken(user._id)

  const cookieOptions = { expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000), httpOnly: true }

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions)

  res.status(statusCode).json({
    status: 'Success',
    token,
    user
  });
}

module.exports = sendToken;
