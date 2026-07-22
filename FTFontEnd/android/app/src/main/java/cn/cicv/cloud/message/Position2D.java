package cn.cicv.cloud.message;

/**
 * @author Fai Lee
 * @date 2023-08-13
 */
public class Position2D {

    private Long longitude;

    private Long latitude;

    public Position2D(Long longitude) {
        this.longitude = longitude;
    }

    public Long getLongitude() {
        return longitude;
    }

    public void setLongitude(Long longitude) {
        this.longitude = longitude;
    }

    public Long getLatitude() {
        return latitude;
    }

    public void setLatitude(Long latitude) {
        this.latitude = latitude;
    }
}
