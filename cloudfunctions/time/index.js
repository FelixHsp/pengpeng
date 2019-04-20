var rq = require('request-promise')
exports.main = (event, context) => {
  var res = rq('http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp').then(html => {
    return html;
  })
  console.log(event);
  return res
}