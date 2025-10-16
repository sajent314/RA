import { supabase } from './supabase';

export const getActiveChallenge = async () => {
  const currentHour = new Date().getHours();
  if (currentHour < 6 || currentHour > 22) {
    return null; // After hours
  }

  const { data, error } = await supabase
    .from('hourly_challenges')
    .select('*')
    .eq('hour', currentHour)
    .single();

  if (error) {
    console.error('Error fetching active challenge:', error);
    return null;
  }
  return data;
};

export const getDailySchedule = async () => {
  const { data, error } = await supabase
    .from('hourly_challenges')
    .select('*')
    .order('hour');

  if (error) {
    console.error('Error fetching daily schedule:', error);
    return [];
  }
  return data;
};
