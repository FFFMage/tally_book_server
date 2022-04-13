'use strict';

const Controller = require('egg').Controller;

class TypeController extends Controller {
  async list() {
    const { ctx } = this;
    const token = ctx.request.header.authorization;
    const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
    if (!decode) return;
    try {
      const result = await ctx.service.type.list(0);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          result,
        },
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
}

module.exports = TypeController;
