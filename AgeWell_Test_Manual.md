📚 AgeWell Test Documentation Manual

Version: 1.0
Date: April 2, 2025

⸻

✅ User Story-Based Test Plan

⸻

👵 User Story 1: As an Elderly User, I Want to Have Daily Check-ins

Acceptance Criteria:
	•	Elderly users receive a daily check-in prompt.
	•	Users can confirm their well-being.
	•	If no response, an alert is triggered.

✅ Test Cases

ID	        Test Case	                           Expected Result

TC-001 |	Elderly user receives check-in prompt |	Notification received
TC-002 |	User confirms well-being	          | Status updated in DB
TC-003 |	User ignores check-in	              | Alert triggered



⸻

💊 User Story 2: As an Elderly User, I Want to Receive Medication Notifications

Acceptance Criteria:
	•	System sends reminders for scheduled medication.
	•	Users can confirm medication intake.
	•	If missed, caregiver is notified.

✅ Test Cases

ID	        Test Case	                                Expected Result

TC-004 |	Medication notification sent on schedule |	User receives alert
TC-005 |	Elderly confirms medication taken	     |   Status updated
TC-006 |	Elderly misses medication	             |   Caregiver notified



⸻

⚡ User Story 3: As an Elderly User, I Want to Immediately Contact for Emergency

Acceptance Criteria:
	•	Emergency button available in the app.
	•	Clicking triggers an alert to caregivers.

✅ Test Cases

ID	        Test Case	                                    Expected Result

TC-007 |	Elderly presses emergency button	         |  Caregiver alerted
TC-008 |	Alert details include location and user info |	Data sent correctly



⸻

👤 User Story 4: As an Administrator, I Want to Manage User Accounts and Permissions

Acceptance Criteria:
	•	Admin can modify user roles and permissions.
	•	Admin can deactivate/reactivate accounts.

✅ Test Cases

ID	        Test Case	                    Expected Result

TC-009 |	Admin changes user role	     |  Role updated
TC-010 |	Admin deactivates an account |	User access revoked
TC-011 |	Admin reactivates an account |	Access restored



⸻

📊 User Story 5: As an Elderly User, I Want to Check Vital Signs

Acceptance Criteria:
	•	Elderly users can input vital signs (BP, heart rate, etc.).
	•	Data is stored and viewable.

✅ Test Cases

ID	        Test Case	                Expected Result

TC-012 |	User enters vital signs |	Data stored in DB
TC-013 |	User views past records |	Data displayed correctly



⸻

🍽 User Story 6: As a Primary Caregiver, I Want to CRUD Elderly Diet Plan

Acceptance Criteria:
	•	Caregiver can create, update, read, and delete diet plans.
	•	Elderly users can view, but not edit.

✅ Test Cases

ID	        Test Case	                Expected Result

TC-014 |	Caregiver adds diet plan |	Plan saved and listed
TC-015 |	Caregiver updates plan	 |  Changes reflected
TC-016 |	Elderly views plan	     |  Read-only access
TC-017 |	Unauthorized user edits	 |  Access denied



⸻

🗓 User Story 7: As a Primary Caregiver, I Want to CURD Schedules

Acceptance Criteria:
	•	Caregiver can create, update, read, and delete schedules.
	•	Elderly and family can view schedules.

✅ Test Cases

ID	        Test Case	                    Expected Result

TC-018 |	Caregiver creates a schedule |	Schedule saved and displayed
TC-019 |	Caregiver updates a schedule |	Changes applied
TC-020 |	Caregiver deletes a schedule |	Removed from system
TC-021 |	Elderly views schedule	     |  Read-only mode
TC-022 |	Unauthorized user modifies	 |  Access denied



⸻

📅 User Story 8: As an Unregistered User, I Want to Explore Monthly Subscriptions and App Features

Acceptance Criteria:
	•	Unregistered users can browse available subscription plans.
	•	Users can view a feature list before registering.

✅ Test Cases

ID	        Test Case	                                  Expected Result
      
TC-023 |	Unregistered user visits pricing page	   |  Subscription plans displayed
TC-024 |	Unregistered user views feature list	   |  Features listed
TC-025 |	Unregistered user tries restricted feature |  Redirected to sign-up page



⸻

🔒 Security Notes
	•	JWT tokens secured in localStorage.
	•	Backend routes protected via verifyToken middleware.
	•	Role-based access control enforced.

⸻

🧹 Cleanup Steps (Post-Test)
	•	Clear dummy users from database.
	•	Reset test schedules and diet plans.
	•	Remove test emergency alerts.

⸻

