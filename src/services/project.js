import request from '@/utils/request';

// 获取页面数据
export async function queryAllProject() {
  return request('/iothub/query/projectinfo', {
    method: 'POST',
  });
}
