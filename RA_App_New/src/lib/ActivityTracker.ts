import { upsertActivityLog, getActivityLog } from './api';

const today = new Date().toISOString().split('T')[0];

const getOrCreateLog = async (userId: string) => {
  let log = await getActivityLog(userId, today);
  if (!log) {
    log = { user_id: userId, log_date: today, pebi_score: 0, ai_score: 0, at_score: 0 };
  }
  return log;
};

export const incrementPebiScore = async (userId: string, amount: number = 1) => {
  const log = await getOrCreateLog(userId);
  const newPebiScore = (log.pebi_score || 0) + amount;
  await upsertActivityLog({ user_id: userId, pebi_score: newPebiScore });
};

export const incrementAiScore = async (userId: string, amount: number = 1) => {
  const log = await getOrCreateLog(userId);
  const newAiScore = (log.ai_score || 0) + amount;
  await upsertActivityLog({ user_id: userId, ai_score: newAiScore });
};

export const incrementAtScore = async (userId: string, distance: number) => {
  const log = await getOrCreateLog(userId);
  const newAtScore = (log.at_score || 0) + distance;
  await upsertActivityLog({ user_id: userId, at_score: newAtScore });
};
