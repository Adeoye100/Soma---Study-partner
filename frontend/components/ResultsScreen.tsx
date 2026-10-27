import React, { useMemo, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ExamResult } from '../types';
import { CheckCircle2, XCircle, Download, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShaderBackground from './ShaderBackground';

// Fix: Declare jspdf and html2canvas on the window object to fix TypeScript errors.
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface ResultsScreenProps {
  result: ExamResult;
  onRestart: (result: ExamResult) => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onRestart }) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const { questions, evaluations, config } = result;

    const totalScore = useMemo(() => evaluations.reduce((sum, e) => sum + e.score, 0), [evaluations]);
    const maxScore = evaluations.length * 10;
    const accuracy = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    const topicPerformance = useMemo(() => {
        const topics: { [key: string]: { score: number, total: number } } = {};
        evaluations.forEach(ev => {
            if (!topics[ev.topic]) {
                topics[ev.topic] = { score: 0, total: 0 };
            }
            topics[ev.topic].score += ev.score;
            topics[ev.topic].total += 10;
        });

        return Object.entries(topics).map(([name, data]) => ({
            name,
            performance: (data.score / data.total) * 100,
        }));
    }, [evaluations]);

    const handleDownloadPdf = async () => {
        const { jsPDF } = window.jspdf;
        const html2canvas = window.html2canvas;

        if (reportRef.current) {
            const canvas = await html2canvas(reportRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('exam-report.pdf');
        }
    };

    const handleRestart = () => {
        const resultToSave: ExamResult = { ...result, score: accuracy, totalQuestions: questions.length };
        onRestart(resultToSave);
    }

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 animate-fade-in">
             <div ref={reportRef} className="bg-card text-card-foreground border border-border p-3 sm:p-6 md:p-8 rounded-xl shadow-xs transition-colors duration-200">
                <ShaderBackground><div className="p-4 sm:p-6 md:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-6 transition-colors duration-200">Exam Results</h2>

                    {/* Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                        <div className="bg-muted/50 border border-border/50 p-4 sm:p-6 rounded-xl text-center transition-colors duration-200">
                            <h3 className="text-sm sm:text-base font-semibold text-muted-foreground transition-colors duration-200">Accuracy</h3>
                            <p className={`text-3xl sm:text-4xl font-bold ${accuracy >= 70 ? 'text-success' : 'text-destructive'}`}>{accuracy.toFixed(1)}%</p>
                        </div>
                        <div className="bg-muted/50 border border-border/50 p-4 sm:p-6 rounded-xl text-center transition-colors duration-200">
                             <h3 className="text-sm sm:text-base font-semibold text-muted-foreground transition-colors duration-200">Correct</h3>
                            <p className="text-3xl sm:text-4xl font-bold text-foreground transition-colors duration-200">{evaluations.filter(e => e.isCorrect).length}/{evaluations.length}</p>
                        </div>
                         <div className="bg-muted/50 border border-border/50 p-4 sm:p-6 rounded-xl text-center transition-colors duration-200">
                             <h3 className="text-sm sm:text-base font-semibold text-muted-foreground transition-colors duration-200">Type</h3>
                            <p className="text-xl sm:text-2xl font-bold text-foreground capitalize transition-colors duration-200">{config.type}</p>
                        </div>
                    </div>

                    {/* Topic Performance */}
                    <div className="mb-8">
                        <h3 className="text-xl sm:text-2xl font-bold mb-4 transition-colors duration-200">Topic Performance</h3>
                        <div className="w-full h-64 sm:h-80 bg-muted/30 border border-border/40 p-3 sm:p-4 rounded-xl overflow-x-auto transition-colors duration-200">
                            <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                                <BarChart data={topicPerformance} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis unit="%" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--card-foreground))', borderRadius: '8px', fontSize: '12px' }} cursor={{fill: 'hsl(var(--muted) / 0.3)'}} />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Bar dataKey="performance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Detailed Review */}
                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-4 transition-colors duration-200">Review</h3>
                        <div className="space-y-4 sm:space-y-6">
                            {questions.map((q, i) => (
                                <div key={i} className="p-3 sm:p-4 border border-border rounded-lg bg-card/50 transition-colors duration-200">
                                    <div className="flex items-start gap-3">
                                        {evaluations[i].isCorrect ? <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-success flex-shrink-0 mt-1"/> : <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-destructive flex-shrink-0 mt-1"/>}
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-sm sm:text-base text-foreground break-words transition-colors duration-200">{i+1}. {q.question}</p>
                                            <p className="text-xs sm:text-sm mt-2"><span className="font-semibold text-foreground">Answer:</span> <span className="text-muted-foreground transition-colors duration-200">{result.userAnswers[i] || "No answer"}</span></p>
                                            <div className="mt-3 bg-muted/60 border border-border/50 p-2 sm:p-3 rounded-md transition-colors duration-200">
                                                <p className="font-semibold text-xs sm:text-sm text-foreground transition-colors duration-200">Feedback:</p>
                                                <p className="text-xs sm:text-sm text-muted-foreground transition-colors duration-200">{evaluations[i].feedback}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div></ShaderBackground>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
                <Button variant="outline" onClick={handleRestart} className="w-full sm:w-auto h-11 px-6">
                    <RotateCw className="h-4 w-4 mr-2" />
                    <span>Take Another</span>
                </Button>
                <Button onClick={handleDownloadPdf} className="w-full sm:w-auto h-11 px-6">
                    <Download className="h-4 w-4 mr-2" />
                    <span>Download</span>
                </Button>
            </div>
        </div>
    );
};

export default ResultsScreen;
