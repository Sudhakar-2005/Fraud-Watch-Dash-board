import { useCallback, useRef } from "react";

type NotificationType = "fraud" | "warning" | "info";

const frequencies: Record<NotificationType, number[]> = {
  fraud: [880, 660, 880], // Urgent alert pattern
  warning: [660, 520],     // Warning beeps
  info: [520],             // Simple beep
};

export const useNotificationSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isEnabledRef = useRef(true);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, startTime: number) => {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }, [getAudioContext]);

  const playNotification = useCallback((type: NotificationType) => {
    if (!isEnabledRef.current) return;

    const audioContext = getAudioContext();
    const tones = frequencies[type];
    const toneDuration = 0.15;
    const gap = 0.1;

    tones.forEach((freq, index) => {
      playTone(freq, toneDuration, audioContext.currentTime + index * (toneDuration + gap));
    });
  }, [getAudioContext, playTone]);

  const setEnabled = useCallback((enabled: boolean) => {
    isEnabledRef.current = enabled;
  }, []);

  return { playNotification, setEnabled };
};
