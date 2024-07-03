import React, { useState, useRef } from 'react';
import axios from 'axios';
import { IoPlayCircle , IoPauseCircle } from "react-icons/io5";

const SpeechToText = ({callback}) => {
    const [recordedUrl, setRecordedUrl] = useState('');
    const [recording, set_recording] = useState(false);
    const mediaStream = useRef(null);
    const mediaRecorder = useRef(null);
    const chunks = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(
                { audio: true }
            );
            set_recording(true);
            mediaStream.current = stream;
            mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.current.push(e.data);
                }
            };
            mediaRecorder.current.onstop = async() => {
                const audioBlob = new Blob(chunks.current, { type: 'audio/wav' });
                const formData = new FormData();
                formData.append('audio', audioBlob, 'audio.wav');
                setRecordedUrl(audioBlob);
                console.log(formData)
                // console.log(first)
                try {
                    const response = await axios.post('https://sevend-assignment-backend.onrender.com//api/speech-to-text', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    callback(response.data)
                    console.log(response.data);
                } catch (error) {
                    console.error('Error:', error);
                }
                chunks.current = [];
            };
            mediaRecorder.current.start();
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };
    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
        }
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach((track) => {
                track.stop();
            });
        }
        set_recording(false)
    };

    return (
        <div>
            {/* <audio controls src={recordedUrl} /> */}
            {!recording? <IoPlayCircle className='record-button' onClick={startRecording}/>:
            <IoPauseCircle className='record-button' onClick={stopRecording}/>}
        </div>
    );
};

export default SpeechToText