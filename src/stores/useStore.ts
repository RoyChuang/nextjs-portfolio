import { create } from 'zustand';

interface Item {
  id: number;
  title: string;
  description: string;
}

interface Store {
  items: Item[];
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (id: number, item: Partial<Item>) => void;
  deleteItem: (id: number) => void;
}

export const useStore = create<Store>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, { ...item, id: Date.now() }],
    })),
  updateItem: (id, updatedItem) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    })),
  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));
