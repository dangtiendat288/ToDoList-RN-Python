import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TodoItem } from '@/components/TodoItem';
import { TodoForm } from '@/components/TodoForm';
import { useTodo } from '@/contexts/TodoContext';
import { Todo } from '@/services/TodoService';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TodoScreen() {
  const { todos, loading, error, fetchTodos, addTodo, updateTodo, deleteTodo } = useTodo();
  const [formVisible, setFormVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(undefined);
  const insets = useSafeAreaInsets();
  const tintColor = useThemeColor({}, 'tint');

  const handleAddTodo = () => {
    setSelectedTodo(undefined);
    setFormVisible(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setFormVisible(true);
  };

  const handleSubmitTodo = async (todo: Todo) => {
    try {
      if (selectedTodo && selectedTodo.id) {
        await updateTodo(selectedTodo.id, todo);
      } else {
        await addTodo(todo);
      }
      setFormVisible(false);
    } catch (err) {
      console.error('Error submitting todo:', err);
    }
  };

  const handleDeleteTodo = (id: number | undefined) => {
    if (!id) return;

    Alert.alert(
      "Delete Todo",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTodo(id)
        }
      ]
    );
  };

  const handleToggleTodo = (todo: Todo) => {
    if (!todo.id) return;
    updateTodo(todo.id, { ...todo, completed: !todo.completed });
  };

  if (loading && todos.length === 0) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ThemedText type="title" style={styles.header}>Todo List</ThemedText>

      {error ? (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={fetchTodos}>
            <ThemedText style={styles.retryText}>Try Again</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : null}

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={() => handleToggleTodo(item)}
            onEdit={() => handleEditTodo(item)}
            onDelete={() => handleDeleteTodo(item.id)}
          />
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No todos yet. Add one below!</ThemedText>
          </ThemedView>
        }
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: tintColor }]}
        onPress={handleAddTodo}
      >
        <ThemedText style={styles.addButtonText}>+</ThemedText>
      </TouchableOpacity>

      <TodoForm
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmitTodo}
        initialValues={selectedTodo}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
  },
  header: {
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    opacity: 0.6,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 10,
  },
  retryButton: {
    padding: 8,
  },
  retryText: {
    color: '#0a7ea4',
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});