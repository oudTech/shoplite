## Day 20 — Week 4 Milestone Review

### What changed in my thinking?

At the end of Week 2, I mainly thought an application worked if the code ran and the expected output appeared. That approach did not fully account for what happens when the frontend communicates with a real backend and database.

Now I understand that an application must be tested across the entire flow: frontend requests, API routes, input validation, database operations, HTTP status codes, and error handling.

### What I verified

- Connected the backend to a dedicated MongoDB database named `shoplite_day20`.
- Seeded eight products and confirmed they could be retrieved through the API.
- Verified that an invalid string price returns HTTP 400 with a useful error message.
- Verified that updating a valid-format but nonexistent product ID returns HTTP 404.
- Created a product through POST and confirmed it appeared exactly once in subsequent GET requests.
- Added safer request-body validation to prevent unexpected errors when the body is missing or invalid.
- Confirmed that valid product creation still works after the validation improvement.

### What I learned

A successful response is not enough to prove that an application is reliable. I need to test invalid inputs, missing records, database failures, and whether data persists between requests.

I also learned to isolate testing in a separate database so I can experiment without risking existing data.

### Remaining verification

- Complete a full frontend check against the real backend.
- Verify database-unavailable behavior safely.
- Finish reviewing all relevant routes and status codes.
