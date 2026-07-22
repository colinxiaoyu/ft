package cn.cicv.cloud.utils;


import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * @author Fai Lee
 * @since 2023-08-29
 */
public class UnitConvertUtil {

    public static Integer convertToInteger(int num) {
        return num;
    }

    public static Integer convertToInteger(double num) {
        return (int) num;
    }

    public static Integer convertToInteger(int num, int subtrahend) {
        return num - subtrahend;
    }

    public static Integer convertToInteger(double num, double multiplier) {
        return (int) (num * multiplier);
    }

    public static Integer convertToInteger(double num, double multiplier, int subtrahend) {
        return (int) ((num - subtrahend) * multiplier);
    }

    public static Long convertToLong(double num, int subtrahend) {
        return (long) (num - subtrahend);
    }

    public static Long convertToLong(double num, double multiplier) {
        return (long) (num * multiplier);
    }

    public static Long convertToLong(double num, double multiplier, int subtrahend) {
        return (long) ((num - subtrahend) * multiplier);
    }

    public static Double convertToDouble(long num, double multiplier, long subtrahend, int scale) {
        BigDecimal value = BigDecimal.valueOf(num)
                .multiply(BigDecimal.valueOf(multiplier))
                .subtract(BigDecimal.valueOf(subtrahend));
        return value.setScale(scale, RoundingMode.HALF_UP).doubleValue();
    }

    public static Double convertToDouble(long num, long subtrahend) {
        return (double) (num - subtrahend);
    }

    public static Double convertToDouble(long num, double multiplier, int scale) {
        BigDecimal value = BigDecimal.valueOf(num)
                .multiply(BigDecimal.valueOf(multiplier));
        return value.setScale(scale, RoundingMode.HALF_UP).doubleValue();
    }

}
