/**
 * 屏幕适配工具类
 */

import { Dimensions, PixelRatio, } from 'react-native';

/* 设备宽度 */
export const width = Dimensions.get('window').width;

/* 设备高度 */
export const height = Dimensions.get('window').height;

/* dpr */
export const dpr = PixelRatio.get();

/**
 * 根据基准宽度计算实际像素
 * @param  {number} wd 设计像素
 * @return {number}       实际像素
 */
export const px = (wd) => {
  if (wd === 1) {
    return 1 / dpr;
  }

  return Math.floor((width / 1920) * wd);
};

