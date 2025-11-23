import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, Copy, Check } from 'lucide-react';
import { generateWelcomeMessage } from '../services/geminiService';
import { GraphNode } from '../types';

interface WelcomeLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: GraphNode;
  senderName: string;
}

export const WelcomeLetterModal: React.FC<WelcomeLetterModalProps> = ({ isOpen, onClose, recipient, senderName }) => {
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && recipient) {
      handleGenerate();
    } else {
      setMessage('');
      setIsSent(false);
    }
  }, [isOpen, recipient]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const text = await generateWelcomeMessage(recipient.name, recipient.relationLabel || 'Relative', senderName);
    setMessage(text);
    setIsGenerating(false);
  };

  const handleSend = () => {
    // In a real app, this would send an email or notification
    setIsSent(true);
    setTimeout(() => {
      onClose();
      setIsSent(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Send size={18} className="text-pink-500" />
            Send Welcome Letter
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${recipient.generation === 0 ? 'bg-pink-600' : 'bg-slate-600'}`}>
              {recipient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium">To: {recipient.name}</p>
              <p className="text-slate-500 text-xs">Re: Welcome to the family!</p>
            </div>
          </div>

          <div className="relative">
            <textarea 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-300 text-sm focus:outline-none focus:border-pink-500 h-40 resize-none leading-relaxed"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Drafting letter..."
            />
            {isGenerating && (
              <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center rounded-lg">
                <div className="flex items-center gap-2 text-pink-400 text-sm animate-pulse">
                  <Sparkles size={16} />
                  <span>Drafting with AI...</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors mr-auto"
            >
              <Sparkles size={12} />
              Regenerate
            </button>
            
            <button 
              onClick={handleCopy}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <button 
            onClick={handleSend}
            disabled={!message || isGenerating || isSent}
            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              isSent 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-pink-600 hover:bg-pink-700 active:scale-[0.98]'
            }`}
          >
            {isSent ? (
              <>
                <Check size={18} />
                Sent Successfully!
              </>
            ) : (
              <>
                <Send size={18} />
                Send Welcome
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};