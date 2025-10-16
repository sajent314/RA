import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator } from 'react-native';
import { colors } from '../constants/colors';
import { signOut, getProfile, getActivityLog } from '../lib/api';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  current_grade: string;
}

interface ActivityLog {
  pebi_score: number;
  ai_score: number;
  at_score: number;
}

const GradeProgressBar = ({ label, score, max }: { label: string; score: number; max: number }) => (
  <View style={styles.progressContainer}>
    <Text style={styles.statLabel}>{label}</Text>
    <View style={styles.progressBarBackground}>
      <View style={[styles.progressBarFill, { width: `${Math.min((score / max) * 100, 100)}%` }]} />
    </View>
    <Text style={styles.statValue}>{score}</Text>
  </View>
);

const ProfileScreen = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profileData = await getProfile(session.user.id);
        setProfile(profileData);

        const today = new Date().toISOString().split('T')[0];
        const logData = await getActivityLog(session.user.id, today);
        if (logData) {
          setActivityLog(logData);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} />;
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>No profile found.</Text>
        <Button title="Sign Out" onPress={() => signOut()} color={colors.turquoise} />
      </View>
    );
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return '#2ecc71';
    if (grade.startsWith('B')) return '#3498db';
    if (grade.startsWith('C')) return '#f1c40f';
    if (grade.startsWith('D')) return '#e67e22';
    return '#e74c3c';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.gradeCircle, { backgroundColor: getGradeColor(profile.current_grade) }]}>
          <Text style={styles.grade}>{profile.current_grade}</Text>
        </View>
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.fullName}>{profile.full_name}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
      </View>

      <View style={styles.statsContainer}>
        <GradeProgressBar label="PEBI" score={activityLog?.pebi_score ?? 0} max={100} />
        <GradeProgressBar label="AI" score={activityLog?.ai_score ?? 0} max={50} />
        <GradeProgressBar label="AT" score={activityLog?.at_score ?? 0} max={10} />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>30-Day Grade History</Text>
        <View style={styles.chartPlaceholder}>
          <Text>Chart will be implemented here.</Text>
        </View>
      </View>

      <Button title="Sign Out" onPress={() => signOut()} color={colors.turquoise} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.lightGray,
  },
  gradeCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  grade: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.white,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  fullName: {
    fontSize: 18,
    color: colors.darkGray,
  },
  bio: {
    fontSize: 14,
    color: colors.darkGray,
    textAlign: 'center',
    marginTop: 8,
  },
  statsContainer: {
    padding: 24,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 20,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    marginTop: 4,
  },
  progressBarFill: {
    height: 20,
    backgroundColor: colors.turquoise,
    borderRadius: 10,
  },
  statLabel: {
    fontSize: 14,
    color: colors.darkGray,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.darkGray,
    alignSelf: 'flex-end',
  },
  chartContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 8,
  },
});

export default ProfileScreen;
