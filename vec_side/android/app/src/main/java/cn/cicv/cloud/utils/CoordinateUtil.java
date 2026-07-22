package cn.cicv.cloud.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * 坐标系util
 *
 * @author magic
 * @datetime 2024/3/4
 */
public class CoordinateUtil {
    static Double x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    static Double PI = 3.1415926535897932384626;
    static Double a = 6378245.0;
    static Double ee = 0.00669342162296594323;


    public static void main(String[] args) {
        // 经度
        double lon = 112.877171;
        // 纬度
        double lat = 28.229653;

        System.out.println(" = = >>> 百度坐标 转 火星坐标" + bd09togcj02(lon, lat));
        System.out.println(" = = >>> 火星坐标 转 百度坐标" + gcj02tobd09(lon, lat));
        System.out.println(" = = >>> 地球坐标 转 火星坐标" + wgs84togcj02(lon, lat));
        System.out.println(" = = >>> 火星坐标 转 地球坐标" + gcj02towgs84(lon, lat));
    }

    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     *
     * @param lon
     * @param lat
     * @returns
     */
    public static List<Double> bd09togcj02(double lon, double lat) {
        List<Double> list = new ArrayList<>();
        double xPi = 3.14159265358979324 * 3000.0 / 180.0;
        double x = lon - 0.0065;
        double y = lat - 0.006;
        double z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPi);
        double theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPi);
        double ggLng = z * Math.cos(theta);
        double ggLat = z * Math.sin(theta);
        list.add(ggLng);
        list.add(ggLat);
        return list;
    }

    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     *
     * @param lon
     * @param lat
     * @returns {*[]}
     */
    public static List<Double> gcj02tobd09(double lon, double lat) {
        List<Double> list = new ArrayList<>();
        double z = Math.sqrt(lon * lon + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
        double theta = Math.atan2(lat, lon) + 0.000003 * Math.cos(lon * x_PI);
        double bdLng = z * Math.cos(theta) + 0.0065;
        double bdLat = z * Math.sin(theta) + 0.006;
        list.add(bdLng);
        list.add(bdLat);
        return list;
    }

    /**
     * 地球坐标系（WGS84） 转 火星坐标系（GCj02）
     *
     * @param lon
     * @param lat
     */
    public static List<Double> wgs84togcj02(double lon, double lat) {
        List<Double> list = new ArrayList<>();
        if (outOfChina(lon, lat)) {
            list.add(lon);
            list.add(lat);
            return list;
        } else {
            double dlat = transformlat(lon - 105.0, lat - 35.0);
            double dlng = transformlng(lon - 105.0, lat - 35.0);
            double radlat = lat / 180.0 * PI;
            double magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            double sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            double mglat = lat + dlat;
            double mglng = lon + dlng;
            list.add(mglng);
            list.add(mglat);
            return list;
        }
    }

    /**
     * 火星坐标系（GCj02） 转 地球坐标系（WGS84）
     *
     * @param lon
     * @param lat
     * @return
     */
    public static List<Double> gcj02towgs84(double lon, double lat) {
        List<Double> list = new ArrayList<>();
        if (outOfChina(lon, lat)) {
            list.add(lon);
            list.add(lat);
            return list;
        } else {
            double dlat = transformlat(lon - 105.0, lat - 35.0);
            double dlng = transformlng(lon - 105.0, lat - 35.0);
            double radlat = lat / 180.0 * PI;
            double magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            double sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            double mglat = lat + dlat;
            double mglng = lon + dlng;
            list.add(lon * 2 - mglng);
            list.add(lat * 2 - mglat);
            return list;
        }
    }


    private static double transformlat(double lng, double lat) {
        double ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret;
    }

    private static double transformlng(double lng, double lat) {
        double ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret;
    }

    /**
     * 判断是否在国内, 不在国内则不做偏移
     *
     * @param lon
     * @param lat
     * @return
     */
    private static boolean outOfChina(double lon, double lat) {
        return (lon < 72.004 || lon > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
    }
}
