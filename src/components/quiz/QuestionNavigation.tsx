import { Check, Eye, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  visitedQuestions: Set<number>;
  answeredQuestions: Set<number>;
  onQuestionSelect: (index: number) => void;
}

export const QuestionNavigation = ({
  totalQuestions,
  currentQuestion,
  visitedQuestions,
  answeredQuestions,
  onQuestionSelect,
}: QuestionNavigationProps) => {
  const getQuestionStatus = (index: number) => {
    if (answeredQuestions.has(index)) return 'answered';
    if (visitedQuestions.has(index)) return 'visited';
    return 'unvisited';
  };

  const getButtonVariant = (index: number) => {
    const status = getQuestionStatus(index);
    const isCurrent = index === currentQuestion;

    if (isCurrent) return 'default';
    if (status === 'answered') return 'outline';
    return 'ghost';
  };

  const getButtonClassName = (index: number) => {
    const status = getQuestionStatus(index);
    const isCurrent = index === currentQuestion;

    let baseClasses = 'relative transition-all duration-200 hover:scale-105';

    if (isCurrent) {
      baseClasses += ' ring-2 ring-quiz-primary shadow-glow';
    } else if (status === 'answered') {
      baseClasses += ' bg-quiz-success/10 border-quiz-success/30 text-quiz-success hover:bg-quiz-success/20';
    } else if (status === 'visited') {
      baseClasses += ' bg-quiz-warning/10 border-quiz-warning/30 text-quiz-warning hover:bg-quiz-warning/20';
    }

    return baseClasses;
  };

  const getStatusIcon = (index: number) => {
    const status = getQuestionStatus(index);
    
    if (status === 'answered') {
      return <Check className="w-3 h-3 absolute -top-1 -right-1 text-quiz-success" />;
    } else if (status === 'visited') {
      return <Eye className="w-3 h-3 absolute -top-1 -right-1 text-quiz-warning" />;
    }
    return <Circle className="w-2 h-2 absolute -top-1 -right-1 text-muted-foreground" />;
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        Question Overview
        <span className="text-xs text-muted-foreground">
          ({answeredQuestions.size}/{totalQuestions} answered)
        </span>
      </h3>
      
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, index) => (
          <Button
            key={index}
            variant={getButtonVariant(index)}
            size="sm"
            className={getButtonClassName(index)}
            onClick={() => onQuestionSelect(index)}
          >
            {index + 1}
            {getStatusIcon(index)}
          </Button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <Circle className="w-3 h-3 text-muted-foreground" />
          <span>Not visited</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3 text-quiz-warning" />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-1">
          <Check className="w-3 h-3 text-quiz-success" />
          <span>Answered</span>
        </div>
      </div>
    </div>
  );
};