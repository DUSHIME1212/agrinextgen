# EcoBazar

## Description
EcoBazar is a comprehensive e-commerce platform that allows users to browse and purchase a variety of products. The application supports user authentication, cart management, order processing, and payment handling.

## Features
- **User Authentication**: Users can register and log in to their accounts.
- **Cart Management**: Users can add products to their cart and view their cart items.
- **Order Processing**: Users can create and view their orders.
- **Payment Handling**: Users can make payments for their orders.
- **Product Management**: Sellers can create and manage their products.

## Tech Stack
- **Frontend**: Next.js, React
- **Backend**: Node.js, Express
- **Database**: Prisma, PostgreSQL
- **Authentication**: JWT, bcrypt
- **Styling**: Tailwind CSS, shadcn

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/DUSHIME1212/agrinextgen.git
   cd agrinextgen
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   - Create a PostgreSQL database and update the connection string in the `.env` file.

## Running the Application
To run the application in development mode, use the following command:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## Environment Variables
Make sure to create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.
