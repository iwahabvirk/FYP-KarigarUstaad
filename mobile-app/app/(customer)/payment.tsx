import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

type PaymentMethod = 'cash' | 'card';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const totalAmount = params.totalAmount as string;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert('Payment Successful', 'Your booking has been confirmed!');
      router.replace('/(customer)/live-tracking');
    } catch (error) {
      Alert.alert('Payment Failed', 'Please try again');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Payment Method</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amount}>Rs. {totalAmount}</Text>
        </Card>

        <View style={styles.paymentMethodsContainer}>
          <Text style={styles.paymentMethodsTitle}>Select Payment Method</Text>

          <TouchableOpacity
            style={[
              styles.paymentCard,
              selectedPaymentMethod === 'card' && styles.selectedPaymentCard,
            ]}
            onPress={() => setSelectedPaymentMethod('card')}
          >
            <Card style={{ marginBottom: 0 }}>
              <View style={styles.paymentCardContent}>
                <View style={styles.paymentCardRadio}>
                  <View
                    style={[
                      styles.radioButton,
                      selectedPaymentMethod === 'card' && styles.radioButtonSelected,
                    ]}
                  >
                    {selectedPaymentMethod === 'card' && (
                      <View style={styles.radioButtonDot} />
                    )}
                  </View>
                </View>
                <View style={styles.paymentCardInfo}>
                  <Text style={styles.paymentCardIcon}>💳</Text>
                  <View style={styles.paymentCardDetails}>
                    <Text style={styles.paymentCardTitle}>Credit / Debit Card</Text>
                    <Text style={styles.paymentCardDesc}>Visa, Mastercard, RuPay</Text>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>

          {selectedPaymentMethod === 'card' && (
            <Card style={styles.cardDetailsCard}>
              <Text style={styles.cardDetailsLabel}>Card Number</Text>
              <Text style={styles.cardDetailsValue}>•••• •••• •••• 4242</Text>
              <View style={styles.cardDetailsRow}>
                <View style={styles.cardDetailsColumn}>
                  <Text style={styles.cardDetailsLabel}>Expiry</Text>
                  <Text style={styles.cardDetailsValue}>12/25</Text>
                </View>
                <View style={styles.cardDetailsColumn}>
                  <Text style={styles.cardDetailsLabel}>CVV</Text>
                  <Text style={styles.cardDetailsValue}>•••</Text>
                </View>
              </View>
            </Card>
          )}

          <TouchableOpacity
            style={[
              styles.paymentCard,
              selectedPaymentMethod === 'cash' && styles.selectedPaymentCard,
            ]}
            onPress={() => setSelectedPaymentMethod('cash')}
          >
            <Card style={{ marginBottom: 0 }}>
              <View style={styles.paymentCardContent}>
                <View style={styles.paymentCardRadio}>
                  <View
                    style={[
                      styles.radioButton,
                      selectedPaymentMethod === 'cash' && styles.radioButtonSelected,
                    ]}
                  >
                    {selectedPaymentMethod === 'cash' && (
                      <View style={styles.radioButtonDot} />
                    )}
                  </View>
                </View>
                <View style={styles.paymentCardInfo}>
                  <Text style={styles.paymentCardIcon}>💵</Text>
                  <View style={styles.paymentCardDetails}>
                    <Text style={styles.paymentCardTitle}>Pay in Cash</Text>
                    <Text style={styles.paymentCardDesc}>Pay when service is completed</Text>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        <Card style={styles.securityCard}>
          <View style={styles.securityItem}>
            <Text style={styles.securityIcon}>🔒</Text>
            <Text style={styles.securityText}>Secure & Encrypted</Text>
          </View>
          <View style={styles.securityItem}>
            <Text style={styles.securityIcon}>✓</Text>
            <Text style={styles.securityText}>Money-back Guarantee</Text>
          </View>
          <View style={styles.securityItem}>
            <Text style={styles.securityIcon}>🛡️</Text>
            <Text style={styles.securityText}>Data Protection</Text>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={processing ? 'Processing...' : `Pay ₹${totalAmount}`}
          onPress={handlePayment}
          size="large"
          disabled={processing}
        />
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
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  amountCard: {
    marginBottom: 24,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  amountLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentMethodsContainer: {
    marginBottom: 24,
  },
  paymentMethodsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  paymentCard: {
    marginBottom: 12,
  },
  selectedPaymentCard: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
  },
  paymentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentCardRadio: {
    marginRight: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  paymentCardInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentCardIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  paymentCardDetails: {
    flex: 1,
  },
  paymentCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  paymentCardDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardDetailsCard: {
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
  },
  cardDetailsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  cardDetailsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  cardDetailsColumn: {
    flex: 1,
  },
  securityCard: {
    marginBottom: 24,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  securityText: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
