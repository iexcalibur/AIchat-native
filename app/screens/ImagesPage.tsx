import React, { useState } from 'react'
import { Text, View ,StyleSheet ,TextInput, TouchableOpacity, ActivityIndicator , Image} from 'react-native'
import { useApi } from '../hooks/useApi'



const ImagesPage = () => {

  const [input,setInput] = useState('')
  const { generateImage } = useApi()
  const [image,setImage] = useState()
  const [loading,setLoading] = useState(false)

  const onGenerateImage = async () => {
    setLoading(true);
    const image = await generateImage(input);
    console.log('onGenerateimage',image);
    setImage(image || '');
    setLoading(false)
    setInput('')
  }

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder='Search...'
        editable={!loading}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={onGenerateImage}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          Generate Image
        </Text>
      </TouchableOpacity>
      {loading && < ActivityIndicator style={{ marginTop: 20}} size={'large'} />}
      {image && <Image style={{ width: '100%', height: 300, marginTop: 20}} source={{ uri: image}} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingHorizontal:20,
    paddingVertical:20
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 10,
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
    color: 'white',
    textAlign: 'center',
    fontSize: 16
  },
})

export default ImagesPage
