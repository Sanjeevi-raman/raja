# Raja Electricals

A clean monorepo — **React frontend** and **Express + MongoDB Atlas backend** are separated into two folders, but served from a single unified address without requiring Docker.

```text
electric-main/
├── client/          # React + Vite frontend (the website)
│   ├── index.html
│   ├── vite.config.mjs
│   ├── package.json
│   └── src/
│       ├── pages/       # Home, About, Products, Projects, Gallery, Brands, Contact, Dashboard
│       ├── components/  # Layout (Header/Footer), shared UI
│       ├── lib/api.js   # fetch helpers for /api
│       ├── data/        # static image URLs
│       └── *.css
├── server/          # Express API + MongoDB Atlas backend
│   ├── server.js    # all /api routes, auth, DB models
│   ├── supabase.js  # Supabase integration
│   ├── package.json
│   ├── .env         # MONGODB_URI, JWT_SECRET, ADMIN_*
│   └── .env.example
├── package.json     # root scripts (workspaces)
└── README.md
```

## Architecture

```text
React + Vite Frontend (Port 4000)
       ↓
Express API Server (Port 4000)
       ↓
MongoDB Atlas (`raja-electricals`)
```

- **http://localhost:4000** serves the built React website **and** the `/api` routes — same address, no CORS issues.
- `/api/*` routes connect to **MongoDB Atlas** (content, products, brands, enquiries, orders, admin authentication).
- Supabase integration is preserved for synchronized tables and assets.

---

## MongoDB Atlas Configuration

1. **Database Name**: The database name must be `raja-electricals`.
2. **Connection String Format**:
   Set `MONGODB_URI` in `server/.env` (and root `.env`):
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.vsfwtu2.mongodb.net/raja-electricals?retryWrites=true&w=majority
   ```
   *(Replace `<username>` and `<password>` with your Atlas database user credentials).*

3. **Network Access**:
   - Go to **MongoDB Atlas** → **Security** → **Network Access**.
   - Ensure your current IP address is added to the IP Access List (or your deployment server's IP address).

---

## Environment Variables

Create `server/.env` (or copy from `server/.env.example`) and configure:

```env
PORT=4000
MONGODB_USERNAME=stombregar3_db_user
MONGODB_PASSWORD=<Atlas database password>
MONGODB_URI=mongodb+srv://stombregar3_db_user:<Atlas database password>@cluster0.vsfwtu2.mongodb.net/raja-electricals
JWT_SECRET=<strong-random-secret>
ADMIN_EMAIL=admin@rajaelectricals.com
ADMIN_PASSWORD=<strong-admin-password>
SUPABASE_URL=https://xgtwlxycixgzhjyfcksb.supabase.co
SUPABASE_SECRET_KEY=<your-supabase-server-secret>
```

> **Security Note**: Never commit `.env` files to version control. All `.env` files are ignored via `.gitignore`.

---

## Local Development (No Docker Required)

1. **Install dependencies** (from the root directory):
   ```bash
   npm install
   ```

2. **Build and start the application**:
   ```bash
   npm run dev
   ```
   This builds the React application into `client/dist` and starts the Express server on port 4000.

3. **Access the application**:
   - Website: [http://localhost:4000](http://localhost:4000)
   - Admin Dashboard: [http://localhost:4000/#dashboard](http://localhost:4000/#dashboard)

### Frontend Hot-Reload Mode (Optional)

To develop with Vite hot-module reloading:
1. Start the backend in one terminal:
   ```bash
   npm run dev:server
   ```
2. Start the Vite development server in another terminal:
   ```bash
   npm run dev:client
   ```
   Vite runs on port 5173 and proxies `/api` requests to the Express server on port 4000.

---

## Root Scripts

| Command              | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `npm run dev`        | Builds the React client and starts the Express server  |
| `npm run build`      | Builds the React client into `client/dist`              |
| `npm start`          | Starts the Express API server on port 4000              |
| `npm run dev:client` | Runs the Vite dev server with hot reload on port 5173   |
| `npm run dev:server` | Runs the Express API server on port 4000                |

---

## Docker Data Preservation Note

If you previously ran MongoDB inside Docker with the `mongo_data` named volume:
- The volume remains stored inside your Docker virtual disk image and is **not** deleted.
- If you need to export legacy data from Docker's volume, run:
  ```bash
  docker run --rm -v mongo_data:/data/db -v ${PWD}:/backup mongo:7 mongodump --out /backup/mongo_dump
  ```
- To restore the dumped data to MongoDB Atlas:
  ```bash
  mongorestore --uri="<MONGODB_ATLAS_URI>" mongo_dump/raja-electricals
  ```
- When starting with MongoDB Atlas, the server automatically initializes default products, categories, site content, and admin accounts if the database is newly created.
