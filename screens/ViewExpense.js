import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, TextInput, Modal, Button } from 'react-native';
import { ref, onValue, remove, update } from 'firebase/database';
import { database } from '../config/firebaseConfig';

const ViewExpense = () => {
    const [expenses, setExpenses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedAmount, setUpdatedAmount] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');

    useEffect(() => {
        const expensesRef = ref(database, 'expenses');
        const unsubscribe = onValue(expensesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const expenseArray = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setExpenses(expenseArray);
            } else {
                setExpenses([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = (id) => {
        remove(ref(database, `expenses/${id}`))
            .then(() => Alert.alert('Deleted', 'Expense removed successfully'))
            .catch((error) => Alert.alert('Error', error.message));
    };

    const handleUpdate = (expense) => {
        setSelectedExpense(expense);
        setUpdatedTitle(expense.title);
        setUpdatedAmount(expense.amount.toString());
        setUpdatedDescription(expense.description);
        setModalVisible(true);
    };

    const saveUpdatedExpense = () => {
        if (!updatedTitle || !updatedAmount || !updatedDescription) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        update(ref(database, `expenses/${selectedExpense.id}`), {
            title: updatedTitle,
            amount: parseFloat(updatedAmount),
            description: updatedDescription,
        })
            .then(() => {
                Alert.alert('Updated', 'Expense updated successfully');
                setModalVisible(false);
            })
            .catch((error) => Alert.alert('Error', error.message));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Expenses</Text>
            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.expenseItem}>
                        <View>
                            <Text style={styles.expenseTitle}>{item.title}</Text>
                            <Text style={styles.expenseAmount}>Rs {item.amount}</Text>
                            <Text style={styles.expenseDesc}>{item.description}</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => handleUpdate(item)}>
                                <Text style={styles.update}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <Text style={styles.delete}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Modal for Updating Expense */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Expense</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={updatedTitle}
                            onChangeText={setUpdatedTitle}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Amount (Rs)"
                            keyboardType="numeric"
                            value={updatedAmount}
                            onChangeText={setUpdatedAmount}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={updatedDescription}
                            onChangeText={setUpdatedDescription}
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
                            <Button title="Update" onPress={saveUpdatedExpense} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    expenseItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, marginVertical: 5, backgroundColor: '#fff', borderRadius: 10, elevation: 2 },
    expenseTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    expenseAmount: { fontSize: 16, color: '#FFC107' },
    expenseDesc: { fontSize: 14, color: '#777' },
    actions: { flexDirection: 'row', gap: 15 },
    update: { color: 'blue', fontWeight: 'bold' },
    delete: { color: 'red', fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    input: { height: 50, borderColor: '#ddd', borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, backgroundColor: '#fff' },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
});

export default ViewExpense;
