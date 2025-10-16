import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { colors } from '../constants/colors';
import { getActiveChallenge, getDailySchedule } from '../lib/HourlyChallengeManager';

interface Challenge {
  id: number;
  hour: number;
  title: string;
  description: string;
}

const ChallengesScreen = () => {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [schedule, setSchedule] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [active, scheduleData] = await Promise.all([
        getActiveChallenge(),
        getDailySchedule(),
      ]);
      setActiveChallenge(active);
      setSchedule(scheduleData);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const minutes = 59 - now.getMinutes();
      const seconds = 59 - now.getSeconds();
      setCountdown(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const renderScheduleItem = (item: Challenge) => {
    const currentHour = new Date().getHours();
    const isActive = item.hour === currentHour;
    const isCompleted = item.hour < currentHour;
    return (
      <View key={item.id} style={[styles.scheduleItem, isActive && styles.activeItem, isCompleted && styles.completedItem]}>
        <Text style={styles.scheduleTime}>{`${item.hour}:00`}</Text>
        <Text style={styles.scheduleTitle}>{item.title}</Text>
      </View>
    );
  };

  if (loading) {
    return <View style={styles.container}><Text>Loading challenges...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.featuredCard}>
        {activeChallenge ? (
          <>
            <Text style={styles.featuredTitle}>{activeChallenge.title}</Text>
            <Text style={styles.featuredDescription}>{activeChallenge.description}</Text>
            <Text style={styles.countdown}>{countdown}</Text>
            <Button title="Participate Now" onPress={() => {}} color={colors.turquoise} />
          </>
        ) : (
          <Text style={styles.afterHoursText}>Challenges are active from 6 AM to 10 PM. Come back tomorrow!</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Today's Schedule</Text>
      {schedule.map(renderScheduleItem)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  featuredCard: {
    backgroundColor: colors.lightGray,
    padding: 24,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkGray,
    textAlign: 'center',
  },
  featuredDescription: {
    fontSize: 16,
    color: colors.darkGray,
    textAlign: 'center',
    marginVertical: 16,
  },
  countdown: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.turquoise,
    marginBottom: 16,
  },
  afterHoursText: {
    fontSize: 18,
    color: colors.darkGray,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginLeft: 16,
    marginBottom: 8,
  },
  scheduleItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  activeItem: {
    backgroundColor: '#e8f8f5',
  },
  completedItem: {
    opacity: 0.5,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGray,
    width: 60,
  },
  scheduleTitle: {
    fontSize: 16,
    color: colors.darkGray,
  },
});

export default ChallengesScreen;
