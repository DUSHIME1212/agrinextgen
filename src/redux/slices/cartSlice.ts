import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { toast } from "sonner"

// Types
interface CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    price: number
    productStatus: string
    productimg: Array<{ url: string }>
    seller?: {
      id: string
      name?: string
      businessName?: string
    }
  }
}

interface Cart {
  id: string
  userId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

interface CartState {
  cart: Cart | null
  isLoading: boolean
  error: string | null
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      return rejectWithValue("Authentication required")
    }

    const response = await fetch("/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("Cart fetch error:", error)
      return rejectWithValue(error.error || "Failed to fetch cart")
    }

    return await response.json()
  } catch (error) {
    console.error("Cart fetch exception:", error)
    return rejectWithValue("An error occurred while fetching the cart")
  }
})

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }: { productId: string; quantity?: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        return rejectWithValue("Authentication required")
      }

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || "Failed to add item to cart")
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue("An error occurred while adding item to cart")
    }
  },
)

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        return rejectWithValue("Authentication required")
      }

      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || "Failed to update cart item")
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue("An error occurred while updating cart item")
    }
  },
)

export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (itemId: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      return rejectWithValue("Authentication required")
    }

    const response = await fetch(`/api/cart/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.error || "Failed to remove item from cart")
    }

    return await response.json()
  } catch (error) {
    return rejectWithValue("An error occurred while removing item from cart")
  }
})

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null
    },
    clearCart: (state) => {
      state.cart = null
    },
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload
      if (state.cart && state.cart.items) {
        state.cart.items = state.cart.items.map((item) => (item.id === id ? { ...item, quantity } : item))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.cart = action.payload
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.cart = action.payload
        toast.success("Item added to cart")
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        toast.error(action.payload as string)
      })

      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.cart = action.payload
        toast.success("Cart updated")
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        toast.error(action.payload as string)
      })

      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.cart = action.payload
        toast.success("Item removed from cart")
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        toast.error(action.payload as string)
      })
  },
})

export const { clearCartError, clearCart, updateCartItemQuantity } = cartSlice.actions
export default cartSlice.reducer

