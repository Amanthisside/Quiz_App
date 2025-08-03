import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QuestionCard } from './QuestionCard';
import { QuestionNavigation } from './QuestionNavigation';
import { Timer } from './Timer';
import { QuizState } from '@/types/quiz';
import { Flag, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface QuizPageProps {
  quizState: QuizState;
  onAnswer: (answer: string) => void;
  onGoToQuestion: (index: number) => void;
  onCompleteQuiz: () => void;
}

export const QuizPage = ({
  quizState,
  onAnswer,
  onGoToQuestion,
  onCompleteQuiz,
}: QuizPageProps) => {
  const [showNavigation, setShowNavigation] = useState(false);
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  
  const existingAnswer = quizState.answers.find(
    a => a.questionIndex === quizState.currentQuestionIndex
  );

  const answeredQuestions = new Set(quizState.answers.map(a => a.questionIndex));

  const handlePrevious = () => {
    if (quizState.currentQuestionIndex > 0) {
      onGoToQuestion(quizState.currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      onGoToQuestion(quizState.currentQuestionIndex + 1);
    }
  };

  const canGoPrevious = quizState.currentQuestionIndex > 0;
  const canGoNext = quizState.currentQuestionIndex < quizState.questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Quiz Challenge
              </h1>
              <Timer timeRemaining={quizState.timeRemaining} />
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNavigation(!showNavigation)}
                className="md:hidden"
              >
                {showNavigation ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-quiz-danger/10 border-quiz-danger/30 text-quiz-danger hover:bg-quiz-danger/20">
                    <Flag className="w-4 h-4 mr-2" />
                    Submit Quiz
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Quiz?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to submit your quiz? You have answered {answeredQuestions.size} out of {quizState.questions.length} questions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline">Continue Quiz</Button>
                    <Button onClick={onCompleteQuiz} className="bg-quiz-danger hover:bg-quiz-danger/90">
                      Submit Quiz
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Navigation - Mobile Collapsible */}
            <div className={`lg:col-span-1 ${showNavigation ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-24">
                <QuestionNavigation
                  totalQuestions={quizState.questions.length}
                  currentQuestion={quizState.currentQuestionIndex}
                  visitedQuestions={quizState.visitedQuestions}
                  answeredQuestions={answeredQuestions}
                  onQuestionSelect={onGoToQuestion}
                />
              </div>
            </div>

            {/* Question Content */}
            <div className="lg:col-span-3">
              {currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  questionIndex={quizState.currentQuestionIndex}
                  totalQuestions={quizState.questions.length}
                  existingAnswer={existingAnswer}
                  onAnswer={onAnswer}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  canGoPrevious={canGoPrevious}
                  canGoNext={canGoNext}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};