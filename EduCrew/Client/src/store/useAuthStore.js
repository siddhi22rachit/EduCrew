import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      set({ authUser: res.data })
    } catch (error) {
      console.error("Error in checkAuth:", error)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      console.log("Signup data:", data)
      const res = await axiosInstance.post("/auth/signup", data)
      console.log("Signup response:", res.data) // Log the response
      set({ authUser: res.data })
      toast.success("Account created successfully")
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "An error occurred during signup")
    } finally {
      set({ isSigningUp: false })
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true })
    try {
      const res = await axiosInstance.post("/auth/login", data)
      set({ authUser: res.data })
      toast.success("Logged in successfully")
      return true // Return true on successful login
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "An error occurred during login")
      return false // Return false on login failure
    } finally {
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout")
      set({ authUser: null })
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "An error occurred during logout")
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true })
    try {
      const res = await axiosInstance.put("/auth/update-profile", data)
      set({ authUser: res.data })
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Update profile error:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "An error occurred while updating profile")
    } finally {
      set({ isUpdatingProfile: false })
    }
  },

  isUserValid: () => {
    const { authUser } = get()
    return authUser !== null
  },
}))

