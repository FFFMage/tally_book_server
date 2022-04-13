'use strict';

module.exports = {
  // 成功响应
  success(res = null, msg = '请求成功', code, status) {
    this.ctx.body = {
      code,
      data: res,
      msg,
    };
    this.ctx.status = status;
  },
  // 失败响应
  fail(res = null, msg = '请求失败', code, status) {
    this.ctx.body = {
      code,
      data: res,
      msg,
    };
    this.ctx.status = status;
  },
};
