// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken")
  return !!token // Returns true if token exists, false otherwise
}

// Helper function to get the current user data
export const getCurrentUser = () => {
  const userData = localStorage.getItem("userData")
  return userData ? JSON.parse(userData) : null
}

// Helper function to logout user
export const logout = () => {
  localStorage.removeItem("authToken")
  localStorage.removeItem("userData")
  // You can add additional cleanup here if needed
}
