const headers = require('./headers');

/**
 * 錯誤處理
 * @param {object} res response instance
 * @param {number} statusCode http code
 * @param {string} errormessage 錯誤提醒文字
 */
const errorHandle = (res, statusCode=400, errormessage) => {
  res.writeHead(statusCode, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      errormessage
    })
  );
  res.end();
};

module.exports = errorHandle;
