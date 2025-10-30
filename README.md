# Mock E‑Commerce Cart 

A minimal full‑stack e‑commerce cart example with an Express + MongoDB backend and a Vite + React frontend. It seeds products from the Fake Store API (with graceful fallback) and provides a simple cart and checkout flow.

## Project Structure

```
mock-e-commerce_cart-v1/
├── server/            # Express API, MongoDB models, routes
│   ├── server.js      # App bootstrap, seeding, error handling
│   ├── routes/        # products, cart, checkout, users
│   ├── models/        # Product, Cart, User
│   ├── middleware/    # auth, errorHandler
│   ├── services/      # Fake Store API integration
│   └── .env           # MONGODB_URI, PORT, optional JWT_SECRET
├── client/            # Vite + React app (TailwindCSS)
│   ├── src/           # Components, services
│   ├── index.html
│   └── vite.config.js
├── package.json       # Root scripts (see Note below)
```

Note: The root `package.json` scripts reference `backend` and `frontend`. In this project the directories are named `server` and `client`. Use the commands below, or update the root scripts to match.

## Tech Stack

- Backend: `Node.js`, `Express`, `MongoDB`, `Mongoose`, `JWT`
- Frontend: `React` (Vite), `TailwindCSS`, `Axios`
- Data seeding: `Fake Store API` with fallback local seeding

## Features 
 
 - **Product Seeding**: Automatically fetches products from Fake Store API on startup 
 - **Fallback Data**: Uses Unsplash placeholder images if API is unavailable 
 - **Responsive Design**: Mobile-first UI with TailwindCSS 
 - **Dark Theme**: Clean, modern dark UI 
 - **Cart Management**: Add, update quantity, remove items 
 - **Mock Checkout**: Receipt generation with timestamp 
 - **Error Handling**: Centralized error middleware 

## Prerequisites

- `Node.js >= 20`
- `npm` (or `pnpm`/`yarn` if you prefer)
- A local MongoDB instance running at `mongodb://localhost:27017/vibe-commerce`

## Environment Variables (server/.env)

- `MONGODB_URI` (required): e.g., `mongodb://localhost:27017/vibe-commerce`
- `PORT` (optional): defaults to `5001`
- `JWT_SECRET` (optional): defaults to `'mock-ecommerce-secret-key'` if not set

Example `server/.env`:

```
MONGODB_URI='mongodb://localhost:27017/vibe-commerce'
PORT=5001
# JWT_SECRET='change-me'
```

## Quick Start

- Install dependencies at the root, then in `server` and `client`:
  - `npm install`
  - `cd server && npm install`
  - `cd ../client && npm install`

- Start the backend (Express + MongoDB):
  - `cd server`
  - `npm run dev`
  - Backend runs on `http://localhost:5001` (configurable via `PORT`)

- Start the frontend (Vite + React):
  - Open a new terminal
  - `cd client`
  - `npm run dev`
  - Vite dev server runs on `http://localhost:5173`

- Frontend is configured to call the backend at `http://localhost:5001/api` (see `client/src/services/api.js`).

### Optional: Run Both with a Single Command

If you prefer running both in one terminal, use `concurrently`:

```
npx concurrently "cd server && npm run dev" "cd client && npm run dev"
```

Or update the root `package.json` scripts to:

```
{
  "scripts": {
    "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm run dev\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm run dev",
    "install-all": "npm install && cd server && npm install && cd ../client && npm install"
  }
}
```

## API Overview

Base URL: `http://localhost:5001/api`

- `GET /products`
  - Returns all products (seeded via Fake Store API or fallback).

- `GET /cart`
  - Returns cart items and `total`.

- `POST /cart`
  - Body: `{ productId, quantity }`
  - Adds item to cart; quantity clamped between `1` and `20`.

- `PUT /cart/:id`
  - Body: `{ quantity }`
  - Updates quantity (clamped `1..20`).

- `DELETE /cart/:id`
  - Removes item from cart.

- `POST /checkout`
  - Body: `{ cartItems }` where each item has `productId` populated and `quantity`.
  - Returns a mock receipt and clears cart.

- Users (`/users`)
  - `POST /users/register`: `{ username, email, password, firstName, lastName }`
  - `POST /users/login`: `{ email, password }`
  - `GET /users/me`: requires header `x-auth-token: <JWT>`

## Data Models

- Product:
  - `{ name, price, image, description?, category?, rating?: { rate, count } }`
- Cart:
  - `{ productId: ObjectId<Product>, quantity }`
- User:
  - `{ username, email, password (hashed), firstName?, lastName?, isAdmin? }`

