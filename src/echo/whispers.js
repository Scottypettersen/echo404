// src/echo/whispers.js
export const WHISPERS = {
  recovery: [
    'RECOVERY REQUIRED.',
    'TRACE INCOMPLETE.',
    '... return to the last stable marker ...',
    '... sequence not yet earned ...',
  ],
  success: [
    'ACCESS GRANTED.',
    '... signal accepted ...',
  ],
  deny: [
    'ACCESS DENIED.',
    '... signal mismatch ...',
  ],
};

export function pick(list = []) {
  if (!list.length) return '';
  return list[Math.floor(Math.random() * list.length)];
}
