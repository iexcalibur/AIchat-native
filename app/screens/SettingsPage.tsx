import { View, Text, Alert, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_API_KEY } from '../constants/constants';
import { useNavigation } from '@react-navigation/native';

const SettingsPage = () => {

  const [apiKey,setApiKey] = useState('');
  const [hasKey,setHasKey] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus',() => {
      loadApiKey()
    })
    return unsubscribe;
  },[navigation])

  const loadApiKey = async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_API_KEY)
      if(value !== null) {
        setApiKey(value)
        setHasKey(true)
      }else {
        setHasKey(false);
        setApiKey('')
      }
    } catch(e) {
      //
      Alert.alert('Error')
    }
  }

  const saveApiKey = async () =>{
    try {
      await AsyncStorage.setItem(STORAGE_API_KEY,apiKey)
      setHasKey(true)
      Toast.show('API key saved',{ duration: Toast.durations.SHORT})
    } catch(e) {
      //
      Alert.alert('Error')
    }

  }

  const removeApiKey = async () =>{
    try {
      await AsyncStorage.removeItem(STORAGE_API_KEY)
      setHasKey(false)
      setApiKey('')

    } catch(e) {
      //
      Alert.alert('Error')
    }

  }

  return (
    <View style={styles.container}>
      { hasKey && (
        <>
          <Text style={styles.label}> You are all set !!</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={removeApiKey}
          >
            <Text style={styles.buttonText}>
              Remove API Key
            </Text>
          </TouchableOpacity>
        </>
      )}
      { !hasKey && (
        <>
          <Text style={styles.label}>API Key:</Text>
          <TextInput 
            style={styles.input}
            value={apiKey} 
            onChangeText={setApiKey} 
            autoCapitalize='none'
            placeholder='Enter you API key'
          />
          <TouchableOpacity 
            onPress={saveApiKey}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Save API Key</Text>
          </TouchableOpacity>
        </>
      )

      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    
  },
  input: {
    borderWidth:1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal:10,
    paddingVertical:10,
    marginBottom: 20,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#18191a',
    borderRadius: 5,
    padding: 10,
  
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  }
})

//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

export default SettingsPage