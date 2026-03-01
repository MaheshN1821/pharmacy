# Pharmacy EMR Frontend

React application built with Vite (Pure JavaScript/JSX, no TypeScript)

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navigation.jsx
│   │   ├── MedicineDetailsModal.jsx
│   │   └── MedicineForm.jsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   └── Inventory.jsx
│   ├── api.js               # API client (Axios)
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies
└── .env                     # Environment variables
```

## Installation

```bash
npm install
# or
pnpm install
```

## Development

```bash
npm run dev
# or
pnpm dev
```

Opens at http://localhost:5173

## Building

```bash
npm run build
# or
pnpm build
```

Creates optimized production build in `dist/` folder.

## Preview

```bash
npm run preview
# or
pnpm preview
```

## Environment Variables

Create `.env` file:

```
VITE_API_BASE_URL=http://localhost:8000
```

## Features

- **Dashboard**: Real-time sales summary, low stock alerts, pending orders
- **Inventory Management**: Add, edit, delete medicines with search
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Real-time Updates**: Automatic data refresh every 30 seconds on dashboard
- **Form Validation**: Comprehensive error messages

## Key Components

### Pages

- `Dashboard` - Overview of sales, stock, and orders
- `Inventory` - Medicine management with CRUD operations

### Components

- `Navigation` - Top navigation bar
- `MedicineForm` - Add/edit medicine modal
- `MedicineDetailsModal` - To preview details

## API Integration

All API calls are handled through `src/api.js` using Axios.

Example usage:

```jsx
import { getMedicines, createMedicine } from "./api";

// List medicines
const response = await getMedicines(skip, limit, search);

// Create medicine
const response = await createMedicine(medicineData);
```

## Styling

- **Colors**: CSS custom properties defined in `index.css`
- **Layout**: Flexbox and CSS Grid
- **Responsive**: Mobile-first approach with media queries
- **No frameworks**: Pure CSS, no Tailwind or styled-components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Hot Module Replacement (HMR) during development
- Code splitting with Vite
- Optimized production build with minification
- API response caching with Axios defaults

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Static Hosting (GitHub Pages, etc.)

```bash
npm run build
# Upload dist/ folder
```

Update `VITE_API_BASE_URL` environment variable for production API endpoint.

## Troubleshooting

**API Connection Error**

- Check if backend is running on http://localhost:8000
- Verify `.env` file has correct `VITE_API_BASE_URL`
- Check browser console for CORS errors

**Port Already in Use**

```bash
npm run dev -- --port 3000
```

**Build Issues**

```bash
rm -rf node_modules dist package-lock.json
npm install
npm run build
```
