export const createRandomSku = (categoryName: string): string => {
  let skuPrefix = '';
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (const word of categoryName.split(' ')) {
    skuPrefix += word[0].toUpperCase();
  }

  return (
    skuPrefix +
    Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, '0') +
    alphabet[Math.floor(Math.random() * alphabet.length)]
  );
};
