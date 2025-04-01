import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { toast } from "sonner"

// Types
interface Payment {
  id: string
  userId: string
  orderId: string
  amount: number
  status: string
  method: string
  transactionId: string
  createdAt: string
  updatedAt: string
  order?: any
}

interface PaymentState {
  payments: Payment[]
  payment: Payment | null
  isLoading: boolean
  error: string | null
}

const initialState: PaymentState = {
  payments: [],
  payment: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchPayments = createAsyncThunk("payments/fetchPayments", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      return rejectWithValue("Authentication required")
    }

    const response = await fetch("/api/payments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.error || "Failed to fetch payments")
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue("An error occurred while fetching payments")
  }
})

export const fetchPaymentById = createAsyncThunk(
  "payments/fetchPaymentById",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        return rejectWithValue("Authentication required")
      }

      const response = await fetch(`/api/payments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || "Failed to fetch payment")
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue("An error occurred while fetching the payment")
    }
  },
)

export const createPayment = createAsyncThunk(
  "payments/createPayment",
  async (paymentData: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        return rejectWithValue("Authentication required")
      }

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || "Failed to create payment")
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue("An error occurred while creating the payment")
    }
  },
)

export const updatePaymentStatus = createAsyncThunk(
  "payments/updatePaymentStatus",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        return rejectWithValue("Authentication required")
      }

      const response = await fetch(`/api/payments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || "Failed to update payment status")
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue("An error occurred while updating payment status")
    }
  },
)

// Slice
const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null
    },
    clearPayment: (state) => {
      state.payment = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch payments
      .addCase(fetchPayments.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.isLoading = false
        state.payments = action.payload
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Fetch payment by ID
      .addCase(fetchPaymentById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.isLoading = false
        state.payment = action.payload
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.isLoading = false
        state.payments = [action.payload, ...state.payments]
        state.payment = action.payload
        toast.success("Payment processed successfully")
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        toast.error(action.payload as string)
      })

      // Update payment status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.payments = state.payments.map((payment) => (payment.id === action.payload.id ? action.payload : payment))
        if (state.payment && state.payment.id === action.payload.id) {
          state.payment = action.payload
        }
        toast.success("Payment status updated")
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        toast.error(action.payload as string)
      })
  },
})

export const { clearPaymentError, clearPayment } = paymentSlice.actions
export default paymentSlice.reducer

