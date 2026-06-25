export const serializeCustomer = (customer) => {
  const data = customer.toJSON();

  return {
    ...data,
    birthDate: data.birthDate
      ? data.birthDate.toISOString().slice(0, 10)
      : null,
  };
};
