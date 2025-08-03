import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Play, Zap } from 'lucide-react';

interface StartPageProps {
  onStart: (email: string) => void;
  isLoading: boolean;
}

export const StartPage = ({ onStart, isLoading }: StartPageProps) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    onStart(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5NzMzZGQiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCI+PC9jaXJjbGU+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <Card className="w-full max-w-md relative overflow-hidden animate-fade-in shadow-card">
        <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
        <CardHeader className="text-center relative z-10">
          <div className="mx-auto mb-4 w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow animate-pulse-glow">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Quiz Challenge
          </CardTitle>
          <CardDescription className="text-lg">
            Test your knowledge with our interactive quiz!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border/50">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Play className="w-4 h-4 text-quiz-primary" />
              Quiz Details
            </h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 15 multiple choice questions</li>
              <li>• 30 minutes time limit</li>
              <li>• Navigate between questions freely</li>
              <li>• Review your answers at the end</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                className={`transition-all duration-200 ${
                  emailError ? 'border-quiz-danger focus:ring-quiz-danger' : 'focus:ring-quiz-primary'
                }`}
                disabled={isLoading}
              />
              {emailError && (
                <p className="text-sm text-quiz-danger animate-fade-in">{emailError}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-glow"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Loading Questions...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Start Quiz
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};