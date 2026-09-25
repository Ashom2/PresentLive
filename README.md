# PresentLive
Made by Alexander Shomer using React, Bootstrap and JavaScript Web for COMP2140 at The University of Queensland.

# Testing Guide

## Setup
Before running these workflows, ensure the app is running.
1. Execute `npm run dev` in the `/presentlive-app` directory.
2. Ensure `.env` file contains `VITE_API_TOKEN=<token>`.
3. Visit the local app at `http://localhost:5173`

## Workflow 1: Presenter

**User story:** A presenter creates a slide deck, adds content and poll slides, publishes it, and shares it with an audience.

### 1.1 Create a new presentation

1. On the home page (`/`), click **My presentations** in the header. → *Demonstrates: consistent header, clear navigation.*
2. Click **+ New presentation**.
3. Enter a title, e.g. `Testing Demo`, and leave "Start blank" selected.
4. Click **Create presentation**.
5. You should land on the slide editor at `/decks/edit/:id`. Confirm the title appears at the top. → *Demonstrates: routing to a dynamic route parameter, loading data from the URL.*

### 1.2 Edit presentation metadata

1. In the **Presentation Meta** panel, change the **Title** field to `Testing Demo (edited)` and click elsewhere. The field saves on blur. → *Demonstrates: edit, form validation, controlled form.*
2. Change the **Author** field to your name.
3. In the **Presentation Sharing** panel, confirm the status dropdown shows **Draft**. Everything below it is hidden with the message "Publish this presentation to share it with an audience." → *Demonstrates: conditional rendering based on entity state.*

### 1.3 Add slides

1. In the **Slides** panel, click **+ Add slide** three times. Three "New slide" entries appear in the list. → *Demonstrates: add records, list rendering of related entities.*
2. Click the first slide in the list. The **Edit Slide** panel shows its Title and Body fields.
3. Change the **Title** to `Welcome` and the **Body** to:
   ```
   ### Welcome to PresentLive
   This is a demo deck for the testing guide.
   ```
4. Click **Apply changes**. The list on the left updates to show "Welcome". → *Demonstrates: edit, controlled forms, state propagation between components.*
5. Select the second slide in the **Slides** panel. Set **Title** to `About Me` and **Body** to: 
   ```
   ### About Me
   - My name is <your name>
   ```
6. Before clicking **Apply changes**, attempt to navigate to a different slide or page. Verify the page warns you of unsaved changes. Cancel then click **Apply changes**.
7. Select the third slide. Set **Title** to `Poll: Experience`, toggle **Poll slide** on, and fill in:
   - **Question:** `How familiar are you with React?`
   - **Options:** `Beginner`, `Intermediate`, `Advanced`
   - Click **+ Add option** for each additional option.

### 1.4 Reorder slides (advanced feature: drag-and-drop)

1. Drag the second slide ("About Me") above the first slide ("Welcome"). The order changes in the list. → *Demonstrates: drag-and-drop reordering - an advanced feature.*
2. Wait a moment. The list stays in the new order after the page refetches. Reload the page or navigate elsewhere and verify the change persists.  → *Demonstrates: persisting an action via the API.*

### 1.5 Publish the deck

1. In the **Presentation Sharing** panel, change the status dropdown from **Draft** to **Published**.
2. The panel now shows three fields: **Code**, **Join link**, and **Edit link**. → *Demonstrates: edit, state transition, conditional rendering.*
3. Click **Copy** next to **Join link**. The button briefly shows "Copied!". Paste it somewhere for use in Workflow 2. → *Demonstrates: unique link generation (copy to clipboard).*
4. Keep the **Code** or **Join link** or **Edit link** on hand. You will need it for Workflow 2 (any of the three will work).

### 1.6 Preview the deck (multi-step guided flow)

1. Click **Preview** in the top-right of the editor. The preview view opens at `/decks/preview/:id`.
2. Step through the slides using **Previous** and **Next**. The slide counter in the navigation bar updates. → *Demonstrates: multi-page routing, one step per page, controlled progression.*
3. On the poll slide, the poll panel appears below the slide, previewing what this poll would look like to an attendee. Verify that the poll cannot be interacted with or submitted.

### 1.8 Present the deck

1. Click **← Edit** to go back to the editor. Then click **Present** in the top-right of the editor. The presenter view opens at `/decks/present/:id`.
2. Step through the slides using **Previous** and **Next**. The slide counter in the navigation bar updates. → *Demonstrates: multi-page routing, one step per page, controlled progression.*
3. In the **Presentation Attendance** panel, confirm it reads "No attendees yet." You will check this again after Workflow 2. → *Demonstrates: derived data (empty state).*
4. On the poll slide, the live results panel appears below the slide, showing 0 responses. Leave this page open - you will come back to it in Workflow 2 to see results appear live. → *Demonstrates: derived summary data, live update via polling.*

