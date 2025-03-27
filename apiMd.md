# Agrinextgen Market API Documentation

This document outlines all the backend API endpoints required for the Agrinextgen Market e-commerce platform.

## Base URL

```
https://api.Agrinextgen-market.com/api/v1
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer {token}
```

## API Endpoints

### Authentication

#### 1. Register User

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Register a new user (customer or seller)
- **Request Body**:
  ```json
  {
    "fullName": "DUSHIME Aime",
    "email": "john@example.com",
    "password": "securepassword",
    "confirmPassword": "securepassword",
    "role": "customer", // "customer" or "seller"
    // If seller, additional fields:
    "businessName": "Green Farm",
    "contactPerson": "DUSHIME Aime",
    "phone": "+1234567890"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "user": {
      "id": "user123",
      "fullName": "DUSHIME Aime",
      "email": "john@example.com",
      "role": "customer",
      "createdAt": "2023-06-01T12:00:00Z",
      "updatedAt": "2023-06-01T12:00:00Z"
    },
    "token": "jwt_token_here"
  }
  ```

#### 2. Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Authenticate a user
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "user": {
      "id": "user123",
      "fullName": "DUSHIME Aime",
      "email": "john@example.com",
      "role": "customer",
      "createdAt": "2023-06-01T12:00:00Z",
      "updatedAt": "2023-06-01T12:00:00Z"
    },
    "token": "jwt_token_here"
  }
  ```

#### 3. Password Reset Request

- **URL**: `/auth/forgot-password`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Request a password reset email
- **Request Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Password reset email sent"
  }
  ```

#### 4. Reset Password

- **URL**: `/auth/reset-password`
- **Method**: `POST`
- **Auth Required**: No
- **Description**: Reset password using token from email
- **Request Body**:
  ```json
  {
    "token": "reset_token_from_email",
    "password": "newpassword",
    "confirmPassword": "newpassword"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Password reset successful"
  }
  ```

### User Management

#### 1. Get User Profile

- **URL**: `/users/profile`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get current user profile
- **Response**: `200 OK`
  ```json
  {
    "id": "user123",
    "fullName": "DUSHIME Aime",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "ARWtown",
      "state": "State",
      "zipCode": "12345",
      "country": "Country"
    },
    "avatar": "https://example.com/avatar.jpg",
    "role": "customer",
    "createdAt": "2023-06-01T12:00:00Z",
    "updatedAt": "2023-06-01T12:00:00Z"
  }
  ```

#### 2. Update User Profile

- **URL**: `/users/profile`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Description**: Update user profile information
- **Request Body**:
  ```json
  {
    "fullName": "John Smith",
    "phone": "+9876543210",
    "address": {
      "street": "456 New St",
      "city": "Newtown",
      "state": "State",
      "zipCode": "54321",
      "country": "Country"
    }
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "id": "user123",
    "fullName": "John Smith",
    "email": "john@example.com",
    "phone": "+9876543210",
    "address": {
      "street": "456 New St",
      "city": "Newtown",
      "state": "State",
      "zipCode": "54321",
      "country": "Country"
    },
    "avatar": "https://example.com/avatar.jpg",
    "role": "customer",
    "createdAt": "2023-06-01T12:00:00Z",
    "updatedAt": "2023-06-02T12:00:00Z"
  }
  ```

#### 3. Update User Avatar

- **URL**: `/users/avatar`
- **Method**: `POST`
- **Auth Required**: Yes
- **Content-Type**: `multipart/form-data`
- **Description**: Upload user avatar
- **Request Body**:
  ```
  avatar: [file]
  ```
- **Response**: `200 OK`
  ```json
  {
    "avatar": "https://example.com/new-avatar.jpg",
    "message": "Avatar updated successfully"
  }
  ```

#### 4. Change Password

- **URL**: `/users/change-password`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Change user password
- **Request Body**:
  ```json
  {
    "currentPassword": "oldpassword",
    "newPassword": "newpassword",
    "confirmPassword": "newpassword"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Password changed successfully"
  }
  ```

### Products

#### 1. Get All Products

- **URL**: `/products`
- **Method**: `GET`
- **Auth Required**: No
- **Description**: Get all products with optional filtering
- **Query Parameters**:
  - `category`: Filter by category
  - `brand`: Filter by brand
  - `min_price`: Minimum price filter
  - `max_price`: Maximum price filter
  - `rating`: Filter by minimum rating
  - `organic`: Filter organic products (true/false)
  - `sort`: Sort order (price-asc, price-desc, newest, popular)
  - `page`: Page number
  - `limit`: Items per page
