package cn.cicv.cloud.message;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.lang.reflect.Field;

/**
 * @author Fai Lee
 * @date 2023-08-10
 */
public abstract class V2CMessage {

    private Short identifier;

    private Long bodyLen;

    private Short type;

    private Short version;

    private Long timestamp;

    private Short controlContent;

    private String vehicleId;

    public Short getIdentifier() {
        return identifier;
    }

    public void setIdentifier(Short identifier) {
        this.identifier = identifier;
    }

    public Long getBodyLen() {
        return bodyLen;
    }

    public void setBodyLen(Long bodyLen) {
        this.bodyLen = bodyLen;
    }

    public Short getType() {
        return type;
    }

    public void setType(Short type) {
        this.type = type;
    }

    public Short getVersion() {
        return version;
    }

    public void setVersion(Short version) {
        this.version = version;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public Short getControlContent() {
        return controlContent;
    }

    public void setControlContent(Short controlContent) {
        this.controlContent = controlContent;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public WritableMap getWritableMap() {
        WritableMap map = Arguments.createMap();
        Class<?> currentClass = this.getClass();

        // 遍历当前类和父类的所有字段
        while (currentClass != null) {
            Field[] fields = currentClass.getDeclaredFields();

            for (Field field : fields) {
                try {
                    field.setAccessible(true);
                    Object value = field.get(this);
                    String fieldName = field.getName();

                    if (value instanceof String) {
                        map.putString(fieldName, (String) value);
                    } else if (value instanceof Integer) {
                        map.putInt(fieldName, (Integer) value);
                    } else if (value instanceof Short) {
                        map.putInt(fieldName, ((Short) value).intValue());
                    } else if (value instanceof Long) {
                        map.putDouble(fieldName, ((Long) value).doubleValue());
                    } else if (value instanceof Double) {
                        map.putDouble(fieldName, (Double) value);
                    } else if (value instanceof Boolean) {
                        map.putBoolean(fieldName, (Boolean) value);
                    } else {
                        System.out.println("Unrecognized field type: " + fieldName);
                    }
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }

            // 继续处理父类
            currentClass = currentClass.getSuperclass();
        }

//        Log.i("getWritableMap",map.toString());
        return map;
    }

}
