import Api from "../utils/Api";


/*
{
  "jobNo": "",
  "workNo": "",
  "vin": "",
  "goods": "",
  "startPointId": "",
  "endPointId": ""
}
*/
const postJobList = (query) => {
  return Api.post(`/job/list`, query)

}



// 取消
const postJobCancel = (id) => {
  return Api.post(`/job/${id}/cancel`,)
}

// 继续
const postJobContinue = (id) => {
  return Api.post(`/job/${id}/continue`,)
}


// 暂停
const postJobPause = (id) => {
  return Api.post(`/job/${id}/pause`,)
}

// 开始送货
const postJobStartDelivery = (id) => {
  return Api.post(`/job/${id}/start-delivery`)
}

// 卸货完成

const postJobUnload = (id) => {
  return Api.post(`/job/${id}/unloaded`)
}

/**
 {
  "goodsList": [
    {
      "goodsCode": "",
      "goodsMame": "",
      "startPointId": "",
      "startPointName": "",
      "endPointId": "",
      "endPointName": ""
    }
  ]
}
 */
const postJobCreate = (query) => {
  return Api.post(`/job/create`, query)
}

const getJobDetail = (id) => {
  return Api.get(`/job/${id}/detail`)
}

const getJobBeforeAfterList = (query) => {
  return Api.get(`/job/before-after-list`, query)
}






export default {
  postJobList,
  postJobCancel, postJobContinue, postJobPause, postJobStartDelivery, postJobUnload,
  postJobCreate, getJobDetail, getJobBeforeAfterList
}
