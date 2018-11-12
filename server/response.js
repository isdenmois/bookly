exports.ok = (res, data, count) => {
  res.send({
    status: {code: 200, message: 'OK'},
    data,
    count
  });
};
