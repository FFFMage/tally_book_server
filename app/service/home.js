'use strict';
const Service = require('egg').Service;

class HomeService extends Service {
  async user() {
    const { app } = this;
    const QUERY_STR = 'id, name';
    const sql = `select ${QUERY_STR} from list`;
    try {
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async addUser(name) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('list', { name });
      return result;
    } catch (error) {
      return error;
    }
  }

  async editUser(id, name) {
    const { app } = this;
    try {
      const result = await app.mysql.update('list', { name }, {
        where: {
          id,
        },
      });
      return result;
    } catch (error) {
      return error;
    }
  }

  async delUser(id) {
    try {
      const { app } = this;
      const result = await app.mysql.delete('list', { id });
      return result;
    } catch (error) {
      return error;
    }
  }
}

module.exports = HomeService;
