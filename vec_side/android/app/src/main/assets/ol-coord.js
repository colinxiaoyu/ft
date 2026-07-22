/**
 * 坐标转换 —— CoordinateUtil.java 的 JS 移植
 *
 * 背景：车端 TCP 上来的 WGS84 已由 MessageCodec.java 原生转成 GCJ-02，
 * HTTP 接口下发的路径/点位后端直接就是 GCJ-02。
 * 所以进入本页面的所有经纬度一律按 GCJ-02 处理。
 * 底图若是 WGS84 源（OSM/天地图），必须先 gcj02towgs84 再投影，否则整体偏移数百米。
 */
(function (global) {
  const PI = Math.PI;
  const A = 6378245.0; // 克拉索夫斯基椭球长半轴
  const EE = 0.00669342162296594323; // 偏心率平方

  // 边界必须与 CoordinateUtil.java 的 outOfChina 完全一致，
  // 否则同一个点在原生链路和本页面会得到不同的偏移处理
  function outOfChina(lng, lat) {
    return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
  }

  function transformLat(lng, lat) {
    let ret =
      -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
    return ret;
  }

  function transformLng(lng, lat) {
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
    return ret;
  }

  function offset(lng, lat) {
    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = (lat / 180.0) * PI;
    let magic = Math.sin(radLat);
    magic = 1 - EE * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / (((A * (1 - EE)) / (magic * sqrtMagic)) * PI);
    dLng = (dLng * 180.0) / ((A / sqrtMagic) * Math.cos(radLat) * PI);
    return [dLng, dLat];
  }

  function wgs84togcj02(lng, lat) {
    if (outOfChina(lng, lat)) return [lng, lat];
    const [dLng, dLat] = offset(lng, lat);
    return [lng + dLng, lat + dLat];
  }

  function gcj02towgs84(lng, lat) {
    if (outOfChina(lng, lat)) return [lng, lat];
    const [dLng, dLat] = offset(lng, lat);
    return [lng * 2 - (lng + dLng), lat * 2 - (lat + dLat)];
  }

  global.Coord = { wgs84togcj02, gcj02towgs84, outOfChina };
})(window);
