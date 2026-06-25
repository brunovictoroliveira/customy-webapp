import { formatDateOnly } from "../utils/date.js";

export const serializeNote = (note) => {
  const data = note.toJSON();

  return {
    ...data,
    date: formatDateOnly(data.date),
    note: data.content || "",
  };
};
