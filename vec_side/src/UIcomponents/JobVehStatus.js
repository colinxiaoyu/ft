import React from "react";
import { Text } from "react-native";
import { connect } from "react-redux";
import { px } from "../utils/ScreenUtils";


// 公用 任务状态
const JobVehStatus = (props) => {


  const { vinObj, vin, style } = props;


  const velocity = vinObj?.getIn([vin, 'velocity'])

  if (velocity === 0) {
    return <Text style={[style, { color: '#000', fontSize: px(22) }]}>停车</Text>
  } else if (velocity > 0) {
    return <Text style={[style, { color: '#13CE66', fontSize: px(22) }]}>行驶</Text>
  } else {
    return <Text style={[style, { color: '#000', fontSize: px(22) }]}>未知</Text>
  }

}


export default connect(({
  messageModal: { vinObj } }) => ({
    vinObj
  }))(JobVehStatus)