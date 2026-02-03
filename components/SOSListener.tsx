'use client';

import { useEffect, useRef, useState } from 'react';

/* ================= CONFIG ================= */

// 🔴 REAL WhatsApp numbers (country code ke saath, no +, no spaces)
const TRUSTED_CONTACTS = [
  '919569939178',
  '918XXXXXXXXX',
];

// Emergency voice phrases
const EMERGENCY_PHRASES = [
//   'i need help',
//   'help me',
//   'emergency',
//   'save me',
//   'sos',
  'safar lamba hai',
];

/* ================= TYPES ================= */
// Speech Recognition typing fix
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

/* ================= COMPONENT ================= */

export default function SOSListener() {
  const [status, setStatus] = useState<
    'idle' | 'listening' | 'sos-triggered'
  >('idle');

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const sosTriggeredRef = useRef(false);

  /* ========== INIT SPEECH RECOGNITION ========== */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('❌ Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListeningRef.current = true;
      setStatus('listening');
    };

    recognition.onend = () => {
      isListeningRef.current = false;

      // auto-restart unless SOS already fired
      if (!sosTriggeredRef.current) {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognition.onresult = (event: any) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript
          .toLowerCase()
          .trim();

      console.log('🎙 Heard:', transcript);

      if (
        !sosTriggeredRef.current &&
        EMERGENCY_PHRASES.some(p => transcript.includes(p))
      ) {
        triggerSOS();
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('🎤 Speech error:', event.error);

      if (event.error === 'not-allowed') {
        alert('Microphone permission denied. SOS disabled.');
        setStatus('idle');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  /* ========== START LISTENING AFTER USER INTERACTION ========== */
  useEffect(() => {
    const handleUserInteraction = () => {
      if (
        recognitionRef.current &&
        !isListeningRef.current &&
        status === 'idle'
      ) {
        try {
          recognitionRef.current.start();
        } catch {}
      }
    };

    document.addEventListener('click', handleUserInteraction);
    return () =>
      document.removeEventListener('click', handleUserInteraction);
  }, [status]);

  /* ========== SOS TRIGGER FUNCTION ========== */
  const triggerSOS = async () => {
    if (sosTriggeredRef.current) return;

    sosTriggeredRef.current = true;
    setStatus('sos-triggered');
    recognitionRef.current?.stop();

    let message =
      '🚨 SOS ALERT 🚨\nI am in danger. Please help me immediately.';

    // 📍 Try to get live location
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          })
      );

      const { latitude, longitude } = position.coords;
      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      message += `\n📍 Live Location: ${mapsLink}`;
    } catch {
      message += '\n📍 Location unavailable';
    }

    const encodedMessage = encodeURIComponent(message);

    // 📲 Open WhatsApp for each trusted contact
    TRUSTED_CONTACTS.forEach(phone => {
      window.open(
        `https://wa.me/${phone}?text=${encodedMessage}`,
        '_blank'
      );
    });
  };

  /* ========== UI BANNER ========== */
  return (
    <div className="fixed top-16 left-0 right-0 z-50 bg-red-600 text-white text-center py-2 px-4 shadow-lg">
      <p className="text-sm font-semibold">
        {status === 'idle' &&
          '🚨 Emergency? Tap anywhere & say "Safar Lamba Hai.."'}
        {status === 'listening' && '🎙 Listening for SOS…'}
        {status === 'sos-triggered' &&
          '🚨 SOS Triggered! Notifying trusted contacts'}
      </p>
    </div>
  );
}
