import * as React from 'react'
import { useCallback, useRef, useState } from 'react'
import { Alert, Linking, StyleSheet, View } from 'react-native'
import { useCameraDevice, useCodeScanner } from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera'

import { useIsFocused } from '@react-navigation/core'
import { useIsForeground } from '../utils/useIsForeground'


const showCodeAlert = (value, onDismissed) => {
  const buttons = [
    {
      text: 'Close',
      style: 'cancel',
      onPress: onDismissed,
    },
  ]
  if (value.startsWith('http')) {
    buttons.push({
      text: 'Open URL',
      onPress: () => {
        Linking.openURL(value)
        onDismissed()
      },
    })
  }
  Alert.alert('Scanned Code', value, buttons)
}

export default function QRScannerScreen ({ navigation }) {

  const device = useCameraDevice('back')

  const isFocused = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocused && isForeground

  // 3. (Optional) enable a torch setting
  const [torch, setTorch] = useState(false)

  // 4. On code scanned, we show an aler to the user
  const isShowingAlert = useRef(false)
  const onCodeScanned = useCallback((codes) => {
    console.log(`Scanned ${codes.length} codes:`, codes)
    const value = codes[0]?.value
    if (value == null) return
    if (isShowingAlert.current) return
    showCodeAlert(value, () => {
      isShowingAlert.current = false
    })
    isShowingAlert.current = true
  }, [])

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: onCodeScanned,
  })

  return (
    <View style={styles.container}>
      {device != null && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          codeScanner={codeScanner}
          torch={torch ? 'on' : 'off'}
          enableZoomGesture={true}
        />
      )}


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
})