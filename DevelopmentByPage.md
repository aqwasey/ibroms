# Request: Create Duty CRUD Module

Please read the DEVELOPMENT_TEMPLATE.md file in the project root to understand the established Vue.js CRUD architecture and patterns.

## Module Requirements:
- **Name**: Duty
- **Location**: Add to Sidenav under "Business" section
- **Service**: Use OTHER_SERVICE_URL (https://people-api-service.onrender.com)
- **Route**: /duty

## API Endpoints:
- **GET /duty/** - Get all duties
- **POST /duty/** - Create new duty
- **PATCH /duty/{value}** - Update duty by ID
- **GET /duty/id/{value}** - Get duty by ID
- **GET /duty/title/** - Get all duty titles

## Data Schema:
```json
{
  "title": "string",
  "description": "string", 
  "notes": "string",
  "id": "",
  "created_on": "2025-08-31T05:34:26.815Z",
  "updated_on": "2025-08-31T05:34:26.815Z"
}