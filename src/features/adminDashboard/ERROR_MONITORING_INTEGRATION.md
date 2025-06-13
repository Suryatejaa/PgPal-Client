# Error Monitoring Dashboard Integration

## Overview

The Error Monitoring Dashboard is a comprehensive real-time monitoring solution integrated into the PG management system admin panel. It connects to the gateway's enhanced error tracking system (PORT 4000) to provide administrators with detailed insights into system health, errors, and service performance.

## Features

### 🔍 Real-time Monitoring

- **Auto-refresh**: 30-second intervals for live data updates
- **Gateway Health**: Real-time status of the gateway and connected services
- **Error Tracking**: Continuous monitoring of system errors across all services

### 📊 Comprehensive Metrics

- **Error Statistics**: Total errors, error rates, and trend analysis
- **Service Health**: Individual service status with health scores
- **System Performance**: Gateway uptime, response times, and throughput
- **Visual Analytics**: Interactive charts for error distribution and trends

### 🎯 Key Components

#### 1. **MetricCard** (`components/MetricCard.tsx`)

- Responsive stat display cards with loading states
- Trend indicators and color-coded themes
- Mobile-optimized layout

#### 2. **ErrorTable** (`components/ErrorTable.tsx`)

- Dual layout: Mobile cards + Desktop table
- Advanced sorting and filtering capabilities
- Real-time error log display with detailed modals

#### 3. **ServiceStatus** (`components/ServiceStatus.tsx`)

- Visual service health indicators
- Error rate monitoring per service
- Health score calculations and alerts

#### 4. **ErrorMonitoring** (`components/ErrorMonitoring.tsx`)

- Main dashboard orchestrating all monitoring features
- Time range filtering (1h, 24h, 7d)
- Interactive charts and real-time metrics

#### 5. **monitoringService** (`services/monitoringService.ts`)

- API client for gateway endpoints
- Comprehensive TypeScript interfaces
- Alert checking and threshold management

## Gateway Integration

### Endpoints

The dashboard connects to the following gateway endpoints:

```
GET /gateway/health          - Gateway and service health status
GET /gateway/errors          - Error logs with filtering options
GET /gateway/services        - Service status and performance metrics
POST /gateway/errors/clear   - Clear error logs (admin only)
```

### Data Flow

```
Gateway (PORT 4000) → Monitoring Service → React Components → Dashboard UI
```

## Integration Steps

### 1. AdminDashboard Integration ✅

The monitoring dashboard has been integrated into the main AdminDashboard component:

```tsx
// Added monitoring tab to navigation
{
  id: "monitoring",
  name: "Monitoring",
  icon: <MonitoringIcon />
}

// Added render function
const renderMonitoring = () => (
  <div className="space-y-4 sm:space-y-6">
    <h2>System Monitoring</h2>
    <ErrorMonitoring />
  </div>
);

// Updated renderContent switch case
case "monitoring":
  return renderMonitoring();
```

### 2. Navigation Enhancement ✅

- Added "Monitoring" tab to the tab navigation array
- Included monitoring icon with responsive behavior
- Updated renderContent() to handle monitoring tab routing

### 3. Component Architecture ✅

```
AdminDashboard
├── ErrorMonitoring (Main Dashboard)
│   ├── MetricCard (Overview Stats)
│   ├── DashboardChart (Error Visualizations)
│   ├── ServiceStatus (Service Health Grid)
│   └── ErrorTable (Recent Errors)
└── monitoringService (API Integration)
```

## Usage

### Accessing the Dashboard

1. Navigate to the Admin Dashboard
2. Click the "Monitoring" tab in the navigation
3. View real-time system metrics and error tracking

### Key Features

- **Overview Metrics**: Total errors, error rates, requests, uptime
- **Service Health**: Visual grid showing status of all services
- **Error Charts**: Interactive visualizations of errors by service and status code
- **Recent Errors**: Detailed table with error logs and filtering
- **Time Filtering**: Switch between 1h, 24h, and 7d views
- **Auto-refresh**: Toggle real-time updates on/off

### Mobile Responsiveness

