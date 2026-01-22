# Soeltan Medsos - Developer Cheat Sheet & Guide

## Project Structure

```
c:\Githab\SM\
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components (ui.jsx, Navbar, Footer, etc.)
│   │   ├── context/         # React Context (AuthContext, CartContext)
│   │   ├── pages/           # Page components (Home, Products, Admin pages)
│   │   ├── services/        # API Client (axios instances)
│   │   └── utils/           # Helper functions (formatters)
│   └── ...
├── backend/                 # Node.js Express Backend
│   ├── server.js            # Main server entry point
│   ├── ...
└── ...
```

## Key Components

### 1. UI Components (`src/components/ui.jsx`)

Reusable atomic components with Dark Theme support.

- `Button`: Standard buttons with variants (primary, secondary, ghost, danger).
- `Input`: Text inputs with consistent styling.
- `Select`: Custom dropdown with animation and styling.

### 2. Admin Layout (`src/components/AdminLayout.jsx`)

The main wrapper for Admin Pages.

- **Features**: Sidebar (Desktop), Mobile Header, Active Link highlighting.
- **Theme**: Global Dark Theme (`bg-slate-900`).
- **Logo**: Uses `/LOGO-.png`.

### 3. Products Management (`src/pages/admin/ProductsManagement.jsx`)

- **Inline Form**: Collapsible "Add Product" form at the top.
- **Grid Layout**: Form fields are organized in a 2-column grid.
- **Dark Theme**: Fully styled for dark mode.
- **Platform Logic**: Supports adding new platforms dynamically.

### 4. Orders Management (`src/pages/admin/OrdersManagement.jsx`)

- **Filters**: Status (Payment/Seller) and Platform (Client-side filtering).
- **Detail Modal**: Shows Order details + Action buttons (Update Status, WA Buyer).

### 5. Checkout (`src/pages/Checkout.jsx`)

- **Validation**: Enforces WhatsApp number input.
- **Flow**: Cart -> Validation -> API Create Order -> Success Page.
- **Styling**: Dark theme with glassmorphism cards.

## Code Standards & Clean Code

### 1. Imports

- Group imports: React/Third-party first, then Local components, then Icons/Utils.
- Remove unused imports before committing.

### 2. Styling (Tailwind CSS)

- Use `bg-slate-900` / `bg-slate-950` for page backgrounds.
- Use `bg-slate-800/50 backdrop-blur-xl` for cards (Glassmorphism).
- Use `text-slate-400` for secondary text, `text-white` for primary.
- Use `indigo-600` for primary actions.

### 3. Async/Await

- Always use `try/catch` blocks for API calls.
- Use `toast` for user feedback (Success/Error).
- Use `loading` states to show Spinners (`PageLoader`).

### 4. Responsiveness

- Always test `md:` and `lg:` breakpoints.
- Use `hidden lg:block` for desktop-only elements.
- Use `lg:hidden` for mobile-only elements.
- Ensure tables have `overflow-x-auto` to prevent breaking layout on mobile.

## Common Snippets

**Formatter Usage:**

```javascript
import { formatRupiah, formatDate } from '../../utils/formatters';

formatRupiah(15000); // "Rp 15.000"
formatDate(new Date()); // "21 Jan 2026 19:30"
```

**API Call:**

```javascript
import { adminApi } from '../../services/api';

const fetchData = async () => {
  try {
    const res = await adminApi.getOrders();
    // handle success
  } catch (err) {
    toast.error('Gagal memuat data');
  }
};
```
