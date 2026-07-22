import React, { useState, useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, Image, TextInput } from 'react-native';
import { height, px, width } from '../utils/ScreenUtils';

const testdata = [
  { id: 0, value: 'ORDER2024042316255170997-0001' },
  { id: 1, value: 'ORDER2024042316255170997-0001' },
  { id: 2, value: 'ORDER2024042316255170997-0002' },
  { id: 3, value: 'ORDER2024042316255170997-0003' },
  { id: 4, value: 'ORDER2024042316255170997-0004' },
  { id: 5, value: 'ORDER2024042316255170997-0005' },
];

const InputPickerModal = forwardRef((props, ref) => {

  const { title = '', direction = 'column', addAll = true,
    style, initData = testdata, onSelect, otherFiliter = () => { return false }, value } = props;

  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(initData);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (addAll && !initData.some((item => item.value === '全部'))) {
      initData.unshift({ id: undefined, value: '全部' })

    }
    setData(initData)
  }, [initData])

  useImperativeHandle(ref, () => ({
    resetData: () => {
      setSearchQuery('')
      setData(initData)
    },
  }));


  useEffect(() => {
    const filteredData = initData.filter(item =>
      // item.value.toLowerCase().includes(searchQuery.toLowerCase()) || item?.goodsNamePy?.toLowerCase().includes(searchQuery.toLowerCase())
      item.value.toLowerCase().includes(searchQuery.toLowerCase()) || item?.goodsNamePy?.toLowerCase().includes(searchQuery.toLowerCase()) || item.value === '全部' || otherFiliter(item, searchQuery)
    );

    setData(filteredData);
  }, [searchQuery, initData]);

  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const boxRef = useRef(null);
  const flatListRef = useRef(null);

  const handleSelect = (item) => {
    const res = data.map(i => {
      return {
        ...i,
        selected: i.id === item.id,
      };
    });

    setData(res);
    setVisible(false);

    onSelect && onSelect(item);
  };

  const handleScrollToIndexFailed = (error) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const onBoxLayout = (event) => {
    boxRef.current.measure((x, y, width, height, pageX, pageY) => {
      setModalPosition({ top: pageY + height, left: pageX });
    });
  };

  const selectedItem = useMemo(() => {
    return data.filter(item => item.selected)[0];
  }, [data]);

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <View ref={boxRef} onLayout={onBoxLayout}>
      <TouchableOpacity
        style={[styles.selectItem, direction === 'row' && styles.selectItemRow, style]}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.selectItemTitle}>{title}</Text>
        <View style={[styles.selectItemBottom, direction === 'row' ? { marginLeft: px(40), flex: 1 } : { marginBottom: px(10) }]}>
          {selectedItem?.value ? (
            <Text style={styles.selectItemValue} numberOfLines={1} ellipsizeMode="tail">{selectedItem?.value}</Text>
          ) : (
            <Text style={styles.selectItemValuePlaceholder}>请选择</Text>
          )}
          <Image source={require('../assets/icon_top.png')} style={[styles.selectImg, visible && styles.selectImgActive]} />
        </View>
      </TouchableOpacity>

      <Modal transparent={true} visible={visible} animationType="fade">
        <TouchableOpacity style={styles.overLayer} onPress={closeModal} />
        <View
          style={[
            styles.modalBackdropWrapper,
            { top: modalPosition.top, left: modalPosition.left },
          ]}
        >
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="请输入搜索内容"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              ref={flatListRef}
              data={data}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    item === selectedItem && styles.selectedItem,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item.value}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item?.id}
              style={styles.flatList}
              getItemLayout={(data, index) => ({
                length: px(50),
                offset: px(50) * index,
                index,
              })}
              onScrollToIndexFailed={handleScrollToIndexFailed}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  selectItem: {
    paddingHorizontal: px(20),
    paddingVertical: px(12),
    backgroundColor: '#fff',
    borderRadius: px(8),
    marginRight: px(10),
  },
  selectItemRow: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  selectItemTitle: {
    color: '#333',
    fontSize: px(24),
    fontWeight: 'bold',
  },
  selectItemValue: {
    color: '#333',
    fontSize: px(24),
  },
  selectItemValuePlaceholder: {
    color: '#999',
    fontSize: px(24),
  },
  selectImg: {
    width: px(11),
    height: px(9),
    tintColor: '#333333',
    transform: [{ rotate: '180deg' }],
  },
  selectImgActive: {
    transform: [{ rotate: '0deg' }],
  },
  selectItemBottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectItemBottomText: {
    fontSize: px(24),
    color: '#333',
  },
  selectItemBottomImg: {
    height: px(13),
    width: px(13),
  },
  overLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackdropWrapper: {
    position: 'absolute',
    zIndex: 99,
  },
  modalContent: {
    width: px(295),
    marginHorizontal: px(40),
    backgroundColor: 'white',
    padding: px(20),
    borderRadius: px(10),
  },
  searchInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: px(5),
    marginBottom: px(10),
    paddingHorizontal: px(10),
    fontSize: px(18),
  },
  flatList: {
    maxHeight: px(400),
  },
  modalItem: {
    padding: px(10),
    marginVertical: px(5),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: px(18),
    textAlign: 'center',
  },
  selectedItem: {
    backgroundColor: '#007BFF',
  },
});

export default InputPickerModal;
