# Travel Records API

---

**Q: What are the core endpoints of your API?**  
A:

- `POST /api/travel-records` → create a new record, optional weather query param for enrichment.
- `GET /api/travel-records` → list all records.
- `GET /api/travel-records/:id` → get a record by ID.
- `PATCH /api/travel-records/:id` → update a record, optional weather query param.
- `DELETE /api/travel-records/:id` → delete a record by ID.

**Q: What do request and response formats look like?**  
A: For example, creating a record with weather:

`POST /api/travel-records?weather=true`

```json
{
  "destinationName": "Paris",
  "country": "France",
  "visitDate": "2023-07-15",
  "rating": 5
}
```

Response:

```json
{
  "id": "uuid",
  "destinationName": "Paris",
  "country": "France",
  "visitDate": "2023-07-15",
  "rating": 5,
  "weather": "clear sky",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Q: What was most important for you to consider while designing this API?**  
A:

- RESTful design that's predictable and easy to use.
- Strong validation to protect data integrity.
- Clear error handling so developers know what went wrong.
- Extensible architecture that can grow with new features.
- Keeping optional features (like weather) separate from core data.

**Q: What challenges did you face and how did you solve them?**  
A:

- Validation: Used Zod schemas so data is checked at runtime with clear errors.
- External API Integration: Wrapped OpenWeather calls in try/catch and tied them to a `?weather=true` flag to make them optional.
- Consistent Error Handling: Built a custom HTTPError class so every error response uses the same JSON format.
- Type Safety: Used TypeScript plus Zod, which caught multiple bugs early.

**Q: How did you choose the endpoint structure?**  
A:

- Base resource `/api/travel-records`
- Path parameters (`:id`) for specific records.
- Query parameters (`?weather=true`)
- Didn't add versioning yet, but could add `/api/v1` later if needed.

**Q: Why did you make the choices you did (stack, tools, design)?**  
A:

- TypeScript for type safety and better developer experience.
- Zod for unified validation and error messages.
- Layered architecture (controllers → services → models) for maintainability.
- Custom standardized error formatting

**Q: What would you add if you had more time?**  
A:

- Database integration (PostgreSQL or MongoDB).
- Authentication
- File uploads for attaching photos.
- Aggregated analytics (average ratings by country).
