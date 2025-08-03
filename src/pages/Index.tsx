import { useEffect } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import { StartPage } from '@/components/quiz/StartPage';
import { QuizPage } from '@/components/quiz/QuizPage';
import { ResultsPage } from '@/components/quiz/ResultsPage';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const {
    quizState,
    isLoading,
    error,
    fetchQuestions,
    startQuiz,
    goToQuestion,
    answerQuestion,
    completeQuiz,
    resetQuiz,
  } = useQuiz();

  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleStart = (email: string) => {
    if (quizState.questions.length === 0) {
      toast({
        title: "Loading...",
        description: "Please wait while we load the quiz questions.",
      });
      return;
    }
    startQuiz(email);
  };

  const handleComplete = () => {
    completeQuiz();
    toast({
      title: "Quiz Submitted!",
      description: "Your answers have been saved successfully.",
    });
  };

  const handleRestart = () => {
    resetQuiz();
    fetchQuestions();
  };

  // Show results page if quiz is completed
  if (quizState.isQuizCompleted) {
    return <ResultsPage quizState={quizState} onRestart={handleRestart} />;
  }

  // Show quiz page if quiz is started
  if (quizState.isQuizStarted) {
    return (
      <QuizPage
        quizState={quizState}
        onAnswer={answerQuestion}
        onGoToQuestion={goToQuestion}
        onCompleteQuiz={handleComplete}
      />
    );
  }

  // Show start page by default
  return <StartPage onStart={handleStart} isLoading={isLoading} />;
};

export default Index;
