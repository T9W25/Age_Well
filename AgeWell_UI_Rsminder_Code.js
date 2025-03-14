import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const medications = [
  { id: '1', name: 'Paracetamol', dosage: '500Mg', time: '8:00 AM' },
  { id: '2', name: 'Ibuprofen', dosage: '500Mg', time: '8:00 AM' },
  { id: '3', name: 'Ibuprofen', dosage: '500Mg', time: '8:00 AM' },
];

const MedicationReminder = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.title}>AgeWell</Text>
        <Ionicons name="menu" size={24} color="black" />
      </View>
      <Text style={styles.subtitle}>Medication Reminder</Text>
      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Ionicons name="medkit" size={24} color="black" style={styles.icon} />
            <View>
              <Text style={styles.medText}>Medication Name: {item.name}</Text>
              <Text style={styles.medText}>Dosage: {item.dosage}</Text>
              <Text style={styles.medText}>Time: {item.time}</Text>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Reminder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3EAF2',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  medText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MedicationReminder;
