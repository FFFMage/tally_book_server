'use strict';

const Service = require('egg').Service;

class TypeService extends Service {
  async list(user_id) {
    const { app } = this;
    user_id = user_id ? user_id : 0;
    try {
      const result = await app.mysql.select('type', {
        where: { user_id },
        columns: [ 'id', 'name', 'type' ],
      });
      return result;
    } catch (error) {
      return error;
    }
  }
}

module.exports = TypeService;
