import { View, Text, Modal, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import clsx from 'clsx';
import { icons } from '@/constants/icons';
import dayjs from 'dayjs';
import {posthog} from "@/src/config/posthog";

interface CreateBotModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (bot: Bot) => void;
}

type Frequency = 'Monthly' | 'Yearly';
type Strategy = 'Momentum' | 'Breakout' | 'Mean Reversion' | 'Grid' | 'Scalping' | 'Other';
const CATEGORIES: Strategy[] = ['Momentum', 'Breakout', 'Mean Reversion', 'Grid', 'Scalping', 'Other'];
const CATEGORY_COLORS: Record<Strategy, string> = {
  'Momentum': '#ff6b6b',
  'Breakout': '#b8d4e3',
  'Mean Reversion': '#e8def8',
  'Grid': '#f5c542',
  'Scalping': '#95e1d3',
  'Other': '#d4d4d4',
};

const CreateBotModal = ({ visible, onClose, onSubmit }: CreateBotModalProps) => {
  const [name, setName] = useState('');
  const [performance, setPerformance] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('Monthly');
  const [category, setCategory] = useState<Strategy>('Other');

  // Improved price validation
  const isValidPerformance = () => {
    const trimmedPerformance = performance.trim();
    if (!trimmedPerformance) return false;
    // Strict numeric pattern check
    if (!/^\s*[+-]?(\d+(\.\d+)?|\.\d+)\s*$/.test(trimmedPerformance)) return false;
    const numValue = Number(trimmedPerformance);
    return Number.isFinite(numValue);
  };

  const isValidForm = name.trim() !== '' && isValidPerformance();

  const handleSubmit = () => {
    if (!isValidForm) return;

    const perfValue = Number(performance.trim());
    const now = dayjs();
    const renewalDate = frequency === 'Monthly' ? now.add(1, 'month') : now.add(1, 'year');

    const newBot: Bot = {
      id: `bot-${Date.now()}`,
      name: name.trim(),
      performance: perfValue,
      currency: '%',
      frequency,
      strategy: category,
      status: 'active',
      startDate: now.toISOString(),
      renewalDate: renewalDate.toISOString(),
      icon: icons.plus,
      billing: frequency,
      color: CATEGORY_COLORS[category],
    };

    onSubmit(newBot);

    posthog.capture('bot_created', {
      bot_name: name.trim(),
      bot_performance: perfValue,
      bot_frequency: frequency,
      bot_strategy: category,
    })

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setPerformance('');
    setFrequency('Monthly');
    setCategory('Other');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <Pressable className="modal-overlay" onPress={handleClose}>
          <Pressable className="modal-container" onPress={(e) => e.stopPropagation()}>
            <View className="modal-header">
              <Text className="modal-title">New Trading Bot</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">✕</Text>
              </Pressable>
            </View>

            <ScrollView
              className="p-5"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
            >
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  className="auth-input"
                  placeholder="Bot name"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Target Performance (%)</Text>
                <TextInput
                  className="auth-input"
                  placeholder="0.00"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={performance}
                  onChangeText={setPerformance}
                  keyboardType="decimal-pad"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Trade Frequency</Text>
                <View className="picker-row">
                  <Pressable
                    className={clsx('picker-option', frequency === 'Monthly' && 'picker-option-active')}
                    onPress={() => setFrequency('Monthly')}
                  >
                    <Text className={clsx('picker-option-text', frequency === 'Monthly' && 'picker-option-text-active')}>
                      Monthly
                    </Text>
                  </Pressable>
                  <Pressable
                    className={clsx('picker-option', frequency === 'Yearly' && 'picker-option-active')}
                    onPress={() => setFrequency('Yearly')}
                  >
                    <Text className={clsx('picker-option-text', frequency === 'Yearly' && 'picker-option-text-active')}>
                      Yearly
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Strategy</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      className={clsx('category-chip', category === cat && 'category-chip-active')}
                      onPress={() => setCategory(cat)}
                    >
                      <Text className={clsx('category-chip-text', category === cat && 'category-chip-text-active')}>
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Text className="text-red-500 text-center font-medium mb-3">
                * App subscription required to deploy bots
              </Text>
              <Pressable
                className={clsx('auth-button', !isValidForm && 'auth-button-disabled')}
                onPress={handleSubmit}
                disabled={!isValidForm}
              >
                <Text className="auth-button-text">Create Bot</Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateBotModal;
