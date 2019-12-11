import request from '@/utils/request';
import { sha256 } from 'js-sha256';

export async function fakeAccountLogin(params) {
  return request('/iothub/user/login', {
    method: 'POST',
    data: {
      ...params,
      passwd: sha256(params.passwd),
    },
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
