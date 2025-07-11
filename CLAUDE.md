# Buddhist Lent Project - CLAUDE.md

## Project Overview
This is a Next.js application for managing Buddhist Lent campaigns and organization data. The project includes multiple modules for tracking participants, organizations, and various forms of data collection related to Buddhist practices and sobriety campaigns.

## Technology Stack
- **Framework**: Next.js 15.2.4 with App Router
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Tailwind CSS, DaisyUI, Radix UI
- **Charts**: ECharts, Chart.js
- **File Upload**: Custom image upload system
- **Maps**: Leaflet with React Leaflet

## Project Structure

### Main Applications
1. **Buddhist Lent Campaign (`/app/Buddhist-Lent/`)** - Main campaign management
2. **Organization Management (`/app/organization/`)** - Organization data and forms
3. **Dashboard (`/app/dashboard/`)** - Analytics and data visualization
4. **Sober Cheers (`/app/soberCheers/`)** - Sobriety tracking campaign
5. **Form Return (`/app/form_return/`)** - Form submission tracking

### Key Database Models
- **SoberCheers**: Participant data for sobriety campaigns
- **CampaignBuddhistLent**: Buddhist Lent campaign participants
- **Organization**: Organization return data with images
- **OrganizationCategory**: Master data for organization types
- **Buddhist2025**: 2025 Buddhist campaign data
- **Form_return**: Form submission tracking
- **User**: User authentication and management

## Development Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npx prisma generate  # Generate Prisma client
npx prisma migrate   # Run database migrations
npx prisma studio    # Open Prisma Studio
```

## Key Features

### 1. Multi-Step Forms
- Address input with Thai location data
- Image upload with compression
- Progress tracking with step indicators
- Form validation and error handling

### 2. Dashboard Analytics
- Interactive charts using ECharts
- Provincial distribution maps
- Statistical summaries
- Export functionality (CSV, Excel)

### 3. Image Management
- Multiple image upload support
- Image compression and optimization
- Temporary file handling
- File naming conventions

### 4. Authentication
- NextAuth.js integration
- Role-based access control
- Password reset functionality
- Session management

## File Organization

### Actions (`/actions/`)
- `Get.ts` - Data fetching functions
- `Post.ts` - Data creation functions
- `Update.ts` - Data update functions
- `Delete.ts` - Data deletion functions
- `Upload.ts` - File upload handling

### Components Structure
- `components/` - Reusable UI components
- `ui/` - Base UI components (buttons, inputs, etc.)
- `charts/` - Chart components
- `sections/` - Form sections

### API Routes (`/app/api/`)
- Authentication endpoints
- CRUD operations for all models
- Chart data endpoints
- File upload endpoints

## Environment Variables
```env
DATABASE_URL="mysql://user:password@localhost:3306/database"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

## Data Flow

### Form Submission Flow
1. User fills multi-step form
2. Data validation on each step
3. Image upload and processing
4. Final submission to database
5. Success confirmation

### Dashboard Data Flow
1. Data fetching from multiple sources
2. Chart data processing
3. Real-time updates
4. Export functionality

## Testing and Validation
- Form validation using custom validators
- Image upload validation
- Database constraint validation
- Error handling and user feedback

## Common Tasks

### Adding New Form Fields
1. Update Prisma schema
2. Run migration
3. Update TypeScript types
4. Add to form components
5. Update validation logic

### Adding New Charts
1. Create chart component in `/charts/`
2. Add data fetching function
3. Update dashboard layout
4. Add export functionality if needed

### Database Changes
1. Modify `prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Update TypeScript types
4. Update related actions and components

## Performance Considerations
- Image compression before upload
- Lazy loading for charts
- Pagination for large datasets
- Database indexing for performance
- Caching strategies for dashboard data

## Security Features
- Input validation and sanitization
- File upload restrictions
- Authentication and authorization
- SQL injection prevention via Prisma
- XSS protection

## Deployment Notes
- Build process includes TypeScript compilation
- Database migrations required for deployment
- Environment variables must be configured
- Image upload directory permissions
- SSL certificate for production

## Common Issues and Solutions

### Database Connection Issues
- Check DATABASE_URL format
- Verify MySQL server is running
- Check user permissions

### Image Upload Problems
- Verify upload directory exists
- Check file permissions
- Validate image formats

### Chart Display Issues
- Check data format consistency
- Verify chart dependencies
- Check responsive design

## Development Best Practices
- Follow TypeScript strict mode
- Use Prisma for all database operations
- Implement proper error handling
- Use consistent naming conventions
- Write reusable components
- Maintain proper project structure