import Api from "../utils/Api";



// 站点列表  query 不详
const getCommonStationList = () => {
  return Api.get('/common/station-list')
};


// 货物名称列表
const getCommonGoodList = (query) => {
  return Api.get('/common/goods-list', query)
};


const getCommonConfigInfo = () => {
  return Api.get('/common/config-info')
};



export default {
  getCommonStationList, getCommonGoodList, getCommonConfigInfo
}
