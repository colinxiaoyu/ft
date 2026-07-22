package cn.cicv.cloud.command;


import cn.cicv.cloud.message.Position2D;

import java.util.List;

/**
 * @author Fai Lee
 * @date 2024-05-25
 */
public class TaskJobCommand {

    private String uuid;

    private Long timestamp;

    private Integer alertType;

    private Long totalLen;

    private Position2D destLocation;

    private Long destHeading;

    private Integer pathNum;

    private Short destActionCodeLen;

    private String destActionCode;

    private Integer destActionValue;

    private Integer dataLen;

    private List<Path> pathList;

    public TaskJobCommand() {
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public Integer getAlertType() {
        return alertType;
    }

    public void setAlertType(Integer alertType) {
        this.alertType = alertType;
    }

    public Long getTotalLen() {
        return totalLen;
    }

    public void setTotalLen(Long totalLen) {
        this.totalLen = totalLen;
    }

    public Position2D getDestLocation() {
        return destLocation;
    }

    public void setDestLocation(Position2D destLocation) {
        this.destLocation = destLocation;
    }

    public Long getDestHeading() {
        return destHeading;
    }

    public void setDestHeading(Long destHeading) {
        this.destHeading = destHeading;
    }

    public Integer getPathNum() {
        return pathNum;
    }

    public void setPathNum(Integer pathNum) {
        this.pathNum = pathNum;
    }

    public Short getDestActionCodeLen() {
        return destActionCodeLen;
    }

    public void setDestActionCodeLen(Short destActionCodeLen) {
        this.destActionCodeLen = destActionCodeLen;
    }

    public String getDestActionCode() {
        return destActionCode;
    }

    public void setDestActionCode(String destActionCode) {
        this.destActionCode = destActionCode;
    }

    public Integer getDestActionValue() {
        return destActionValue;
    }

    public void setDestActionValue(Integer destActionValue) {
        this.destActionValue = destActionValue;
    }

    public Integer getDataLen() {
        return dataLen;
    }

    public void setDataLen(Integer dataLen) {
        this.dataLen = dataLen;
    }

    public List<Path> getPathList() {
        return pathList;
    }

    public void setPathList(List<Path> pathList) {
        this.pathList = pathList;
    }
}
