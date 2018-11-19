exports.ok = (res, data, count) => {
  setTimeout(() => res.send({
    status: {code: 200, message: 'OK'},
    data,
    count
  }), delay());
};

function delay() {
  return Math.round(3000 * Math.random())
}
