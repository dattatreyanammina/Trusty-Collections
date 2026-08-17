# 🌿 Trusty Collections - Traditional Indian Saree Store

A modern e-commerce platform specializing in authentic traditional Indian sarees, particularly Pattu/Blouses, built with React, TypeScript, and Firebase.

## ✨ Features

### 👥 Customer Features
- **Browse Products** - Shop traditional sarees and blouses with detailed product pages
- **Inquiry-Based Model** - Direct contact for custom Pattu sarees pricing
- **Smart Checkout** - Easy multi-step checkout with quantity selector
- **Order Tracking** - Real-time order status tracking with WhatsApp updates
- **Mobile Optimized** - Fully responsive design for seamless mobile shopping
- **Social Integration** - Connect via Instagram, YouTube, WhatsApp, and phone

### 🛡️ Admin Features
- **Product Management** - Add, edit, delete products with image URLs and categories
- **Order Management** - View, update order status, and send WhatsApp confirmations to customers
- **Analytics Dashboard** - Monthly sales tracking with revenue breakdown
- **Real-Time Stats** - Total revenue, products sold, and pending orders overview
- **Secure Access** - Firebase Authentication with admin-only access control

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite 6.4.2
- **Styling**: Tailwind CSS with custom maroon/gold/stone theme
- **Database**: Firestore (Firebase)
- **Authentication**: Firebase Auth
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Animations**: Framer Motion
- **Deployment**: Vercel
- **Database Rules**: Firestore Security Rules

## 📦 Installation

```bash
# Clone or extract project
cd Trusty-Collections

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🚀 Usage

### For Customers
1. Browse products on the home page
2. Click on a product to view details
3. Add to order and enter shipping details
4. Select quantity and proceed to payment
5. Transfer exact amount to the UPI number shown
6. Submit transaction ID to complete order
7. Receive WhatsApp order confirmation and tracking updates

### For Admin
1. Login at `/admin` with your email
2. **Orders Tab**: View all orders, update status, send WhatsApp confirmations
3. **Products Tab**: Create new products with categories (Pattu Saree, Blouse, Saree, Dress)
4. **Analytics Tab**: Track monthly sales, revenue, and best-selling products
5. **Settings Tab**: Configure store settings

## 📱 Payment

Orders are processed via UPI transfer to: **7989840075**

Customers receive:
- Order confirmation with unique Order ID
- Payment instructions (copy number → open UPI app → transfer amount)
- WhatsApp tracking updates when status changes
- Delivery confirmation upon shipment

## 📊 Product Categories

- **Pattu Saree** - Premium silk sarees (inquiry-only, no prices shown)
- **Blouse** - Matching blouse pieces
- **Saree** - Traditional sarees
- **Dress** - Contemporary saree-inspired dresses

## 🔐 Security

- Firebase Security Rules protect data access
- Admin-only product creation/editing/deletion
- Customer order data encryption
- Auth token validation for all operations

## 📱 Social Links

- Instagram: [@7trusty_collections](https://www.instagram.com/7trusty_collections)
- YouTube: [Lakshmi The Explorer](https://youtube.com/@lakshmitheexplorer9632)
- WhatsApp: +91-7989840075
- Phone: +91-7989840075

## 📞 Contact

For inquiries about custom orders or Pattu sarees:
- Call: +91-7989840075
- WhatsApp: +91-7989840075
- Email: support@trusty-collections.com

## 📋 Project Structure

```
src/
├── components/
│   ├── AdminProductForm.tsx      # Product creation/editing form
│   ├── AdminProtectedRoute.tsx   # Admin access protection
│   ├── Navbar.tsx                # Top navigation
│   └── ProductCard.tsx           # Product display card
├── lib/
│   └── firebase.ts               # Firebase config & utilities
├── pages/
│   ├── AdminDashboard.tsx        # Admin portal (orders, products, analytics)
│   ├── AdminLogin.tsx            # Admin login page
│   ├── Home.tsx                  # Product listing & filters
│   ├── OrderFlow.tsx             # Checkout flow (details → payment → success)
│   ├── ProductDetail.tsx         # Individual product page
│   └── TrackOrder.tsx            # Order tracking
├── App.tsx                        # Main app router
├── main.tsx                       # React entry point
├── types.ts                       # TypeScript definitions
└── index.css                      # Global styles

public/
└── images/                        # Product images

firestore.rules                    # Database security rules
firebase.json                      # Firebase CLI config
```

## 🌐 Deployment

Deployed on **Vercel** at: [trusty-collections.vercel.app](https://trusty-collections.vercel.app)

To deploy:
```bash
# Build locally
npm run build

# Deploy to Vercel (if connected)
vercel deploy
```

## 🎨 Color Scheme

- **Primary**: Maroon (#991B1B) - Traditional Indian color
- **Accent**: Gold (#D4AF37) - Premium feel
- **Neutral**: Stone (various shades) - Elegant background
- **Success**: Emerald - Confirmation states

## 📈 Monthly Analytics

Admin dashboard provides:
- Total revenue across all time periods
- Monthly breakdown (orders, units sold, revenue per month)
- Top-selling products by month
- Pending orders requiring attention
- Customer contact history

## 🎯 Business Model

- **Direct Sales**: Traditional products sold with transparent pricing
- **Custom Orders**: Pattu sarees available by inquiry (call/WhatsApp)
- **B2B Ready**: Analytics and tracking support bulk orders
- **Customer Retention**: WhatsApp notifications keep customers engaged

## 📝 Notes

- Product images are hosted via URLs (no Firebase Storage upload)
- All orders stored in Firestore with automatic timestamps
- UPI payments are manual verification (customer sends transaction ID)
- Admin access requires Firebase Authentication

## 🤝 Support

For issues or feature requests, contact via WhatsApp: +91-7989840075
