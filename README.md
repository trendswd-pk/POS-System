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
- ✅ **Data Export** - View and print transaction history

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

4. **Configure Environment Variables**
   - Create `.env.local` file in root directory
   - Get credentials from Supabase Dashboard → Settings → API
   - Add the following:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Open `http://localhost:5173` in your browser
   - Login with default credentials:
     - **Username:** `admin`
     - **Password:** `admin123`

## 📋 Default Credentials

```
Username: admin
Password: admin123
```

⚠️ **IMPORTANT:** Change the admin password immediately after first login!

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
   - Password
   - Full Name
   - Custom Permissions
3. Edit or delete existing users
4. Manage access control

## 🏗️ Project Structure

```
pos-system/
├── src/
│   ├── pages/
│   │   ├── Login.jsx          # Authentication
│   │   ├── Items.jsx           # Product management
│   │   ├── StockPurchase.jsx   # Purchase orders
│   │   ├── StockReturn.jsx     # Supplier returns
│   │   ├── Sale.jsx            # Sales transactions
│   │   ├── SaleReturn.jsx      # Customer returns
│   │   ├── ClosingStock.jsx    # Stock reports
│   │   └── Users.jsx           # User management
│   ├── utils/
│   │   ├── storage.js          # Data operations
│   │   └── supabase.js         # Supabase client
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── setup-database.sql          # Database setup script
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Technology Stack

- **Frontend Framework:** React 18.2.0
- **Build Tool:** Vite 5.0.8
- **Routing:** React Router DOM 6.20.0
- **Backend:** Supabase (PostgreSQL)
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

## 🔒 Security Notes

- Default admin password should be changed immediately
- For production, consider enabling Row Level Security (RLS) in Supabase
- Use environment variables for sensitive data
- Never commit `.env.local` file to version control

## 🐛 Troubleshooting

### Database Connection Issues
- ✅ Verify `.env.local` file exists with correct credentials
- ✅ Check Supabase project is active
- ✅ Ensure `setup-database.sql` executed successfully
- ✅ Verify network connectivity

### Login Problems
- ✅ Use default credentials: `admin` / `admin123`
- ✅ Check Supabase users table has admin user
- ✅ Clear browser localStorage if needed
- ✅ Check browser console for errors

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

- **Primary Storage:** Supabase PostgreSQL (cloud database)
- **Fallback:** Browser localStorage (if Supabase not configured)
- **Data Persistence:** All data synced to cloud automatically

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
- Styled with modern CSS

## 📞 Support

For issues, questions, or contributions:
- Check browser console for error messages
- Review Supabase dashboard for database issues
- Inspect network tab for API errors
- Open an issue on GitHub

---

⭐ **Star this repository if you find it useful!**
