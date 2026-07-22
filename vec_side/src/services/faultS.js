import Api from "../utils/Api";



// 故障列表  车辆故障状态 0：无故障；1：故障  query:{faultCode, status :0,1}
const postFaultlist = (query) => {
  return Api.post('/fault/list', query)
};

//修改故障
// {
//   "vehFaultDTO": {
//     "id": "",
//     "faultType": "",
//     "faultDesc": "",
//     "faultCode": "",
//     "status": 0,
//     "startTime": "",
//     "endTime": "",
//     "station": {
//       "lat": 0,
//       "lon": 0
//     },
//     "vin": "",
//     "deviceId": ""
//   }
// }
const putFaultId = (id, query) => {
  return Api.put(`/fault/${id}`)

}



// 根据id查询故障详情
const getFaultId = (id,) => {
  return Api.get(`/fault/${id}`,)
}


export default {
  postFaultlist, getFaultId, putFaultId
}
