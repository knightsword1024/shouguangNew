import { getDynamicmenu } from '@/services/dynamicMenu';

export default {
  namespace: 'dynamicmenu',

  state: {
    menuData: [],
  },

  effects: {
    *getDynamicmenu({ payload }, { call, put }) {
      localStorage.setItem('menuNum', payload.value);
      const response = yield call(getDynamicmenu, payload);
      yield put({
        type: 'getDynamicmenuSuccess',
        payload: response,
      });
    },
  },

  reducers: {
    getDynamicmenuSuccess(state, action) {
      return {
        ...state,
        menuData: action.payload.data,
      };
    },
  },
};
