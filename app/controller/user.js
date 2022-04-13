'use strict';

const Controller = require('egg').Controller;
const defaultAvatar = '\\public\\upload\\20211112\\1636732352320.png';

class UserController extends Controller {
  // 注册
  async register() {
    const { ctx } = this;
    // 获取用户 用户名 密码
    const { username, password } = ctx.request.body;
    // 验证数据库内是否存在改账户名
    const userInfo = await ctx.service.user.getUserByName(username); // 获取用户信息
    // 调用service方法, 将数据存入数据库
    const result = await ctx.service.user.register({
      username,
      password,
      signature: '张明舟-203101940125',
      avatar: defaultAvatar,
    });
    // 判断用户名或密码是否为空
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: '账号密码不能为空',
        data: null,
      };
    }
    // 判断用户名是否存在
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账户名已被注册,请重新注册',
        data: null,
      };
      return;
    }
    // 判断注册是否成功
    if (result) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null,
      };
    }
  }

  // 登录
  async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    // 根据用户名查到数据库中对应用户信息
    const userInfo = await ctx.service.user.getUserByName(username);
    // 没找到表示没有用户
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账号不存在',
        data: null,
      };
      return;
    }

    // 生成token校验
    // app.jwt.sign 方法接受两个参数，第一个为对象，对象内是需要加密的内容配置；第二个是加密字符串
    const token = app.jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    }, app.config.jwt.secret);

    // 用户存在则判断密码是否正确
    if (userInfo) {
      if (password !== userInfo.password) {
        ctx.body = {
          code: 500,
          msg: '账号密码错误',
          data: null,
        };
      } else {
        ctx.body = {
          code: 200,
          msg: '登录成功',
          data: {
            token,
          },
        };
      }
      return;
    }
  }

  // 验证
  async validate() {
    const { ctx, app } = this;
    // 通过token解析, 拿到user_id
    const token = ctx.request.header.authorization;
    // 通过 app.jwt.verify + 加密字符串 解析出 token 的值
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    // 响应接口
    // ctx.body = {
    //   code: 200,
    //   msg: '获取成功',
    //   data: {
    //     ...decode,
    //   },
    // };
    ctx.helper.success({ ...decode }, '获取成功', 200, 200);
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx } = this;
    // 获取token令牌
    const token = ctx.request.header.authorization;
    const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
    // 从数据库 获取用户信息
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    // 将userInfo的数据返回给用户
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: {
        ...userInfo,
      },
    };
  }

  // 修改用户信息
  async editUserInfo() {
    const { ctx } = this;
    const { signature = '', avatar = '' } = ctx.request.body;
    const token = ctx.request.header.authorization;
    const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
    try {
      const userInfo = await ctx.service.user.getUserByName(decode.username);
      await ctx.service.user.editUserInfo({
        ...userInfo,
        signature,
        avatar,
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          ...userInfo,
          signature,
          avatar,
        },
      };
    } catch (error) {
      ctx.body = {
        code: 400,
        msg: '修改失败',
        data: error,
      };
    }
  }

  // 修改密码
  async modifyPassword() {
    const { ctx } = this;
    const { oldpass, newpass } = ctx.request.body;
    const token = ctx.request.header.authorization;
    const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
    if (!decode) return;
    try {
      const userInfo = await ctx.service.user.getUserByName(decode.username);
      if (userInfo.password !== oldpass) {
        ctx.body = {
          code: 400,
          msg: '原密码错误',
          data: null,
        };
      } else {
        await ctx.service.user.modifyPassword({
          id: decode.id,
          newpass,
        });
        ctx.body = {
          code: 200,
          msg: '修改成功',
          data: null,
        };
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
}

module.exports = UserController;
