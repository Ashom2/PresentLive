# PresentLive
Made by Alexander Shomer using React, Bootstrap and JavaScript Web for COMP2140 at The University of Queensland.

# Usage of Generative AI
DeepSeek AI was used to assist in the creation of this web application.
   - It was used to generate initial mockups of HTML pages using Bootstrap.
   - It was used to assist my practical understanding of React.
   - It was used to partially or fully generate some functions - all of which are cited in the JDoc - particularly:
      - useApi (`src/hooks/useApi.js`)
      - request (`scr/api/client.js`)
      - SortableSlideRow and SlideList (`src/components/SlideList.jsx`)
      - PollDisplay (`src/components/PollDisplay.jsx`)
   - It was used to refine the AI prompt template in `src/api/server.js`.
   - It was used to assist writing this README.md, particularly the outline of the testing guide. It was then corrected, reformatted, edited and checked manually.

---

# Testing Guide

## Setup
Before running these workflows, ensure the app is running.
1. Ensure your `.env` files are set up. The client needs: 
`VITE_BASE_URL=<your API URL>`
`VITE_API_TOKEN=<your API token>`
2. If using the AI feature, the AI server needs:
`AI_BASE_URL=<OpenAI-compatible base URL, ending in /v1>`  
`AI_API_KEY=<your AI provider key>`
3. Execute `npm run dev` in the `/presentlive-app` directory.
4. If using the AI feature, in a separate terminal run `node server/index.js`
5. Visit the local app at `http://localhost:5173`

## Workflow 1: Presenter

**User story:** A presenter creates a slide deck, adds content and poll slides, publishes it, and shares it with an audience.

### 1.1 Create a new presentation

1. On the home page (`/`), click **My presentations** in the header. → *Demonstrates: consistent header, clear navigation.*
2. Click **+ New presentation**.
3. Leave "Start blank" selected, and enter a title, e.g. `Testing Demo`.
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
6. Before clicking **Apply changes**, click a different slide or **← My presentations** button. Verify the page warns you of unsaved changes. Cancel then click **Apply changes**.
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
4. Keep either the **Code** or **Join link** or **Edit link** on hand. You will need it for Workflow 2 (any of the three will work).

### 1.6 Preview the deck

1. Click **Preview** in the top-right of the editor. The preview view opens at `/decks/preview/:id`.
2. Step through the slides using **Previous** and **Next**. The slide counter in the navigation bar updates. → *Demonstrates: multi-page routing, one step per page, controlled progression.*
3. On the poll slide, the poll panel appears below the slide, previewing what this poll would look like to an attendee. Verify that the poll cannot be interacted with or submitted.

### 1.7 Present the deck

1. Click **← Edit** to go back to the editor. Then click **Present** in the top-right of the editor. The presenter view opens at `/decks/present/:id`.
2. Step through the slides using **Previous** and **Next**. The slide counter in the navigation bar updates. → *Demonstrates: multi-page routing, one step per page, controlled progression.*
3. In the **Presentation Attendance** panel, confirm it reads "No attendees yet." You will check this again after Workflow 2. → *Demonstrates: derived data (empty state).*
4. On the poll slide, the **Slide Poll Results** panel appears below the slide, showing 0 responses. Leave this page open - you will come back to it in Workflow 2 to see results appear live. → *Demonstrates: derived summary data, live update via polling.*

**Workflow 1 complete.** A deck has been created, edited, reordered, published, and presented.

---

## Workflow 2: Audience

**User story:** An audience member joins a deck via a shared link, steps through slides, answers a poll, and finishes.

### 2.1 Join a deck via the shared link

1. Open a **new browser window** (incognito or a different browser is best, to simulate a fresh session with no shared state). → *Demonstrates: the unique link works in a fresh session, no login required.*
2. On the home page (`/`) in the **Join a presentation** segment, paste the **Code** or **Join link** you copied in Workflow 1.5.3. Click join or press enter. → *Demonstrates: unique link access, deep linking.*
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
2. Advance to the poll slide. The **Slide Poll Results** panel now shows 1 response with your chosen option highlighted. → *Demonstrates: data created by one user type is acted on by another, results flow back.*
3. Expand the **Results by attendee** list. Confirm your name (`Cave Johnson`) appears with the option you chose. → *Demonstrates: derived summary data, linking to related records.*

### 2.6 Verify the attendee list

1. Still in the presenter view `/decks/present/:id`, the **Presentation Attendance** panel now shows `Cave Johnson` in a table entry with status "Finished". → *Demonstrates: derived summary data.*
2. Click the attendee's name. You are taken to `/attendee/:id`, a detail page showing their name, the presentation they joined, their status, and their poll responses (question + chosen answer). → *Demonstrates: list view linking to detail view, data round trip.*

**Workflow 2 complete.** An audience member joined via a unique link, participated in a poll, finished, and their data flowed back to the presenter.

---

## Workflow 3: AI-assisted Presentation Generation

**User story:** A presenter creates a new deck by giving the AI a topic. The AI returns a structured deck of slides and poll slides, which the app persists as real entities the presenter can then edit and present like any other deck.

### 3.1 Generate a deck from a topic

