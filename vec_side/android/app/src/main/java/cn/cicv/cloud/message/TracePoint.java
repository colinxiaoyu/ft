package cn.cicv.cloud.message;

/**
 * @author Fai Lee
 * @since 2023-08-17
 */
public class TracePoint {

    private Long expLongitude;

    private Long expLatitude;

    private Integer expSpeed;

    private Integer expAcceleration;

    private Long expHeading;

    public TracePoint() {
    }

    public Long getExpLongitude() {
        return expLongitude;
    }

    public void setExpLongitude(Long expLongitude) {
        this.expLongitude = expLongitude;
    }

    public Long getExpLatitude() {
        return expLatitude;
    }

    public void setExpLatitude(Long expLatitude) {
        this.expLatitude = expLatitude;
    }

    public Integer getExpSpeed() {
        return expSpeed;
    }

    public void setExpSpeed(Integer expSpeed) {
        this.expSpeed = expSpeed;
    }

    public Integer getExpAcceleration() {
        return expAcceleration;
    }

    public void setExpAcceleration(Integer expAcceleration) {
        this.expAcceleration = expAcceleration;
    }

    public Long getExpHeading() {
        return expHeading;
    }

    public void setExpHeading(Long expHeading) {
        this.expHeading = expHeading;
    }
}
