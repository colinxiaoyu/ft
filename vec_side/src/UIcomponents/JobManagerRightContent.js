import React, { useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { px } from "../utils/ScreenUtils";
import JobProcess from "./JobProcess";
import JobStaticesProcess from "./JobStaticesProcess";
import JobStaticesFinish from "./JobStaticesFinish";
import JobStaticesDispatch from "./JobStaticesDispatch";
import JobManagerRightContentWebView from "./JobManagerRightContentWebView";
import HomeWebView from "./HomeWebView";
import { connect } from "react-redux";


// 任务页 右侧的webview 悬浮的信息

const JobManagerRightContent = (props) => {

  const { data, vinObj, refreshCount } = props;


  const status = data.status

  const jobPath = useMemo(() => {
    return {
      [data.vin]: data
    }
  }, [data])

  const selectedVinObj = useMemo(() => {
    return vinObj?.filter((value, key) => key === data.vin)
  }, [vinObj, data])


  return <View style={styles.rightContent}>

    {status === 9 ? <JobManagerRightContentWebView isFollow={true} data={data} jobPath={jobPath} mapKey={data.id + '123'} /> :
      <HomeWebView data={selectedVinObj} mapKey={data.id}
        homeRefreshFalg={refreshCount}
        jobPath={jobPath} isFollow={true} />}
    {/* 任务进程 */}
    <View style={styles.jobProcess}>
      <JobProcess data={data} />
    </View>
    {/* 任务数据 */}
    {(status === 1 || status === 2) && <View style={styles.jobStatices}>
      <JobStaticesProcess data={data} selectedVinObj={selectedVinObj} />
    </View>}
    {/* 任务数据  人工驾驶 自动驾驶 */}
    {status === 9 && <View style={styles.jobStatices}>
      <JobStaticesFinish data={data} />
    </View>}
    {/* 任务数据  预计行驶里程 */}
    {(status === -2 || status === -1 || status === 0) && <View style={styles.jobStatices}>
      <JobStaticesDispatch data={data} />
    </View>}
  </View>
}



export default connect(({ messageModal: { vinObj }, configModal: { refreshCount }, }) => ({
  vinObj, refreshCount
}))(JobManagerRightContent);


const styles = StyleSheet.create({
  rightContent: {
    flex: 1,
    position: 'relative'
  },
  jobProcess: {
    width: px(391),
    height: px(322),
    position: 'absolute',
    top: px(20),
    left: px(20),
  },

  jobStatices: {
    width: px(411),
    position: 'absolute',
    top: px(20),
    right: px(20),
  },

  jobHistoryTrack: {
    position: 'absolute',
    bottom: px(40),
    left: px(20),
    width: px(967),
  }

})