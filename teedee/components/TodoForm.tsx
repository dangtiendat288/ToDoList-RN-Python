import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Todo } from '../services/TodoService';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TodoFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (todo: Todo) => void;
    initialValues?: Todo;
}

export function TodoForm({ visible, onClose, onSubmit, initialValues }: TodoFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tintColor = useThemeColor({}, 'tint');

    useEffect(() => {
        if (initialValues) {
            setTitle(initialValues.title);
            setDescription(initialValues.description || '');
        } else {
            setTitle('');
            setDescription('');
        }
    }, [initialValues, visible]);

    const handleSubmit = () => {
        if (!title.trim()) return;

        const todo: Todo = {
            title: title.trim(),
            description: description.trim(),
            completed: initialValues?.completed || false,
        };

        onSubmit(todo);
        setTitle('');
        setDescription('');
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <ThemedView style={styles.formContainer}>
                        <ThemedText type="subtitle" style={styles.title}>
                            {initialValues ? 'Edit Todo' : 'Add Todo'}
                        </ThemedText>

                        <TextInput
                            style={[styles.input, { color: textColor, borderColor: textColor + '50' }]}
                            placeholder="Todo title"
                            placeholderTextColor={textColor + '80'}
                            value={title}
                            onChangeText={setTitle}
                        />

                        <TextInput
                            style={[
                                styles.input,
                                styles.textArea,
                                { color: textColor, borderColor: textColor + '50' }
                            ]}
                            placeholder="Description (optional)"
                            placeholderTextColor={textColor + '80'}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                        />

                        <View style={styles.buttonContainer}>
                            <Button title="Cancel" onPress={onClose} color="#888" />
                            <Button
                                title={initialValues ? "Update" : "Add"}
                                onPress={handleSubmit}
                                disabled={!title.trim()}
                                color={tintColor}
                            />
                        </View>
                    </ThemedView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    formContainer: {
        width: '90%',
        padding: 24,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
});