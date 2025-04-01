import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { toast } from "sonner"

// Types
interface WishlistItem {
  id: string
  userId: string
  productId: string
  createdAt: string
  product: {
    id: string
    name: string
    price: number
    productStatus: string
    productimg: Array<{ url: string }>
  }
}

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  error: string | null
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      return rejectWithValue("Authentication required")
    }

    const response = await fetch("/api/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.error || "Failed to fetch wishlist")
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue("An error occurred while fetching the wishlist")
  }
})

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        return rejectWithValue("Authentication required")
      }

      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || "Failed to add to wishlist")
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue("An error occurred while adding to wishlist")
    }
  },
)

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (wishlistItemId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        return rejectWithValue("Authentication required")
      }

      const response = await fetch(`/api/wishlist/${wishlistItemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || "Failed to remove from wishlist")
      }

      return { id: wishlistItemId }
    } catch (error) {
      return rejectWithValue("An error occurred while removing from wishlist")
    }
  },
)

// Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = [...state.items, action.payload]
        toast.success("Added to wishlist")
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        toast.error(action.payload as string)
      })

      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.filter((item) => item.id !== action.payload.id)
        toast.success("Removed from wishlist")
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        toast.error(action.payload as string)
      })
  },
})

export const { clearWishlistError } = wishlistSlice.actions
export default wishlistSlice.reducer

