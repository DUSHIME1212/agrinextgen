import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { toast } from "sonner"


interface ProductImage {
  id: string
  url: string
  productId: string
}

export interface Product {
  id: string
  documentId: string
  name: string
  price: number
  productStatus: string
  productDescription?: string
  features?: string
  verified: boolean
  isNew: boolean
  discount?: number
  rating: number
  slug: string
  sellerId: string
  createdAt: string
  updatedAt: string
  Category?: string
  productimg: ProductImage[]
  seller?: {
    id: string
    name?: string
    businessName?: string
  }
}

interface ProductState {
  products: Product[]
  product: Product | null
  isLoading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

const initialState: ProductState = {
  products: [],
  product: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
}


export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: { page?: number; limit?: number; category?: string; sellerId?: string } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, category, sellerId } = params
      let url = `/api/products?page=${page}&limit=${limit}`

      if (category) url += `&category=${category}`
      if (sellerId) url += `&sellerId=${sellerId}`

      console.log("Fetching products from:", url)
      const response = await fetch(url)

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || "Failed to fetch products")
      }

      const data = await response.json()
      console.log("Fetched products:", data)
      return data
    } catch (error) {
      console.error("Error fetching products:", error)
      return rejectWithValue("An error occurred while fetching products")
    }
  },
)

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/products/${slug}`)
      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || "Failed to fetch product")
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue("An error occurred while fetching the product")
    }
  }
)

export const addProduct = createAsyncThunk("products/addProduct", async (productData: any, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      return rejectWithValue("Authentication required")
    }

    
    let imageUrls = []
    if (productData.images && productData.images.length > 0) {
      imageUrls = productData.images
    }

    
    const { images, ...productDataWithoutImages } = productData

    
    const dataToSend = {
      ...productDataWithoutImages,
      images: imageUrls,
    }

    console.log("Sending product data to API:", dataToSend)

    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("API error response:", error)
      return rejectWithValue(error.error || "Failed to add product")
    }

    const product = await response.json()
    console.log("API success response:", product)

    return product
  } catch (error: any) {
    console.error("Error in addProduct thunk:", error)
    return rejectWithValue(error.message || "An error occurred while adding the product")
  }
})

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }: { id: string; productData: any }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        return rejectWithValue("Authentication required")
      }

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const error = await response.json()
        return rejectWithValue(error.error || "Failed to update product")
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue("An error occurred while updating the product")
    }
  },
)

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id: string, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      return rejectWithValue("Authentication required")
    }

    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.error || "Failed to delete product")
    }

    return { id }
  } catch (error) {
    return rejectWithValue("An error occurred while deleting the product")
  }
})


const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null
    },
    clearProduct: (state) => {
      state.product = null
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload.products
        state.pagination = action.payload.pagination
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        state.product = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = [action.payload, ...state.products]
        toast.success("Product added successfully")
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        toast.error(action.payload as string)
      })

      
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = state.products.map((product) => (product.id === action.payload.id ? action.payload : product))
        if (state.product && state.product.id === action.payload.id) {
          state.product = action.payload
        }
        toast.success("Product updated successfully")
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        toast.error(action.payload as string)
      })

      
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = state.products.filter((product) => product.id !== action.payload.id)
        toast.success("Product deleted successfully")
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        toast.error(action.payload as string)
      })
  },
})

export const { clearProductError, clearProduct } = productSlice.actions
export default productSlice.reducer

