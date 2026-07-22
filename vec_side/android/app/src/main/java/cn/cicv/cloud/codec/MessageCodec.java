package cn.cicv.cloud.codec;

import cn.cicv.cloud.command.ActionJobCommand;
import cn.cicv.cloud.command.JobCommand;
import cn.cicv.cloud.command.TaskJobCommand;
import cn.cicv.cloud.message.*;
import cn.cicv.cloud.utils.ByteUtil;
import cn.cicv.cloud.utils.CoordinateUtil;
import cn.cicv.cloud.utils.UnitConvertUtil;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

import static cn.cicv.cloud.contstant.UnitConvertConstant.*;

public class MessageCodec {

    private static final Logger log = Logger.getLogger(MessageCodec.class.getName());
    public static final int HEADER_LEN = 16;
    public static final int JOB_HEADER_LEN = 28;
    public static final int WORD_DEFAULT_VALUE = 0xFFFF;
    public static final long DWORD_DEFAULT_VALUE = 0xFFFFFFFFL;

    public static V2CMessage decode(byte[] bytes) {
        log.info("receive bytes: " + ByteUtil.byteArrayToHexString(bytes));
        UnsignedByteBuffer byteBuffer = UnsignedByteBuffer.wrap(bytes);
        short type = bytes[5];
        switch (type) {
            case 0x15:
                StateMessage message = new StateMessage();
                decodeHeader(byteBuffer, message);
                decode0x15Body(byteBuffer, message);
                return message;
            case 0x1B:
                JobCommandReply reply = new JobCommandReply();
                decodeHeader(byteBuffer, reply);
                decode0x1BBody(byteBuffer, reply);
                return reply;
            default:
                log.warning("unknown message type: " + type);
                return null;
        }
    }

    private static void decode0x1BBody(UnsignedByteBuffer byteBuffer, JobCommandReply message) {
        message.setVehicleId(byteBuffer.getString(17));
        message.setSeq(byteBuffer.getLong());
        message.setJobType(byteBuffer.getUnsignedByte());
        message.setDataLen(byteBuffer.getUnsignedShort());
        message.setDoFlag(byteBuffer.getUnsignedByte());
    }

    private static void decodeHeader(UnsignedByteBuffer byteBuffer, V2CMessage message) {
        message.setIdentifier(byteBuffer.getUnsignedByte());
        message.setBodyLen(byteBuffer.getUnsignedInt());
        message.setType(byteBuffer.getUnsignedByte());
        message.setVersion(byteBuffer.getUnsignedByte());
        message.setTimestamp(byteBuffer.getLong());
        message.setControlContent(byteBuffer.getUnsignedByte());
    }

