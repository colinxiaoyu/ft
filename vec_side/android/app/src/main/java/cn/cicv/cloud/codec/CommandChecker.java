package cn.cicv.cloud.codec;

import cn.cicv.cloud.command.ActionJobCommand;
import cn.cicv.cloud.command.JobCommand;
import cn.cicv.cloud.command.TaskJobCommand;

import java.util.Objects;

public class CommandChecker {

    public static void checkJobCommand(JobCommand<?> command) {
        Objects.requireNonNull(command.getVehicleId(), "vehicleId is null");
        if (command.getVehicleId().length() != 17) {
            throw new IllegalArgumentException("vehicleId must be 17");
        }
        Objects.requireNonNull(command.getSeq(), "seq is null");
        Objects.requireNonNull(command.getJobType(), "jobType is null");
    }

    public static void checkActionJobCommand(ActionJobCommand command) {
        Objects.requireNonNull(command, "adviceData is null");
        Objects.requireNonNull(command.getTimestamp(), "timestamp is null");
        Objects.requireNonNull(command.getActionLen(), "actionLen is null");
        Objects.requireNonNull(command.getAction(), "action is null");
        if (command.getActionLen() != command.getAction().length()) {
            throw new IllegalArgumentException("action length must be " + command.getActionLen());
        }
        Objects.requireNonNull(command.getValue(), "value is null");
    }

    public static void checkTaskJobCommand(TaskJobCommand command) {
        Objects.requireNonNull(command, "adviceData is null");
        Objects.requireNonNull(command.getUuid(), "uuid is null");
        Objects.requireNonNull(command.getTimestamp(), "timestamp is null");
        Objects.requireNonNull(command.getAlertType(), "alertType is null");
        Objects.requireNonNull(command.getDestLocation(), "destLocation is null");
        Objects.requireNonNull(command.getDestLocation().getLongitude(), "destLocation.longitude is null");
        Objects.requireNonNull(command.getDestLocation().getLatitude(), "destLocation.latitude is null");
        Objects.requireNonNull(command.getPathNum(), "pathNum is null");
        Objects.requireNonNull(command.getDestActionCodeLen(), "destActionCodeLen is null");
        Objects.requireNonNull(command.getDestActionCodeLen(), "destActionCodeLen is null");
        Objects.requireNonNull(command.getDestActionCode(), "destActionCode is null");
        Objects.requireNonNull(command.getDestActionValue(), "destActionValue is null");
        Objects.requireNonNull(command.getDataLen(), "dataLen is null");
        Objects.requireNonNull(command.getPathList(), "pathList is null");

    }

}
