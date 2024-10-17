import React, { useState, useEffect } from 'react';
import * as JsSIP from 'jssip';
import { Phone } from 'lucide-react';

function App() {
  const [userAgent, setUserAgent] = useState<JsSIP.UA | null>(null);
  const [status, setStatus] = useState('Disconnected');

  useEffect(() => {
    const socket = new JsSIP.WebSocketInterface('wss://your-kamailio-server:8443');
    const configuration = {
      sockets: [socket],
      uri: 'sip:your-username@your-sip-domain.com',
      password: 'your-password'
    };

    const ua = new JsSIP.UA(configuration);

    ua.on('connected', () => setStatus('Connected'));
    ua.on('disconnected', () => setStatus('Disconnected'));
    ua.on('registered', () => setStatus('Registered'));
    ua.on('unregistered', () => setStatus('Unregistered'));

    ua.start();
    setUserAgent(ua);

    return () => {
      ua.stop();
    };
  }, []);

  const handleCall = () => {
    if (userAgent) {
      const options = {
        mediaConstraints: { audio: true, video: false }
      };
      userAgent.call('sip:destination@your-sip-domain.com', options);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Custom Calling App</h1>
        <p className="mb-4">Status: {status}</p>
        <button
          onClick={handleCall}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <Phone className="mr-2" />
          Make Call
        </button>
      </div>
    </div>
  );
}

export default App;