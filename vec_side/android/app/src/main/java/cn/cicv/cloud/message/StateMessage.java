package cn.cicv.cloud.message;

import java.util.List;

/**
 * @author Fai Lee
 * @date 2023-08-13
 */
public class StateMessage extends V2CMessage {
    //----------------------------------------车辆基础信息数据结构------------------------------------//

    private Long messageId;

    private Long timestampGNSS;

    private Double velocityGNSS;

    private DoublePosition position;

    private Double heading;

    private Short tapPos;

    private Long steeringAngle;

    private Double velocity;

    private Integer accelerationLon;

    private Integer accelerationLat;

    private Integer accelerationVer;

    private Integer yawRate;

    private Integer accelPos;

    private Integer engineSpeed;

    private Long engineTorque;

    private Short brakeFlag;

    private Integer brakePos;

    private Integer brakePressure;

    private Integer fuelConsumption;

    private Short driveMode;

    private DoublePosition2D destLocation;

    private Short passPointsNum;

    private List<DoublePosition2D> passPoints;

    private Short userdefinedDataLength;

    private String userdefinedData;

    //------------------------------车辆辅助驾驶系统信息及其他状态信息数据结构-----------------------------//
    private Short absFlag;

    private Short tcsFlag;

    private Short espFlag;

    private Short lkaFlag;

    private Short accMode;

    private Short fcwFlag;

    private Short ldwFlag;

    private Short aebFlag;

    private Short lcaFlag;

    private Short dmsFlag;

    private Long mileage;

    private Integer fuelGauge;

    private Integer soc;

    private Short temperature;

    private Long endurance;

    private Long vehFault;

    private Integer motorspeed;

    private Long motortorque;

    private Short vehMode;

    private Short chargeState;

    private Integer battVol;

    private Integer battCur;

    private Short hornState;

    private Short wheelNum;

    private List<Integer> wheelVelocity;

    private List<Integer> tirePressure;

    private Integer lights;

    private Integer doors;

    private Short networkState;

    private Short signalStrength;

    private Short userdefinedDataLength1;

    private String userdefinedData1;

    //------------------------------车辆自动驾驶系统信息数据结构-----------------------------//
    private Long cloudMessageId;

    private Integer accelCmd;

    private Long torqueCmd;

    private Integer velocityCmd;

    private Integer planningLocNum;

    private List<TracePoint> planningLocs;

    private Short decisionLaneChange;

    private Short decisionAccel;

    private Short decisionTurnSignal;

    private Short decisionVehicleStatus;

    private Integer detectionLen;

    private List<DetectionData> detectionData;

    private Integer autoDrivingSysFault;

    private Short epbFlag;

    private Long jobId;

    private Integer pathId;

    private Short pathPogress;

    private Short actionLen;

    private String actionCode;

    private Integer actionValue;

    private Short scramFlag;

    private Short remoteScramFlag;

    private Short userdefinedDataLength2;

    private String userdefinedData2;

