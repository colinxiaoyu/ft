package cn.cicv.cloud.command;

import org.json.JSONObject;

public class JobCommand<T> {

    private String vehicleId;

    private Long seq;

    private Short jobType;

    private Integer dataLen;

    private T adviceData;

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public Long getSeq() {
        return seq;
    }

    public void setSeq(Long seq) {
        this.seq = seq;
    }

    public Short getJobType() {
        return jobType;
    }

    public void setJobType(Short jobType) {
        this.jobType = jobType;
    }

    public Integer getDataLen() {
        return dataLen;
    }

    public void setDataLen(Integer dataLen) {
        this.dataLen = dataLen;
    }

    public T getAdviceData() {
        return adviceData;
    }

    public void setAdviceData(T adviceData) {
        this.adviceData = adviceData;
    }

    public static String serialize(JobCommand<ActionJobCommand> jobCommand) {
        try {
            JSONObject jsonObject = new JSONObject();

            // 添加顶层字段
            if (jobCommand.getVehicleId() != null) {
                jsonObject.put("vehicleId", jobCommand.getVehicleId());
            }

            if (jobCommand.getSeq() != null) {
                jsonObject.put("seq", jobCommand.getSeq());
            }

            if (jobCommand.getJobType() != null) {
                jsonObject.put("jobType", jobCommand.getJobType());
            }

            // 处理嵌套的 adviceData 字段
            if (jobCommand.getAdviceData() != null) {
                ActionJobCommand adviceData = (ActionJobCommand) jobCommand.getAdviceData();
                JSONObject adviceDataJson = new JSONObject();

                if (adviceData.getTimestamp() != null) {
                    adviceDataJson.put("timestamp", adviceData.getTimestamp());
                }

                if (adviceData.getActionLen() != null) {
                    adviceDataJson.put("actionLen", adviceData.getActionLen());
                }

                if (adviceData.getAction() != null) {
                    adviceDataJson.put("action", adviceData.getAction());
                }

                if (adviceData.getValue() != null) {
                    adviceDataJson.put("value", adviceData.getValue());
                }

                jsonObject.put("adviceData", adviceDataJson);
            }

            return jsonObject.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "{}";
        }
    }
}
