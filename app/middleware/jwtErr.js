'use strict';

module.exports = secret => {
  return async (ctx, next) => {
    // 获取token令牌
    const token = ctx.request.header.authorization;
    // 如果没令牌则会返回null字符串
    if (token !== 'null' && token) {
      try {
        // 验证token令牌合法性
        await ctx.app.jwt.verify(token, secret);
        await next();
      } catch (error) {
        console.log('error', error);
        ctx.helper.success(null, 'token已过期，请重新登录', 401, 200);
        return;
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: 'token不存在',
      };
      return;
    }
  };
};
