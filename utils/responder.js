function httpRes(status, message, data) {
  return {
    status: status,
    message: message,
    result: data,
  };
}

module.exports = { httpRes };
