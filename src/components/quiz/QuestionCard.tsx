import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Question, QuizAnswer } from '@/types/quiz';
import { CheckCircle, Circle, ArrowLeft, ArrowRight } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  existingAnswer?: QuizAnswer;
  onAnswer: (answer: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const QuestionCard = ({
  question,
  questionIndex,
  totalQuestions,
  existingAnswer,
  onAnswer,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    existingAnswer?.selectedAnswer || null
  );

  // Shuffle answers for display
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  useEffect(() => {
    const answers = [question.correct_answer, ...question.incorrect_answers];
    const shuffled = [...answers].sort(() => Math.random() - 0.5);
    setShuffledAnswers(shuffled);
  }, [question]);

  useEffect(() => {
    setSelectedAnswer(existingAnswer?.selectedAnswer || null);
  }, [existingAnswer]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-quiz-success text-white';
      case 'medium': return 'bg-quiz-warning text-white';
      case 'hard': return 'bg-quiz-danger text-white';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-quiz-primary border-quiz-primary/30">
              Question {questionIndex + 1} / {totalQuestions}
            </Badge>
            <Badge className={getDifficultyColor(question.difficulty)}>
              {question.difficulty}
            </Badge>
          </div>
          <Badge variant="secondary" className="text-xs">
            {question.category}
          </Badge>
        </div>
        
        <CardTitle className="text-xl leading-relaxed mt-4">
          {question.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {shuffledAnswers.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            
            return (
              <Button
                key={index}
                variant="outline"
                className={`
                  h-auto p-4 text-left justify-start transition-all duration-200 group
                  ${isSelected 
                    ? 'bg-quiz-primary/10 border-quiz-primary text-quiz-primary shadow-glow' 
                    : 'hover:bg-muted/50 hover:border-border'
                  }
                `}
                onClick={() => handleAnswerSelect(answer)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                    ${isSelected 
                      ? 'border-quiz-primary bg-quiz-primary' 
                      : 'border-muted-foreground group-hover:border-quiz-primary'
                    }
                  `}>
                    {isSelected ? (
                      <CheckCircle className="w-3 h-3 text-white" />
                    ) : (
                      <Circle className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <span className="flex-1 text-sm leading-relaxed">{answer}</span>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-6">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {selectedAnswer ? (
              <span className="text-quiz-success flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Answer selected
              </span>
            ) : (
              'Select an answer'
            )}
          </div>

          <Button
            variant="outline"
            onClick={onNext}
            disabled={!canGoNext}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};