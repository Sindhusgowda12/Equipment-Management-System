# Equipment Management System Compliance

This document confirms that the application adheres to the technical requirements and business rules specified in the assignment.

## UI Compliance
- [x] **No inline styles**: All styling is handled via Tailwind CSS utility classes. No `style={{}}` attributes are used.
- [x] **No raw HTML form elements**: All form inputs, selects, and buttons are implemented using `shadcn/ui` components (Radix UI primitives).
- [x] **Add and Edit reuse the same form component**: The `EquipmentForm.tsx` component is used for both adding and editing equipment, with conditional logic for the initial state and API endpoints.

## Database & Backend Compliance
- [x] **Equipment types are not hardcoded**: Equipment types are stored in a dedicated `equipment_types` table and fetched dynamically by the frontend.
- [x] **Business rules enforced in the backend**:
    - [x] **Maintenance Workflow**: When a maintenance record is added, the backend automatically updates the equipment status to `Active` and the `Last Cleaned Date` to the maintenance date.
    - [x] **Status Constraint**: The backend rejects any request to mark equipment as `Active` if its `Last Cleaned Date` is older than 30 days, returning a meaningful error message.

## Architecture
- [x] **Layered Architecture**: The backend is structured with a clear separation of concerns:
    - **Controllers**: Handle HTTP requests and responses.
    - **Services**: Implement business logic and validation.
    - **Repositories**: Handle database operations.
