import { issueCredential } from './issue.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/issue-credential', async (req, res) => {
  const { userId, rank } = req.body;
  if (!userId || !rank) {
    return res.status(400).send('userId and rank are required');
  }
  try {
    const { blob, salt } = await issueCredential(userId, rank);
    res.status(200).json({ blob, salt });
  } catch (error) {
    console.error('Error issuing credential:', error);
    res.status(500).send('Failed to issue credential');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Issuer server listening on port ${PORT}`);
});

