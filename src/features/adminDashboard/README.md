# Admin Dashboard Feature

A comprehensive admin dashboard for PG (Paying Guest) management system that integrates with both property-service and room-service APIs.

## Features

### Overview Dashboard

- Property management statistics (total properties, active properties, reviews, images)
- Room management statistics (total rooms, available/occupied rooms, average rent)
- Recent activity display for both properties and rooms
- Real-time data from both property and room services

### Property Management

- View all properties with sorting capabilities
- Property details including name, location, rent range, room/bed counts
- Availability status indicators
- Toggle property status and delete operations
- Responsive table with property actions

### Room Management

- Advanced room table with bulk operations
- Room details including room number, type, total beds, rent per bed
- Bed status indicators (occupied, available)
- Bulk status updates for multiple rooms
- Sortable columns with filtering

### Analytics

- Interactive charts using Chart.js and react-chartjs-2
- Growth trends visualization
- Revenue distribution pie charts
- Monthly comparison bar charts
- Key metrics dashboard

## Technical Implementation

### API Integration

- **Property Service**: Full CRUD operations, dashboard overview, analytics
- **Room Service**: Room management, bulk operations, revenue analytics
- Proper error handling with fallback data structures
- Axios-based HTTP client with consistent response handling

### Components Structure

```
components/
├── StatsCard.tsx           # Reusable statistics display cards
├── DashboardChart.tsx      # Chart visualization component
├── PropertyTable.tsx       # Property management table
└── RoomTable.tsx          # Room management with bulk operations

pages/
└── AdminDashboard.tsx     # Main dashboard page with tabs

services/
├── propertyService.ts     # Property API client
└── roomService.ts         # Room API client
```

### Interface Definitions

- **Property**: MongoDB-based schema with nested address, contact, and range objects
- **Room**: Room schema with bed management and status tracking
- **Analytics**: Comprehensive analytics interfaces for both services

### Key Features

1. **Real-time Data**: Live integration with backend APIs
2. **Error Handling**: Graceful fallbacks and error states
3. **Responsive Design**: Mobile-friendly with Tailwind CSS
4. **Type Safety**: Full TypeScript implementation
5. **Performance**: Optimized data loading and caching strategies

## Usage

```tsx
import AdminDashboard from "./features/adminDashboard/pages/AdminDashboard";

function App() {
  return (
    <div className="App">
      <AdminDashboard />
    </div>
  );
}
```

## API Endpoints

### Property Service

- `GET /admin/property-service/dashboard` - Dashboard overview
- `GET /admin/property-service/properties` - List properties
- `POST /admin/property-service/properties` - Create property
- `PUT /admin/property-service/properties/:id` - Update property
- `DELETE /admin/property-service/properties/:id` - Delete property
- `PATCH /admin/property-service/properties/:id/toggle-status` - Toggle status

### Room Service

- `GET /admin/room-service/dashboard` - Room analytics
- `GET /admin/room-service/rooms` - List rooms
- `POST /admin/room-service/rooms` - Create room
- `PUT /admin/room-service/rooms/:id` - Update room
- `PUT /admin/room-service/rooms/bulk-update` - Bulk update rooms
- `DELETE /admin/room-service/rooms/:id` - Delete room

## Dependencies

- React 18+
- TypeScript
- Tailwind CSS
- Chart.js & react-chartjs-2
- Axios (via axiosInstance)

## Data Flow

1. **Dashboard Load**: Fetches overview data from both services
2. **Tab Navigation**: Loads specific data based on active tab
3. **Real-time Updates**: Refreshes data after CRUD operations
4. **Error Handling**: Shows fallback data and error states
5. **Performance**: Caches data and loads analytics on-demand

## Future Enhancements

- Real-time notifications for status changes
- Advanced filtering and search capabilities
- Export functionality for reports
- Drag-and-drop room assignments
- Integration with payment systems
- Mobile app version
