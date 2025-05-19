import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { askAI } from '../../ai/aiService';

export const Main = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse('');
    try {
      const res = await askAI(input);
      setResponse(res);
    } catch (err) {
      setResponse('Ошибка при обращении к AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Напиши свой план дня..."
        value={input}
        onChangeText={setInput}
        style={styles.input}
        multiline
      />
      <Button title="Отправить" onPress={handleAsk} />
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      <ScrollView style={styles.response}>
        <Text>{response}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 50 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    minHeight: 80,
  },
  response: {
    marginTop: 20,
    maxHeight: 300,
  },
});