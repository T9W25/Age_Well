# 📝 AgeWell Test Documentation Manual  
**Version**: 1.0  
**Date**: April 2, 2025  

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

### 🍽 **User Story 6: As a Primary Caregiver, I want to CRUD Elderly Diet Plans**  

**Acceptance Criteria:**  
- Caregivers can create, update, and delete diet plans.  
- Elderly users can view but not modify the plan.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-018 | Open Diet Plan section           | Current diet plan is visible         |
| TC-019 | Add a new diet plan              | Plan appears in elderly’s UI         |
| TC-020 | Edit meal details                | Updates reflected in UI & DB         |
| TC-021 | Elderly tries to modify plan     | Access denied                        |

---

### 📅 **User Story 7: As a Primary Caregiver, I want to CRUD Schedules**  

**Acceptance Criteria:**  
- Caregivers can create, update, and delete schedules.  
- Elderly users and family can view schedules.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-022 | Open Schedules page              | List of schedules is visible         |
| TC-023 | Add a new schedule               | Schedule appears in elderly’s UI     |
| TC-024 | Modify an existing schedule      | Updates saved                        |
| TC-025 | Delete a schedule                | Entry removed from UI and DB         |

---

### 💳 **User Story 8: As an Unregistered User, I want to explore monthly subscriptions and app features**  

**Acceptance Criteria:**  
- Subscription plans are displayed without login.  
- Users can browse features but not interact.  
- Signup button is available for conversion.  

#### 🧪 Test Cases  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-026 | Open app without logging in      | Subscription plans are visible       |
| TC-027 | Click on a feature (e.g., diet plan) | Prompt to sign up appears |
| TC-028 | Click "Subscribe"                | Redirects to checkout page           |

---

## 🔐 **Security & Authentication Tests**  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-029 | JWT included in API requests    | Backend verifies authentication     |
| TC-030 | Unauthorized access attempt     | Redirected to login page            |
| TC-031 | Admin modifies caregiver role   | Role updates correctly              |

---

## 🎨 **User Interface & Mobile Responsiveness Tests**  

| ID     | Test Case                        | Expected Result                      |
|--------|----------------------------------|--------------------------------------|
| TC-032 | Open app on desktop              | Layout adapts to full screen        |
| TC-033 | Open app on mobile               | Layout adjusts for small screens    |
| TC-034 | Navigation between sections      | Smooth transitions between pages    |
| TC-035 | Dark mode toggle                 | UI switches themes correctly        |

---

## 🛠 **Post-Test Cleanup Steps**  

- Delete test users from the database.  
- Reset check-in and emergency logs.  
- Verify API logs for any errors.  

---