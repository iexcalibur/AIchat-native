import { View, Text , StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Audio } from 'expo-av';
import { useApi } from '../hooks/useApi';
import { STORAGE_API_KEY } from '../constants/constants';

const WhisperPage = () => {

  const [ result ,setResult ] = useState(STORAGE_API_KEY);
  const [loading, setLoading] = useState(false);
  const [recording,setRecording] = useState<Audio.Recording>()
  const { speechToText } = useApi()

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      })

      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording)
    } catch (error) {
      console.log(error)
    }
  }

  const stopRecording =async () => {
    setRecording(undefined)
    await recording?.stopAndUnloadAsync()
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false
    })
    
    uploadAudio()
  }

  const uploadAudio = async () => {
    const uri = recording?.getURI()
    if (!uri) {
      return
    }
    setLoading(true)
    try {
      const result = await speechToText(uri)
      setResult(result.text)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }
  return (
    <View style={styles.containter}>
      {!recording && (
        <TouchableOpacity style={styles.button} onPress={startRecording} disabled={loading}>
          <Text style={styles.buttonText}> Record</Text>
        </TouchableOpacity>
      )}
      {recording && (
        <TouchableOpacity style={styles.buttonStop} onPress={stopRecording} disabled={loading}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      )}
      {loading && <ActivityIndicator style={{ marginTop: 20}} size={'large'} />}
      {result && <Text style={styles.text}> {result} </Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  containter: {
      flex:1,
      paddingHorizontal:20,
      paddingVertical:20
  },
  button: {
    backgroundColor: '#18191a',
    borderRadius: 5,
    padding: 10
  },
  buttonStop: {
    backgroundColor: '#840f15',
    borderRadius: 5,
    padding: 10
  },
  buttonText:{
    color:'white',
    textAlign:'center',
    fontSize: 16
  },
  text: {
    fontSize:20,
    marginTop:20,
    textAlign:'center'
  }
})

export default WhisperPage