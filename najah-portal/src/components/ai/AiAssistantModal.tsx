import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  User, 
  Calendar, 
  Award, 
  BookOpen, 
  Copy, 
  Check,
  RefreshCw
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, events, notices, certificates, students } = usePortal();
  const isAdmin = currentUser?.role === 'admin';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello ${currentUser?.name}! I am Najah AI, your intelligent class assistant. I can answer questions about class events, attendance, rewards, schedules, participation rules, generate announcement drafts, and recommend activities. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Build real class context to feed into Gemini model
  const classContext = `
You are Najah AI, the smart assistant for Najah Class Portal.
Current User: ${currentUser?.name} (${currentUser?.role})
Enrolled Students Count: ${students.length}
Scheduled Events:
${events.map(e => `- ${e.title} (${e.category}) on ${e.date} at ${e.venue}. Cap: ${e.maxCapacity}, Registered: ${e.registeredStudentIds.length}. Rules: ${e.rules?.join('; ') || 'Standard class regulations'}`).join('\n')}
Recent Notices:
${notices.map(n => `- ${n.title} (${n.category}): ${n.content}`).join('\n')}
Total Certificates Issued: ${certificates.length}

Answer questions helpfully, concisely, and professionally. If requested to draft announcements or certificates, provide high-quality ready-to-use prose.
`;

  const generateAiResponse = async (userPrompt: string): Promise<string> => {
    // Attempt real Gemini API via @google/genai
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI();
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${classContext}\n\nUser Question: ${userPrompt}`,
        });
        if (response && response.text) {
          return response.text;
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local contextual AI logic:', err);
    }

    // Intelligent Contextual Fallback Engine
    const lower = userPrompt.toLowerCase();

    if (lower.includes('schedule') || lower.includes('upcoming') || lower.includes('event')) {
      return `Here is the current upcoming schedule for Najah Class:\n\n${events.map((e, idx) => `${idx + 1}. **${e.title}** (${e.category})\n   • Date: ${e.date} (${e.time})\n   • Location: ${e.venue}\n   • Seats: ${e.registeredStudentIds.length} / ${e.maxCapacity}`).join('\n\n')}\n\nYou can register directly via the Events tab or check in with your QR pass!`;
    }

    if (lower.includes('rule') || lower.includes('guideline')) {
      const targetEvent = events.find(e => lower.includes(e.title.toLowerCase()) || lower.includes(e.category.toLowerCase())) || events[0];
      return `### Rules & Guidelines for **${targetEvent.title}**:\n\n${targetEvent.rules?.map(r => `• ${r}`).join('\n') || '• Class student ID required.\n• Adhere to class code of conduct.'}\n\nCoordinated by: ${targetEvent.coordinator || 'Class Event Committee'}.`;
    }

    if (lower.includes('announcement') || lower.includes('notice') || lower.includes('draft')) {
      const nextEvent = events[0];
      return `### Official Notice Draft (Ready to Publish)\n\n**Subject:** ${nextEvent ? nextEvent.title : 'Upcoming Class Symposium'}\n\nDear Students,\n\nWe are pleased to announce the upcoming **${nextEvent ? nextEvent.title : 'Class Event'}** scheduled for **${nextEvent ? nextEvent.date : 'this month'}** at **${nextEvent ? nextEvent.venue : 'the Main Class Hall'}**.\n\nRegistration is now officially open on the Najah Portal. Secure your seat early to receive your digital QR entry pass. We look forward to your active participation!\n\nBest Regards,\nClass Administrator`;
    }

    if (lower.includes('certificate') || lower.includes('citation')) {
      return `### Formal Certificate Citation Template:\n\n"In formal recognition of outstanding performance, leadership, and exemplary participation during the ${events[0]?.title || 'Annual Class Championship'}, this digital credential is authorized with official class seal."\n\nAdmin can directly issue this via the **Certificates** tab!`;
    }

    if (lower.includes('recommend') || lower.includes('activity')) {
      return `Based on current class activities:\n\n1. **${events[0]?.title || 'TechFest'}**: Ideal for computing students looking to build prototypes and network.\n2. **${events[1]?.title || 'Sports Cup'}**: High-energy tournament with live crowd support and team sportsmanship.\n3. **Class Gallery**: Check out recent photo highlights in the media section!`;
    }

    return `Thank you for asking! I'm synchronized with the Najah Class Portal. There are currently ${events.length} active events scheduled and ${notices.length} official bulletins posted. Feel free to ask about class schedules, attendance, rewards, check-in instructions, rules, or drafting notices!`;
  };

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const replyText = await generateAiResponse(q);

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[85vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#073642] to-[#086a7e] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">Najah AI Assistant</h3>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-teal-400/30 text-teal-200 border border-teal-300/30">
                  Class Intelligence
                </span>
              </div>
              <p className="text-[11px] text-teal-100/80">
                Ground-truth assistant for class events, schedules, rules & drafts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Quick Prompts:
          </span>
          <button
            onClick={() => handleSend('What upcoming events are scheduled?')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 hover:border-teal-400 text-slate-700 whitespace-nowrap shadow-xs"
          >
            📅 Event Schedules
          </button>
          <button
            onClick={() => handleSend('Explain rules for class events')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 hover:border-teal-400 text-slate-700 whitespace-nowrap shadow-xs"
          >
            📋 Event Rules
          </button>
          {isAdmin ? (
            <button
              onClick={() => handleSend('Draft an official announcement for the upcoming event')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-50 border border-amber-200 hover:border-amber-400 text-amber-900 whitespace-nowrap shadow-xs"
            >
              ✍️ Draft Notice with AI
            </button>
          ) : (
            <button
              onClick={() => handleSend('Recommend activities for me')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 hover:border-teal-400 text-slate-700 whitespace-nowrap shadow-xs"
            >
              🌟 Recommend Activities
            </button>
          )}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'ai'
                    ? 'bg-[#086a7e] text-amber-300'
                    : 'bg-slate-800 text-white'
                }`}
              >
                {msg.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 relative group ${
                  msg.sender === 'user'
                    ? 'bg-[#086a7e] text-white rounded-tr-xs'
                    : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[10px] flex items-center justify-between pt-1 ${
                    msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 hover:text-slate-700"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#086a7e] text-amber-300 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-slate-100 p-3 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>Najah AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about class events, schedules, rules..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3 text-xs rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#086a7e]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`p-3 rounded-2xl text-white font-bold transition-all shadow-xs ${
                loading || !input.trim()
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-[#086a7e] hover:bg-[#065464] active:scale-95'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
