package cn.cicv.cloud.message;

/**
 * @author Fai Lee
 * @since 2023-08-13
 */
public class Position {

    private Long longitude;

    private Long latitude;

    private Long elevation;

    public Position() {
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

    public Long getElevation() {
        return elevation;
    }

    public void setElevation(Long elevation) {
        this.elevation = elevation;
    }
}
