const timestamp = (): string => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const uniqueText = (prefix: string): string => `${prefix}-${timestamp()}`;

export const uniqueEmail = (prefix = 'qa.user'): string => `${prefix}.${timestamp()}@vetdemo.test`;

export const futureDate = (daysAhead = 1): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
};

export const futureDateTimeLocal = (daysAhead = 1, hour = 10, minute = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(hour, minute, 0, 0);

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
