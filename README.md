### **Core Endpoints**

| Method   | Endpoint                  | Description               | Parameters                       |
| -------- | ------------------------- | ------------------------- | -------------------------------- |
| `POST`   | `/api/travel-records`     | Create new travel record  | `weather` (optional query param) |
| `GET`    | `/api/travel-records`     | Get all travel records    | None                             |
| `GET`    | `/api/travel-records/:id` | Get specific record by ID | `id` (path parameter)            |
| `PATCH`  | `/api/travel-records/:id` | Update existing record    | `id` (path parameter)            |
| `DELETE` | `/api/travel-records/:id` | Delete record             | `id` (path parameter)            |
