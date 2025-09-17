# InvoSafe - Invoice Management System

InvoSafe is a modern, feature-rich invoice management system built with **Next.js 15** and **React 19**, designed to streamline the entire invoicing process for businesses of all sizes. From creating and sending invoices to tracking payments and managing clients, InvoSafe provides everything you need to manage your invoicing workflow efficiently.

Built with modern web technologies:
- Next.js 15.x
- React 19
- TypeScript
- Tailwind CSS V4

## Installation

### Prerequisites
To get started with InvoSafe, ensure you have the following prerequisites installed:

- Node.js 18.x or later (recommended to use Node.js 20.x or later)
- npm or yarn package manager

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/GaurangPohankar/invosafe-frontend
   cd invosafe-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   > Use `--legacy-peer-deps` flag if you face peer-dependency errors during installation.

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality


### Server Changes
- `git pull origin main` - Start the development server
- `pm2 restart invosafe-frontend` - Build the application for production


## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (admin)/           # Admin dashboard pages
│   ├── (full-width-pages)/ # Authentication and error pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── charts/           # Data visualization components
│   ├── form/             # Form components
│   ├── tables/           # Table components
│   └── ui/               # Basic UI components
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── icons/                # SVG icons
└── layout/               # Layout components
```

**InvoSafe** - Streamlining invoice management for modern businesses.
