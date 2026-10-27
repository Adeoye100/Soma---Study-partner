
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ExamConfig, Question, TimeIntensity, UserAnswer, ExamType, Evaluation } from '../types';
import { evaluateExam } from '../services/geminiService';
import { Button } from '@/components/ui/button';
import Loader from './Loader';
import ShaderBackground from './ShaderBackground';

interface ExamScreenProps {
  questions: Question[];
  config: ExamConfig;
  onFinish: (result: { questions: Question[]; userAnswers: UserAnswer[]; evaluations: Evaluation[]; timeTaken: number; config: ExamConfig; }) => void;
}

const timePerQuestion: Record<TimeIntensity, number> = {
  [TimeIntensity.RELAXED]: 180,
  [TimeIntensity.MODERATE]: 90,
  [TimeIntensity.CHALLENGING]: 45,
};

const ExamScreen: React.FC<ExamScreenProps> = ({ questions, config, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(Array(questions.length).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalTime = useMemo(() => timePerQuestion[config.intensity] * questions.length, [config.intensity, questions.length]);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const startTime = useMemo(() => Date.now(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswerChange = (answer: string) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answer;
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const evaluations = await evaluateExam(questions, userAnswers.map(a => a || 'No answer provided.'));
      const timeTaken = totalTime - timeLeft;
      onFinish({ questions, userAnswers, evaluations, timeTaken, config });
    } catch (error) {
      console.error('[ExamScreen] Evaluation failed:', error);
      // Fallback: finish with empty evaluations so the UI doesn't hang
      const timeTaken = totalTime - timeLeft;
      const fallbackEvals = questions.map(q => ({ score: 0, feedback: 'Evaluation failed', isCorrect: false, topic: q.topic || 'General' }));
      onFinish({ questions, userAnswers, evaluations: fallbackEvals, timeTaken, config });
    }
  }, [questions, userAnswers, totalTime, timeLeft, onFinish, config]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (isSubmitting) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh]">
              <Loader text="Evaluating your answers..." />
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 animate-fade-in">
        <ShaderBackground><div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 border-b border-border pb-4 transition-colors duration-200">
                <h2 className="text-lg sm:text-xl font-bold text-primary transition-colors duration-200">
                    Q{currentQuestionIndex + 1}/{questions.length}
                </h2>
                <div className="text-xl sm:text-2xl font-mono font-semibold text-foreground transition-colors duration-200" role="timer">
                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 sm:h-2.5 mb-6 transition-colors duration-200">
                <div className="bg-primary h-2 sm:h-2.5 rounded-full transition-all duration-300 ease-ui" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Question */}
            <div className="mb-6 sm:mb-8 min-h-[80px] sm:min-h-[100px]">
                <p className="text-base sm:text-lg text-foreground leading-relaxed transition-colors duration-200">{currentQuestion.question}</p>
            </div>

            {/* Answer Area */}
            <div className="space-y-3 sm:space-y-4">
              {config.type === ExamType.OBJECTIVE && currentQuestion.options && (
                  currentQuestion.options.map((option, index) => (
                      <label key={index} className="flex items-start sm:items-center p-3 sm:p-4 rounded-lg border border-border cursor-pointer hover:bg-muted/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors duration-200">
                          <input type="radio" name={`q_${currentQuestionIndex}`} value={option} checked={userAnswers[currentQuestionIndex] === option} onChange={(e) => handleAnswerChange(e.target.value)} className="h-4 w-4 flex-shrink-0 text-primary border-input focus:ring-ring mt-1 transition-colors duration-200" />
                          <span className="ml-3 text-sm sm:text-base text-foreground transition-colors duration-200">{option}</span>
                      </label>
                  ))
              )}
              {config.type === ExamType.SHORT_ANSWER && (
                  <input type="text" value={userAnswers[currentQuestionIndex]} onChange={(e) => handleAnswerChange(e.target.value)} placeholder="Your answer..." className="block w-full rounded-md border border-input bg-background py-2 px-3 text-sm sm:text-base text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition-colors duration-200"/>
              )}
               {config.type === ExamType.ESSAY && (
                  <textarea rows={6} value={userAnswers[currentQuestionIndex]} onChange={(e) => handleAnswerChange(e.target.value)} placeholder="Your essay..." className="block w-full rounded-md border border-input bg-background py-2 px-3 text-sm sm:text-base text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition-colors duration-200"/>
              )}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-between sm:items-center">
                <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0} className="w-full sm:w-auto">
                    ← Previous
                </Button>
                {currentQuestionIndex === questions.length - 1 ? (
                    <Button onClick={handleSubmit} className="w-full sm:w-auto bg-success text-success-foreground hover:bg-success/90">
                        Submit Exam
                    </Button>
                ) : (
                    <Button onClick={handleNext} className="w-full sm:w-auto">
                        Next →
                    </Button>
                )}
            </div>
        </div></ShaderBackground>
    </div>
  );
};

export default ExamScreen;
