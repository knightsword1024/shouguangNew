import request from '@/utils/request';
import { stringify } from 'qs';

// 查询全量产品
export async function fetchAllProduct(params) {
  return request('/iothub/query/allproduct', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