- **Response**: `200 OK`
  ```json
  {
    "products": [
      {
        "id": "prod123",
        "name": "Organic Apples",
        "description": "Fresh organic apples",
        "price": 2.99,
        "discountPrice": 2.49,
        "stock": 100,
        "images": ["https://example.com/apple1.jpg", "https://example.com/apple2.jpg"],
        "category": "fruits",
        "brand": "Green Farm",
        "tags": ["organic", "fresh", "fruit"],
        "rating": 4.5,
        "reviews": [
          {
            "id": "rev123",
            "userId": "user456",
            "userName": "Jane Smith",
            "rating": 5,
            "comment": "Very fresh and delicious!",
            "createdAt": "2023-06-10T15:30:00Z"
          }
        ],
        "sellerId": "seller789",
        "sellerName": "Green Farm Foods",
        "isOrganic": true,
        "isFeatured": true,
        "createdAt": "2023-06-01T12:00:00Z",
        "updatedAt": "2023-06-01T12:00:00Z"
      }
    ],
    "pagination": {
      "totalItems": 100,
      "currentPage": 1,
      "pageSize": 10,
      "totalPages": 10,
      "hasNext": true,
      "hasPrevious": false
    }
  }
  ```

#### 2. Get Product by ID

- **URL**: `/products/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Description**: Get a single product by ID
- **Response**: `200 OK`
  ```json
  {
    "id": "prod123",
    "name": "Organic Apples",
    "description": "Fresh organic apples",
    "price": 2.99,
    "discountPrice": 2.49,
    "stock": 100,
    "images": ["https://example.com/apple1.jpg", "https://example.com/apple2.jpg"],
    "category": "fruits",
    "brand": "Green Farm",
    "tags": ["organic", "fresh", "fruit"],
    "rating": 4.5,
    "reviews": [
      {
        "id": "rev123",
        "userId": "user456",
        "userName": "Jane Smith",
        "rating": 5,
        "comment": "Very fresh and delicious!",
        "createdAt": "2023-06-10T15:30:00Z"
      }
    ],
    "sellerId": "seller789",
    "sellerName": "Green Farm Foods",
    "isOrganic": true,
    "isFeatured": true,
    "createdAt": "2023-06-01T12:00:00Z",
    "updatedAt": "2023-06-01T12:00:00Z"
  }
  ```

#### 3. Create Product (Seller Only)

- **URL**: `/products`
- **Method**: `POST`
- **Auth Required**: Yes (Seller role)
- **Content-Type**: `multipart/form-data`
- **Description**: Create a new product
- **Request Body**:
  ```
  name: "Organic Apples"
  description: "Fresh organic apples"
  price: 2.99
  discountPrice: 2.49 (optional)
  stock: 100
  category: "fruits"
  brand: "Green Farm" (optional)
  tags: ["organic", "fresh", "fruit"] (optional)
  isOrganic: true
  isFeatured: false (optional)
  images: [file1, file2, ...] (up to 5 images)
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": "prod123",
    "name": "Organic Apples",
    "description": "Fresh organic apples",
    "price": 2.99,
    "discountPrice": 2.49,
    "stock": 100,
    "images": ["https://example.com/apple1.jpg", "https://example.com/apple2.jpg"],
    "category": "fruits",
    "brand": "Green Farm",
    "tags": ["organic", "fresh", "fruit"],
    "rating": 0,
    "reviews": [],
    "sellerId": "seller789",
    "sellerName": "Green Farm Foods",
    "isOrganic": true,
    "isFeatured": false,
    "createdAt": "2023-06-01T12:00:00Z",
    "updatedAt": "2023-06-01T12:00:00Z"
  }
  ```

#### 4. Update Product (Seller Only)

- **URL**: `/products/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes (Seller role, must be product owner)
- **Content-Type**: `multipart/form-data`
- **Description**: Update a product
- **Request Body**: Same fields as Create Product (all optional)
- **Response**: `200 OK`
  ```json
  {
    "id": "prod123",
    "name": "Organic Red Apples",
    "description": "Fresh organic red apples",
    "price": 3.49,
    "discountPrice": 2.99,
    "stock": 75,
    "images": ["https://example.com/apple1.jpg", "https://example.com/apple2.jpg"],
    "category": "fruits",
    "brand": "Green Farm",
    "tags": ["organic", "fresh", "fruit", "red"],
    "rating": 4.5,
    "reviews": [...],
    "sellerId": "seller789",
    "sellerName": "Green Farm Foods",
    "isOrganic": true,
    "isFeatured": true,
    "createdAt": "2023-06-01T12:00:00Z",
    "updatedAt": "2023-06-05T12:00:00Z"
  }
  ```

