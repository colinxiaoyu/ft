package cn.cicv.cloud.command;


import cn.cicv.cloud.message.Position2D;

import java.util.List;

/**
 * @author Fai Lee
 * @date 2024-03-06
 */
public class Path {

    private Integer pathId;

    private Short pointsNum;

    private List<Position2D> pointsPos;

    private Long pathLen;

    private Short pathNameLen;

    private String pathName;

    private Short pathType;

    public Path() {
    }

    public Integer getPathId() {
        return pathId;
    }

    public void setPathId(Integer pathId) {
        this.pathId = pathId;
    }

    public Short getPointsNum() {
        return pointsNum;
    }

    public void setPointsNum(Short pointsNum) {
        this.pointsNum = pointsNum;
    }

    public List<Position2D> getPointsPos() {
        return pointsPos;
    }

    public void setPointsPos(List<Position2D> pointsPos) {
        this.pointsPos = pointsPos;
    }

    public Long getPathLen() {
        return pathLen;
    }

    public void setPathLen(Long pathLen) {
        this.pathLen = pathLen;
    }

    public Short getPathNameLen() {
        return pathNameLen;
    }

    public void setPathNameLen(Short pathNameLen) {
        this.pathNameLen = pathNameLen;
    }

    public String getPathName() {
        return pathName;
    }

    public void setPathName(String pathName) {
        this.pathName = pathName;
    }

    public Short getPathType() {
        return pathType;
    }

    public void setPathType(Short pathType) {
        this.pathType = pathType;
    }
}
