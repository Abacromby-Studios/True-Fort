const scrambledParts = ['QWw=', 'cGhh', 'bGxvI', 'bGFi', 'ZCBDa', 'HR5I', 'gNNTI', '1NzY=', '1NTg=', '5Mw=='];

export function decodePassword() {
  const unsort = [2, 3, 4, 0, 1, 6, 5, 8, 9, 7];
  const sorted = unsort.map(i => scrambledParts[i]);
  const combined = sorted.join('');
  const step1 = atob(combined);
  const step2 = atob(step1);
  const final = atob(step2);
  return final;
}
