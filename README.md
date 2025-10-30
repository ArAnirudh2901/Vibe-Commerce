# Mock E‑Commerce Cart v1

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
└── .qodo/             # IDE workflow metadata
```

Note: The root `package.json` scripts reference `backend` and `frontend`. In this project the directories are named `server` and `client`. Use the commands below, or update the root scripts to match.

## Tech Stack

- Backend: `Node.js`, `Express`, `MongoDB`, `Mongoose`, `JWT`
- Frontend: `React` (Vite), `TailwindCSS`, `Axios`
- Data seeding: `Fake Store API` with fallback local seeding

## Prerequisites

- `Node.js >= 16`
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

## Setup Screenshots

Place your screenshots in `docs/screenshots/` and they will render below. Suggested captures:

- Install dependencies at root
  - `![Install - root](docs/screenshots/install-root.png)`
- Install dependencies in `server`
  - `![Install - server](docs/screenshots/install-server.png)`
- Install dependencies in `client`
  - `![Install - client](docs/screenshots/install-client.png)`
- Backend running on `5001`
  - `![Server running](docs/screenshots/server-running.png)`
- Frontend running on `5173`
  - `![Client running](docs/screenshots/client-running.png)`
- UI: Home / Products / Cart
  - `![Home](docs/screenshots/ui-home.png)`
  - `![Products](docs/screenshots/ui-products.png)`
  - `![Cart](docs/screenshots/ui-cart.png)`
- Checkout receipt
  - `![Checkout receipt](docs/screenshots/checkout-receipt.png)`
- Postman: `GET /api/products`
  - `![API products](docs/screenshots/postman-products.png)`

Tips for capturing:

- Use terminal screenshots that show `Server running on port 5001` and Vite’s `Local: http://localhost:5173`.
- Include one screenshot per UI view for clarity.

## Common Issues & Fixes

- Root scripts reference `backend/frontend` but directories are `server/client`.
  - Use the commands in Quick Start or update root scripts as shown.
- MongoDB not running:
  - Ensure `mongod` is running locally and `MONGODB_URI` is correct.
- CORS errors:
  - Backend enables CORS (`app.use(cors())`). Ensure you’re calling `http://localhost:5001/api`.
- Invalid `productId` on `POST /cart`:
  - Must be a valid MongoDB ObjectId referring to an existing Product.

## Development Notes

- Error handling is centralized via `middleware/errorHandler.js` and `notFound`.
- Authentication uses JWT (header `x-auth-token`). `JWT_SECRET` can be provided via `.env`.
- Frontend API base is in `client/src/services/api.js`. Adjust if you change backend port.

## License

This project is for learning and demo purposes.