## Day 20 — Week 4 Milestone Review

### What changed in my thinking?

At the end of Week 2, I mainly thought an application worked if the code ran and the expected output appeared. Now I understand that I also need to test how the frontend, backend, API routes, and database work together, including how the application handles errors.

### What I verified

- Connected the backend to the dedicated MongoDB database `shoplite_day20`.
- Seeded eight products and confirmed they could be retrieved through the API.
- Verified that an invalid price returns HTTP 400 with a useful error message.
- Verified that an invalid product ID returns HTTP 400 and a nonexistent product returns HTTP 404.
- Tested a missing route and confirmed it returns HTTP 404.
- Created a product through POST and confirmed it was saved to MongoDB.
- Sent five concurrent GET requests and confirmed that all five succeeded and found the test product.
- Deleted the temporary test product and confirmed that the product count returned to eight.
- Checked the health endpoint and confirmed that MongoDB remained connected.
- Checked the product count and verified that the original eight products were intact.
- Confirmed that product validation and error handling work as expected.

### What I learned

A successful response is not enough to prove that an application is reliable. I need to test valid and invalid inputs, missing records, concurrent requests, database operations, and error handling.

I also learned how to use HTTP status codes to understand the results of API requests and how to clean up temporary test data after testing.

### Remaining verification

- Verify database-unavailable behavior safely while the server is running.
- Complete any remaining route and status-code checks.
- Review the final notes and confirm the milestone is ready to close.
## Day 25 � Authentication UI Polish

### What I completed

- Added client-side validation for email addresses and password length.
- Added clear error messages for invalid inputs and duplicate email addresses.
- Added loading states and disabled submit buttons while requests are running.
- Tested successful login and incorrect login credentials.
- Confirmed rapid clicks send only one signup or login request.
- Tampered with a JWT and confirmed the app safely rejected the invalid session.
- Confirmed the authentication UI works without crashing when a token is invalid.

### Authentication edge case deferred

Password reset and email verification are not implemented yet. Login rate limiting is also important because it helps reduce repeated password-guessing attempts. I deferred these features to focus on building and testing the core authentication flow first. They should be considered before ShopLite is used in production.

### What I learned

I learned how to validate form inputs, display useful error messages, prevent duplicate submissions, and handle invalid authentication tokens. I also learned that authentication needs more than working login and signup routes; it needs careful testing and additional protections.
