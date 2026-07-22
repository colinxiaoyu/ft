package cn.cicv.cloud.message;

/**
 * @author Fai Lee
 * @since 2023-08-13
 */
public class DoublePosition {

    private Double longitude;

    private Double latitude;

    private Double elevation;

    public DoublePosition() {
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getElevation() {
        return elevation;
    }

    public void setElevation(Double elevation) {
        this.elevation = elevation;
    }
}
