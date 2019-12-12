import { queryProjectNotice } from '@/services/api';
import { queryAllProject } from '@/services/project';
export default {
  namespace: 'project',

  state: {
    notice: [],

    projectTotal: [],
  },

  effects: {
    *fetchNotice(_, { call, put }) {
      const response = yield call(queryProjectNotice);
      yield put({
        type: 'saveNotice',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchAllProject(_, { call, put }) {
      const response = yield call(queryAllProject);
      yield put({
        type: 'saveAllProject',
        payload: response,
      });
    },
  },

  reducers: {
    saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload,
      };
    },
    saveAllProject(state, response) {
      return {
        ...state,
        projectTotal: response.payload.data.projectinfo,
      };
    },
  },
};
