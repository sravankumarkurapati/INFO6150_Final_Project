export const logoutUser = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  