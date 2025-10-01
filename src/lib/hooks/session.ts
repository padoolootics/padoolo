export const saveUserSession = (token: string, user: { id: number; name: string }) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearUserSession = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

export const getUserSession = () => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");

  if (token && user) {
    return { token, user: JSON.parse(user) };
  }
  return null;
};
