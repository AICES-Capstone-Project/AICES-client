export const tagColors = [
  'magenta',
  'green',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

export const tagColorFor = (value?: string | null) => {
  if (!value) return 'default';
  // simple hash to pick a color deterministically
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0; // convert to 32bit int
  }
  const idx = Math.abs(h) % tagColors.length;
  return tagColors[idx];
};
