import { useEffect, useRef } from 'react';

interface InactivityMonitorProps {
  timeout: number;              // en ms
  onTimeout: () => void;
}

export const InactivityMonitor: React.FC<InactivityMonitorProps> = ({
  timeout,
  onTimeout
}) => {
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(onTimeout, timeout);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    // init the timer for each event
    events.forEach((e) => document.addEventListener(e, reset));
    //Activate timer
    reset();
    return () => {
      events.forEach((e) => document.removeEventListener(e, reset));
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return null;  
};
