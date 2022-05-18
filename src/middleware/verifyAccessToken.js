const verifyAccessToken = async (req, res, next) => {
  // Allows to user postman
  if (req.headers.session) {
    req.session.accessToken = req.headers.session;
  }
  const { accessToken } = req.session;

  if (accessToken) {
    next();
    return;
  }
  res.status(401).send({ message: `You are not authorized to make this request. Invalid access token.${accessToken}` });
};

export default verifyAccessToken;