    public StateMessage() {
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public Long getTimestampGNSS() {
        return timestampGNSS;
    }

    public void setTimestampGNSS(Long timestampGNSS) {
        this.timestampGNSS = timestampGNSS;
    }

    public Double getVelocityGNSS() {
        return velocityGNSS;
    }

    public void setVelocityGNSS(Double velocityGNSS) {
        this.velocityGNSS = velocityGNSS;
    }

    public DoublePosition getPosition() {
        return position;
    }

    public void setPosition(DoublePosition position) {
        this.position = position;
    }

    public Double getHeading() {
        return heading;
    }

    public void setHeading(Double heading) {
        this.heading = heading;
    }

    public Short getTapPos() {
        return tapPos;
    }

    public void setTapPos(Short tapPos) {
        this.tapPos = tapPos;
    }

    public Long getSteeringAngle() {
        return steeringAngle;
    }

    public void setSteeringAngle(Long steeringAngle) {
        this.steeringAngle = steeringAngle;
    }

    public Double getVelocity() {
        return velocity;
    }

    public void setVelocity(Double velocity) {
        this.velocity = velocity;
    }

    public Integer getAccelerationLon() {
        return accelerationLon;
    }

    public void setAccelerationLon(Integer accelerationLon) {
        this.accelerationLon = accelerationLon;
    }

    public Integer getAccelerationLat() {
        return accelerationLat;
    }

    public void setAccelerationLat(Integer accelerationLat) {
        this.accelerationLat = accelerationLat;
    }

    public Integer getAccelerationVer() {
        return accelerationVer;
    }

    public void setAccelerationVer(Integer accelerationVer) {
        this.accelerationVer = accelerationVer;
    }

    public Integer getYawRate() {
        return yawRate;
    }

    public void setYawRate(Integer yawRate) {
        this.yawRate = yawRate;
    }

    public Integer getAccelPos() {
        return accelPos;
    }

    public void setAccelPos(Integer accelPos) {
        this.accelPos = accelPos;
    }

    public Integer getEngineSpeed() {
        return engineSpeed;
    }

    public void setEngineSpeed(Integer engineSpeed) {
        this.engineSpeed = engineSpeed;
    }

    public Long getEngineTorque() {
        return engineTorque;
    }

    public void setEngineTorque(Long engineTorque) {
        this.engineTorque = engineTorque;
    }

    public Short getBrakeFlag() {
        return brakeFlag;
    }

    public void setBrakeFlag(Short brakeFlag) {
        this.brakeFlag = brakeFlag;
    }

    public Integer getBrakePos() {
        return brakePos;
    }

    public void setBrakePos(Integer brakePos) {
        this.brakePos = brakePos;
    }

    public Integer getBrakePressure() {
        return brakePressure;
    }

    public void setBrakePressure(Integer brakePressure) {
        this.brakePressure = brakePressure;
    }

    public Integer getFuelConsumption() {
        return fuelConsumption;
    }

    public void setFuelConsumption(Integer fuelConsumption) {
        this.fuelConsumption = fuelConsumption;
    }

    public Short getDriveMode() {
        return driveMode;
    }

    public void setDriveMode(Short driveMode) {
        this.driveMode = driveMode;
    }

    public DoublePosition2D getDestLocation() {
        return destLocation;
    }

    public void setDestLocation(DoublePosition2D destLocation) {
        this.destLocation = destLocation;
    }

    public Short getPassPointsNum() {
        return passPointsNum;
    }

    public void setPassPointsNum(Short passPointsNum) {
        this.passPointsNum = passPointsNum;
    }

    public List<DoublePosition2D> getPassPoints() {
        return passPoints;
    }

    public void setPassPoints(List<DoublePosition2D> passPoints) {
        this.passPoints = passPoints;
    }

    public Short getUserdefinedDataLength() {
        return userdefinedDataLength;
    }

    public void setUserdefinedDataLength(Short userdefinedDataLength) {
        this.userdefinedDataLength = userdefinedDataLength;
    }

    public String getUserdefinedData() {
        return userdefinedData;
    }

    public void setUserdefinedData(String userdefinedData) {
        this.userdefinedData = userdefinedData;
    }

    public Short getAbsFlag() {
        return absFlag;
    }

    public void setAbsFlag(Short absFlag) {
        this.absFlag = absFlag;
    }

    public Short getTcsFlag() {
        return tcsFlag;
    }

    public void setTcsFlag(Short tcsFlag) {
        this.tcsFlag = tcsFlag;
    }

    public Short getEspFlag() {
        return espFlag;
    }

    public void setEspFlag(Short espFlag) {
        this.espFlag = espFlag;
    }

    public Short getLkaFlag() {
        return lkaFlag;
    }

    public void setLkaFlag(Short lkaFlag) {
        this.lkaFlag = lkaFlag;
    }

    public Short getAccMode() {
        return accMode;
    }

    public void setAccMode(Short accMode) {
        this.accMode = accMode;
    }

    public Short getFcwFlag() {
        return fcwFlag;
    }

    public void setFcwFlag(Short fcwFlag) {
        this.fcwFlag = fcwFlag;
    }

    public Short getLdwFlag() {
        return ldwFlag;
    }

    public void setLdwFlag(Short ldwFlag) {
        this.ldwFlag = ldwFlag;
    }

    public Short getAebFlag() {
        return aebFlag;
    }

    public void setAebFlag(Short aebFlag) {
        this.aebFlag = aebFlag;
    }

    public Short getLcaFlag() {
        return lcaFlag;
    }

    public void setLcaFlag(Short lcaFlag) {
        this.lcaFlag = lcaFlag;
    }

    public Short getDmsFlag() {
        return dmsFlag;
    }

    public void setDmsFlag(Short dmsFlag) {
        this.dmsFlag = dmsFlag;
    }

    public Long getMileage() {
        return mileage;
    }

    public void setMileage(Long mileage) {
        this.mileage = mileage;
    }

    public Integer getFuelGauge() {
        return fuelGauge;
    }

    public void setFuelGauge(Integer fuelGauge) {
        this.fuelGauge = fuelGauge;
    }

    public Integer getSoc() {
        return soc;
    }

    public void setSoc(Integer soc) {
        this.soc = soc;
    }

    public Short getTemperature() {
        return temperature;
    }

    public void setTemperature(Short temperature) {
        this.temperature = temperature;
    }

    public Long getEndurance() {
        return endurance;
    }

    public void setEndurance(Long endurance) {
        this.endurance = endurance;
    }

    public Long getVehFault() {
        return vehFault;
    }

    public void setVehFault(Long vehFault) {
        this.vehFault = vehFault;
    }

    public Integer getMotorspeed() {
        return motorspeed;
    }

    public void setMotorspeed(Integer motorspeed) {
        this.motorspeed = motorspeed;
    }

    public Long getMotortorque() {
        return motortorque;
    }

    public void setMotortorque(Long motortorque) {
        this.motortorque = motortorque;
    }

    public Short getVehMode() {
        return vehMode;
    }

    public void setVehMode(Short vehMode) {
        this.vehMode = vehMode;
    }

    public Short getChargeState() {
        return chargeState;
    }

    public void setChargeState(Short chargeState) {
        this.chargeState = chargeState;
    }

    public Integer getBattVol() {
        return battVol;
    }

    public void setBattVol(Integer battVol) {
        this.battVol = battVol;
    }

    public Integer getBattCur() {
        return battCur;
    }

    public void setBattCur(Integer battCur) {
        this.battCur = battCur;
    }

    public Short getHornState() {
        return hornState;
    }

    public void setHornState(Short hornState) {
        this.hornState = hornState;
    }

    public Short getWheelNum() {
        return wheelNum;
    }

    public void setWheelNum(Short wheelNum) {
        this.wheelNum = wheelNum;
    }

    public List<Integer> getWheelVelocity() {
        return wheelVelocity;
    }

    public void setWheelVelocity(List<Integer> wheelVelocity) {
        this.wheelVelocity = wheelVelocity;
    }

    public List<Integer> getTirePressure() {
        return tirePressure;
    }

    public void setTirePressure(List<Integer> tirePressure) {
        this.tirePressure = tirePressure;
    }

    public Integer getLights() {
        return lights;
    }

    public void setLights(Integer lights) {
        this.lights = lights;
    }

    public Integer getDoors() {
        return doors;
    }

    public void setDoors(Integer doors) {
        this.doors = doors;
    }

    public Short getNetworkState() {
        return networkState;
    }

    public void setNetworkState(Short networkState) {
        this.networkState = networkState;
    }

    public Short getSignalStrength() {
        return signalStrength;
    }

    public void setSignalStrength(Short signalStrength) {
        this.signalStrength = signalStrength;
    }

    public Short getUserdefinedDataLength1() {
        return userdefinedDataLength1;
    }

    public void setUserdefinedDataLength1(Short userdefinedDataLength1) {
        this.userdefinedDataLength1 = userdefinedDataLength1;
    }

    public String getUserdefinedData1() {
        return userdefinedData1;
    }

    public void setUserdefinedData1(String userdefinedData1) {
        this.userdefinedData1 = userdefinedData1;
    }

    public Long getCloudMessageId() {
        return cloudMessageId;
    }

    public void setCloudMessageId(Long cloudMessageId) {
        this.cloudMessageId = cloudMessageId;
    }

    public Integer getAccelCmd() {
        return accelCmd;
    }

    public void setAccelCmd(Integer accelCmd) {
        this.accelCmd = accelCmd;
    }

    public Long getTorqueCmd() {
        return torqueCmd;
    }

    public void setTorqueCmd(Long torqueCmd) {
        this.torqueCmd = torqueCmd;
    }

    public Integer getVelocityCmd() {
        return velocityCmd;
    }

    public void setVelocityCmd(Integer velocityCmd) {
        this.velocityCmd = velocityCmd;
    }

    public Integer getPlanningLocNum() {
        return planningLocNum;
    }

    public void setPlanningLocNum(Integer planningLocNum) {
        this.planningLocNum = planningLocNum;
    }

    public List<TracePoint> getPlanningLocs() {
        return planningLocs;
    }

    public void setPlanningLocs(List<TracePoint> planningLocs) {
        this.planningLocs = planningLocs;
    }

    public Short getDecisionLaneChange() {
        return decisionLaneChange;
    }

    public void setDecisionLaneChange(Short decisionLaneChange) {
        this.decisionLaneChange = decisionLaneChange;
    }

    public Short getDecisionAccel() {
        return decisionAccel;
    }

    public void setDecisionAccel(Short decisionAccel) {
        this.decisionAccel = decisionAccel;
    }

    public Short getDecisionTurnSignal() {
        return decisionTurnSignal;
    }

    public void setDecisionTurnSignal(Short decisionTurnSignal) {
        this.decisionTurnSignal = decisionTurnSignal;
    }

    public Short getDecisionVehicleStatus() {
        return decisionVehicleStatus;
    }

    public void setDecisionVehicleStatus(Short decisionVehicleStatus) {
        this.decisionVehicleStatus = decisionVehicleStatus;
    }

    public Integer getDetectionLen() {
        return detectionLen;
    }

    public void setDetectionLen(Integer detectionLen) {
        this.detectionLen = detectionLen;
    }

    public List<DetectionData> getDetectionData() {
        return detectionData;
    }

    public void setDetectionData(List<DetectionData> detectionData) {
        this.detectionData = detectionData;
    }

    public Integer getAutoDrivingSysFault() {
        return autoDrivingSysFault;
    }

    public void setAutoDrivingSysFault(Integer autoDrivingSysFault) {
        this.autoDrivingSysFault = autoDrivingSysFault;
    }

    public Short getEpbFlag() {
        return epbFlag;
    }

    public void setEpbFlag(Short epbFlag) {
        this.epbFlag = epbFlag;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public Integer getPathId() {
        return pathId;
    }

    public void setPathId(Integer pathId) {
        this.pathId = pathId;
    }

    public Short getPathPogress() {
        return pathPogress;
    }

    public void setPathPogress(Short pathPogress) {
        this.pathPogress = pathPogress;
    }

    public Short getActionLen() {
        return actionLen;
    }

    public void setActionLen(Short actionLen) {
        this.actionLen = actionLen;
    }

    public String getActionCode() {
        return actionCode;
    }

    public void setActionCode(String actionCode) {
        this.actionCode = actionCode;
    }

    public Integer getActionValue() {
        return actionValue;
    }

    public void setActionValue(Integer actionValue) {
        this.actionValue = actionValue;
    }

    public Short getUserdefinedDataLength2() {
        return userdefinedDataLength2;
    }

    public void setUserdefinedDataLength2(Short userdefinedDataLength2) {
        this.userdefinedDataLength2 = userdefinedDataLength2;
    }

    public String getUserdefinedData2() {
        return userdefinedData2;
    }

    public void setUserdefinedData2(String userdefinedData2) {
        this.userdefinedData2 = userdefinedData2;
    }

    public Short getRemoteScramFlag() {
        return remoteScramFlag;
    }

    public void setRemoteScramFlag(Short remoteScramFlag) {
        this.remoteScramFlag = remoteScramFlag;
    }

    public Short getScramFlag() {
        return scramFlag;
    }

     public void setScramFlag(Short scramFlag) {
        this.scramFlag = scramFlag;
     }
}
