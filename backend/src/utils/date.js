export const parseDateOnly = (value) => {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00.000Z`);
};

export const dateOnlyRange = (value) => {
  const start = parseDateOnly(value);

  if (!start) {
    return null;
  }

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { $gte: start, $lt: end };
};

export const formatDateOnly = (date) => {
  if (!date) {
    return "";
  }

  return new Date(date).toISOString().slice(0, 10);
};
