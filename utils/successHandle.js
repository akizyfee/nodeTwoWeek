const headers = require('./headers');
/**
 * 
 * @param {object} res response instance
 * @param {number} statusCode http code
 * @param {*} data 回傳資料
 * @param {string} message  錯誤提醒文字
 */

const successHandle = (res, statusCode = 200, data, message) => {
  res.writeHead(statusCode, headers);
  if (data) {
    res.write(
      JSON.stringify({
        status: 'success',
        data,
        message,
      })
    );
  }else {
    res.write(
      JSON.stringify({
        status: 'success',
        message,
      })
    );
  }
  res.end();
};

module.exports = successHandle;
