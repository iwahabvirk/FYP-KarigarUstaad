import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function LiveTrackingScreen() {
  const router = useRouter();
  const [status, setStatus] = useState('Worker is on the way');
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('Worker has arrived!');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scaleAnim]);

  const handleComplete = () => {
    Alert.alert('Service Started', 'Timer started for the service');
  };

  const handleRateWorker = () => {
    router.push('/(customer)/rate-worker');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Tracking</Text>
        <TouchableOpacity>
          <Text style={styles.helpIcon}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Map View 🗺️</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Card style={styles.statusCard}>
          <Text style={styles.statusLabel}>Current Status</Text>
          <Animated.View
            style={[
              styles.statusIndicator,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.pulseCircle} />
          </Animated.View>
          <Text style={styles.statusText}>{status}</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Worker Details</Text>
          <View style={styles.workerDetailRow}>
            <Text style={styles.workerDetailLabel}>Name</Text>
            <Text style={styles.workerDetailValue}>Rajesh Kumar</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.workerDetailRow}>
            <Text style={styles.workerDetailLabel}>Vehicle</Text>
            <Text style={styles.workerDetailValue}>White Wagon - KA01AB1234</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.workerDetailRow}>
            <Text style={styles.workerDetailLabel}>ETA</Text>
            <Text style={styles.workerDetailValue}>8 minutes</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.locationText}>📍 Model Town, Lahore</Text>
        </Card>

        <Card style={styles.contactCard}>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactIcon}>📞</Text>
            <Text style={styles.contactButtonText}>Call Worker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactIcon}>💬</Text>
            <Text style={styles.contactButtonText}>Text Worker</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            label="Mark as Arrived"
            onPress={handleComplete}
            size="large"
          />
          {status === 'Worker has arrived!' && (
            <Button
              label="Rate & Complete"
              onPress={handleRateWorker}
              variant="secondary"
              size="large"
              style={styles.secondaryButton}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  helpIcon: {
    fontSize: 18,
  },
  mapContainer: {
    height: 200,
    backgroundColor: colors.gray,
    marginBottom: 16,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  statusCard: {
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  statusIndicator: {
    marginBottom: 12,
  },
  pulseCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  workerDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  workerDetailLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  workerDetailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayLight,
  },
  locationText: {
    fontSize: 13,
    color: colors.text,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
    marginBottom: 16,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  contactIcon: {
    fontSize: 18,
  },
  contactButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  buttonContainer: {
    gap: 12,
  },
  secondaryButton: {
    marginBottom: 0,
  },
});
