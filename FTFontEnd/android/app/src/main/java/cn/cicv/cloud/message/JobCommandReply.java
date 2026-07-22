package cn.cicv.cloud.message;

public class JobCommandReply extends V2CMessage {

//    private String vehicleId;

    private Long seq;

    private Short jobType;

    private Integer dataLen;

    private Short doFlag;

    public JobCommandReply() {
    }

//    @Override
//    public String getVehicleId() {
//        return vehicleId;
//    }
//
//    @Override
//    public void setVehicleId(String vehicleId) {
//        this.vehicleId = vehicleId;
//    }

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

    public Short getDoFlag() {
        return doFlag;
    }

    public void setDoFlag(Short doFlag) {
        this.doFlag = doFlag;
    }
}
