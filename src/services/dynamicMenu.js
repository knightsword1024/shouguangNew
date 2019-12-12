import { stringify } from 'qs';
import request from '@/utils/request';

export async function getDynamicmenu(params) {
  return request('/iothub/query/menu', {
    method: 'POST',
    data: params,
  });
}
