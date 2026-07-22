package cn.cicv.cloud;

import cn.cicv.cloud.client.TcpClient;
import cn.cicv.cloud.command.ActionJobCommand;
import cn.cicv.cloud.command.JobCommand;

import java.io.IOException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) throws IOException, InterruptedException {
        TcpClient client = new TcpClient("61721pi2ip51.vicp.fun", 45046);

        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNextLine()) {
            String input = scanner.nextLine();

            if ("exit".equalsIgnoreCase(input)) {
                System.out.println("Exiting...");
                break;
            }
            // [pause, continue, finish]
            sendJobCommand(client, input);
        }
        client.close();
    }

    public static void sendJobCommand(TcpClient client, String input) throws InterruptedException {
        JobCommand<ActionJobCommand> jobCommand = new JobCommand<>();
        jobCommand.setVehicleId("XXHPT1D2022101869");
        jobCommand.setSeq(122222L);
        jobCommand.setJobType((short) 5);
        ActionJobCommand actionJobCommand = new ActionJobCommand();
        actionJobCommand.setTimestamp(System.currentTimeMillis());
        actionJobCommand.setActionLen((short) input.length());
        actionJobCommand.setAction(input);
        actionJobCommand.setValue(5);
        jobCommand.setAdviceData(actionJobCommand);
        client.sendJobCommand(jobCommand);
        Thread.sleep(1000);
    }

    /**
     * 下发紧急急停指令
     */
    public static void sendScramCommand(TcpClient client) {
        JobCommand<ActionJobCommand> jobCommand = new JobCommand<>();
        jobCommand.setVehicleId("XXHPT1D2022101869");
        jobCommand.setSeq(122222L);
        jobCommand.setJobType((short) 5);
        ActionJobCommand actionJobCommand = new ActionJobCommand();
        actionJobCommand.setTimestamp(System.currentTimeMillis());
        actionJobCommand.setActionLen((short) 5);
        actionJobCommand.setAction("scram");
        actionJobCommand.setValue(0);
        jobCommand.setAdviceData(actionJobCommand);
        client.sendJobCommand(jobCommand);
    }

    /**
     * 下发取消紧急急停指令
     */
    public static void sendUnScramCommand(TcpClient client) {
        JobCommand<ActionJobCommand> jobCommand = new JobCommand<>();
        jobCommand.setVehicleId("XXHPT1D2022101869");
        jobCommand.setSeq(122222L);
        jobCommand.setJobType((short) 5);
        ActionJobCommand actionJobCommand = new ActionJobCommand();
        actionJobCommand.setTimestamp(System.currentTimeMillis());
        actionJobCommand.setActionLen((short) 7);
        actionJobCommand.setAction("unscram");
        actionJobCommand.setValue(0);
        jobCommand.setAdviceData(actionJobCommand);
        client.sendJobCommand(jobCommand);
    }

    /**
     * 下发人工驾驶切换到自动驾驶指令
     */
    public static void sendChangeDriveMode0Command(TcpClient client) {
        JobCommand<ActionJobCommand> jobCommand = new JobCommand<>();
        jobCommand.setVehicleId("XXHPT1D2022101869");
        jobCommand.setSeq(122222L);
        jobCommand.setJobType((short) 5);
        ActionJobCommand actionJobCommand = new ActionJobCommand();
        actionJobCommand.setTimestamp(System.currentTimeMillis());
        actionJobCommand.setActionLen((short) 16);
        actionJobCommand.setAction("change_drivemode");
        actionJobCommand.setValue(0);
        jobCommand.setAdviceData(actionJobCommand);
        client.sendJobCommand(jobCommand);
    }

    /**
     * 下发自动驾驶切换到人工驾驶指令
     */
    public static void sendChangeDriveMode1Command(TcpClient client) {
        JobCommand<ActionJobCommand> jobCommand = new JobCommand<>();
        jobCommand.setVehicleId("XXHPT1D2022101869");
        jobCommand.setSeq(122222L);
        jobCommand.setJobType((short) 5);
        ActionJobCommand actionJobCommand = new ActionJobCommand();
        actionJobCommand.setTimestamp(System.currentTimeMillis());
        actionJobCommand.setActionLen((short) 16);
        actionJobCommand.setAction("change_drivemode");
        actionJobCommand.setValue(1);
        jobCommand.setAdviceData(actionJobCommand);
        client.sendJobCommand(jobCommand);
    }


}
