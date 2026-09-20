# Demo Dataset Specification — ActionFlow AI

This document specifies the official demo dataset pre-configured in `src/data/demoAnalysis.ts`. It allows judges and users to reproduce the exact hackathon sync demonstration.

---

## 📄 Official Demo Raw Input Text

```text
AI Day hackathon preparation meeting.

Our final submission is tomorrow at 6 PM.
Vishal will finish the frontend and integrate the dashboard.
Sahil needs to prepare the presentation.
Rahul will test the backend API.

The demo video still needs to be completed but nobody has been assigned to it yet.
We need to make sure the application is deployed before the final submission.
There will be a team review at 4 PM today.

The presentation should include the problem statement, architecture, AI workflow and future scope.
Rahul mentioned that the API currently has two unresolved issues.
We should prioritize fixing those before the final demo.
```

---

## 🎯 Expected Extraction Outputs

### Executive Summary
> *"AI Day hackathon preparation meeting outlining critical tasks for Vishal (frontend/dashboard), Sahil (presentation), and Rahul (backend API testing/bug fixes), with upcoming team review at 4 PM today and final submission tomorrow at 6 PM. A critical unassigned task remains for the demo video."*

### Extracted Tasks
1. **Fix 2 unresolved API issues**: Assignee `Rahul` | Priority `High` | Deadline `Today before 4 PM Review` | Status `In Progress`
2. **Finish frontend & integrate dashboard**: Assignee `Vishal` | Priority `High` | Deadline `Tomorrow 6:00 PM` | Status `In Progress`
3. **Prepare presentation deck**: Assignee `Sahil` | Priority `High` | Deadline `Tomorrow 6:00 PM` | Status `Pending`
4. **Test backend API end-to-end**: Assignee `Rahul` | Priority `High` | Deadline `Tomorrow 6:00 PM` | Status `Pending`
5. **Produce demo video**: Assignee `Unassigned` | Priority `High` | Deadline `Tomorrow 6:00 PM` | Status `Pending` (Gapped)
6. **Deploy application to host**: Assignee `Unassigned` | Priority `High` | Deadline `Tomorrow 6:00 PM` | Status `Pending`

### Extracted Deadlines
1. **Team Review Meeting**: Date `Today` | Time `4:00 PM`
2. **Final Submission & Video**: Date `Tomorrow` | Time `6:00 PM`

### Extracted Decisions
1. Prioritize fixing two unresolved API issues before the final demo.
2. Presentation must cover Problem Statement, Architecture, AI Workflow, and Future Scope.

### Detected Information Gaps
1. **Unassigned Demo Video**: Transcript states nobody has been assigned yet.
2. **Unspecified Deployment Target**: Cloud hosting target platform is not mentioned.
3. **API Issue Details**: Rahul reported 2 issues, but specific error logs were omitted.

### AI Confidence Score
* **Confidence Rating**: **94%**
* **Reasoning**: High clarity in task ownership and strict deadlines; minor gap due to unassigned demo video owner.
