import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QuizState } from '@/types/quiz';
import { Trophy, RefreshCw, CheckCircle, XCircle, Clock, Mail } from 'lucide-react';

interface ResultsPageProps {
  quizState: QuizState;
  onRestart: () => void;
}

export const ResultsPage = ({ quizState, onRestart }: ResultsPageProps) => {
  const totalQuestions = quizState.questions.length;
  const answeredQuestions = quizState.answers.length;
  const correctAnswers = quizState.answers.filter(a => a.isCorrect).length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const timeUsed = (30 * 60) - quizState.timeRemaining;
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = () => {
    if (scorePercentage >= 80) return 'text-quiz-success';
    if (scorePercentage >= 60) return 'text-quiz-warning';
    return 'text-quiz-danger';
  };

  const getScoreGradient = () => {
    if (scorePercentage >= 80) return 'bg-gradient-success';
    if (scorePercentage >= 60) return 'bg-gradient-to-r from-quiz-warning to-quiz-primary';
    return 'bg-gradient-danger';
  };

  const getPerformanceMessage = () => {
    if (scorePercentage >= 90) return 'Outstanding! 🏆';
    if (scorePercentage >= 80) return 'Excellent work! 🌟';
    if (scorePercentage >= 70) return 'Good job! 👍';
    if (scorePercentage >= 60) return 'Not bad! 📈';
    return 'Keep practicing! 💪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mx-auto mb-4 w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow animate-pulse-glow">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Quiz Complete!
          </h1>
          <p className="text-lg text-muted-foreground">{getPerformanceMessage()}</p>
        </div>

        {/* Score Summary */}
        <Card className="mb-8 shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle className="text-center">Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>
                {scorePercentage}%
              </div>
              <div className="text-lg text-muted-foreground">
                {correctAnswers} out of {totalQuestions} correct
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-quiz-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-quiz-success">{correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <XCircle className="w-8 h-8 text-quiz-danger mx-auto mb-2" />
                <div className="text-2xl font-bold text-quiz-danger">{totalQuestions - correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="w-8 h-8 text-quiz-warning mx-auto mb-2" />
                <div className="text-2xl font-bold text-quiz-warning">{formatTime(timeUsed)}</div>
                <div className="text-sm text-muted-foreground">Time Used</div>
              </div>
            </div>

            <Progress value={scorePercentage} className="h-3 mb-4" />
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              Results for: {quizState.userEmail}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="mb-8 shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle>Question by Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quizState.questions.map((question, index) => {
                const userAnswer = quizState.answers.find(a => a.questionIndex === index);
                const isAnswered = !!userAnswer;
                const isCorrect = userAnswer?.isCorrect || false;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      !isAnswered
                        ? 'bg-muted/30 border-muted'
                        : isCorrect
                        ? 'bg-quiz-success/10 border-quiz-success/30'
                        : 'bg-quiz-danger/10 border-quiz-danger/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {!isAnswered ? (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-xs">?</span>
                          </div>
                        ) : isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-quiz-success" />
                        ) : (
                          <XCircle className="w-6 h-6 text-quiz-danger" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Q{index + 1}</Badge>
                          <Badge className={`text-xs ${
                            question.difficulty === 'easy' ? 'bg-quiz-success' :
                            question.difficulty === 'medium' ? 'bg-quiz-warning' :
                            'bg-quiz-danger'
                          }`}>
                            {question.difficulty}
                          </Badge>
                        </div>
                        
                        <h4 className="font-medium mb-3 leading-relaxed">{question.question}</h4>
                        
                        <div className="grid gap-2">
                          {!isAnswered ? (
                            <div className="text-sm text-muted-foreground italic">
                              No answer provided
                            </div>
                          ) : (
                            <>
                              <div className={`text-sm p-2 rounded ${
                                isCorrect ? 'bg-quiz-success/20 text-quiz-success' : 'bg-quiz-danger/20 text-quiz-danger'
                              }`}>
                                <strong>Your answer:</strong> {userAnswer.selectedAnswer}
                              </div>
                              {!isCorrect && (
                                <div className="text-sm p-2 rounded bg-quiz-success/20 text-quiz-success">
                                  <strong>Correct answer:</strong> {question.correct_answer}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center animate-fade-in">
          <Button
            onClick={onRestart}
            size="lg"
            className={`${getScoreGradient()} hover:opacity-90 transition-all duration-200 shadow-glow`}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Take Quiz Again
          </Button>
        </div>
      </div>
    </div>
  );
};