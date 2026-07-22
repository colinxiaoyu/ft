package cn.cicv.cloud.codec;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

public class UnsignedByteBuffer {

    private ByteBuffer buffer;
    private static final short UNSIGNED_BYTE_MASK = 0xFF;
    private static final int UNSIGNED_SHORT_MASK = 0xFFFF;
    private static final long UNSIGNED_INT_MASK = 0xFFFFFFFFL;

    public static UnsignedByteBuffer wrap(byte[] array) {
        UnsignedByteBuffer unsignedByteBuffer = new UnsignedByteBuffer();
        unsignedByteBuffer.buffer = ByteBuffer.wrap(array);
        return unsignedByteBuffer;
    }

    public static UnsignedByteBuffer allocate(int size) {
        UnsignedByteBuffer unsignedByteBuffer = new UnsignedByteBuffer();
        unsignedByteBuffer.buffer = ByteBuffer.allocate(size);
        return unsignedByteBuffer;
    }

    public byte[] array() {
        return buffer.array();
    }

    public byte[] getArray() {
        byte[] writtenData = new byte[buffer.position()];
        buffer.flip();
        buffer.get(writtenData);
        return writtenData;
    }

    public int position() {
        return buffer.position();
    }

    public short getUnsignedByte() {
        return (short) (buffer.get() & UNSIGNED_BYTE_MASK);
    }

    public int getUnsignedShort() {
        return buffer.getShort() & UNSIGNED_SHORT_MASK;
    }

    public long getUnsignedInt() {
        return buffer.getInt() & UNSIGNED_INT_MASK;
    }

    public long getLong() {
        return buffer.getLong();
    }

    public String getString(int len) {
        byte[] bytes = new byte[len];
        buffer.get(bytes);
        return new String(bytes, StandardCharsets.UTF_8);
    }

    public void put(byte[] value) {
        buffer.put(value);
    }

    public void put(Short value) {
        buffer.put(value.byteValue());
    }

    public void putShort(Integer value) {
        buffer.putShort(value.shortValue());
    }

    public void putInt(Long value) {
        buffer.putInt(value.intValue());
    }

    public void putLong(Long value) {
        buffer.putLong(value);
    }

    public void putString(String string) {
        buffer.put(string.getBytes(StandardCharsets.UTF_8));
    }

}
