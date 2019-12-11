import { stringify } from 'qs';
import request from '@/utils/request';

export async function getDynamicmenu(params) {
  return request('/DynamicMenu/getDynamicMenu', {
    method: 'POST',
    data: params,
  });
}
