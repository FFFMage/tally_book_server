'use strict';

const Service = require('egg').Service;

class BillService extends Service {
  // 添加账单
  async add(parmas) {
    const { app } = this;
    try {
      // 插入新账单数据到数据库中
      const result = await app.mysql.insert('bill', { ...parmas });
      return result;
    } catch (error) {
      return error;
    }

  }

  // 查看账单
  async list(id) {
    const { app } = this;
    // const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark';
    // const sql = `select ${QUERY_STR} from bill where user_id = ${id}`;
    try {
      const result = app.mysql.select('bill', { // 查询表
        where: { user_id: id }, // 查询过滤条件
        columns: [ 'id', 'pay_type', 'amount', 'date', 'type_id', 'type_name', 'remark' ], // 查询字段
        orders: [[ 'date', 'desc' ]], // 排序方式
      });
      return result;
    } catch (error) {
      return error;
    }
  }

  // 获取账单详情
  async detail(id, user_id) {
    const { app } = this;
    try {
      const result = app.mysql.get('bill', { id, user_id });
      return result;
    } catch (error) {
      return error;
    }
  }

  // 修改账单详情信息
  async update(parmas) {
    const { app } = this;
    try {
      const result = app.mysql.update('bill', {
        ...parmas,
      }, {
        id: parmas.id,
        user_id: parmas.user_id,
      });
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // 删除账单
  async delete(id, user_id) {
    const { app } = this;
    try {
      const result = app.mysql.delete('bill', { id, user_id });
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = BillService;
