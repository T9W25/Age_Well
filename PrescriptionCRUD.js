import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const PrescriptionCRUD = () => {
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const addOrUpdatePrescription = () => {
    if (medication && dosage && time) {
      let updatedPrescriptions = [...prescriptions];
      if (editingIndex !== null) {
        updatedPrescriptions[editingIndex] = { medication, dosage, time };
        setEditingIndex(null);
      } else {
        updatedPrescriptions.push({ medication, dosage, time });
      }
      setPrescriptions(updatedPrescriptions);
      setMedication('');
      setDosage('');
      setTime('');
    }
  };

  const editPrescription = (index) => {
    setMedication(prescriptions[index].medication);
    setDosage(prescriptions[index].dosage);
    setTime(prescriptions[index].time);
    setEditingIndex(index);
  };

  const deletePrescription = (index) => {
    let updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(updatedPrescriptions);
    setEditingIndex(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prescription Management</Text>
      <TextInput
        style={styles.input}
        placeholder="Medication Name"
        value={medication}
        onChangeText={setMedication}
      />
      <TextInput
        style={styles.input}
        placeholder="Dosage"
        value={dosage}
        onChangeText={setDosage}
      />
      <TextInput
        style={styles.input}
        placeholder="Time"
        value={time}
        onChangeText={setTime}
      />
      <Button
        title={editingIndex !== null ? "Update Prescription" : "Add Prescription"}
        onPress={addOrUpdatePrescription}
      />
      <FlatList
        data={prescriptions}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.prescriptionItem}>
            <Text>{item.medication} - {item.dosage} - {item.time}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => editPrescription(index)}>
                <Text style={styles.edit}>✏ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deletePrescription(index)}>
                <Text style={styles.delete}>🗑 Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  prescriptionItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 10, borderWidth: 1, marginVertical: 5, borderRadius: 5
  },
  actions: { flexDirection: 'row', gap: 10 },
  edit: { color: 'blue', marginRight: 10 },
  delete: { color: 'red' }
});

export default PrescriptionCRUD;
