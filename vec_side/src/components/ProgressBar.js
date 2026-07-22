import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { px } from '../utils/ScreenUtils';

const ProgressBar = ({ progress = 0, showIcon = true, progressColor = '#2D7EF8' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View
          style={[styles.progressBar, { width: `${progress}%`, }, { backgroundColor: progressColor }]}
        />
        {progress > 0 && showIcon && (
          <View style={[styles.marker, { left: `${progress}%` }]} >
            <Image source={require('../assets/icon_process.png')} style={styles.markerImg} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  progressContainer: {
    width: '100%',
    height: px(10),
    backgroundColor: '#C1D2E9',
    borderRadius: 10,
    flexDirection: 'row',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2D7EF8',
    borderRadius: 10,
  },
  marker: {
    position: 'absolute',
    top: '50%',
    left: '0%',
    width: px(34),
    height: px(34),
    backgroundColor: '#fff',
    borderRadius: px(17),
    transform: [{ translateY: -px(17), }, { translateX: -px(17) }],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerImg: {
    width: px(24),
    height: px(24),
  }
});

export default ProgressBar;
