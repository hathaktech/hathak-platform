export const sanitizeUser = (user) => {
  const { password, ...safeUser } = user.toObject();
  return safeUser;
};