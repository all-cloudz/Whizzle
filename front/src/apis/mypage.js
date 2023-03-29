import api from "./axiosInstance";

export const keepApi = async (params) => {
  try {
    const res = await api.get(`/api/keeps/whiskies/any`, { params: params });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const reviewApi = async (id, params) => {
  try {
    const res = await api.get(`/api/reviews/members/${id}/any`, { params: params });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};