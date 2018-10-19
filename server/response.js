exports.ok = (res, data) => {
  res.send({
    status: {code: 200, message: 'OK'},
    data,
  });
};
