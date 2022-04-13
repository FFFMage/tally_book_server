'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  router.post('/api/user/register', controller.user.register); // 注册
  router.post('/api/user/login', controller.user.login); // 登录
  router.post('/api/user/get_userinfo', _jwt, controller.user.getUserInfo); // 获取用户信息
  router.post('/api/user/validate', _jwt, controller.user.validate); // 返回token信息
  router.post('/api/user/edit_userinfo', _jwt, controller.user.editUserInfo); // 修改用户信息
  router.post('/api/user/modify_password', _jwt, controller.user.modifyPassword); // 修改密码
  router.post('/api/upload', controller.upload.upload); // 上传图片
  router.post('/api/bill/add', _jwt, controller.bill.add); // 账单添加
  router.get('/api/bill/list', _jwt, controller.bill.list); // 获取账单列表
  router.get('/api/bill/detail', _jwt, controller.bill.detail); // 获取账单详情
  router.post('/api/bill/update', _jwt, controller.bill.update); // 修改账单详情
  router.post('/api/bill/delete', _jwt, controller.bill.delete); // 删除账单
  router.get('/api/bill/data', _jwt, controller.bill.data); // 获取账单数据
  router.get('/api/type/list', _jwt, controller.type.list); // 获取类型数据
};
