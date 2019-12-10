import request from '@/utils/request';
import { stringify } from 'qs';

// 添加项目接口
export async function projectAdd(params) {
  return request('/iothub/add/project', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 删除项目接口
export async function projectDelete(params) {
  return request('/iothub/delete/project', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 查询全量项目
export async function FetchAllProject(params) {
  return request('/iothub/query/projectinfo', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 添加设备
export async function deviceAdd(params) {
  return request('/iothub/add/device', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 更改设备信息
export async function deviceChange(params) {
  return request('/iothub/update/deviceinfo', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 删除设备
export async function deviceDelete(params) {
  return request('/iothub/delete/device', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 查询设备管理界面表格数据
export async function dataFetch(params) {
  return request('/iothub/query/devlist', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 查询设备管理界面查询条件
export async function searchValueFetch(params) {
  return request('/iothub/query/devtyp', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 服务调用
export async function serviceCallFetch(params) {
  return request('/iothub/ctrl/device', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 获取位置分层信息
export async function locationFetch(params) {
  return request('/iothub/query/logiclocation', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 创建位置
export async function locationAdd(params) {
  return request('/iothub/add/logiclocation', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 删除位置
export async function locationDelete(params) {
  return request('/iothub/delete/logiclocation', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 获取全量报警信息
export async function alertFetch(params) {
  return request('/iothub/query/alarmrecord', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 获取全量报警类型
export async function alertTypeFetch(params) {
  return request('/iothub/query/eventtyp', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 改变报警状态
export async function alertStatusChange(params) {
  return request('/iothub/update/alarminfo', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 获取全量运行日志信息
export async function allRunningLogFetch(params) {
  return request('/iothub/query/eventrecord', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// //获取全量操作日志信息
// export async function allOperateLogFetch (params) {
//   return request('/iothub/query/eventrecord', {
//     method: 'POST',
//     data: {
//       ...params
//     }
//   })
// }

// 获取设备数据界面
export async function sensorDataFetch(params) {
  return request('/iothub/query/sensordata', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 设备调试面板
export async function deviceDebug(params) {
  return request('/iothub/debug/device', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
