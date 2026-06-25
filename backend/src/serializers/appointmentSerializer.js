import { formatDateOnly } from "../utils/date.js";

export const serializeAppointment = (appointment) => {
  const data = appointment.toJSON();

  return {
    ...data,
    date: formatDateOnly(data.date),
  };
};
