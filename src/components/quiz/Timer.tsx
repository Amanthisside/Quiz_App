import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  timeRemaining: number;
}

export const Timer = ({ timeRemaining }: TimerProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining <= 300; // 5 minutes
  const isCriticalTime = timeRemaining <= 60; // 1 minute

  const getTimerColor = () => {
    if (isCriticalTime) return 'text-quiz-danger';
    if (isLowTime) return 'text-quiz-warning';
    return 'text-quiz-primary';
  };

  const getBackgroundColor = () => {
    if (isCriticalTime) return 'bg-quiz-danger/10 border-quiz-danger/20';
    if (isLowTime) return 'bg-quiz-warning/10 border-quiz-warning/20';
    return 'bg-quiz-primary/10 border-quiz-primary/20';
  };

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm ${getBackgroundColor()} transition-colors duration-300`}>
      {isCriticalTime ? (
        <AlertTriangle className={`w-5 h-5 ${getTimerColor()} animate-pulse`} />
      ) : (
        <Clock className={`w-5 h-5 ${getTimerColor()}`} />
      )}
      <span className={`font-mono text-lg font-bold ${getTimerColor()}`}>
        {formatTime(timeRemaining)}
      </span>
      {isLowTime && (
        <span className={`text-xs ${getTimerColor()} animate-pulse`}>
          {isCriticalTime ? 'URGENT!' : 'Low Time'}
        </span>
      )}
    </div>
  );
};