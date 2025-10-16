import { supabase } from './supabase';

const PEBI_WEIGHT = 0.5;
const AI_WEIGHT = 0.3;
const AT_WEIGHT = 0.2;

const MAX_PEBI = 100; // Example max daily score
const MAX_AI = 50;   // Example max daily score
const MAX_AT = 10;   // Example max daily km

const calculateScore = (value: number, max: number) => {
  return Math.min((value / max) * 100, 100);
};

const getLetterGrade = (score: number): string => {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 63) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
};

export const calculateGrade = async (userId: string): Promise<string> => {
  const { data: logs, error } = await supabase
    .from('activity_logs')
    .select('log_date, pebi_score, ai_score, at_score')
    .eq('user_id', userId)
    .order('log_date', { ascending: false })
    .limit(3);

  if (error || !logs || logs.length === 0) {
    return 'F';
  }

  // Neglect penalty
  const today = new Date();
  const lastLogDate = new Date(logs[0].log_date);
  const daysSinceLastLog = (today.getTime() - lastLogDate.getTime()) / (1000 * 3600 * 24);
  if (daysSinceLastLog >= 3) {
    return 'F';
  }

  const pebiScore = calculateScore(logs[0].pebi_score, MAX_PEBI);
  const aiScore = calculateScore(logs[0].ai_score, MAX_AI);
  const atScore = calculateScore(logs[0].at_score, MAX_AT);

  const overallScore = (pebiScore * PEBI_WEIGHT) + (aiScore * AI_WEIGHT) + (atScore * AT_WEIGHT);
  const grade = getLetterGrade(overallScore);

  // Update the user's profile with the new grade
  await supabase.from('profiles').update({ current_grade: grade }).eq('id', userId);

  return grade;
};
