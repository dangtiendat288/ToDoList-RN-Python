import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { Todo } from '../services/TodoService';
import { Checkbox } from 'react-native-paper';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TodoItemProps {
    todo: Todo;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
    const iconColor = useThemeColor({}, 'icon');

    return (
        <ThemedView style={styles.container}>
            <View style={styles.todoContent}>
                <Checkbox
                    status={todo.completed ? 'checked' : 'unchecked'}
                    onPress={onToggle}
                    color={useThemeColor({}, 'tint')}
                />
                <View style={styles.textContainer}>
                    <ThemedText
                        style={[
                            styles.title,
                            todo.completed && styles.completedText
                        ]}
                    >
                        {todo.title}
                    </ThemedText>
                    {todo.description ? (
                        <ThemedText
                            style={[
                                styles.description,
                                todo.completed && styles.completedText
                            ]}
                        >
                            {todo.description}
                        </ThemedText>
                    ) : null}
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                    <ThemedText style={styles.actionText}>Edit</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                    <ThemedText style={[styles.actionText, styles.deleteText]}>Delete</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    todoContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        marginTop: 4,
    },
    completedText: {
        textDecorationLine: 'line-through',
        opacity: 0.7,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
    },
    actionButton: {
        marginLeft: 16,
        padding: 4,
    },
    actionText: {
        fontSize: 14,
        color: '#0a7ea4',
    },
    deleteText: {
        color: '#e74c3c',
    },
});