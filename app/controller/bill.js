'use strict';

const moment = require('moment');
const Controller = require('egg').Controller;

class BillController extends Controller {
  // 新增
  async add() {
    const { ctx } = this;
    // 获取添加账单请求数据携带参数
    const { amount, pay_type, type_id, type_name, date, remark = '' } = ctx.request.body;
    // 判断参数是否为空
    if (!amount || !pay_type || !type_id || !type_name || !date) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
      return;
    }
    try {
      const token = ctx.request.header.authorization;
      const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
      if (!decode) return;
      // 添加账单 携带参数
      await ctx.service.bill.add({
        amount,
        pay_type,
        type_id,
        type_name,
        date,
        remark,
        user_id: decode.id,
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }

  // 账单列表
  async list() {
    const { ctx } = this;
    // 获取，日期 date，分页数据，类型 type_id，这些都是我们在前端传给后端的数据
    const { date, page = 1, page_size = 5, type_id = 'all' } = ctx.query;
    try {
      const token = ctx.request.header.authorization;
      const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
      if (!decode) return;
      // 获取用户账单数据
      const list = await ctx.service.bill.list(decode.id);
      // 过滤 月份和类型对应 账单
      const filter_list = list.filter(item => {
        if (type_id !== 'all') {
          return moment(item.date).format('YYYY-MM') === date && item.type_id === Number(type_id);
        }
        return moment(item.date).format('YYYY-MM') === date;
      });
      // 格式化数据
      const list_map = filter_list.reduce((pre, item) => {
        const date = moment(item.date).format('YYYY-MM-DD');
        // 如果 累加数组有数据 日期相同 加入同一个日期数组中
        if (pre && pre.length && pre.findIndex(item => item.date === date) > -1) {
          const index = pre.findIndex(item => item.date === date);
          pre[index].bills.push(item);
        }
        // 如果 累加数组有数据 日期没有相同 则创建新的一项
        if (pre && pre.length && pre.findIndex(item => item.date === date) === -1) {
          pre.push({
            date,
            bills: [ item ],
          });
        }
        // 如果 累加数组没有数据 则默认添加第一个账单项item
        if (!pre.length) {
          pre.push({
            date,
            bills: [ item ],
          });
        }
        return pre;
      }, []).sort((a, b) => moment(b.date) - moment(a.date)); // 时间顺序为倒叙
      // 分页处理
      const filter_list_map = list_map.slice((page - 1) * page_size, page * page_size);
      // 计算当月收入与支出
      // 首先获取当月所有账单
      const month_list = list.filter(item => moment(item.date).format('YYYY-MM') === date);
      // 累加支出
      const totalExpense = month_list.reduce((pre, item) => {
        if (item.pay_type === 1) {
          return pre + Number(item.amount);
        }
        return pre;
      }, 0);
      // 累加收入
      const totalIncome = month_list.reduce((pre, item) => {
        if (item.pay_type === 2) {
          return pre + Number(item.amount);
        }
        return pre;
      }, 0);

      // 返回数据
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          totalExpense,
          totalIncome,
          totalPage: Math.ceil(list_map.length / page_size),
          list: filter_list_map || [],
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

  // 账单详情获取
  async detail() {
    const { ctx } = this;
    // 获取账单id
    const { id = '' } = ctx.query;
    const token = ctx.request.header.authorization;
    const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
    if (!decode) return;
    if (!id) {
      ctx.body = {
        code: 500,
        msg: '账单id不能为空',
        data: null,
      };
      return;
    }
    try {
      const result = await ctx.service.bill.detail(id, decode.id);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: result,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }

  // 账单修改
  async update() {
    const { ctx } = this;
    // 获取修改账单参数
    const { id, amount, type_id, type_name, date, pay_type, remark } = ctx.request.body;
    const token = ctx.request.header.authorization;
    const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
    if (!decode) return;
    try {
      await ctx.service.bill.update({
        id,
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }

  // 账单删除
  async delete() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    const token = ctx.request.header.authorization;
    const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
    if (!decode) return;
    if (!id) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
      return;
    }
    try {
      await ctx.service.bill.delete(id, decode.id);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }

  // 数据处理
  async data() {
    const { ctx } = this;
    const { date } = ctx.query;
    const token = ctx.request.header.authorization;
    const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
    try {
      // 初始化 收入 支出排行数组
      const expense_rank = [];
      const income_rank = [];
      // 先获取用户账单列表
      const result = await ctx.service.bill.list(decode.id);
      // 过滤日期数据
      const start = moment(date).startOf('month');
      const end = moment(date).endOf('month');
      const filter_data = result.filter(item => {
        return moment(item.date) >= start && moment(item.date) <= end;
      });
      // 总支出
      const total_expense = filter_data.reduce((arr, cur) => {
        if (cur.pay_type === 1) {
          expense_rank.push(cur);
          arr += Number(cur.amount);
        }
        return arr;
      }, 0);
      // 总收入
      const total_income = filter_data.reduce((pre, item) => {
        if (item.pay_type === 2) {
          income_rank.push(item);
          return pre + Number(item.amount);
        }
        return pre;
      }, 0);
      // 收支构成
      const total_data = filter_data.reduce((pre, item) => {
        const index = pre.findIndex(pre_item => pre_item.type_id === item.type_id);
        if (index === -1) {
          pre.push({
            type_id: item.type_id,
            type_name: item.type_name,
            pay_type: item.pay_type,
            number: Number(item.amount),
          });
        }
        if (index > -1) {
          pre[index].number += Number(item.amount);
        }
        return pre;
      }, []);
      // 收支排行
      const expense_rank_data = expense_rank.sort((a, b) => b.amount - a.amount);
      const income_rank_data = income_rank.sort((a, b) => b.amount - a.amount);
      // 返回数据
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          total_expense,
          total_income,
          total_data,
          expense_rank_data,
          income_rank_data,
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '请求失败',
        data: null,
      };
    }
  }
}

module.exports = BillController;
