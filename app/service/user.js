'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  // 获取用户信息
  async getUserByName(username) {
    const { app } = this;
    try {
      const result = await app.mysql.get('user', { username });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 注册
  async register(params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('user', params);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // 修改数据
  async editUserInfo(params) {
    const { app } = this;
    try {
      const result = await app.mysql.update('user', {
        ...params,
      }, {
        id: params.id,
      });
      return result;
    } catch (error) {
      return error;
    }
  }

  // 修改密码
  async modifyPassword(params) {
    const { app } = this;
    try {
      const result = app.mysql.update('user', {
        password: params.newpass,
      }, {
        where: { id: params.id },
      });
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = UserService;
