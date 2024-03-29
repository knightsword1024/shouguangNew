// import fetch from 'dva/fetch';
// import { notification } from 'antd';
// import router from 'umi/router';
// import hash from 'hash.js';
// import { isAntdPro } from './utils';

// const codeMessage = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// };

// const checkStatus = response => {
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   }
//   const errortext = codeMessage[response.status] || response.statusText;
//   notification.error({
//     message: `请求错误 ${response.status}: ${response.url}`,
//     description: errortext,
//   });
//   const error = new Error(errortext);
//   error.name = response.status;
//   error.response = response;
//   throw error;
// };

// const cachedSave = (response, hashcode) => {
//   /**
//    * Clone a response data and store it in sessionStorage
//    * Does not support data other than json, Cache only json
//    */
//   const contentType = response.headers.get('Content-Type');
//   if (contentType && contentType.match(/application\/json/i)) {
//     // All data is saved as text
//     response
//       .clone()
//       .text()
//       .then(content => {
//         sessionStorage.setItem(hashcode, content);
//         sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
//       });
//   }
//   return response;
// };

// /**
//  * Requests a URL, returning a promise.
//  *
//  * @param  {string} url       The URL we want to request
//  * @param  {object} [options] The options we want to pass to "fetch"
//  * @return {object}           An object containing either "data" or "err"
//  */
// export default function request(
//   url,
//   options = {
//     expirys: isAntdPro(),
//   }
// ) {
//   /**
//    * Produce fingerprints based on url and parameters
//    * Maybe url has the same parameters
//    */
//   const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
//   const hashcode = hash
//     .sha256()
//     .update(fingerprint)
//     .digest('hex');

//   const defaultOptions = {
//     credentials: 'include',
//   };
//   const newOptions = { ...defaultOptions, ...options };
//   if (
//     newOptions.method === 'POST' ||
//     newOptions.method === 'PUT' ||
//     newOptions.method === 'DELETE'
//   ) {
//     if (!(newOptions.body instanceof FormData)) {
//       newOptions.headers = {
//         Accept: 'application/json',
//         'Content-Type': 'application/json; charset=utf-8',
//         ...newOptions.headers,
//       };
//       newOptions.body = JSON.stringify(newOptions.body);
//     } else {
//       // newOptions.body is FormData
//       newOptions.headers = {
//         Accept: 'application/json',
//         ...newOptions.headers,
//       };
//     }
//   }

//   const expirys = options.expirys || 60;
//   // options.expirys !== false, return the cache,
//   if (options.expirys !== false) {
//     const cached = sessionStorage.getItem(hashcode);
//     const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
//     if (cached !== null && whenCached !== null) {
//       const age = (Date.now() - whenCached) / 1000;
//       if (age < expirys) {
//         const response = new Response(new Blob([cached]));
//         return response.json();
//       }
//       sessionStorage.removeItem(hashcode);
//       sessionStorage.removeItem(`${hashcode}:timestamp`);
//     }
//   }
//   return fetch(url, newOptions)
//     .then(checkStatus)
//     .then(response => cachedSave(response, hashcode))
//     .then(response => {
//       // DELETE and 204 do not return data by default
//       // using .json will report an error.
//       if (newOptions.method === 'DELETE' || response.status === 204) {
//         return response.text();
//       }
//       return response.json();
//     })
//     .catch(e => {
//       const status = e.name;
//       if (status === 401) {
//         // @HACK
//         /* eslint-disable no-underscore-dangle */
//         window.g_app._store.dispatch({
//           type: 'login/logout',
//         });
//         return;
//       }
//       // environment should not be used
//       if (status === 403) {
//         router.push('/exception/403');
//         return;
//       }
//       if (status <= 504 && status >= 500) {
//         router.push('/exception/500');
//         return;
//       }
//       if (status >= 404 && status < 422) {
//         router.push('/exception/404');
//       }
//     });
// }
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import requesUmi, { extend } from 'umi-request';
import { notification } from 'antd';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  // prefix: '',
  // timeout: 1000,
  // headers: {
  //   'Content-Type': 'multipart/form-data'
  // },
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
  let token = localStorage.getItem('token');
  if (token) {
    const data = {
      ...options.data,
      token: token,
    };
    return {
      url: url,
      options: { ...options, data: data },
    };
  } else {
    return {
      url: url,
      options: { ...options },
    };
  }
});

// response拦截器, 处理response
// request.interceptors.response.use((response, options) => {
//   let token = response.headers.get("token");
//   if (token) {
//     localStorage.setItem("token", token);
//   }
//   console.log(response)
//   return response;
// });

export default request;
