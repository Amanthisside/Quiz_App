export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: string;
  isCorrect: boolean;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  timeRemaining: number;
  isQuizStarted: boolean;
  isQuizCompleted: boolean;
  userEmail: string;
  visitedQuestions: Set<number>;
}