1. From the home page (`/`), click **+ New presentation**.
2. Under **Starting point**, select **Generate with AI**. The title field disappears (the AI will generate it) and a **Topic** field appears with the helper text "The AI will generate a title and slides for this topic."
3. Enter a topic, e.g. `Introduction to React hooks`.
4. Check **Include poll slides** so you can verify the poll-generation path. (See step 9 for the no-polls path.)
5. Click **Generate presentation**. The button shows "Generating…" while the AI server is working. This takes roughly 5-15 seconds. → *Demonstrates: handling long-running async operations.*
6. When generation finishes, you are redirected to the editor at `/decks/edit/:id`. The AI-chosen title appears at the top of the page. → *Demonstrates: AI-generated content becoming real app data, not just displayed text.*
7. In the **Slides** panel on the left, confirm the deck contains several slides with varied titles. → *Demonstrates: structured output from the model being stored as entities via the REST API.*

### 3.2 Verify the AI generated varied content

1. Click through the slides in **Slides** panel. Confirm that:
   - Each slide has a unique and relevant title.
   - The slide bodies contain presentMD (headings, bullets, prose, quotes - not just a single format).
   - At least one slide is marked as a poll and has a question and options.
2. On a poll slide, click **Preview** in the top-right. Confirm the poll panel appears below the slide with the generated question and options. → *Demonstrates: AI-generated poll data conforms to the app's expected shape.*
3. Click **← Edit** to return to the editor.

### 3.3 Generate without polls

1. Navigate back to the home page and click **+ New presentation**.
2. Select **Generate with AI**, enter the same topic Introduction to React hooks, but leave Include poll slides unchecked.
3. Click **Generate presentation**.
4. In the editor, confirm the generated deck contains only Content slides and no poll slides. → *Demonstrates: the AI operates on user input - the parameter changes the output.*

### 3.4 Generate on a different topic

1. Return to the home page and click **+ New presentation**.
2. Select **Generate with AI**, enter a different topic, e.g. `History of the internet`.
3. Click **Generate presentation**.
4. In the editor, confirm the generated title, slides, and content are entirely different from the first deck. → *Demonstrates: the AI is generating fresh content, not returning a canned response.*

### 3.5 Edit and present the generated deck

1. Open one of the generated decks from **My presentations** (`/decks`).
2. Edit a slide's title or body as per Workflow 1.3, and click **Apply changes**. → *Demonstrates: AI-generated entities are editable like any other entity.*
3. Publish the deck as per Workflow 1.5.
4. Click **Present** and step through the slides as per Workflow 1.7. → *Demonstrates: the full presenter workflow works on AI-generated decks.*

---

# Advanced Features

Beyond drag-and-drop reordering (Workflow 1.4), the following advanced features are implemented:

### Interactive data visualisation (poll results chart)

1. From the presenter view (`/decks/present/:id`), navigate to a poll slide.
2. The **Slide Poll Results** panel displays a bar chart with one bar per option.
3. With at least one response (see Workflow 2), the bars scale proportionally to the responses. → *Demonstrates: interactive visualisation of app data.*

### Real-time updates via polling

1. With the presenter view open on a poll slide, open the audience view in another window (as per Workflow 2).
2. Submit a poll response from the audience window.
3. Within 3 seconds, the presenter's chart updates without a manual refresh. → *Demonstrates: real-time data updates using polling.*

### Copy-to-clipboard for unique links

1. In the **Presentation Sharing** panel, click **Copy** next to any field (Code, Join link, or Edit link).
2. Paste the clipboard contents somewhere - the copied value appears. → *Demonstrates: browser Clipboard API, unique link generation.*

---

# Summary of Requirements Coverage

| Requirement                         | Where demonstrated                                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
|Consistent header|All pages; header shows brand and nav links|
|Clear navigation|Workflow 1.1.1, 1.7.1|
|Colour, icons, instructions|status dropdown (1.5), poll toggle (1.3.6), presentation status badges, navigation arrows, button colours throughout|
|Footer|All pages|
| 3+ related entities|Deck, Slide, Attendee, Poll Response used for slide poll results section (2.5.2) and attendee info page (2.6.2)|
|RESTful API|All actions persist to the API and all API stored entities are displayed in tables on `/admin` page|
| List views for each entity          | Decks presentations (`/decks`), Slides (editor sidebar), Attendees (presentation panel), All (`/admin`)|
|Add, Edit, Delete|Workflow 1.1 (add deck), 1.2 (edit), 1.3 (add/edit slides); delete buttons on each list row|
|Required fields, user-friendly validation|Workflow 1.1.3 (title required), 1.2 (title cannot be empty), 1.3.6 (cannot leave slide with unsaved changes)|
|All collected data is used|Poll responses feed the presenter's live chart and the attendee detail page|
| Summary data with links|Attendance panel (1.7.2, 2.6.2); click-through to attendee detail (2.6.3)|
|Data round trip| Attendee response appears in presenter view (2.5)|
|Two workflows, different user types| Workflow 1 (presenter), Workflow 2 (audience)|
|Multi-step guided flow| Workflow 2.1-2.4 (one step per page, no going back)|
|Clear start and end|Home page (2.1), results page (2.4)|
|AI Integration|Workflow 3|
|Advanced feature - drag and drop|Slide re-ordering (workflow 1.4)|
|Advanced feature - real-time updates via polling|Live slide poll results (2.5), live attendance (2.6)|
|Advanced feature - copy to clipboard|Workflow 1.5.3|
|Advanced feature - unique deep link|Join link works in fresh session and in any URL format from modes which the presentation was viewed (2.1)|

---