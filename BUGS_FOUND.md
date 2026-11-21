
# ShopLite — Bug Bash Findings (Day 35)

## 1. Login Email Validation

**Issue:** The login route did not validate email address format before querying the database.

**Impact:** Invalid email inputs could reach the database unnecessarily.

**Fix:** Added email format validation using a regular expression, matching the signup route.

**Status:** Fixed and manually tested — PASS (HTTP 400).

---

## 2. Product Input Validation

**Issue:** The `validateProduct()` function did not explicitly validate the optional `category`, `image`, and `stock` fields.

**Impact:** Invalid field values could reach Mongoose and produce inconsistent validation behaviour.

**Fix:** Added checks to ensure:
- Category is a string when supplied.
- Image is a string when supplied.
- Stock is a non-negative integer when supplied.
- Price is at least 0.01.

**Status:** Fixed in code — manual API verification pending.

---

## 3. Hardest-to-Notice Issue

The product validation issue was easy to miss because the existing validation already checked the required name and price fields. Normal product creation and updates could work correctly, making the missing checks for optional fields less obvious during everyday testing.
