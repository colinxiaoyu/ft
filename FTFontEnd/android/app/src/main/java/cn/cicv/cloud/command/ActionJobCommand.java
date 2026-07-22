package cn.cicv.cloud.command;

/**
 * @author Fai Lee
 * @date 2024-05-25
 */
public class ActionJobCommand {

    private Long timestamp;

    private Short actionLen;

    private String action;

    private Integer value;

    public ActionJobCommand() {
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public Short getActionLen() {
        return actionLen;
    }

    public void setActionLen(Short actionLen) {
        this.actionLen = actionLen;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }
}
