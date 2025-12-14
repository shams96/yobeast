'use client';

import { useState } from 'react';

type FeedbackType = 'bug' | 'feature' | 'general';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>('general');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For beta: Log to console (later: send to API)
    console.log('Beta Feedback:', {
      type,
      rating,
      message,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });

    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setMessage('');
      setRating(0);
      setType('general');
    }, 2000);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-accent-fire to-brand-pink shadow-glow hover:scale-110 active:scale-95 transition-transform flex items-center justify-center"
        aria-label="Send feedback"
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-gold rounded-full text-xs font-bold text-dark-bg flex items-center justify-center">
          β
        </span>
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-dark-bg/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
        >
          <div
            className="card-elevated max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 id="feedback-title" className="text-xl font-bold text-text-primary">
                    Beta Feedback
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-text-tertiary hover:text-text-primary"
                    aria-label="Close feedback form"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-sm text-text-secondary">
                  Help us improve Yollr Beast! Your feedback shapes the future of campus challenges.
                </p>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    How's your experience?
                  </label>
                  <div className="flex gap-2" role="radiogroup" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-3xl transition-transform hover:scale-110 active:scale-95"
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                        aria-checked={rating >= star}
                        role="radio"
                      >
                        {rating >= star ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    What's this about?
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: 'bug' as FeedbackType, label: '🐛 Bug', color: 'from-red-500 to-red-600' },
                      { value: 'feature' as FeedbackType, label: '💡 Feature', color: 'from-blue-500 to-blue-600' },
                      { value: 'general' as FeedbackType, label: '💬 General', color: 'from-green-500 to-green-600' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setType(option.value)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                          type === option.value
                            ? `bg-gradient-to-r ${option.color} text-white`
                            : 'glass hover:bg-dark-elevated'
                        }`}
                        aria-pressed={type === option.value}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="feedback-message" className="block text-sm font-semibold text-text-primary mb-2">
                    Tell us more
                  </label>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What would you like us to know?"
                    className="w-full px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-mocha resize-none"
                    rows={4}
                    required
                    aria-required="true"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={!message.trim() || rating === 0}
                  aria-disabled={!message.trim() || rating === 0}
                >
                  Send Feedback
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="text-6xl">✅</div>
                <h3 className="text-xl font-bold text-text-primary">
                  Thanks for your feedback!
                </h3>
                <p className="text-text-secondary">
                  Your input helps us build the best campus app ever.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FeedbackWidget;
