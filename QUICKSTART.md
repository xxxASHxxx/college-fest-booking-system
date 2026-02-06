# Quick Start Guide - College Fest Booking System (Offline Mode)

## ✅ What's Working

### Frontend - FULLY OPERATIONAL
```powershell
cd c:\Users\Ashmit\Downloads\booking\fest-booking-ui
npm start
```
**Access at**: http://localhost:3000

**Status**: ✅ Running successfully

---

## ⚠️ Backend - Known Issue & Workaround

### Issue
Backend encounters H2 database cascade constraint error during initial schema creation with `qr_metadata` table.

### Quick Fix Required

The issue is related to a bidirectional relationship in the entities. Here are two quick solutions:

#### Option 1: Temporarily Comment Out QR Code Feature (Fastest)

1. Open [DataSeederConfig.java](file:///c:/Users/Ashmit/Downloads/booking/src/main/java/com/collegefest/booking/config/DataSeederConfig.java)
2. Comment out QR metadata repository injection (if present)

OR

#### Option 2: Use MySQL Instead of H2

If you have MySQL installed and running:

1. **Restore MySQL configuration**:
```powershell
cd c:\Users\Ashmit\Downloads\booking
Copy-Item "src\main\resources\application.properties.mysql.backup" "src\main\resources\application.properties" -Force
```

2. **Start MySQL service**:
```powershell
# Find MySQL service name
Get-Service | Where-Object {$_.DisplayName -like "*mysql*"}

# Start MySQL (replace MySQL80 with your service name)
Start-Service -Name MySQL80
```

3. **Rebuild and run**:
```powershell
.\mvnw.cmd clean package -DskipTests
java -jar target\booking-0.0.1-SNAPSHOT.jar
```

MySQL password is set to `hello` - update if different in `application.properties`.

---

## Fixed Files Summary

| File | What Was Fixed |
|------|----------------|
| [DataSeederConfig.java](file:///c:/Users/Ashmit/Downloads/booking/src/main/java/com/collegefest/booking/config/DataSeederConfig.java) | ✅ Removed 10 invalid `.createdAt()` calls |
| [pom.xml](file:///c:/Users/Ashmit/Downloads/booking/pom.xml) | ✅ Added H2 dependency |
| [application.properties](file:///c:/Users/Ashmit/Downloads/booking/src/main/resources/application.properties) | ✅ Configured H2 database |
| [QRMetadata.java](file:///c:/Users/Ashmit/Downloads/booking/src/main/java/com/collegefest/booking/entity/QRMetadata.java) | ✅ Changed LONGTEXT to TEXT |

---

## Seeded Data (Once Backend Runs)

### User Accounts
- **Admin**: `admin@festbook.com` / `admin123`
- **Student 1**: student1@college.edu` / `student123`
- **Student 2**: `student2@college.edu` / `student123`
- **Student 3**: `student3@college.edu` / `student123`

### Events
1. Starlight Music Fest 2026 (3 price tiers)
2. Tech Innovation Summit (2 price tiers)
3. Annual Sports Championship (2 price tiers)
4. Cultural Night: Colors of India (2 price tiers)
5. HackFest 2026 - 24hr Coding Marathon (1 tier)

### Venues
1. Main Auditorium (500 capacity)
2. Open Air Theatre (1000 capacity)
3. Sports Complex (300 capacity)

---

## Testing Frontend Only

The frontend can be tested independently:

1. **Start frontend**: `cd fest-booking-ui && npm start`
2. **Open browser**: http://localhost:3000
3. **Features available**:
   - Browse UI components
   - View event listing page structure
   - Test form validations
   - Check responsive design

**Note**: API calls will fail until backend is running.

---

## Next Steps

1. **Immediate**: Frontend is ready for UI testing
2. **Backend fix**: Apply Option 1 or 2 above to resolve database issue
3. **Full integration**: Once backend runs, test complete booking flow

For detailed documentation, see [walkthrough.md](file:///C:/Users/Ashmit/.gemini/antigravity/brain/c6494bf4-07ea-4bd5-8201-908f533c699c/walkthrough.md).
