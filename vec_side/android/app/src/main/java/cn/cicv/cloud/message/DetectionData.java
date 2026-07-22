package cn.cicv.cloud.message;

import java.util.List;
import java.util.Map;

/**
 * @author Fai Lee
 * @date 2023-08-17
 */
public class DetectionData {

    private String uuid;

    private Integer objId;

    private Short type;

    private Integer x;

    private Integer y;

    private Long heading;

    public DetectionData() {
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Integer getObjId() {
        return objId;
    }

    public void setObjId(Integer objId) {
        this.objId = objId;
    }

    public Short getType() {
        return type;
    }

    public void setType(Short type) {
        this.type = type;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public Long getHeading() {
        return heading;
    }

    public void setHeading(Long heading) {
        this.heading = heading;
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }
}
