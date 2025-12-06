import React, { useState, useRef } from 'react';

const VoiceButton = ({ onVoiceCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [editableText, setEditableText] = useState('');
  const [showTextBox, setShowTextBox] = useState(false);
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Get Deepgram API key from environment variable
  // Make sure to add VITE_DEEPGRAM_API_KEY to your .env file
  const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;

  const startListening = async () => {
    try {
      setError('');
      setTranscript('');
      setEditableText('');
      setShowTextBox(false);
      audioChunksRef.current = [];

      // Request microphone access with better quality settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 48000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      streamRef.current = stream;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      // Collect audio chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('📦 Audio chunk received:', event.data.size, 'bytes');
        }
      };

      // When recording stops, send to Deepgram
      mediaRecorder.onstop = async () => {
        console.log('🛑 Recording stopped, processing audio...');
        
        // Create audio blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        console.log('🎵 Audio blob size:', audioBlob.size, 'bytes');
        
        if (audioBlob.size === 0) {
          setError('No audio recorded. Please try again.');
          return;
        }

        // Send to Deepgram
        await transcribeAudio(audioBlob);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      // Start recording - collect data more frequently
      mediaRecorder.start(250); // Collect data every 250ms for better quality
      setIsListening(true);
      console.log('🎤 Recording started...');

    } catch (error) {
      console.error('❌ Error starting recording:', error);
      
      if (error.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access.');
      } else if (error.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.');
      } else {
        setError(`Error: ${error.message}`);
      }
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      console.log('⏹️ Stopping recording...');
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      setTranscript('Processing your speech...');

      // Check if API key is set
      if (!DEEPGRAM_API_KEY || DEEPGRAM_API_KEY === 'YOUR_DEEPGRAM_API_KEY_HERE') {
        setError('⚠️ Please add your Deepgram API key in the code. Get it free from https://deepgram.com');
        setTranscript('');
        return;
      }

      console.log('🎵 Sending audio blob:', audioBlob.size, 'bytes', audioBlob.type);

      // Send to Deepgram API with better parameters
      const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': audioBlob.type
        },
        body: audioBlob
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Deepgram API error:', response.status, errorText);
        throw new Error(`Deepgram API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('📝 Deepgram response:', data);
      console.log('📝 Full results:', JSON.stringify(data.results, null, 2));

      // Extract transcript - try multiple paths
      let transcribedText = '';
      
      if (data.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
        transcribedText = data.results.channels[0].alternatives[0].transcript;
      } else if (data.results?.channels?.[0]?.alternatives?.[0]?.words) {
        // If transcript is empty, try constructing from words
        const words = data.results.channels[0].alternatives[0].words;
        transcribedText = words.map(w => w.word).join(' ');
      }
      
      console.log('📝 Extracted transcript:', transcribedText);
      console.log('📝 Transcript length:', transcribedText.length);
      
      if (transcribedText && transcribedText.trim()) {
        console.log('✅ Success! Transcript:', transcribedText);
        setEditableText(transcribedText.trim());
        setShowTextBox(true);
        setTranscript('');
      } else {
        console.error('❌ No transcript found in response');
        console.error('Full response structure:', data);
        setError('No speech detected. Please speak louder and try again.');
        setTranscript('');
      }

    } catch (error) {
      console.error('❌ Transcription error:', error);
      setError(`Transcription failed: ${error.message}`);
      setTranscript('');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSend = () => {
    if (editableText.trim()) {
      onVoiceCommand(editableText.trim());
      setEditableText('');
      setShowTextBox(false);
      setTranscript('');
      setError('');
    }
  };

  const handleCancel = () => {
    setEditableText('');
    setShowTextBox(false);
    setTranscript('');
    setError('');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[9999]">
      {/* Error Message */}
      {error && (
        <div className="absolute bottom-20 sm:bottom-24 right-0 bg-red-900 border-2 border-red-500 rounded-xl shadow-2xl p-4 mb-2 w-80 animate-fade-in">
          <div className="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-200">Error</p>
              <p className="text-xs text-red-300 mt-1">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Recording Indicator */}
      {isListening && (
        <div className="absolute bottom-20 sm:bottom-24 right-0 bg-gray-800 rounded-xl shadow-2xl p-4 mb-2 w-72 animate-fade-in border-2 border-red-500">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold text-gray-100">Recording...</p>
            </div>
            {transcript && (
              <div className="bg-gray-700 p-2 rounded">
                <p className="text-sm text-gray-300 italic">{transcript}</p>
              </div>
            )}
            {!transcript && (
              <p className="text-xs text-gray-400">Start speaking...</p>
            )}
            <p className="text-xs text-gray-400 font-semibold">Click button to stop</p>
          </div>
        </div>
      )}
      
      {/* Processing Indicator */}
      {transcript && !isListening && !showTextBox && (
        <div className="absolute bottom-20 sm:bottom-24 right-0 bg-gray-800 rounded-xl shadow-2xl p-4 mb-2 w-72 animate-fade-in border-2 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
            <p className="text-sm text-gray-300">{transcript}</p>
          </div>
        </div>
      )}
      
      {/* Editable Text Box */}
      {showTextBox && !isListening && (
        <div className="absolute bottom-20 sm:bottom-24 right-0 bg-gray-800 rounded-xl shadow-2xl p-4 mb-2 w-80 animate-fade-in border-2 border-indigo-500">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-indigo-400">📝 Edit your command</p>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Cancel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <textarea
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 text-sm placeholder-gray-500 focus:border-indigo-500 outline-none resize-none"
              rows="3"
              placeholder="Edit your command here..."
              autoFocus
            />
            
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!editableText.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Button */}
      <button
        onClick={toggleListening}
        className={`relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isListening
            ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
        }`}
        aria-label={isListening ? 'Stop recording' : 'Start voice input'}
      >
        {/* Ripple Effect */}
        {isListening && (
          <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></span>
        )}
        
        {/* Icon */}
        <div className="relative flex items-center justify-center w-full h-full">
          {isListening ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap shadow-xl">
            {isListening ? 'Click to stop' : 'Click to start'}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default VoiceButton;