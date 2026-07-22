package cn.cicv.cloud.utils;

import cn.cicv.cloud.codec.MessageCodec;

public class ByteUtil {

    public static byte[] hexStringToByteArray(String s) {
        String substring = s.substring(1, s.length() - 1);
        String[] split = substring.split(" ");
        byte[] result = new byte[split.length];
        int i = 0;
        for (String hex : split) {
            result[i] = (byte) ((Character.digit(hex.charAt(0), 16) << 4));
            result[i] += (byte) (Character.digit(hex.charAt(1), 16));
            i++;
        }
        return result;
    }

    public static String byteArrayToHexString(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            hexString.append(String.format("%02X", b));
            hexString.append(" ");
        }
        return hexString.toString();
    }

    public static void main(String[] args) {
//        byte[] bytes = hexStringToByteArray("[F2 00 00 00 B0 15 03 00 00 01 93 A9 4D FF 5F 00 58 58 48 50 54 31 44 32 30 32 32 31 30 31 38 36 39 00 00 00 00 00 00 00 01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 FF FF FF FF 00 00 00 00 00 00 98 96 80 00 00 FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF 00 00 00 00 00 00 00 00 00 00 00 FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF 00 00 FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF 00 FF FF FF FF 00 00 00 FF FF FF FF FF FF FF FF FF FF FF FF 00 00 FF FF FF FF 00 00 FF FF FF 00 00 00 00 00 00 00 01 00 00 00 00 FF FF 00]");
//        MessageCodec.decode(bytes);
        String str = "f2000000ca150500000193b551375d007465737432303234313231313132333435000000000000001d00000193b5513754b117f2ee4b9f44f8000013880000000020000000040280ffffffff00007d70000011430000008a0000ffff08200174005c010075a86e00a78000000000000821c0000012000000ff00000049d87c86ffffffffffffffffffffffffffff010600ffffffffff0000ffff7bffffffffffffffffffff00ff00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff6e00000000000000000001010101010101";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < str.length(); i += 2) {
            sb.append(str.charAt(i));
            sb.append(str.charAt(i + 1));
            sb.append(" ");
        }
        System.out.println(sb.toString());
    }


}
