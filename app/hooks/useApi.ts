import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { BehaviorSubject} from 'rxjs'
import { STORAGE_API_KEY } from '../constants/constants';
import { Alert } from 'react-native';
import { Configuration , OpenAIApi } from 'openai';

export enum Creator {
    Me = 0,
    Bot = 1,
}

export interface Message {
    text: string;
    from: Creator;
}

let messageSubject: BehaviorSubject<Message[]>

//hook
export const useApi = () => {
    const dummyMessages = [
        {
            text: 'What is React?',
            from: Creator.Me,
        },
        {
            text: 'React is a popular open-source JavaScript library used for building user interfaces (UIs). It was developed by Facebook and is widely used by developers to create dynamic and interactive web applications.',
            from: Creator.Bot
        }
    ]

    const [messages,setMessage] = useState<Message[]>()

    if(!messageSubject) {
        messageSubject = new BehaviorSubject(dummyMessages);
    }

    useEffect(() => {
        const subscription = messageSubject.subscribe((messages) => {
            setMessage(messages)
        })

        return () => {
            subscription.unsubscribe()
        }
    },[])

    const getCompletion = async ( prompt: string) => {
        const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY)

        if (!apiKey) {
            Alert.alert('No API key found')
            return
        }

        //ADD OUR MESSAGE
        const newMessage = {
            text: prompt,
            from: Creator.Me,
        }

        messageSubject.next([...messageSubject.value,newMessage])

        //SETUP OPENAI
        const configuration = new Configuration ({
            apiKey,
        })
        const openai = new OpenAIApi(configuration)

        //GET COMPLETION
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 1.5,
            messages: [{ role: 'user',content: prompt}]
        })

        console.log(completion.data.choices[0])

        const response = completion.data.choices[0].message?.content.trim() || 'Sorry, there was a problem'

        //ADD BOT MESSAGE
        const botMessage = {
            text: response,
            from: Creator.Bot
        }

        messageSubject.next([...messageSubject.value,botMessage])
        return true
    }
 
    const generateImage =async (prompt:string) => {
        const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY);

        if (!apiKey) {
            Alert.alert('No API key found');
            return
        }

        //STEUP OPENAI
        const configuration = new Configuration({
            apiKey,
        })
        const openai = new OpenAIApi(configuration)

        const completion = await openai.createImage({
            prompt,
            n:1,
            size: '1024x1024'

        })
        return completion.data.data[0].url;
    }

    const speechToText =async (audioUri:string) => {
        const apiKey = await AsyncStorage.getItem(STORAGE_API_KEY);
        if(!apiKey) {
            Alert.alert('No API key found');
            return
        }
        
        const formData = new FormData();
        const imageData = {
            uri: audioUri,
            type: 'audio/mp4',
            name: 'audio/m4a',
        }

        formData.append('file',imageData as unknown as Blob )
        formData.append('model','whisper-1')

        return fetch('https://api.openai.com/v1/audio/transcriptions',{
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'multipart/form-data',
            },
            body: formData
        }).then((response) => response.json())
    }

    return {
        messages,
        getCompletion,
        generateImage,
        speechToText
    }
}