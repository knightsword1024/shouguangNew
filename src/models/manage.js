import {
  dataFetch,
  FetchAllProject,
  searchValueFetch,
  serviceCallFetch,
  locationFetch,
  deviceAdd,
  deviceDelete,
  projectAdd,
  alertFetch,
  alertTypeFetch,
  alertStatusChange,
  allRunningLogFetch,
  allOperateLogFetch,
  sensorDataFetch,
  locationAdd,
  locationDelete,
  deviceChange,
  projectDelete,
  deviceDebug,
} from '@/services/manage';
import router from 'umi/router';
import { stringify } from 'qs';

const ManageModel = {
  namespace: 'manage',
  state: {
    projectData: [],
    projectTotal: 0,

    manageData: [],
    devTotal: 0,
    typeData: [],
    typeValue: [],
    cmdValue: [],
    fetchLocationData: [],
    locationList: [],
    locationTotal: '',
    gateValue: [{ did: '', devname: '' }],

    aletTotal: '',
    alertValue: [],
    alertTypeValue: [],

    runningLogValue: [],
    runningLogTotal: '',

    operateValue: [],
    operateTotal: '',

    xValue: [],
    yValue: [],
    unitValue: '',
    dataTotal: '',

    debugValue: '',
  },
  effects: {
    *addProject({ payload }, { call, put }) {
      const response = yield call(projectAdd, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      return response;
    },
    *deleteProject({ payload }, { call, put }) {
      const response = yield call(projectDelete, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      return response;
    },
    *fetchAllProject({ payload }, { call, put }) {
      const response = yield call(FetchAllProject, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      yield put({
        type: 'allProject',
        payload: response,
      });
      return response;
    },
    *fetchAllDevices({ payload }, { call, put }) {
      const response = yield call(dataFetch, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      yield put({
        type: 'changeAllDevices',
        payload: response,
      });
      return response;
    },
    *fetchSearchValue({ payload }, { call, put }) {
      const response = yield call(searchValueFetch, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      if (response.code == 1000) {
        const value = response.data.devtyps;
        const devtyps = [];
        for (let i of value) {
          if (i.isgateway == '1') {
            devtyps.push(i.devtyp);
          }
        }
        if (devtyps.length != 0) {
          const sendvalue = { ...payload, devtyps: devtyps };
          const responsed = yield call(dataFetch, sendvalue);
          yield put({
            type: 'changeGateValue',
            payload: responsed,
          });
        } else {
          const value = [];
          yield put({
            type: 'deleteGateValue',
            payload: value,
          });
        }
      }
      yield put({
        type: 'changeSearchValue',
        payload: response,
      });
      return response;
    },
    *serviceCall({ payload }, { call, put }) {
      const response = yield call(serviceCallFetch, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      return response;
    },
    *fetchlocations({ payload }, { call, put }) {
      const response = yield call(locationFetch, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      yield put({
        type: 'changelocation',
        payload: response,
      });
      return response;
    },
    *addlocations({ payload }, { call, put }) {
      const response = yield call(locationAdd, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      return response;
    },
    *deletelocations({ payload }, { call, put }) {
      const response = yield call(locationDelete, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      return response;
    },
    *addDevice({ payload }, { call, put }) {
      const response = yield call(deviceAdd, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      return response;
    },
    *changeDevice({ payload }, { call, put }) {
      const response = yield call(deviceChange, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      return response;
    },
    *deleteDevice({ payload }, { call, put }) {
      const response = yield call(deviceDelete, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      return response;
    },
    *fetchAllAlert({ payload }, { call, put }) {
      const response = yield call(alertFetch, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      yield put({
        type: 'changeAlertValue',
        payload: response,
      });
      return response;
    },

    *fetchAllAlertType({ payload }, { call, put }) {
      const response = yield call(alertTypeFetch, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      yield put({
        type: 'changeAlertTypeValue',
        payload: response,
      });
      return response;
    },

    *changeAlertStatus({ payload }, { call, put }) {
      const response = yield call(alertStatusChange, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      return response;
    },

    *fetchAllRunningLog({ payload }, { call, put }) {
      const response = yield call(allRunningLogFetch, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      yield put({
        type: 'changeRunningLog',
        payload: response,
      });
      return response;
    },
    *fetchAllOperateLog({ payload }, { call, put }) {
      const response = yield call(allOperateLogFetch, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      yield put({
        type: 'changeOperateLog',
        payload: response,
      });
      return response;
    },
    *fetchSensorData({ payload }, { call, put }) {
      const response = yield call(sensorDataFetch, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      yield put({
        type: 'changeSensorData',
        payload: response,
      });
      return response;
    },
    *debugDevice({ payload }, { call, put }) {
      const response = yield call(deviceDebug, payload);
      if (response.code == 5039) {
        router.push(`/user/login`);
      }
      yield put({
        type: 'changeDebugValue',
        payload: response,
      });
      return response;
    },
  },
  reducers: {
    allProject(state, { payload }) {
      var total = 0;
      for (let i in payload.data) {
        total = total + 1;
      }
      return {
        ...state,
        projectData: payload.data.projectinfo,
        projectTotal: total,
      };
    },
    changeAllDevices(state, { payload }) {
      return {
        ...state,
        manageData: payload.data.devs,
        devTotal: payload.data.totalnum,
      };
    },
    changeSearchValue(state, { payload }) {
      var value1 = [];
      var value2 = [];
      for (let i of payload.data.devtyps) {
        value1.push({ value: i.name, key: i.devtyp });
      }
      for (let i of payload.data.devtyps) {
        value2.push({ key: i.devtyp, value: i.isctrl });
      }
      return {
        ...state,
        typeData: payload.data.devtyps,
        typeValue: value1,
        cmdValue: value2,
      };
    },
    changelocation(state, { payload }) {
      const value = payload.data.locations;
      const list = [];
      for (let i of value) {
        if (i.locations.length != 0) {
          for (let x of i.locations) {
            if (x.locations.length != 0) {
              for (let y of x.locations) {
                list.push({
                  locationid: y.locationid,
                  location1: i.name,
                  location2: x.name,
                  location3: y.name,
                });
              }
            } else {
              list.push({
                locationid: x.locationid,
                location1: i.name,
                location2: x.name,
              });
            }
          }
        } else {
          list.push({
            locationid: i.locationid,
            location1: i.name,
          });
        }
      }
      return {
        ...state,
        fetchLocationData: payload.data.locations,
        locationList: list,
        // locationTotal
      };
    },
    changeGateValue(state, { payload }) {
      var value = [];
      for (let i of payload.data.devs) {
        value.push({ devname: i.devname, did: i.did });
      }
      return {
        ...state,
        gateValue: value,
      };
    },
    changeAlertValue(state, { payload }) {
      return {
        ...state,
        alertValue: payload.data.alarmrecords,
        aletTotal: payload.data.totalnum,
      };
    },
    changeAlertTypeValue(state, { payload }) {
      return {
        ...state,
        alertTypeValue: payload.data.eventtyps,
      };
    },
    changeRunningLog(state, { payload }) {
      return {
        ...state,
        runningLogValue: payload.data.eventrecords,
        runningLogTotal: payload.data.totalnum,
      };
    },
    changeOperateLog(state, { payload }) {
      return {
        ...state,
        operateValue: payload.data.eventrecords,
        operateTotal: payload.data.totalnum,
      };
    },
    changeSensorData(state, { payload }) {
      const value = payload.data.sensordatas;
      var x = [];
      var y = [];
      value.map(({ createtime, val }) => {
        x.push(createtime);
        y.push(val);
      });
      return {
        ...state,
        xValue: x,
        yValue: y,
        unitValue: payload.data.unit,
        dataTotal: payload.data.totalnum,
      };
    },
    changeDebugValue(state, { payload }) {
      return {
        ...state,
        debugValue: payload.data.ret,
      };
    },
    deleteGateValue(state, { payload }) {
      return {
        ...state,
        gateValue: payload,
      };
    },
  },
};
export default ManageModel;
