# 🛒 The Sybil Market | Web3 Trading Card dApp

![Status](https://img.shields.io/badge/Status-Deployed-success)
![Node](https://img.shields.io/badge/Node.js-20.x-green)
![Framework](https://img.shields.io/badge/Next.js-13-black)

**Live Demo:** [https://thesybilmarket.vercel.app/](https://thesybilmarket.vercel.app/)

A decentralized e-commerce application (dApp) built on the Polygon network. The project merges physical merchandise with digital ownership via NFTs (ERC-1155). It features a secure architecture separating client-side Web3 interactions from server-side sensitive data handling.

---

## 🏗 Architecture & Security

This project implements a **Backend-for-Frontend (BFF)** pattern using Next.js API Routes to ensure security and prevent "Environment Contamination".

### 1. Client-Side (Browser)
* **Framework:** React / Next.js (Pages Router).
* **Web3 Interaction:** Uses `@thirdweb-dev/react` for wallet connection, chain switching, and smart contract interaction (Minting/Burning).
* **Security:** No private keys or service account credentials are exposed to the client bundle. The UI interacts *only* with the blockchain (public) and internal API endpoints.

### 2. Server-Side (Node.js Runtime)
* **API Routes:** Located in `pages/api/`. These function as serverless lambda functions deployed on Vercel.
* **Data Persistence:** Google Sheets API is used as a lightweight, real-time database to track orders and referrals.
* **Authentication:** Server-to-Server authentication using Google Service Account (JWT).
* **Isolation:** The `google-auth-library` and `google-spreadsheet` packages are restricted to the server runtime, preventing Webpack build errors (`node:events`, `fs` modules) and credential leaks.

---

## 🛠 Tech Stack

* **Frontend:** Next.js 13, TypeScript, Tailwind CSS
* **Blockchain:** Polygon Mainnet, Thirdweb SDK, Ethers.js v5
* **Database / Storage:** Google Sheets API v4
* **Deployment:** Vercel (Node.js 20.x Runtime)

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+ (Recommended v20 LTS)
* npm or yarn

### 1. Clone the repository
```bash
git clone [https://github.com/rxxddy/web3-trading-card-app.git](https://github.com/rxxddy/web3-trading-card-app.git)
cd web3-trading-card-app

```

### 2. Install Dependencies

*Note: Using `--legacy-peer-deps` is required due to specific Web3 package versions.*

```bash
npm install --legacy-peer-deps

```

### 3. Environment Variables

Create a `.env.local` file in the root directory. **Never commit this file.**

```env
# Google Sheets Configuration (Server-Side Only)
GOOGLE_SHEETS_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Public Config
NEXT_PUBLIC_TEMPLATE_CLIENT_ID=your_thirdweb_client_id

```

### 4. Run Development Server

```bash
npm run dev

```

The app will be available at `http://localhost:3000`.

---

## 📦 Deployment (Vercel)

### Node.js Versioning Policy

As of 2024/2025, Vercel has discontinued support for Node.js 18.x. This project is configured to run on **Node.js 20.x (LTS)**.

**Configuration steps:**

1. Ensure `package.json` includes the engines field:
```json
"engines": { "node": ">=20.0.0" }

```


2. In Vercel Dashboard: `Settings` -> `General` -> `Node.js Version` -> Set to **20.x**.
3. **Build Command:** `next build`
4. **Install Command:** `npm install --legacy-peer-deps`

### TypeScript Verification

To prevent build failures during deployment due to strict type checking in legacy libraries, the `next.config.js` is configured to ignore build errors:

```javascript
typescript: {
  ignoreBuildErrors: true,
},

```