    private static void decode0x15Body(UnsignedByteBuffer byteBuffer, StateMessage message) {
        // 车辆基础信息数据结构 0x01
        message.setVehicleId(byteBuffer.getString(17));
        message.setMessageId(byteBuffer.getLong());
        message.setTimestampGNSS(byteBuffer.getLong());
        int velocityGNSS = byteBuffer.getUnsignedShort();
        message.setVelocityGNSS(velocityGNSS == WORD_DEFAULT_VALUE ? WORD_DEFAULT_VALUE :
                UnitConvertUtil.convertToDouble(velocityGNSS, M_E2, SCALE_2) * 3.6);
        DoublePosition position = decodePosition(byteBuffer);
        List<Double> gcj02Pos = CoordinateUtil.wgs84togcj02(position.getLongitude(), position.getLatitude());
        position.setLongitude(BigDecimal.valueOf(gcj02Pos.get(0)).setScale(7, RoundingMode.HALF_UP).doubleValue());
        position.setLatitude(BigDecimal.valueOf(gcj02Pos.get(1)).setScale(7, RoundingMode.HALF_UP).doubleValue());
        message.setPosition(position);
        long heading = byteBuffer.getUnsignedInt();
        message.setHeading(heading == DWORD_DEFAULT_VALUE ? DWORD_DEFAULT_VALUE :
                UnitConvertUtil.convertToDouble(heading, M_E4, SCALE_4));
        message.setTapPos(byteBuffer.getUnsignedByte());
        message.setSteeringAngle(byteBuffer.getUnsignedInt());
        int velocity = byteBuffer.getUnsignedShort();
        message.setVelocity(velocity == WORD_DEFAULT_VALUE ? WORD_DEFAULT_VALUE :
                UnitConvertUtil.convertToDouble(velocity, M_E2, SCALE_2) * 3.6);
        message.setAccelerationLon(byteBuffer.getUnsignedShort());
        message.setAccelerationLat(byteBuffer.getUnsignedShort());
        message.setAccelerationVer(byteBuffer.getUnsignedShort());
        message.setYawRate(byteBuffer.getUnsignedShort());
        message.setAccelPos(byteBuffer.getUnsignedShort());
        message.setEngineSpeed(byteBuffer.getUnsignedShort());
        message.setEngineTorque(byteBuffer.getUnsignedInt());
        message.setBrakeFlag(byteBuffer.getUnsignedByte());
        message.setBrakePos(byteBuffer.getUnsignedShort());
        message.setBrakePressure(byteBuffer.getUnsignedShort());
        message.setFuelConsumption(byteBuffer.getUnsignedShort());
        message.setDriveMode(byteBuffer.getUnsignedByte());
        DoublePosition2D position2d = decodePosition2D(byteBuffer);
        List<Double> gcj02Pos2d = CoordinateUtil.wgs84togcj02(position2d.getLongitude(), position2d.getLatitude());
        position2d.setLongitude(BigDecimal.valueOf(gcj02Pos2d.get(0)).setScale(7, RoundingMode.HALF_UP).doubleValue());
        position2d.setLatitude(BigDecimal.valueOf(gcj02Pos2d.get(1)).setScale(7, RoundingMode.HALF_UP).doubleValue());
        message.setDestLocation(position2d);
        message.setPassPointsNum(byteBuffer.getUnsignedByte());
        List<DoublePosition2D> passPoints = new ArrayList<>();
        for (int i = 0; i < message.getPassPointsNum(); i++) {
            passPoints.add(decodePosition2D(byteBuffer));
        }
        message.setPassPoints(passPoints);
        message.setUserdefinedDataLength(byteBuffer.getUnsignedByte());
        message.setUserdefinedData(byteBuffer.getString(message.getUserdefinedDataLength()));

        // 车辆辅助驾驶系统信息及其他状态信息数据结构 0x02
        if (message.getVersion() == 2 || message.getVersion() == 3) {
            message.setAbsFlag(byteBuffer.getUnsignedByte());
            message.setTcsFlag(byteBuffer.getUnsignedByte());
            message.setEspFlag(byteBuffer.getUnsignedByte());
            message.setLkaFlag(byteBuffer.getUnsignedByte());
            message.setAccMode(byteBuffer.getUnsignedByte());
            message.setFcwFlag(byteBuffer.getUnsignedByte());
            message.setLdwFlag(byteBuffer.getUnsignedByte());
            message.setAebFlag(byteBuffer.getUnsignedByte());
            message.setLcaFlag(byteBuffer.getUnsignedByte());
            message.setDmsFlag(byteBuffer.getUnsignedByte());
            message.setMileage(byteBuffer.getUnsignedInt());
            message.setFuelGauge(byteBuffer.getUnsignedShort());
            message.setSoc(byteBuffer.getUnsignedShort());
            message.setTemperature(byteBuffer.getUnsignedByte());
            message.setEndurance(byteBuffer.getUnsignedInt());
            message.setVehFault(byteBuffer.getUnsignedInt());
            message.setMotorspeed(byteBuffer.getUnsignedShort());
            message.setMotortorque(byteBuffer.getUnsignedInt());
            message.setVehMode(byteBuffer.getUnsignedByte());
            message.setChargeState(byteBuffer.getUnsignedByte());
            message.setBattVol(byteBuffer.getUnsignedShort());
            message.setBattCur(byteBuffer.getUnsignedShort());
            message.setHornState(byteBuffer.getUnsignedByte());
            message.setWheelNum(byteBuffer.getUnsignedByte());
            List<Integer> wheelVelocity = new ArrayList<>();
            for (int i = 0; i < message.getWheelNum(); i++) {
                wheelVelocity.add(byteBuffer.getUnsignedShort());
            }
            message.setWheelVelocity(wheelVelocity);
            List<Integer> tirePressure = new ArrayList<>();
            for (int i = 0; i < message.getWheelNum(); i++) {
                tirePressure.add(byteBuffer.getUnsignedShort());
            }
            message.setTirePressure(tirePressure);
            message.setLights(byteBuffer.getUnsignedShort());
            message.setDoors(byteBuffer.getUnsignedShort());
            message.setNetworkState(byteBuffer.getUnsignedByte());
            message.setSignalStrength(byteBuffer.getUnsignedByte());
            message.setUserdefinedDataLength1(byteBuffer.getUnsignedByte());
            message.setUserdefinedData1(byteBuffer.getString(message.getUserdefinedDataLength1()));
        }

        // 车辆自动驾驶系统信息数据结构 0x03
        if (message.getVersion() == 3) {
            message.setCloudMessageId(byteBuffer.getUnsignedInt());
            message.setAccelCmd(byteBuffer.getUnsignedShort());
            message.setTorqueCmd(byteBuffer.getUnsignedInt());
            message.setVelocityCmd(byteBuffer.getUnsignedShort());
            message.setPlanningLocNum(byteBuffer.getUnsignedShort());
            List<TracePoint> planningLocs = new ArrayList<>();
            for (int i = 0; i < message.getPlanningLocNum(); i++) {
                planningLocs.add(decodeTracePoint(byteBuffer));
            }
            message.setPlanningLocs(planningLocs);
            message.setDecisionLaneChange(byteBuffer.getUnsignedByte());
            message.setDecisionAccel(byteBuffer.getUnsignedByte());
            message.setDecisionTurnSignal(byteBuffer.getUnsignedByte());
            message.setDecisionVehicleStatus(byteBuffer.getUnsignedByte());
            message.setDetectionLen(byteBuffer.getUnsignedShort());
            List<DetectionData> detectionDataList = new ArrayList<>();
            for (int i = 0; i < message.getDetectionLen(); i++) {
                detectionDataList.add(decodeDetectionData(byteBuffer));
            }
            message.setDetectionData(detectionDataList);
            message.setAutoDrivingSysFault(byteBuffer.getUnsignedShort());
            message.setEpbFlag(byteBuffer.getUnsignedByte());
            message.setJobId(byteBuffer.getLong());
            message.setPathId(byteBuffer.getUnsignedShort());
            message.setPathPogress(byteBuffer.getUnsignedByte());
            message.setActionLen(byteBuffer.getUnsignedByte());
            message.setActionCode(byteBuffer.getString(message.getActionLen()));
            message.setActionValue(byteBuffer.getUnsignedShort());
            message.setScramFlag(byteBuffer.getUnsignedByte());
            message.setRemoteScramFlag(byteBuffer.getUnsignedByte());
            message.setUserdefinedDataLength2(byteBuffer.getUnsignedByte());
            message.setUserdefinedData2(byteBuffer.getString(message.getUserdefinedDataLength2()));
        }

    }

