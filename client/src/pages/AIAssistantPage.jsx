import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import api from '../api/axiosInstance';

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am DISHA — Disaster Intelligence and Support Hub Assistant. You can ask me anything about disaster response and emergency management!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || loading) return;

    const userMessage = { role: 'user', content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        content: msg.content
      }));

      const res = await api.post('/ai/chat', { message: messageText, history });

      setMessages([...updatedMessages, {
        role: 'assistant',
        content: res.data.response
      }]);
    } catch (err) {
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: 'Sorry, AI is not available right now. Please try again later.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const quickQuestions = [
    { text: 'Immediate steps for flood response?', icon: '🌊' },
    { text: 'What to do during an earthquake?', icon: '🌍' },
    { text: 'How to setup a relief camp?', icon: '🏕️' },
    { text: 'How to contact NDRF?', icon: '📞' }
  ];

  return (
    <div style={styles.container}>
      <Navbar />
      <Sidebar />
      <main style={styles.main}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.dishaAvatar}>🤖</div>
            <div>
              <h1 style={styles.title}>DISHA</h1>
              <p style={styles.subtitle}>Disaster Intelligence and Support Hub Assistant</p>
            </div>
          </div>
          <div style={styles.onlineBadge}>
            <span style={styles.onlineDot}></span>
            Online
          </div>
        </div>

        <div style={styles.quickQuestions}>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              style={styles.quickBtn}
              onClick={() => sendMessage(q.text)}
            >
              <span>{q.icon}</span>
              <span>{q.text}</span>
            </button>
          ))}
        </div>

        <div style={styles.chatContainer}>
          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageRow,
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                {msg.role === 'assistant' && (
                  <div style={styles.botAvatar}>🤖</div>
                )}
                <div style={{
                  ...styles.bubble,
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                    : 'rgba(255,255,255,0.05)',
                  border: msg.role === 'user'
                    ? 'none'
                    : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: msg.role === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div style={styles.userAvatarBox}>👤</div>
                )}
              </div>
            ))}

            {loading && (
              <div style={styles.messageRow}>
                <div style={styles.botAvatar}>🤖</div>
                <div style={{
                  ...styles.bubble,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '18px 18px 18px 4px'
                }}>
                  <div style={styles.typingDots}>
                    <span style={styles.dot}></span>
                    <span style={{ ...styles.dot, animationDelay: '0.2s' }}></span>
                    <span style={{ ...styles.dot, animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputArea}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              style={styles.input}
              placeholder="Ask DISHA anything about disaster response... (Enter to send)"
              rows={2}
            />
            <button
              onClick={() => sendMessage(input)}
              style={{
                ...styles.sendBtn,
                opacity: loading || !input.trim() ? 0.4 : 1,
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
              }}
              disabled={loading || !input.trim()}
            >
              Send 🚀
            </button>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#020817' },
  main: { marginLeft: '240px', marginTop: '64px', padding: '28px', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  dishaAvatar: { width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
  title: { fontSize: '20px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.3px' },
  subtitle: { color: '#475569', fontSize: '12px', marginTop: '2px' },
  onlineBadge: { display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', padding: '5px 12px', borderRadius: '20px', color: '#22c55e', fontSize: '12px', fontWeight: '600' },
  onlineDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' },
  quickQuestions: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' },
  quickBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)', padding: '7px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: '500' },
  chatContainer: { flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' },
  messages: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
  messageRow: { display: 'flex', alignItems: 'flex-end', gap: '10px' },
  botAvatar: { width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 },
  userAvatarBox: { width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 },
  bubble: { padding: '12px 16px', color: '#f1f5f9', fontSize: '13px', lineHeight: '1.6', maxWidth: '70%', whiteSpace: 'pre-wrap' },
  typingDots: { display: 'flex', gap: '4px', alignItems: 'center', padding: '4px 0' },
  dot: { width: '6px', height: '6px', borderRadius: '50%', background: '#475569', animation: 'bounce 1.4s infinite' },
  inputArea: { display: 'flex', gap: '12px', padding: '16px', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' },
  input: { flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#f1f5f9', fontSize: '13px', resize: 'none', fontFamily: 'inherit', outline: 'none', position: 'relative', zIndex: 10 },
  sendBtn: { background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }
};

export default AIAssistantPage;