import { fetchAllProduct } from '@/services/product';
const ProductModel = {
  namespace: 'product',
  state: {
    productData: [],
  },
  effects: {
    *fetchAllProduct({ payload }, { call, put }) {
      const response = yield call(fetchAllProduct, payload);
      yield put({
        type: 'allProduct',
        payload: response,
      });
      return response;
    },
  },
  reducers: {
    allProduct(state, { payload }) {
      return {
        ...state,
        productData: payload.data,
      };
    },
  },
};
export default ProductModel;
