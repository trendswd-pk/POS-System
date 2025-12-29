# 🛒 POS System - Complete Point of Sale System

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

A complete, production-ready Point of Sale (POS) System for retail shops with full inventory management, sales tracking, and user management capabilities. Built with React and Supabase for scalable cloud-based data storage.

## ✨ Features

### 📦 Core Modules

- **Items Management** - Complete product catalog with code, name, category, pricing
- **Stock Purchase** - Record supplier purchases with invoice tracking
- **Stock Return** - Handle supplier returns with automatic stock adjustment
- **Sales** - Process customer sales with invoice generation
- **Sale Return** - Manage customer returns efficiently
- **Closing Stock** - Real-time stock monitoring with filtering options
- **User Management** - Role-based access control with customizable permissions

### 🎯 Key Features

- ✅ **Real-time Stock Tracking** - Automatic stock updates on purchase/sale
- ✅ **Invoice Management** - Auto-generated invoice numbers
- ✅ **Search & Filter** - Quick search across all modules
- ✅ **Print Functionality** - Print invoices and reports
- ✅ **Responsive Design** - Works on desktop and tablet devices
- ✅ **Cloud Storage** - Supabase integration for data persistence
- ✅ **User Permissions** - Granular permission system
- ✅ **Password Security** - Bcrypt password hashing for secure authentication
- ✅ **Data Export** - View and print transaction history
- ✅ **Performance Optimized** - Batch operations and caching for fast performance

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**
- **Supabase Account** (Free tier works perfectly)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pos-system.git
   cd pos-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase Database**
   - Create a new project at [Supabase](https://supabase.com)
   - Go to **SQL Editor** in your Supabase dashboard
   - Open `setup-database.sql` from this project
   - Copy and paste the entire SQL script
   - Click **Run** to execute
   - Wait for all queries to complete successfully

4. **Configure Environment Variables**
   - Create `.env.local` file in root directory
   - Get credentials from Supabase Dashboard → Settings → API
   - Add the following:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Hash Existing User Passwords (Optional)**
   - If you have existing users with plain text passwords, run:
   ```bash
   npm run hash-passwords
   ```
   - Or use SQL file: Run `hash-existing-passwords.sql` in Supabase SQL Editor

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Open `http://localhost:5173` in your browser
   - Login with default credentials:
     - **Username:** `admin`
     - **Password:** `admin123`

## 📋 Default Credentials

```
Username: admin
Password: admin123
```

⚠️ **IMPORTANT:** 
- Change the admin password immediately after first login!
- All passwords are automatically hashed using bcrypt for security

## 📖 User Guide

### Items Management
1. Navigate to **Items** page
2. Click **Add Item** button
3. Fill in:
   - Item Code (unique identifier)
   - Item Name
   - Category
   - Purchase Price
   - Sale Price
4. Save and manage items (edit/delete as needed)

### Stock Purchase
1. Go to **Stock Purchase** page
2. Click **New** to create purchase entry
3. Enter:
   - Supplier Name
   - Date
   - Narration (optional)
4. Add items with quantities and prices
5. System auto-generates invoice number
6. Save to update stock levels

### Sales
1. Navigate to **Sale** page
2. Click **New Sale** button
3. Enter customer details
4. Search and add items
5. System checks stock availability
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
│   │   ├── storage.js          # Data operations (Supabase only)
│   │   ├── supabase.js         # Supabase client
│   │   └── password.js         # Password hashing utilities
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── setup-database.sql          # Database setup script
├── hash-existing-passwords.sql # Hash existing passwords (SQL)
├── hash-existing-users.js      # Hash existing passwords (Node.js)
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Technology Stack

- **Frontend Framework:** React 18.2.0
- **Build Tool:** Vite 5.0.8
- **Routing:** React Router DOM 6.20.0
- **Backend:** Supabase (PostgreSQL)
- **Password Hashing:** bcryptjs
- **Styling:** Modern CSS with responsive design

## 📦 Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist` directory, ready for deployment.

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Database Setup

Run `setup-database.sql` in Supabase SQL Editor. This will:
- Create all required tables
- Set up indexes for performance
- Disable RLS for development
- Create default admin user

### Password Hashing

- **New Users:** Passwords are automatically hashed using bcrypt when created
- **Existing Users:** Run `npm run hash-passwords` to hash existing passwords
- **Login:** System automatically compares hashed passwords during login

## 🔒 Security Features

- ✅ **Password Hashing** - All passwords stored as bcrypt hashes (salt rounds: 10)
- ✅ **No Plain Text Storage** - Passwords never stored in plain text
- ✅ **Secure Authentication** - Bcrypt comparison for login verification
- ✅ **Cloud Database** - All data stored securely in Supabase
- ✅ **Environment Variables** - Sensitive credentials in `.env.local` (not committed)

### Security Notes

- Default admin password should be changed immediately
- For production, consider enabling Row Level Security (RLS) in Supabase
- Use environment variables for sensitive data
- Never commit `.env.local` file to version control
- All passwords are automatically hashed - no manual intervention needed

## 🐛 Troubleshooting

### Database Connection Issues
- ✅ Verify `.env.local` file exists with correct credentials
- ✅ Check Supabase project is active
- ✅ Ensure `setup-database.sql` executed successfully
- ✅ Verify network connectivity

### Login Problems
- ✅ Use default credentials: `admin` / `admin123`
- ✅ Check Supabase users table has admin user
- ✅ If password not working, run `npm run hash-passwords`
- ✅ Check browser console for errors

### Password Hashing Issues
- ✅ Run `npm run hash-passwords` to hash existing passwords
- ✅ New users automatically have hashed passwords
- ✅ Check that bcryptjs is installed: `npm list bcryptjs`

### Blank Page / Build Errors
- ✅ Run `npm install` to ensure all dependencies installed
- ✅ Check Node.js version (v16+ required)
- ✅ Verify environment variables are set
- ✅ Check browser console for specific errors
- ✅ Clear `node_modules` and reinstall if needed

### Stock Calculation Issues
- ✅ Verify all transactions are saved properly
- ✅ Check Supabase data integrity
- ✅ Review transaction history

## 📊 Data Storage

- **Storage:** Supabase PostgreSQL (cloud database only)
- **No LocalStorage:** All data stored in cloud (no browser storage fallback)
- **Data Persistence:** All data synced to cloud automatically
- **Backup:** Supabase provides automatic backups

## 🚀 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Hash existing user passwords
npm run hash-passwords
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 👨‍💻 Author

Developed for retail shop management and inventory control.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Password security with [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- Styled with modern CSS

## 📞 Support

For issues, questions, or contributions:
- Check browser console for error messages
- Review Supabase dashboard for database issues
- Inspect network tab for API errors
- Open an issue on GitHub

## 🔄 Migration Notes

### From localStorage to Supabase
- This version uses **Supabase only** - no localStorage fallback
- All data must be in Supabase database
- Run `setup-database.sql` to initialize database

### Password Hashing Migration
- Existing users with plain text passwords need to be hashed
- Run `npm run hash-passwords` or use SQL file
- After migration, users can still login with original passwords

---

⭐ **Star this repository if you find it useful!**
