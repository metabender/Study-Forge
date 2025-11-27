export const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDate = (dateString: string): string => {
  const date = parseLocalDate(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getDaysUntilDue = (dateString: string): number => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const due = parseLocalDate(dateString);
  due.setHours(0, 0, 0, 0);

  const days = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return days;
};

export const formatDaysUntilDue = (dateString: string): string => {
  const days = getDaysUntilDue(dateString);

  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `${days} days`;
};