#### 5. Delete Product (Seller Only)

- **URL**: `/products/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Seller role, must be product owner)
- **Description**: Delete a product
- **Response**: `200 OK`
  ```json
  {
    "message": "Product deleted successfully"
  }
  ```

#### 6. Add Product Review

- **URL**: `/products/:id/reviews`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Add a review to a product
- **Request Body**:
  ```json
  {
    "rating": 5,
    "comment": "Excellent product, very fresh!"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": "rev456",
    "userId": "user123",
    "userName": "DUSHIME Aime",
    "rating": 5,
    "comment": "Excellent product, very fresh!",
    "createdAt": "2023-06-15T14:30:00Z"
  }
  ```

### Orders

#### 1. Create Order

- **URL**: `/orders`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Create a new order
- **Request Body**:
  ```json
  {
    "items": [
      {
        "productId": "prod123",
        "quantity": 3
      },
      {
        "productId": "prod456",
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "ARWtown",
      "state": "State",
      "zipCode": "12345",
      "country": "Country"
    },
    "paymentMethod": "card",
    "notes": "Please deliver in the afternoon"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": "order123",
    "userId": "user123",
    "items": [
      {
        "id": "item123",
        "productId": "prod123",
        "name": "Organic Apples",
        "price": 2.99,
        "quantity": 3,
        "image": "https://example.com/apple1.jpg",
        "sellerName": "Green Farm Foods"
      },
      {
        "id": "item456",
        "productId": "prod456",
        "name": "Organic Carrots",
        "price": 1.99,
        "quantity": 1,
        "image": "https://example.com/carrot1.jpg",
        "sellerName": "Green Farm Foods"
      }
    ],
    "subtotal": 10.96,
    "shippingFee": 5.00,
    "tax": 1.10,
    "total": 17.06,
    "shippingAddress": {
      "street": "123 Main St",
      "city": "ARWtown",
      "state": "State",
      "zipCode": "12345",
      "country": "Country"
    },
    "paymentMethod": "card",
    "paymentStatus": "pending",
    "orderStatus": "pending",
    "notes": "Please deliver in the afternoon",
    "createdAt": "2023-06-20T10:00:00Z",
    "updatedAt": "2023-06-20T10:00:00Z"
  }
  ```

#### 2. Get All Orders (User's Orders)

- **URL**: `/orders`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get all orders for the current user
- **Query Parameters**:
  - `status`: Filter by order status
  - `page`: Page number
  - `limit`: Items per page
- **Response**: `200 OK`
  ```json
  {
    "orders": [
      {
        "id": "order123",
        "userId": "user123",
        "items": [...],
        "subtotal": 10.96,
        "shippingFee": 5.00,
        "tax": 1.10,
        "total": 17.06,
        "shippingAddress": {...},
        "paymentMethod": "card",
        "paymentStatus": "paid",
        "orderStatus": "processing",
        "trackingNumber": "TRK123456",
        "notes": "Please deliver in the afternoon",
        "createdAt": "2023-06-20T10:00:00Z",
        "updatedAt": "2023-06-20T12:00:00Z"
      }
    ],
    "pagination": {
      "totalItems": 5,
      "currentPage": 1,
      "pageSize": 10,
      "totalPages": 1,
      "hasNext": false,
      "hasPrevious": false
    }
  }
  ```

#### 3. Get Order by ID

- **URL**: `/orders/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Get a single order by ID
- **Response**: `200 OK`
  ```json
  {
    "id": "order123",
    "userId": "user123",
    "items": [
      {
        "id": "item123",
        "productId": "prod123",
        "name": "Organic Apples",
        "price": 2.99,
        "quantity": 3,
        "image": "https://example.com/apple1.jpg",
        "sellerName": "Green Farm Foods"
      },
      {
        "id": "item456",
        "productId": "prod456",
        "name": "Organic Carrots",
        "price": 1.99,
        "quantity": 1,
        "image": "https://example.com/carrot1.jpg",
        "sellerName": "Green Farm Foods"
      }
    ],
    "subtotal": 10.96,
    "shippingFee": 5.00,
    "tax": 1.10,
    "total": 17.06,
    "shippingAddress": {
      "street": "123 Main St",
      "city": "ARWtown",
      "state": "State",
      "zipCode": "12345",
      "country": "Country"
    },
    "paymentMethod": "card",
    "paymentStatus": "paid",
    "orderStatus": "processing",
    "trackingNumber": "TRK123456",
    "notes": "Please deliver in the afternoon",
    "createdAt": "2023-06-20T10:00:00Z",
    "updatedAt": "2023-06-20T12:00:00Z"
  }
  ```

#### 4. Cancel Order

- **URL**: `/orders/:id/cancel`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Cancel an order (if not already shipped)
- **Response**: `200 OK`
  ```json
  {
    "id": "order123",
    "orderStatus": "cancelled",
    "updatedAt": "2023-06-21T09:00:00Z",
    "message": "Order cancelled successfully"
  }
  ```

### Payments

#### 1. Process Payment

- **URL**: `/payments/process`
- **Method**: `POST`
- **Auth Required**: Yes
- **Description**: Process payment for an order
- **Request Body**:
  ```json
  {
    "method": {
      "type": "card",
      "details": {
        "cardNumber": "4111111111111111",
        "cardName": "DUSHIME Aime",
        "expiry": "12/25",
        "cvv": "123"
      }
    },
    "amount": 17.06,
    "orderId": "order123",
    "currency": "USD",
    "customerInfo": {
      "name": "DUSHIME Aime",
      "email": "john@example.com"
    }
  }
  ```
  or for mobile money:
  ```json
  {
    "method": {
      "type": "mobile_money",
      "provider": "mtn",
      "details": {
        "phoneNumber": "+1234567890"
      }
    },
    "amount": 17.06,
    "orderId": "order123",
    "currency": "USD",
    "customerInfo": {
      "name": "DUSHIME Aime",
      "email": "john@example.com"
    }
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "transactionId": "trans123",
    "status": "success",
    "message": "Payment processed successfully"
  }
  ```

#### 2. Verify Payment

- **URL**: `/payments/verify/:transactionId`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Verify a payment's status
- **Response**: `200 OK`
  ```json
  {
    "transactionId": "trans123",
    "orderId": "order123",
    "amount": 17.06,
    "currency": "USD",
    "status": "success",
    "paymentMethod": "card",
    "createdAt": "2023-06-20T12:00:00Z"
  }
  ```

### Analytics (Seller Only)

#### 1. Get Dashboard Analytics

- **URL**: `/analytics/dashboard`
- **Method**: `GET`
- **Auth Required**: Yes (Seller role)
- **Description**: Get seller dashboard analytics
- **Query Parameters**:
  - `period`: Time period (day, week, month, year)
- **Response**: `200 OK`
  ```json
  {
    "totalSales": 1250.75,
    "totalOrders": 45,
    "averageOrderValue": 27.79,
    "productsSold": 120,
    "topProducts": [
      {
        "id": "prod123",
        "name": "Organic Apples",
        "totalSold": 30,
        "revenue": 89.70
      }
    ],
    "salesByDay": [
      {
        "date": "2023-06-01",
        "sales": 120.50
      }
    ],
    "recentOrders": [
      {
        "id": "order123",
        "customerName": "DUSHIME Aime",
        "amount": 17.06,
        "date": "2023-06-20T10:00:00Z",
        "status": "processing"
      }
    ]
  }
  ```

## Error Responses

All endpoints will return a standard error format:

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "The provided input is invalid",
    "details": {
      "email": "Email address is invalid"
    }
  }
}
```

Common error codes:

- `INVALID_INPUT`: Validation failed for the input data
- `UNAUTHORIZED`: Authentication is required or failed
- `FORBIDDEN`: User doesn't have permission for the requested action
- `NOT_FOUND`: The requested resource was not found
- `CONFLICT`: A conflict occurred (e.g., email already exists)
- `INTERNAL_ERROR`: An unexpected error occurred on the server
