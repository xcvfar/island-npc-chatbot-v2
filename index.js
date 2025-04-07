import express from 'express';
import cors from 'cors';
import askRoute from './routes/ask.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/ask', askRoute);

app.get('/', (req, res) => {
  res.send('NPC Chatbot is online!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
