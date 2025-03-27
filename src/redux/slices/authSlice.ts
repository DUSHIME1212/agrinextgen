import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = "http://localhost:1337"

// Types
interface User {
  id?: string
  email: string
  name?: string
  businessName?: string
  contactPerson?: string
  role: "customer" | "seller"
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window === "undefined") return

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const removeCookie = (name: string) => {
  if (typeof window === "undefined") return
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

// Helper function to get token from cookies or localStorage
const getToken = () => {
  if (typeof window === "undefined") return null

  // Try to get from localStorage first
  const lsToken = localStorage.getItem("jwt")
  if (lsToken) return lsToken

  // If not in localStorage, try cookies
  const cookies = document.cookie.split(";")
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]?.trim() || ""
    if (cookie.startsWith("token=")) {
      return cookie.substring("token=".length, cookie.length)
    }
  }

  return null
}

const getUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (error) {
    console.error("Error parsing user from localStorage:", error)
    return null
  }
}

// Initial state
const initialState: AuthState = {
  user: typeof window !== "undefined" ? getUser() : null,
  token: typeof window !== "undefined" ? getToken() : null,
  isLoading: false,
  error: null,
}


export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { identifier: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/local`, credentials)
      console.log(response);
      
      const { token, user } = response.data 

      console.log(token);
      

      localStorage.setItem("token", response.data.jwt)

      console.log(response.data);
      
      setCookie("token", response.data.token)

      localStorage.setItem("user", JSON.stringify(response.data))

      return { token, user }
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.message || "Login failed")
    }
  },
)

// Customer registration Done
export const registerCustomer = createAsyncThunk(
  "auth/registerCustomer",
  async (
    userData: {
      username: string
      email: string
      password: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/local/register`, userData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed")
    }
  },
)

// Seller registration
export const registerSeller = createAsyncThunk(
  "auth/registerSeller",
  async (
    userData: {
      email: string
      password: string
      businessName: string
      contactPerson: string
      phoneNumber: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register/seller`, userData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed")
    }
  },
)

// Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  removeCookie("token")
  return null
})

// Check auth status
export const checkAuthStatus = createAsyncThunk("auth/checkStatus", async (_, { getState, rejectWithValue }) => {
  

    try {
        const token = getToken();
        const user = getUser();
        
        if (!token || !user) {
          return rejectWithValue("No active session found");
        }
        
        
        return { user, token };
        
      } catch (error: any) {
        localStorage.removeItem("token");
        localStorage.removeItem("user"); 
        removeCookie("token");
        
        return rejectWithValue(error.message || "Authentication check failed");
      }
})

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.user = action.payload.user
      state.token = action.payload.token
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Customer Registration
    builder.addCase(registerCustomer.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(registerCustomer.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false
    })
    builder.addCase(registerCustomer.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Seller Registration
    builder.addCase(registerSeller.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(registerSeller.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false
    })
    builder.addCase(registerSeller.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Check Auth Status
    builder.addCase(checkAuthStatus.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(checkAuthStatus.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false
      state.user = action.payload.user
      state.token = action.payload.token
    })
    builder.addCase(checkAuthStatus.rejected, (state) => {
      state.isLoading = false
      state.user = null
      state.token = null
    })

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
      state.token = null
    })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer

