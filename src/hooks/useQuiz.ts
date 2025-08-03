import { useState, useEffect, useCallback } from 'react';
import { Question, QuizAnswer, QuizState } from '@/types/quiz';

const QUIZ_TIME_LIMIT = 30 * 60; // 30 minutes in seconds

export const useQuiz = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    timeRemaining: QUIZ_TIME_LIMIT,
    isQuizStarted: false,
    isQuizCompleted: false,
    userEmail: '',
    visitedQuestions: new Set(),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions from API
  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=15&type=multiple');
      const data = await response.json();
      
      if (data.response_code === 0) {
        const questions: Question[] = data.results.map((q: any) => ({
          ...q,
          question: decodeHtmlEntities(q.question),
          correct_answer: decodeHtmlEntities(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map(decodeHtmlEntities),
        }));
        
        setQuizState(prev => ({
          ...prev,
          questions,
        }));
      } else {
        throw new Error('Failed to fetch questions');
      }
    } catch (err) {
      setError('Failed to load quiz questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start the quiz
  const startQuiz = useCallback((email: string) => {
    setQuizState(prev => ({
      ...prev,
      isQuizStarted: true,
      userEmail: email,
      visitedQuestions: new Set([0]),
    }));
  }, []);

  // Timer countdown
  useEffect(() => {
    if (quizState.isQuizStarted && !quizState.isQuizCompleted && quizState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setQuizState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);

      return () => clearInterval(timer);
    } else if (quizState.timeRemaining === 0 && !quizState.isQuizCompleted) {
      completeQuiz();
    }
  }, [quizState.isQuizStarted, quizState.isQuizCompleted, quizState.timeRemaining]);

  // Navigate to question
  const goToQuestion = useCallback((index: number) => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: index,
      visitedQuestions: new Set([...prev.visitedQuestions, index]),
    }));
  }, []);

  // Answer question
  const answerQuestion = useCallback((selectedAnswer: string) => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    setQuizState(prev => {
      const newAnswers = [...prev.answers];
      const existingAnswerIndex = newAnswers.findIndex(
        a => a.questionIndex === prev.currentQuestionIndex
      );

      const newAnswer: QuizAnswer = {
        questionIndex: prev.currentQuestionIndex,
        selectedAnswer,
        isCorrect,
      };

      if (existingAnswerIndex >= 0) {
        newAnswers[existingAnswerIndex] = newAnswer;
      } else {
        newAnswers.push(newAnswer);
      }

      return {
        ...prev,
        answers: newAnswers,
      };
    });
  }, [quizState.questions, quizState.currentQuestionIndex]);

  // Complete quiz
  const completeQuiz = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      isQuizCompleted: true,
    }));
  }, []);

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: QUIZ_TIME_LIMIT,
      isQuizStarted: false,
      isQuizCompleted: false,
      userEmail: '',
      visitedQuestions: new Set(),
    });
  }, []);

  return {
    quizState,
    isLoading,
    error,
    fetchQuestions,
    startQuiz,
    goToQuestion,
    answerQuestion,
    completeQuiz,
    resetQuiz,
  };
};

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}