const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const chatHistory = [];

app.post('/api/chat/message', async (req, res) => {
  const { userId, message } = req.body;
  
  if (!userId || !message) {
    return res.status(400).json({ error: 'userId and message are required' });
  }

  const userMessage = {
    id: Date.now(),
    userId,
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  };
  chatHistory.push(userMessage);

  const aiResponse = {
    id: Date.now() + 1,
    userId,
    role: 'assistant',
    content: `AI response to: "${message}"`,
    timestamp: new Date().toISOString()
  };
  chatHistory.push(aiResponse);

  res.json({ success: true, message: aiResponse });
});

app.get('/api/chat/history/:userId', (req, res) => {
  const { userId } = req.params;
  const userHistory = chatHistory.filter(msg => msg.userId === userId);
  res.json({ success: true, history: userHistory });
});

app.delete('/api/chat/clear/:userId', (req, res) => {
  const { userId } = req.params;
  const index = chatHistory.findIndex(msg => msg.userId === userId);
  if (index !== -1) chatHistory.splice(index, 1);
  res.json({ success: true, message: 'Chat history cleared' });
});

app.get('/', (req, res) => {
  res.json({ message: 'AI Chat App API is running', version: '1.0.0' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
