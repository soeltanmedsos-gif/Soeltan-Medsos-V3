# Project Structure

```
soeltan-medsos/
├── .editorconfig          # Editor configuration
├── .gitignore             # Git ignore rules
├── .prettierrc            # Code formatter config
├── README.md              # Project documentation
├── schema.sql             # Database schema for Supabase
│
├── assets/                # Static assets
│   ├── LOGO-.png          # Logo (small)
│   ├── LOGO.png           # Logo (full)
│   ├── qrcode.jpg         # QR code
│   ├── qrcode.png         # QR code
│   └── Soeltan_Medsos.apk # Android app
│
├── docs/                  # Documentation
│   ├── Price List *.docx  # Price list documents
│   └── Price List *.pdf   # Price list PDFs
│
├── legacy/                # Legacy files (reference only)
│   ├── index.html         # Old static website
│   ├── script.js          # Old JavaScript
│   ├── service.json       # Old service data
│   ├── pengumuman.json    # Old announcements
│   └── TEST.js            # Test file
│
├── backend/               # Node.js Express API
│   ├── .env.example       # Environment template
│   ├── package.json       # Dependencies
│   ├── app.js             # Express app setup
│   ├── server.js          # Server entry point
│   └── src/
│       ├── config/
│       │   └── index.js   # Environment config
│       ├── controllers/
│       │   ├── adminController.js
│       │   ├── orderController.js
│       │   ├── productController.js
│       │   └── webhookController.js
│       ├── middleware/
│       │   ├── auth.js          # JWT authentication
│       │   ├── rateLimit.js     # Rate limiting
│       │   └── validation.js    # Input validation
│       ├── routes/
│       │   ├── adminRoutes.js
│       │   ├── publicRoutes.js
│       │   └── webhookRoutes.js
│       ├── services/
│       │   ├── midtrans.js      # Payment service
│       │   └── supabase.js      # Database service
│       └── utils/
│           └── helpers.js       # Utility functions
│
└── frontend/              # React + Vite + TailwindCSS
    ├── index.html         # Entry HTML
    ├── package.json       # Dependencies
    ├── vite.config.js     # Vite configuration
    ├── tailwind.config.js # Tailwind configuration
    ├── postcss.config.js  # PostCSS configuration
    ├── public/
    │   ├── LOGO-.png
    │   └── Soeltan_Medsos.apk
    └── src/
        ├── main.jsx       # React entry point
        ├── App.jsx        # Main app with routing
        ├── components/
        │   ├── AdminLayout.jsx
        │   ├── Footer.jsx
        │   ├── LoadingSpinner.jsx
        │   ├── Navbar.jsx
        │   ├── OrderStatusCard.jsx
        │   └── ProductCard.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── CheckOrder.jsx
        │   ├── Home.jsx
        │   ├── OrderInfo.jsx
        │   ├── ProductDetail.jsx
        │   ├── Products.jsx
        │   └── admin/
        │       ├── Dashboard.jsx
        │       ├── Login.jsx
        │       ├── OrdersManagement.jsx
        │       └── ProductsManagement.jsx
        ├── services/
        │   └── api.js
        ├── styles/
        │   └── index.css
        └── utils/
            └── formatters.js
```

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────▶│    Backend      │────▶│    Supabase     │
│  React + Vite   │     │  Node + Express │     │   PostgreSQL    │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │                 │
         └─────────────▶│    Midtrans     │
            Snap.js     │   Payment API   │
                        │                 │
                        └─────────────────┘
```
