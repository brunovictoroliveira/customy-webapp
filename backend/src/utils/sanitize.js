export const compactObject = (value) => {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  );
};