    private static DetectionData decodeDetectionData(UnsignedByteBuffer byteBuffer) {
        DetectionData detectionData = new DetectionData();
        detectionData.setUuid(byteBuffer.getString(8));
        detectionData.setObjId(byteBuffer.getUnsignedShort());
        detectionData.setType(byteBuffer.getUnsignedByte());
        detectionData.setX(byteBuffer.getUnsignedShort());
        detectionData.setY(byteBuffer.getUnsignedShort());
        detectionData.setHeading(byteBuffer.getUnsignedInt());
        return detectionData;
    }

    private static TracePoint decodeTracePoint(UnsignedByteBuffer byteBuffer) {
        TracePoint tracePoint = new TracePoint();
        tracePoint.setExpLongitude(byteBuffer.getUnsignedInt());
        tracePoint.setExpLatitude(byteBuffer.getUnsignedInt());
        tracePoint.setExpSpeed(byteBuffer.getUnsignedShort());
        tracePoint.setExpAcceleration(byteBuffer.getUnsignedShort());
        tracePoint.setExpHeading(byteBuffer.getUnsignedInt());
        return tracePoint;
    }

    private static DoublePosition2D decodePosition2D(UnsignedByteBuffer byteBuffer) {
        DoublePosition2D position = new DoublePosition2D();
        position.setLongitude(UnitConvertUtil.convertToDouble(byteBuffer.getUnsignedInt(), M_E7, 180, SCALE_7));
        position.setLatitude(UnitConvertUtil.convertToDouble(byteBuffer.getUnsignedInt(), M_E7, 90, SCALE_7));
        return position;
    }

    private static DoublePosition decodePosition(UnsignedByteBuffer byteBuffer) {
        DoublePosition position = new DoublePosition();
        position.setLongitude(UnitConvertUtil.convertToDouble(byteBuffer.getUnsignedInt(), M_E7, 180, SCALE_7));
        position.setLatitude(UnitConvertUtil.convertToDouble(byteBuffer.getUnsignedInt(), M_E7, 90, SCALE_7));
        long elevation = byteBuffer.getUnsignedInt();
        position.setElevation(elevation == DWORD_DEFAULT_VALUE ? DWORD_DEFAULT_VALUE :
                UnitConvertUtil.convertToDouble(elevation, 1, 5000, SCALE_7));
        return position;
    }

