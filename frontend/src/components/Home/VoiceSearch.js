import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate } from 'react-router-dom';

const VoiceSearch = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState('en-US');

  const {
    transcript: speechTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    setTranscript(speechTranscript);
  }, [speechTranscript]);

  const handleStartListening = () => {
    resetTranscript();
    setTranscript('');
    SpeechRecognition.startListening({ continuous: true, language });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleProcessVoice = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/voice/process-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          text: transcript,
          language,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const { intent, service, time, urgency } = result.result;

        if (intent === 'book_service') {
          const query = `service=${service}&time=${time}&urgency=${urgency}`;
          navigate(`/book-service?${query}`);
        } else if (intent === 'find_expert') {
          navigate(`/experts?category=${service}`);
        } else if (intent === 'emergency') {
          navigate('/emergency');
        }

        onClose();
      }
    } catch (error) {
      console.error('Voice processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const languages = [
    { code: 'en-US', name: 'English' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'mr-IN', name: 'Marathi' },
    { code: 'gu-IN', name: 'Gujarati' },
    { code: 'ta-IN', name: 'Tamil' },
    { code: 'te-IN', name: 'Telugu' },
    { code: 'bn-IN', name: 'Bengali' },
    { code: 'pa-IN', name: 'Punjabi' },
  ];

  if (!browserSupportsSpeechRecognition) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Voice Search Not Supported</h3>
              <p className="text-gray-600 mb-6">
                Your browser doesn't support speech recognition. Use Chrome, Edge, or Safari.
              </p>
              <button
                onClick={onClose}
                className="btn-primary btn-lg px-6"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 flex items-center justify-between">
              <h3 className="font-semibold">Voice Search</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">✕</button>
            </div>

            {/* Language Selection */}
            <div className="p-4 border-b">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Interface */}
            <div className="p-6 text-center">
              <div className="mb-6">
                <motion.div
                  className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                    listening ? 'bg-red-500 animate-pulse' : 'bg-gray-100'
                  }`}
                  animate={listening ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: listening ? Infinity : 0 }}
                >
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </motion.div>
              </div>

              <div className="mb-4">
                {listening ? (
                  <p className="text-red-600 font-medium">Listening... Speak now</p>
                ) : transcript ? (
                  <p className="text-green-600 font-medium">Ready to process</p>
                ) : (
                  <p className="text-gray-600">Click to start speaking</p>
                )}
              </div>

              {transcript && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 text-sm"><span className="font-medium">You said:</span> {transcript}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 justify-center">
                {!listening ? (
                  <button onClick={handleStartListening} className="btn-primary btn-lg px-6">Start Speaking</button>
                ) : (
                  <button onClick={handleStopListening} className="btn-danger btn-lg px-6">Stop</button>
                )}

                {transcript && !isProcessing && (
                  <button onClick={handleProcessVoice} className="btn-secondary btn-lg px-6">Process</button>
                )}

                {isProcessing && (
                  <div className="btn-secondary btn-lg px-6 flex items-center gap-2 opacity-50">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceSearch;