- All components are fully mobile-responsive
- Touch-friendly interactions
- Adaptive layouts for different screen sizes
- Responsive text sizing and spacing

## Testing

### Test Component

Use `TestErrorMonitoring.tsx` for independent testing:

```tsx
import TestErrorMonitoring from "./test/TestErrorMonitoring";

// Renders the error monitoring dashboard independently
<TestErrorMonitoring />;
```

### Integration Testing

1. Ensure gateway is running on PORT 4000
2. Verify monitoring endpoints are accessible
3. Test error tracking functionality
4. Validate real-time updates and auto-refresh

## Configuration

### Environment Variables

```env
REACT_APP_GATEWAY_URL=http://localhost:4000
```

### Monitoring Service Configuration

```typescript
// Base URL for gateway API
const GATEWAY_BASE_URL =
  process.env.REACT_APP_GATEWAY_URL || "http://localhost:4000";

// Auto-refresh interval (30 seconds)
const REFRESH_INTERVAL = 30000;

// Error thresholds for alerts
const ALERT_THRESHOLDS = {
  CRITICAL_ERROR_COUNT: 10,
  HIGH_ERROR_RATE: 0.05, // 5%
  SERVICE_DEGRADED_THRESHOLD: 0.8, // 80% health score
};
```

## Security Considerations

### Authentication

- Error monitoring endpoints should require admin authentication
- Sensitive error details should be protected
- Rate limiting on monitoring API calls

### Data Privacy

- Error logs may contain sensitive information
- Implement proper access controls
- Consider data retention policies

## Performance Optimization

### Caching Strategy

- Gateway health data cached for 30 seconds
- Error statistics cached with smart invalidation
- Service status cached with real-time updates

### Efficient Data Loading

- Paginated error logs to prevent large data transfers
- Optimized API calls with request debouncing
- Lazy loading for detailed error information

## Future Enhancements

### Planned Features

- [ ] Alert notifications and email integration
- [ ] Custom dashboard widgets
- [ ] Historical data analysis and trends
- [ ] Export functionality for reports
- [ ] Advanced filtering and search capabilities

### Scalability Considerations

- WebSocket integration for real-time updates
- Distributed monitoring across multiple gateways
- Advanced analytics and machine learning insights

## Troubleshooting

### Common Issues

#### Gateway Connection Issues

```bash
# Check gateway status
curl http://localhost:4000/gateway/health

# Verify endpoints are accessible
curl http://localhost:4000/gateway/errors?limit=5
```

#### Component Not Loading

1. Check browser console for JavaScript errors
2. Verify all imports are correct
3. Ensure TypeScript interfaces match API responses

#### Data Not Updating

1. Verify auto-refresh is enabled
2. Check network connectivity to gateway
3. Examine API response status codes

## API Documentation

### Error Log Interface

```typescript
interface ErrorLog {
  id: string;
  timestamp: string;
  level: "error" | "warn" | "info";
  message: string;
  service: string;
  error?: any;
  context?: any;
  statusCode?: number;
  endpoint?: string;
  duration?: number;
}
```

### Gateway Health Interface

```typescript
interface GatewayHealth {
  status: "healthy" | "degraded" | "unhealthy";
  uptime: number;
  timestamp: string;
  version: string;
  services: Record<string, ServiceInfo>;
  metrics: {
    totalRequests: number;
    totalErrors: number;
    averageResponseTime: number;
    errorRate: number;
  };
  errorStats: {
    total: number;
    byService: Record<string, number>;
    byStatusCode: Record<string, number>;
    recent: ErrorLog[];
  };
}
```

## Contributing

### Development Guidelines

1. Follow TypeScript best practices
2. Maintain responsive design patterns
3. Write comprehensive error handling
4. Include proper loading states
5. Add appropriate accessibility features

### Code Style

- Use consistent naming conventions
- Include comprehensive JSDoc comments
- Follow React functional component patterns
- Implement proper prop validation

---

The Error Monitoring Dashboard provides a comprehensive solution for real-time system monitoring and error tracking, seamlessly integrated into the existing PG management admin panel.
