const verifyAccessToken = async (req, res, next) => {
  const { accessToken } = req.session;

  if (accessToken) {
    next();
    return;
  }
  res.status(401).send({ message: 'You are not authorized to make this request. Invalid access token.' });
};

export default verifyAccessToken;
