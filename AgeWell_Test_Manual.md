# 📝 AgeWell Test Documentation Manual  
**Version**: 2.0  
**Date**: April 10, 2025  

---

## ✅ User Story-Based Test Plan  

---

### 🏡 **User Story 1: As an Elderly User, I want to have daily check-ins**  

**Acceptance Criteria:**  
- Elderly users receive a daily check-in prompt.  
- Users can confirm their well-being with a simple "I'm okay" button.  
- Caregivers are notified if a check-in is missed.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-001 | Open app in the morning         | Daily check-in prompt appears        |
| TC-002 | Tap "I'm okay"                   | Status updated, no notification sent |
| TC-003 | No response after threshold     | Caregiver notified                   |

---

### 💊 **User Story 2: As an Elderly User, I want to receive medication notifications**  

**Acceptance Criteria:**  
- Users receive reminders for scheduled medications.  
- Notifications should be persistent until acknowledged.  
- Caregivers are alerted if a dose is missed.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-004 | Medication due                   | Notification appears                  |
| TC-005 | Acknowledge reminder             | Marked as taken, no further alerts   |
| TC-006 | No action after threshold        | Caregiver receives alert              |

---

### 🚨 **User Story 3: As an Elderly User, I want to immediately contact for emergency**  

**Acceptance Criteria:**  
- Users have a one-tap emergency button.  
- The emergency contact receives a call or alert.  
- Location details are included in the alert.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-007 | Tap emergency button             | Emergency contact is called          |
| TC-008 | Tap emergency button (no response) | SMS alert with location is sent |
| TC-009 | Check emergency logs             | Recent alerts are stored in history  |

---

### 🔑 **User Story 4: As an Administrator, I want to manage user accounts and permissions**  

**Acceptance Criteria:**  
- Admins can create, edit, and remove user accounts.  
- Role-based access controls apply to users.  
- Account status can be changed (active/inactive).  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-010 | Admin logs in                    | Redirected to Admin Dashboard        |
| TC-011 | Create a new user                 | Account appears in user list         |
| TC-012 | Assign caregiver role             | Role updated in system               |
| TC-013 | Disable an account                | User cannot log in                   |

---

### ❤️ **User Story 5: As an Elderly User, I want to check my vital signs**  

**Acceptance Criteria:**  
- Users can manually enter vital sign data.  
- Connected health devices sync automatically.  
- Alerts trigger for abnormal readings.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-014 | Open "Vitals" section            | Current vitals displayed             |
| TC-015 | Enter blood pressure manually    | Saved to health history              |
| TC-016 | Sync with smartwatch             | Data updates automatically           |
| TC-017 | Abnormal reading detected        | Alert sent to caregiver              |

---

### 🍽 **User Story 6: As a Primary Caregiver, I want to get notification for missed medication**  

**Acceptance Criteria:**  
- The system checks if elderly users have acknowledged their medication.  
- Caregivers receive a notification for any missed dose.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-018 | Elderly skips medication         | Caregiver receives alert             |
| TC-019 | Medication marked as taken       | No alert triggered                   |
| TC-020 | View missed dose history         | Missed logs appear in caregiver UI   |

---

### 🍴 **User Story 7: As a Primary Caregiver, I want to CRUD Elderly Diet Plans**  

**Acceptance Criteria:**  
- Caregivers can create, update, and delete diet plans.  
- Elderly users can view but not modify the plan.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-021 | Open Diet Plan section           | Current diet plan is visible         |
| TC-022 | Add a new diet plan              | Plan appears in elderly’s UI         |
| TC-023 | Edit meal details                | Updates reflected in UI & DB         |
| TC-024 | Elderly tries to modify plan     | Access denied                        |

---

### 🕓 **User Story 8: As a Primary Caregiver, I want to CRUD Schedules**  

**Acceptance Criteria:**  
- Caregivers can create, update, and delete schedules.  
- Elderly users and family can view schedules.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-025 | Open Schedules page              | List of schedules is visible         |
| TC-026 | Add a new schedule               | Schedule appears in elderly’s UI     |
| TC-027 | Modify an existing schedule      | Updates saved                        |
| TC-028 | Delete a schedule                | Entry removed from UI and DB         |

---

### 💳 **User Story 9: As an Unregistered User, I want to explore monthly subscriptions and app features**  

**Acceptance Criteria:**  
- Subscription plans are displayed without login.  
- Users can browse features but not interact.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-029 | Open app without logging in      | Subscription plans are visible       |
| TC-030 | Click on a feature (e.g., diet plan) | Prompt to sign up appears        |
| TC-031 | Click "Subscribe"                | Redirects to checkout page           |

---

### 🧑‍⚕️ **User Story 10: As a Healthcare Professional, I want to CRUD patient health details and prescriptions**  

**Acceptance Criteria:**  
- Can update patient health records and prescribe medication.  
- Only healthcare professionals have access to this feature.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-032 | View patient record              | Health details shown in full         |
| TC-033 | Update vitals or history         | Info saved and visible to others     |
| TC-034 | Add/edit/delete prescription     | Reflected in patient's medication UI |

---

### 📅 **User Story 11: As a Healthcare Professional, I want to schedule appointment meetings**  

**Acceptance Criteria:**  
- Can schedule and view appointments with elderly users.  
- Conflicting appointment times are prevented.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-035 | Create new appointment           | Appears on both user and professional’s calendar |
| TC-036 | Modify appointment details       | Changes saved in system              |
| TC-037 | Overlap time check               | Error message shown                  |

---

### 🚨 **User Story 12: As a Family Member, I want to receive notification of critical health alerts**  

**Acceptance Criteria:**  
- Get notified when vital signs are abnormal or emergencies occur.  
- Option to turn off certain notifications.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-038 | Abnormal BP reading              | Alert sent to family member          |
| TC-039 | Emergency button used            | Family receives alert                |
| TC-040 | Turn off notifications           | No alerts received                   |

---

### 📊 **User Story 13: As a Family Member, I want to view Elderly Health Summary**  

**Acceptance Criteria:**  
- View a dashboard summarizing the elderly’s health metrics.  
- Limited to view-only access.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-041 | Open health summary page         | Summary dashboard loads              |
| TC-042 | Attempt to edit details          | Access denied message shown          |

---

## 🔐 **Security & Authentication Tests**  

| ID     | Test Case                         | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-043 | JWT included in API requests     | Backend verifies authentication     |
| TC-044 | Unauthorized access attempt      | Redirected to login page            |
| TC-045 | Admin modifies caregiver role    | Role updates correctly              |

---

## 🎨 **User Interface & Mobile Responsiveness Tests**  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-046 | Open app on desktop              | Layout adapts to full screen        |
| TC-047 | Open app on mobile               | Layout adjusts for small screens    |
| TC-048 | Navigation between sections      | Smooth transitions between pages    |
| TC-049 | Dark mode toggle                 | UI switches themes correctly        |

---

## 🛠 **Post-Test Cleanup Steps**  

- Delete test users from the database.  
- Reset check-in, vitals, and prescription data.  
- Clear mock notifications and appointments.  

---