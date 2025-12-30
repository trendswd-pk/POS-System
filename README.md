# 🛒 POS System - Complete Point of Sale System

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

> A complete, production-ready Point of Sale (POS) System for retail shops with full inventory management, sales tracking, and user management capabilities. Built with React and Supabase for scalable cloud-based data storage.

## 📑 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Deployment](#-deployment)
- [User Guide](#-user-guide)
- [Project Structure](#-project-structure)
- [Technology Stack](#-technology-stack)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 📦 Core Modules

| Module | Description |
|--------|-------------|
| **Items Management** | Complete product catalog with code, name, category, pricing |
| **Stock Purchase** | Record supplier purchases with invoice tracking |
| **Stock Return** | Handle supplier returns with automatic stock adjustment |
| **Sales** | Process customer sales with invoice generation |
| **Sale Return** | Manage customer returns efficiently |
| **Closing Stock** | Real-time stock monitoring with filtering options |
| **User Management** | Role-based access control with customizable permissions |

### 🎯 Key Features

- ✅ **Real-time Stock Tracking** - Automatic stock updates on purchase/sale
- ✅ **Invoice Management** - Auto-generated invoice numbers
- ✅ **Search & Filter** - Quick search across all modules
- ✅ **Print Functionality** - Print invoices and reports
- ✅ **Responsive Design** - Works on desktop and tablet devices
- ✅ **Cloud Storage** - Supabase integration for data persistence
- ✅ **User Permissions** - Granular permission system
- ✅ **Password Security** - Bcrypt password hashing for secure authentication
- ✅ **Row Level Security (RLS)** - Database-level security enabled
- ✅ **Data Export** - View and print transaction history
- ✅ **Performance Optimized** - Batch operations and caching for fast performance

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Supabase Account** ([Sign up for free](https://supabase.com))

### Installation

#### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/pos-system.git
cd pos-system
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Set up Supabase Database

1. Create a new project at [Supabase](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Open `setup-database.sql` from this project
4. Copy and paste the entire SQL script
5. Click **Run** to execute
6. Wait for all queries to complete successfully

**What the setup script does:**
- ✅ Creates all required tables
- ✅ Sets up indexes for performance
- ✅ Enables Row Level Security (RLS)
- ✅ Creates RLS policies for all tables
- ✅ Creates default admin user
- ✅ Automatically hashes all passwords

#### Step 4: Configure Environment Variables

Create `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**How to get credentials:**
1. Go to Supabase Dashboard → Settings → API
2. Copy **Project URL** → `VITE_SUPABASE_URL`
3. Copy **anon/public key** → `VITE_SUPABASE_ANON_KEY`

#### Step 5: Start Development Server

```bash
npm run dev
```

#### Step 6: Access the Application

- Open `http://localhost:5173` in your browser
- Login with default credentials:
  - **Username:** `admin`
  - **Password:** `admin123`

⚠️ **IMPORTANT:** Change the admin password immediately after first login!

## 📋 Default Credentials

```
Username: admin
Password: admin123
```

**Security Note:** All passwords are automatically hashed using bcrypt. Change the default password immediately after first login.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

Vercel offers zero-config deployment for Vite projects.

#### Steps:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import project to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `VITE_SUPABASE_URL` - Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
   - Click "Deploy"

3. **Your app will be live!**
   - Vercel automatically builds and deploys your app
   - You'll get a URL like `https://your-app.vercel.app`

### Deploy to Other Platforms

This is a standard Vite React app. You can deploy it to:

- **Vercel** (Recommended - Zero config) ⭐
- **Netlify**
- **GitHub Pages**
- **AWS Amplify**
- **Cloudflare Pages**
- Any static hosting service

📖 **Detailed deployment guide:** See [DEPLOYMENT.md](DEPLOYMENT.md)

## 📖 User Guide

### Items Management

1. Navigate to **Items** page
2. Click **Add Item** button
3. Fill in the form:
   - Item Code (unique identifier)
   - Item Name
   - Category
   - Purchase Price
   - Sale Price
4. Save and manage items (edit/delete as needed)

### Stock Purchase

1. Go to **Stock Purchase** page
2. Click **New** to create purchase entry
3. Enter supplier details:
   - Supplier Name
   - Date
   - Narration (optional)
4. Add items with quantities and prices
5. System auto-generates invoice number
6. Save to update stock levels automatically

### Sales

1. Navigate to **Sale** page
2. Click **New Sale** button
3. Enter customer details
4. Search and add items
5. System checks stock availability automatically
6. Complete sale to generate invoice
7. Stock automatically deducted

### Closing Stock

- View all items with current stock levels
- Filter by:
  - In Stock items
  - Out of Stock items
  - Negative quantity items
- View stock values and quantities
- Export/Print stock reports

### User Management (Admin Only)

1. Go to **Users** page
2. Add new users with:
   - Username
   - Password (automatically hashed)
   - Full Name
   - Custom Permissions
3. Edit or delete existing users
4. Manage access control

## 🏗️ Project Structure

```
pos-system/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          # Authentication with password hashing
│   │   ├── Items.jsx           # Product management
│   │   ├── StockPurchase.jsx   # Purchase orders
│   │   ├── StockReturn.jsx     # Supplier returns
│   │   ├── Sale.jsx            # Sales transactions
│   │   ├── SaleReturn.jsx      # Customer returns
│   │   ├── ClosingStock.jsx    # Stock reports
│   │   └── Users.jsx           # User management
│   ├── utils/
│   │   ├── storage.js          # Data operations (Supabase)
│   │   ├── supabase.js         # Supabase client
│   │   └── password.js         # Password hashing utilities
│   ├── App.jsx                 # Main app component with routing
│   ├── App.css                 # Main styles
│   ├── index.css               # Global styles
│   └── main.jsx                # Entry point
├── scripts/
│   └── migrate-users.js        # Optional: Data migration utility
├── setup-database.sql          # Complete database setup (includes RLS & password hashing)
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vercel.json                 # Vercel deployment configuration
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── DEPLOYMENT.md               # Detailed deployment guide
└── PROJECT_SUMMARY.md          # Project summary
```

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | Frontend framework |
| **Vite** | 5.0.8 | Build tool and dev server |
| **React Router DOM** | 6.20.0 | Client-side routing |
| **Supabase** | Latest | Backend (PostgreSQL database) |
| **bcryptjs** | 3.0.3 | Password hashing |
| **CSS3** | - | Styling and responsive design |

## 🔒 Security Features

### Implemented Security Measures

- ✅ **Password Hashing** - All passwords stored as bcrypt hashes (salt rounds: 10)
- ✅ **No Plain Text Storage** - Passwords never stored in plain text
- ✅ **Secure Authentication** - Bcrypt comparison for login verification
- ✅ **Row Level Security (RLS)** - Database-level security enabled on all tables
- ✅ **RLS Policies** - Proper access control policies configured
- ✅ **Cloud Database** - All data stored securely in Supabase
- ✅ **Environment Variables** - Sensitive credentials in `.env.local` (not committed)

### Security Best Practices

- Default admin password should be changed immediately
- RLS is enabled by default for production security
- Use environment variables for sensitive data
- Never commit `.env.local` file to version control
- All passwords are automatically hashed - no manual intervention needed

## 🐛 Troubleshooting

### Database Connection Issues

- ✅ Verify `.env.local` file exists with correct credentials
- ✅ Check Supabase project is active
- ✅ Ensure `setup-database.sql` executed successfully
- ✅ Verify RLS policies are created (check Supabase dashboard)
- ✅ Verify network connectivity

### Login Problems

- ✅ Use default credentials: `admin` / `admin123`
- ✅ Check Supabase users table has admin user
- ✅ Verify passwords are hashed in database
- ✅ Check browser console for errors

### RLS Policy Issues

- ✅ Verify RLS is enabled on all tables
- ✅ Check that policies exist in Supabase dashboard
- ✅ Ensure policies allow necessary operations (SELECT, INSERT, UPDATE, DELETE)

### Build Errors

- ✅ Run `npm install` to ensure all dependencies installed
- ✅ Check Node.js version (v16+ required)
- ✅ Verify environment variables are set
- ✅ Check browser console for specific errors
- ✅ Clear `node_modules` and reinstall if needed

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run data migration utility (optional)
npm run migrate-users
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Developed for retail shop management and inventory control.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Password security with [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- Styled with modern CSS
- Deployed with [Vercel](https://vercel.com)

## 📞 Support

For issues, questions, or contributions:
- Check browser console for error messages
- Review Supabase dashboard for database issues
- Inspect network tab for API errors
- Open an issue on [GitHub Issues](https://github.com/yourusername/pos-system/issues)

---

<div align="center">

⭐ **Star this repository if you find it useful!**

[⬆ Back to Top](#-pos-system---complete-point-of-sale-system)

</div>
