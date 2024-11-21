import { useState } from 'react';

import { useTasks } from './useTasks';

export function useTaskForm() {
  const [title, setTitle] = useState('');
  const { createTask } = useTasks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask({ title });
    setTitle('');
  };

  return {
    title,
    setTitle,
    handleSubmit,
  };
}
