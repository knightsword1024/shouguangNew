// 这里模仿后台返回的菜单数据
export default {
  'POST /DynamicMenu/getDynamicMenu': (req, res) => {
    if (req.body.value == 0) {
      res.send({
        data: [
          {
            path: '/homepage',
            name: '项目首页',
            icon: 'home',
            component: './homepage',
          },
          {
            path: '/projectConsumption',
            name: '项目统计',
            icon: 'ordered-list',
            component: './projectConsumption',
          },
          {
            path: '/productManage',
            name: '产品管理(!)',
            icon: 'radar-chart',
            component: './productManage',
          },
          {
            path: '/productManage/info/:id',
            name: '产品详情',
            component: './productManage/info',
            hideInMenu: true,
          },
          {
            path: '/alerts',
            name: '报警信息',
            icon: 'exclamation-circle',
            component: './alerts',
          },
          {
            path: '/debug',
            name: '调试面板',
            icon: 'exclamation-circle',
            component: './debug',
          },
          {
            component: '404',
          },
        ],
      });
      return;
    }
    if (req.body.value == 1) {
      res.send({
        data: [
          {
            path: '/devicemanage',
            name: '设备管理',
            icon: 'database',
            component: './devicemanage',
          },
          {
            path: '/operateLog',
            name: '操作日志(!)',
            icon: 'align-center',
            component: './operateLog',
          },
          {
            path: '/runningLog',
            name: '运行日志',
            icon: 'redo',
            component: './runningLog',
          },
          {
            path: '/locationManage',
            name: '位置管理',
            icon: 'environment',
            component: './locationManage',
          },
          {
            path: '/datastatistics/:id',
            name: '数据统计',
            component: './dataStatistics',
            hideInMenu: true,
          },
        ],
      });
    }
  },
  'POST /api/query/allPeople': (req, res) => {
    if (req.body.value == 1) {
      res.send({
        data: [
          {
            name: '王明远',
            id: '20190001',
            department: '文文',
            position: '职员',
            phoneNumber: '18769733025',
          },
        ],
      });
    }
  },
};
