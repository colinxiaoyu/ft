import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { px } from "../utils/ScreenUtils";
import { useNavigation } from "@react-navigation/native";

const BackCom = (props) => {

  const { title = '' } = props;

  const navigation = useNavigation()


  function handleBack () {
    navigation.goBack();
  }
  return <TouchableOpacity style={styles.back} onPress={handleBack}>
    <Image source={require('../assets/icon_back.png')} style={styles.backImg} />
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>

}

export default BackCom


const styles = StyleSheet.create({
  back: {
    width: px(150),
    padding: px(20),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

  },
  backImg: {
    width: px(24),
    height: px(24),
    marginRight: px(10),
  },
  title: {
    fontSize: px(24),
    color: '#000',

  },
})