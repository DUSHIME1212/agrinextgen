import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"


interface User {
  id: string
  email: string
  name?: string
  role: string
  businessName?: string
  contactPerson?: string
  phoneNumber?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}


const getStoredToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

const initialState: AuthState = {
  user: null,
  token: getStoredToken(),
  isLoading: false,
  error: null,
  isAuthenticated: false,
}


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { identifier: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || "Failed to login")
      }

      const data = await response.json()
      
      localStorage.setItem("token", data.token)
      return data
    } catch (error) {
      return rejectWithValue("An error occurred during login")
    }
  },
)

export const registerCustomer = createAsyncThunk(
  "auth/registerCustomer",
  async (userData: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.username,
          email: userData.email,
          password: userData.password,
          role: "CUSTOMER",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || "Failed to register")
      }

      const data = await response.json()
      
      localStorage.setItem("token", data.token)
      return data
    } catch (error) {
      return rejectWithValue("An error occurred during registration")
    }
  },
)

export const registerSeller = createAsyncThunk(
  "auth/registerSeller",
  async (
    userData: {
      businessName: string
      contactPerson: string
      email: string
      phoneNumber: string
      password: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.contactPerson,
          email: userData.email,
          password: userData.password,
          role: "SELLER",
          businessName: userData.businessName,
          contactPerson: userData.contactPerson,
          phoneNumber: userData.phoneNumber,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || "Failed to register")
      }

      const data = await response.json()
      
      localStorage.setItem("token", data.token)
      return data
    } catch (error) {
      return rejectWithValue("An error occurred during registration")
    }
  },
)

export const checkAuthStatus = createAsyncThunk("auth/checkAuthStatus", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      return rejectWithValue("No token found")
    }

    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      localStorage.removeItem("token")
      return rejectWithValue("Session expired")
    }

    const data = await response.json()
    return { user: data.user, token }
  } catch (error) {
    localStorage.removeItem("token")
    return rejectWithValue("Failed to verify authentication")
  }
})

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    localStorage.removeItem("token")
    return null
  } catch (error) {
    return rejectWithValue("Failed to logout")
  }
})


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      
      .addCase(registerCustomer.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerCustomer.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      
      .addCase(registerSeller.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerSeller.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })

      
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { clearAuthError } = authSlice.actions
export default authSlice.reducer

