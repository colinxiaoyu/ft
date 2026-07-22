import React, { Fragment, useState, useRef, useCallback, useEffect } from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet, PanResponder, Dimensions } from "react-native";
import { px } from "../utils/ScreenUtils";
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, runOnJS } from 'react-native-reanimated';

// 任务已完成 speed 拖动
const DragXViewSpeed = (props) => {

  const { showResult, children, handleSpeed, speed } = props;

  const translateX = useSharedValue(0);
  const minTranslateX = useSharedValue(0);
  const maxTranslateX = useSharedValue(0);


  useEffect(() => {
    if (speed === 1) {
      translateX.value = 0
    }
    if (speed) {
      translateX.value = speed / 10 * maxTranslateX.value
    }

  }, [speed])







  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;

    maxTranslateX.value = width;
    minTranslateX.value = width / 10;
  }

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      const newtranslateX = ctx.startX + event.translationX;

      translateX.value = Math.min(Math.max(newtranslateX, minTranslateX.value), maxTranslateX.value);
    },
    onEnd: () => {

      const result = translateX.value / maxTranslateX.value
      runOnJS(onResult)(result);

    },
  });

  function onResult (result) {

    console.log('result', result)

    const fixedResult = (Math.max(result * 10, 1)).toFixed(0)

    console.log('fixedResult', fixedResult)
    handleSpeed && handleSpeed(fixedResult)
  }


  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
      ],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value
    };
  });


  return (
    <GestureHandlerRootView style={styles.container}>
      <View
        style={styles.progressContainer}
        onLayout={handleLayout}
      >
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.marker, animatedStyle]}>
            {children || <View style={styles.markerImg} />}
          </Animated.View>
        </PanGestureHandler>
        <Animated.View style={[progressStyle, { backgroundColor: '#2D7EF8' }]} />
      </View>
      {showResult && <Text style={styles.textCon}><Text style={{ color: '#2D7EF8' }}>x{speed}</Text>/10</Text>}
    </GestureHandlerRootView>
  );
};

export default DragXViewSpeed;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    height: px(10),
    backgroundColor: '#A3BCDC',
    borderRadius: 10,
    flexDirection: 'row',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2D7EF8',
    borderRadius: px(10),
  },
  marker: {
    position: 'absolute',
    top: -px(13),
    left: -px(13),
    width: px(34),
    height: px(34),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  markerImg: {
    width: px(24),
    height: px(24),
    backgroundColor: '#fff',
    borderRadius: px(12),
    elevation: 2,
  },
  textCon: {
    marginLeft: px(22),
    fontSize: px(16),
  }
});
