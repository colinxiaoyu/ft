package cn.cicv.cloud.message;

/**
 * @author Fai Lee
 * @date 2023-08-17
 */
public class TrajectoryInfo {

    private Position2D position;

    private Short posConfidence;

    private Integer speed;

    private Short speedConfidence;

    private Long heading;

    private Short headConfidence;

    public TrajectoryInfo() {
    }

    public Position2D getPosition() {
        return position;
    }

    public void setPosition(Position2D position) {
        this.position = position;
    }

    public Short getPosConfidence() {
        return posConfidence;
    }

    public void setPosConfidence(Short posConfidence) {
        this.posConfidence = posConfidence;
    }

    public Integer getSpeed() {
        return speed;
    }

    public void setSpeed(Integer speed) {
        this.speed = speed;
    }

    public Short getSpeedConfidence() {
        return speedConfidence;
    }

    public void setSpeedConfidence(Short speedConfidence) {
        this.speedConfidence = speedConfidence;
    }

    public Long getHeading() {
        return heading;
    }

    public void setHeading(Long heading) {
        this.heading = heading;
    }

    public Short getHeadConfidence() {
        return headConfidence;
    }

    public void setHeadConfidence(Short headConfidence) {
        this.headConfidence = headConfidence;
    }
}
