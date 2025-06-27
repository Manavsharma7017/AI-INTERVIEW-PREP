import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { sessionState } from '../../store/session';

const formatTime = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const Timer: React.FC = () => {
  const session = useRecoilValue(sessionState);
  const [elapsed, setElapsed] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!session.started_at) return;

    const startTime = new Date(session.started_at).getTime(); // from ISO string
    const updateElapsed = () => {
      const now = Date.now();
      const diffInSeconds = Math.floor((now - startTime) / 1000);
      setElapsed(diffInSeconds);
    };

    updateElapsed(); // update immediately
    intervalRef.current = setInterval(updateElapsed, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session.started_at]);

  return <span className="text-sm font-mono">{formatTime(elapsed)}</span>;
};

export default Timer;
  