    public static byte[] encode(JobCommand<?> jobCommand) {
        CommandChecker.checkJobCommand(jobCommand);
        switch (jobCommand.getJobType()) {
            case 1:
                return encodeTaskCommand(jobCommand);
            case 5:
                return encodeActionCommand(jobCommand);
            case 7:
                return encodeActionCommand(jobCommand);
            default:
                throw new IllegalArgumentException("unknown job type " + jobCommand.getJobType());
        }
    }

    private static byte[] encodeTaskCommand(JobCommand<?> jobCommand) {
        TaskJobCommand command = (TaskJobCommand) jobCommand.getAdviceData();
        CommandChecker.checkTaskJobCommand(command);

        UnsignedByteBuffer adviceData = UnsignedByteBuffer.allocate(100 + Math.min(1000, command.getDataLen() * 30));
        encodeTaskCommandAdviceData(command, adviceData);

        UnsignedByteBuffer result = UnsignedByteBuffer.allocate(HEADER_LEN + JOB_HEADER_LEN + adviceData.position());
        encodeJobCommandHeader(result, JOB_HEADER_LEN + adviceData.position());
        encodeJobCommandComBody(jobCommand, result, adviceData.position());
        result.put(adviceData.getArray());
        return result.array();
    }

    private static byte[] encodeActionCommand(JobCommand<?> jobCommand) {
        ActionJobCommand command = (ActionJobCommand) jobCommand.getAdviceData();
        CommandChecker.checkActionJobCommand(command);

        UnsignedByteBuffer adviceData = UnsignedByteBuffer.allocate(100);
        encodeActionCommandAdviceData(command, adviceData);

        UnsignedByteBuffer result = UnsignedByteBuffer.allocate(HEADER_LEN + JOB_HEADER_LEN + adviceData.position());
        encodeJobCommandHeader(result, JOB_HEADER_LEN + adviceData.position());
        encodeJobCommandComBody(jobCommand, result, adviceData.position());
        result.put(adviceData.getArray());
        return result.array();
    }

    private static void encodeActionCommandAdviceData(ActionJobCommand command, UnsignedByteBuffer adviceData) {
        adviceData.putLong(command.getTimestamp());
        adviceData.put(command.getActionLen());
        adviceData.putString(command.getAction());
        adviceData.putShort(command.getValue());
    }

    private static void encodeTaskCommandAdviceData(TaskJobCommand command, UnsignedByteBuffer adviceData) {
        adviceData.putString(command.getUuid());
        adviceData.putLong(command.getTimestamp());
        adviceData.putShort(command.getAlertType());
        adviceData.putInt(command.getTotalLen());
        adviceData.putInt(command.getDestLocation().getLongitude());
        adviceData.putInt(command.getDestLocation().getLatitude());
        adviceData.putInt(command.getDestHeading());
        adviceData.putShort(command.getPathNum());
        adviceData.put(command.getDestActionCodeLen());
        if (command.getDestActionCodeLen() > 0) {
            adviceData.putString(command.getDestActionCode());
        }
        adviceData.putShort(command.getDestActionValue());
        adviceData.putShort(command.getDataLen());
        Optional.ofNullable(command.getPathList()).orElse(Collections.emptyList())
                .forEach(path -> {
                    adviceData.putShort(path.getPathId());
                    adviceData.put(path.getPointsNum());
                    Optional.ofNullable(path.getPointsPos()).orElse(Collections.emptyList())
                            .forEach(pos -> {
                                adviceData.putInt(pos.getLongitude());
                                adviceData.putInt(pos.getLatitude());
                            });
                    adviceData.putInt(path.getPathLen());
                    adviceData.put(path.getPathNameLen());
                    if (path.getPathNameLen() > 0) {
                        adviceData.putString(path.getPathName());
                    }
                    adviceData.put(path.getPathType());
                });
    }

    public static void encodeJobCommandHeader(UnsignedByteBuffer payload, long bodyLen) {
        payload.put((short) 0xF2);
        payload.putInt(bodyLen);
        payload.put((short) 0x1A);
        payload.put((short) 0x01);
        payload.putLong(System.currentTimeMillis());
        payload.put((short) 0x00);
    }

    public static void encodeJobCommandComBody(JobCommand<?> command, UnsignedByteBuffer payload, int dataLen) {
        payload.putString(command.getVehicleId());
        payload.putLong(command.getSeq());
        payload.put(command.getJobType());
        payload.putShort(dataLen);
    }
}
