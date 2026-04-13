import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { dummyAddresses } from '@/src/data';

export default function AddressSelectorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const workerId = params.workerId as string;
  const workerName = params.workerName as string;
  const [selectedAddressId, setSelectedAddressId] = useState(dummyAddresses[0].id);

  const handleSelectAddress = () => {
    if (!selectedAddressId) {
      Alert.alert('Please select an address');
      return;
    }

    router.push({
      pathname: '/(customer)/ai-match',
      params: { workerId, workerName, addressId: selectedAddressId },
    });
  };

  const renderAddressCard = ({ item }: { item: (typeof dummyAddresses)[0] }) => (
    <TouchableOpacity
      style={[
        styles.addressCard,
        selectedAddressId === item.id && styles.selectedAddressCard,
      ]}
      onPress={() => setSelectedAddressId(item.id)}
    >
      <Card style={{ marginBottom: 0 }}>
        <View style={styles.cardContent}>
          <View style={styles.addressContent}>
            <View
              style={[
                styles.radioButton,
                selectedAddressId === item.id && styles.radioButtonSelected,
              ]}
            >
              {selectedAddressId === item.id && (
                <View style={styles.radioButtonDot} />
              )}
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>{item.label}</Text>
              <Text style={styles.addressText}>{item.address}</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Address</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Where would you like the service?
        </Text>
      </View>

      <FlatList
        data={dummyAddresses}
        keyExtractor={(item) => item.id}
        renderItem={renderAddressCard}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />

      <Card style={styles.addNewCard}>
        <TouchableOpacity style={styles.addNewButton}>
          <Text style={styles.addNewIcon}>➕</Text>
          <Text style={styles.addNewText}>Add New Address</Text>
        </TouchableOpacity>
      </Card>

      <View style={styles.footer}>
        <Button
          label="Continue"
          onPress={handleSelectAddress}
          size="large"
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
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  addressCard: {
    marginBottom: 12,
  },
  selectedAddressCard: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.grayLight,
    marginRight: 12,
    marginTop: 2,
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
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  addNewCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  addNewText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