**Workflow 1 complete.** A deck has been created, edited, reordered, published, and presented.

---

## Workflow 2: Audience

**User story:** An audience member joins a deck via a shared link, steps through slides, answers a poll, and finishes.

### 2.1 Join a deck via the shared link

1. Open a **new browser window** (incognito or a different browser is best, to simulate a fresh session with no shared state). → *Demonstrates: the unique link works in a fresh session, no login required.*
2. On the home page (`/`) Paste the **Code** or **Join link** you copied in Workflow 1, step 1.5.3. → *Demonstrates: unique link access, deep linking.*
3. You are redirected to the **Join** page with the code pre-filled. → *Demonstrates: loading data from the URL, multi-step flow.*
4. Enter your name, e.g. `Cave Johnson`, and click **Join**. → *Demonstrates: controlled form, required-field validation.*

### 2.2 Step through slides (guided multi-step flow)

1. You land on the audience view at `/decks/view/:id`. The first slide is shown. → *Demonstrates: dynamic route parameter, clear start of workflow.*
2. Confirm there is no **Previous** button - attendees can only move forward. → *Demonstrates: controlled progression, users cannot return to a completed step.*
3. Click **Next** to advance to the "About Me" slide. Confirm the slide content changes and the counter updates.
4. Click **Next** to reach the poll slide.

### 2.3 Answer the poll

1. The poll question and options are shown below the slide. → *Demonstrates: conditional rendering by entity type.*
2. Select an option, e.g. **Intermediate**. → *Demonstrates: controlled form.*
3. Click **Submit answer**. The message "Submitted - cannot be changed" appears and the options lock. → *Demonstrates: irreversible action, state management.*
4. Attempt to click a different option - it is disabled. → *Demonstrates: validation of the "answers cannot be changed" rule.*

### 2.4 Finish the deck

1. Confirm the Next button on the last slide has been replaced with a **Finish** button. → *Demonstrates: clear end of workflow, conditional button rendering.*
2. Click **Finish**. You are taken to a completion page at `/decks/results/:id` with a thank-you message. → *Demonstrates: clear end of workflow, multi-page routing.*
3. On the completion page, click **Review slides**. You can now step freely back and forth. → *Demonstrates: read-only review mode, distinct from the guided flow.*

### 2.5 Observe the round trip back to the presenter

1. Return to the presenter view from Workflow 1 (still open in the original window, or reopen it at `/decks/present/:id`). → *Demonstrates: two user types, round trip of data.*
2. Advance to the poll slide. The **Live results** panel now shows 1 response with your chosen option highlighted. → *Demonstrates: data created by one user type is acted on by another, results flow back.*
3. Expand the **Results by attendee** list. Confirm your name (`Cav Johnson`) appears with the option you chose. → *Demonstrates: derived summary data, linking to related records.*

### 2.6 Verify the attendee list

1. The **Attendance** panel now shows `Cave Johnson` with status "Finished". → *Demonstrates: derived summary data.*
2. Click the attendee's name. You are taken to `/attendee/:id`, a detail page showing their name, the presentation they joined, their status, and their poll responses (question + chosen answer). → *Demonstrates: list view linking to detail view, data round trip.*

**Workflow 2 complete.** An audience member joined via a unique link, participated in a poll, finished, and their data flowed back to the presenter.

---

## Advanced Features

Beyond drag-and-drop reordering (Workflow 1.4), the following advanced features are implemented:

### Interactive data visualisation (poll results chart)

1. From the presenter view (`/decks/present/:id`), navigate to a poll slide.
2. The **Live results** panel displays a bar chart with one bar per option.
3. With at least one response (see Workflow 2), the bars scale proportionally to the responses. → *Demonstrates: interactive visualisation of app data.*

### Real-time updates via polling

1. With the presenter view open on a poll slide, open the audience view in another window (as per Workflow 2).
2. Submit a poll response from the audience window.
3. Within 3 seconds, the presenter's chart updates without a manual refresh. → *Demonstrates: real-time data updates using polling.*

### Copy-to-clipboard for unique links

1. In the **Presentation Sharing** panel, click **Copy** next to any field (Code, Join link, or Edit link).
2. Paste the clipboard contents somewhere - the copied value appears. → *Demonstrates: browser Clipboard API, unique link generation.*










TODO deleting a presentation
TODO all the new stuff in .env
TODO node src/api/server.js