## Seeding & Images

- On first run, the backend attempts to fetch products from the Fake Store API.
- If the API is unavailable, it seeds fallback products (Unsplash images), and ensures a minimum of 20 products.
- It may later replace placeholder/Unsplash images with Fake Store images when the API becomes available.

## Frontend Features

- Landing page with CTA to shop
- Product grid with add‑to‑cart
- Cart view with quantity update, remove, and checkout modal
- Clean dark UI using TailwindCSS and Lucide icons

## Preview Screenshots for Large Screen

- Landing page 
  - ![image alt](https://github.com/ArAnirudh2901/Vibe-Commerce/blob/16f181d8ed8b5a383e4eea6a62ac37f6da781a2f/PC-Landing-Page.jpg)
- Products listing
  - ![image alt](https://github.com/ArAnirudh2901/Vibe-Commerce/blob/16f181d8ed8b5a383e4eea6a62ac37f6da781a2f/PC-Products.jpg)
  - ![image alt](https://github.com/ArAnirudh2901/Vibe-Commerce/blob/16f181d8ed8b5a383e4eea6a62ac37f6da781a2f/PC-Products2.jpg)
- Cart preview
  - ![image alt](https://github.com/ArAnirudh2901/Vibe-Commerce/blob/16f181d8ed8b5a383e4eea6a62ac37f6da781a2f/PC-Card.jpg)
- Checkout receipt
  - ![image alt](https://github.com/ArAnirudh2901/Vibe-Commerce/blob/16f181d8ed8b5a383e4eea6a62ac37f6da781a2f/PC-checkout.jpg)
- Order Confirmation with Order Number
  - ![image alt](https://github.com/ArAnirudh2901/Vibe-Commerce/blob/16f181d8ed8b5a383e4eea6a62ac37f6da781a2f/PC-order.jpg)
 
 ## Preview Screenshots for Mobile Responsive Mode

- Landing page 
  - ![image alt](https://github.com/ArAnirudh2901/Vibe-Commerce/blob/16f181d8ed8b5a383e4eea6a62ac37f6da781a2f/Mobile-landing-page.jpg)
- Products listing
  - ![image alt](https://github.com/ArAnirudh2901/Vibe-Commerce/blob/16f181d8ed8b5a383e4eea6a62ac37f6da781a2f/Mobile-products-section.jpg)
- Cart preview
  - ![image alt](https://github.com/ArAnirudh2901/Vibe-Commerce/blob/16f181d8ed8b5a383e4eea6a62ac37f6da781a2f/Mobile-cart-preview.jpg)
- Checkout receipt
  - ![image alt](https://github.com/ArAnirudh2901/Vibe-Commerce/blob/16f181d8ed8b5a383e4eea6a62ac37f6da781a2f/Mobile-checkout.jpg)
- Order Confirmation with Order Number
  - ![image alt](https://github.com/ArAnirudh2901/Vibe-Commerce/blob/16f181d8ed8b5a383e4eea6a62ac37f6da781a2f/Mobile-order.jpg)
 

## Common Issues & Fixes 

### Root scripts reference `backend/frontend` but directories are `server/client` 
- Use the commands in Quick Start or update root scripts as shown above 

### MongoDB not running 
- Ensure `mongod` is running locally 
- Verify `MONGODB_URI` in `server/.env` is correct 
- Check MongoDB connection logs in server terminal 

### CORS errors 
- Backend enables CORS via `app.use(cors())` 
- Ensure frontend calls `http://localhost:5001/api` 
- Check `client/src/services/api.js` for correct base URL 

### Invalid `productId` on POST /cart 
- Must be a valid MongoDB ObjectId 
- Product must exist in database 
- Check seeding completed successfully 

### Port already in use 
- Change `PORT` in `server/.env` 
- Update frontend API base URL in `client/src/services/api.js` 
- Kill existing processes: `lsof -ti:5001 | xargs kill -9` (Mac/Linux) 

## Development Notes 

- Error handling centralized via `middleware/errorHandler.js` 
- Authentication uses JWT (header `x-auth-token`) 
- Frontend API configuration in `client/src/services/api.js` 
- Product seeding logic in `server/services/fakeStoreApi.js` 
- Cart state managed in React `App.jsx` component 

## Technology Highlights 

- **React 19**: Latest features including improved hooks and performance 
- **Vite**: Lightning-fast HMR and build times 
- **TailwindCSS**: Utility-first styling with dark theme 
- **MongoDB**: NoSQL database with Mongoose ODM 
- **Express**: Minimal and flexible Node.js web framework 

## License

This project is for learning and demo purposes.

---
