import React, { useState } from 'react';

const ThumbsUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 3V1.7c0-.268.14-.516.379-.645a.75.75 0 01.94.058l.758.758 2.378 2.378a.75.75 0 01.217.53V8.25h1.75a1.25 1.25 0 011.25 1.25v1.5a1.25 1.25 0 01-1.25 1.25h-5.75a.75.75 0 01-.75-.75V3z" />
        <path d="M6 16.75a1.25 1.25 0 102.5 0v-7.5a1.25 1.25 0 10-2.5 0v7.5zM11 15.5V9.75a1.75 1.75 0 00-1.75-1.75h-1.5a1.75 1.75 0 00-1.75 1.75v5.75a.75.75 0 00.75.75h3.5a.75.75 0 00.75-.75z" />
    </svg>
);

const ThumbsDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M1 11.75a1.25 1.25 0 102.5 0v-7.5a1.25 1.25 0 10-2.5 0v7.5zM11 17v1.3c0 .268-.14.516-.379.645a.75.75 0 00-.94-.058l-.758-.758-2.378-2.378a.75.75 0 00-.217-.53V11.75H5a1.25 1.25 0 00-1.25-1.25v-1.5A1.25 1.25 0 005 7.75h5.75a.75.75 0 00.75.75V17z" />
        <path d="M6 3.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 4.5v5.75c0 .414.336.75.75.75h1.5a1.75 1.75 0 001.75-1.75V3.25a.75.75 0 00-.75-.75h-3.5a.75.75 0 00-.75.75z" />
    </svg>
);

export const FeedbackCard: React.FC = () => {
    const [feedback, setFeedback] = useState<'clear' | 'unclear' | 'submitted' | null>(null);

    if (feedback === 'submitted') {
        return (
            <div className="bg-gray-800/60 p-6 rounded-xl shadow-2xl border border-gray-700 text-center">
                <CheckCircleIcon className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-200">Thank you!</h3>
                <p className="mt-1 text-gray-400 text-sm">Your feedback helps improve the AI.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-800/60 p-6 rounded-xl shadow-2xl border border-gray-700">
            <h3 className="text-lg font-semibold text-center text-gray-200">Was this explanation clear?</h3>
            <div className="mt-4 flex justify-center gap-4">
                <button 
                    onClick={() => setFeedback('clear')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border-2 ${feedback === 'clear' ? 'bg-green-500/20 border-green-500' : 'bg-gray-700/50 border-gray-600 hover:bg-green-500/10 hover:border-green-600'}`}
                    aria-label="Explanation was clear"
                >
                    <ThumbsUpIcon className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-medium">Yes</span>
                </button>
                 <button 
                    onClick={() => setFeedback('unclear')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border-2 ${feedback === 'unclear' ? 'bg-yellow-500/20 border-yellow-500' : 'bg-gray-700/50 border-gray-600 hover:bg-yellow-500/10 hover:border-yellow-600'}`}
                    aria-label="Explanation was unclear"
                >
                    <ThumbsDownIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-300 font-medium">No</span>
                </button>
            </div>
            {feedback === 'unclear' && (
                <div className="mt-4">
                    <label htmlFor="feedback-comment" className="block mb-2 text-sm font-medium text-gray-400">What could be improved?</label>
                    <textarea 
                        id="feedback-comment"
                        rows={3} 
                        className="bg-gray-900/70 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" 
                        placeholder="e.g., Explain what 'rms_x' means..."
                    ></textarea>
                </div>
            )}
            {feedback && (
                <button 
                    onClick={() => setFeedback('submitted')}
                    className="mt-4 w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
                >
                    Submit Feedback
                </button>
            )}
        </div>
    );
};

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);