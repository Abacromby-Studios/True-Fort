const scrambledParts = [
  'bEJs', 'aE1q', 'aFdHd', 'kVZ1Z', 'XhDbGl', 'lTUEd', 'ZDJGeg==',
  'b1hsc', 'k0Ump', '5TVc1W'
];

export function decodePassword() {
  const unsort = [2, 4, 7, 0, 5, 8, 1, 3, 6, 9];
  const sorted = unsort.map(i => scrambledParts[i]);
  const combined = sorted.join('');
  const step1 = atob(combined);
  const step2 = atob(step1);
  const final = atob(step2);
  return final;
}
