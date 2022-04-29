const serverErrorSafe = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  }
  catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
      return;
    }
    console.log('Something went wrong!', error);
    res.status(500).send();
  }
};

export default serverErrorSafe;
