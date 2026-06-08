import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, TextInput } from 'react-native';
import { ListWithCount } from '../types/api.types';

interface Props {
  visible: boolean;
  lists: ListWithCount[];
  onClose: () => void;
  onAdd: (listId: string, quantity: number) => Promise<void>;
}

export function QuantityModal({ visible, lists, onClose, onAdd }: Props) {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!selectedListId) return;
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    setSubmitting(true);
    try {
      await onAdd(selectedListId, qty);
      setSelectedListId(null);
      setQuantity('1');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title}>Add to List</Text>
          {lists.length === 0 ? (
            <Text style={styles.empty}>No lists yet. Create one first.</Text>
          ) : (
            <>
              {lists.map((list) => (
                <Pressable
                  key={list.id}
                  style={[styles.listOption, selectedListId === list.id && styles.listOptionSelected]}
                  onPress={() => setSelectedListId(list.id)}
                >
                  <Text style={[styles.listOptionText, selectedListId === list.id && styles.listOptionTextSelected]}>
                    {list.name}
                  </Text>
                </Pressable>
              ))}
              {selectedListId && (
                <View style={styles.quantityRow}>
                  <Text style={styles.quantityLabel}>Quantity:</Text>
                  <TextInput
                    style={styles.quantityInput}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="number-pad"
                    selectTextOnFocus
                    maxLength={3}
                  />
                </View>
              )}
              <Pressable
                style={[styles.addButton, (!selectedListId || submitting) && styles.addButtonDisabled]}
                onPress={handleAdd}
                disabled={!selectedListId || submitting}
              >
                <Text style={styles.addButtonText}>{submitting ? 'Adding...' : 'Add to List'}</Text>
              </Pressable>
            </>
          )}
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    gap: 10,
    maxHeight: '70%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  empty: {
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 16,
  },
  listOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  listOptionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  listOptionText: {
    fontSize: 15,
    color: '#374151',
  },
  listOptionTextSelected: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityLabel: {
    fontSize: 15,
    color: '#374151',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    width: 64,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#6b7280',
    fontSize: 15,
  },
});
