import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitFeedback } from '../services/admin/adminApiService';

export const FeedbackForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('bug_report');
  const [severity, setSeverity] = useState('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.length < 5 || description.length < 20) return;

    try {
      setLoading(true);
      setError(null);
      await submitFeedback({
        type,
        title,
        description,
        severity: type === 'bug_report' ? severity : 'low',
        page_url: window.location.href
      });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setTitle('');
        setDescription('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Report issue or feedback"
        className="fixed bottom-6 right-6 p-3.5 sm:p-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-xl transition-transform duration-200 ease-ui z-40 hover:scale-105 active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <MessageSquare size={22} className="group-hover:rotate-12 transition-transform duration-200" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-card-foreground text-xs font-medium px-3 py-1.5 rounded-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
          Report Issue / Feedback
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-dialog-title"
        >
          <div
            className="bg-card text-card-foreground border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200 ease-ui"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 border-b border-border flex justify-between items-center bg-muted/40">
              <h3 id="feedback-dialog-title" className="text-base sm:text-lg font-bold flex items-center gap-2 text-foreground">
                <MessageSquare className="text-primary" size={20} />
                Feedback & Bug Report
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close feedback dialog"
                className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              <div className="p-8 sm:p-12 text-center animate-in fade-in duration-300">
                <div className="w-14 h-14 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={30} />
                </div>
                <h4 className="text-lg sm:text-xl font-bold mb-2 text-foreground">Thank You!</h4>
                <p className="text-sm text-muted-foreground">Your feedback has been submitted successfully. We appreciate your input!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5 tracking-wider">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors duration-200"
                    >
                      <option value="bug_report">Bug Report</option>
                      <option value="feature_request">Feature Request</option>
                      <option value="general_feedback">General Feedback</option>
                      <option value="performance_issue">Performance Issue</option>
                      <option value="ui_issue">UI Issue</option>
                    </select>
                  </div>
                  
                  {type === 'bug_report' && (
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5 tracking-wider">Severity</label>
                      <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors duration-200"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5 tracking-wider">Title</label>
                  <input
                    type="text"
                    required
                    minLength={5}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief summary..."
                    className="w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1.5 tracking-wider">Description</label>
                  <textarea
                    required
                    minLength={20}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Please provide details..."
                    className="w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors duration-200 resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> Minimum 20 characters
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg flex items-center">
                    <AlertCircle size={16} className="mr-2 shrink-0" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || title.length < 5 || description.length < 20}
                  loading={loading}
                  className="w-full h-11 font-semibold"
                >
                  <Send className="mr-2 size-4" />
                  <span>Submit Report</span>
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackForm;
