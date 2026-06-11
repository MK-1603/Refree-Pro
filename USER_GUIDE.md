# Referee Pro — User Guide

## 1) What this app does
Referee Pro helps you manage football matches and tournaments:
- Schedule matches and tournaments
- Run a live match (timer + goals/cards/substitutions + undo)
- Lock matches and generate match reports (PDF)
- Generate tournament reports and view standings
- Works with offline support
- Export/import/clear your data

---

## 2) Start the app (Production)
Open the hosted app:
https://refree-pro.vercel.app/

---

## 3) First-time setup (Onboarding)
When you open the app for the first time:
1. Go through the onboarding screens.
2. Tap **Get Started →** (or **Skip**).
3. You’ll be taken to the **Dashboard**.

---

## 4) Dashboard (Home)
The dashboard shows:
- **Live match card** (if any)
- **Today’s matches**
- **Active tournaments**
- **Upcoming matches**
- Quick actions:
  - **Schedule Match**
  - **Create Tournament**
  - **Generate Report**
  - **View History**

If there is a live match, tap **RESUME** to continue the live match.

---

## 5) Matches (step-by-step)

### 5.1 Open Matches
1. From the main navigation, open **Matches**.
2. Use the filter tabs:
   - **All**: everything
   - **Scheduled**: matches planned but not started
   - **Live**: matches currently in progress
   - **Completed**: matches finished

### 5.2 Create a match (full workflow)
1. Open **Matches**.
2. Tap **Schedule Match**.
3. **Step 1 (Details)** — fill these fields:
   - **Tournament (optional)**
     - If you want this match linked to a tournament, select it.
     - If not, you can leave it empty.
   - **Venue**
     - Enter/select the ground/venue.
   - **Match number**
     - Enter the match number (useful for tournament fixtures).
   - **Match date**
     - Pick a date that is **today or in the future** (it cannot be in the past).
   - **Match time**
     - Pick the kickoff time.
     - If you pick **today**, the time cannot be in the past.
   - **Referee name (optional)**
     - Add the referee name if you want it to appear in later screens/reports.
4. **Step 1 validation / Next button**
   - After Step 1 fields look correct, tap **Next** to move to Step 2.

5. **Step 2 (Teams / Setup)** — complete what the UI shows:
   - Select **Team A** and **Team B**.
   - Add/select **players for each team**.
   - Review any team-related options shown (for example, substitutions/roster-related fields).
   - Tap the step action (often **Save / Continue / Confirm**).

6. **Step 3 (Match configuration)** — complete configuration shown on this step:
   - Review match settings (format/duration/break options, depending on UI).
   - Confirm the step and tap **Save / Next / Confirm**.

7. **Step 4 (Create / Finish)** — finalize the match:
   - Review the summary (venue, date/time, teams, configuration).
   - Tap the final **Create/Finish** button to create the match.

8. After creation, return to **Matches**:
   - Open the new match card.
   - If it is **Scheduled**, tap **Start** when you are ready.
   - If you need changes before starting, tap **Edit** first, then return to **Start**.



### 5.3 Match details (what you will see)

Tap a match card to open **Match Details**. You will see:
- **Overview**: match info (teams, venue, format, duration, referee, etc.)
- **Timeline**: list of events (goals, cards, substitutions)
- **Squads**: players for Team A and Team B
- **Stats**: quick totals based on recorded events

### 5.4 What buttons you get (depends on status)
- **Scheduled**: you can **Edit** or **Start** the match
- **Live**: you can **Resume** the match
- **Completed**:
  - If not locked yet, **Lock** it first
  - Then you can **Report** / open the **Poster**


---

## 6) Schedule a match (multi-step)
Go to **Schedule Match** and fill **Step 1**:
- Tournament (optional)
- Venue
- Match number
- Match date (cannot be in the past)
- Match time (cannot be in the past for today)
- Referee name (optional)

Important rule:
- If the same **venue + date + time** is already booked, the app will warn you to change it.

Tap **Next** to continue scheduling.

---

## 7) Run a live match (the most important workflow)
Open the match in **Live** mode.

### 7.1 Before you start (quick check)
Before recording events, confirm:
1. The correct **teams** are shown on the scoreboard.
2. The match header (venue/date/match number) matches what you are officiating.
3. The **timer** state looks correct (not accidentally running from a previous session).

### 7.2 Start / Pause / Resume (timer workflow)
Use the timer controls in this order:
- **Start**: begins the match timer
- **Pause**: temporarily stops time
- **Resume**: continues time

Tip: if you leave the match page, come back to the dashboard and use **Resume**.

### 7.3 Use “Half / End” correctly
- When the first half ends, follow the half-time prompt.
- When the match finishes, tap **End** and confirm in the flow.

### 7.4 Record events (how scoring works)
Use the quick action buttons:
- **Goal**
- **Yellow card**
- **Red card**
- **Substitution**

For each event:
1. Tap the quick action.
2. Fill the modal (player/team details, jersey number if asked).
3. Tap **Save**.
4. Check the live update:
   - **Timeline** updates immediately
   - **Scoreboard** updates immediately for **Goals**

### 7.5 Undo last event (fix mistakes)
If you entered something by mistake:
1. Tap **Undo**.
2. Confirm the undo action.
3. The last event is marked undone and:
   - Timeline updates
   - Score/stats update accordingly

### 7.6 Pause safety
If your browser tab becomes hidden or you leave the page, the app pauses the match timer automatically to avoid time drift.


---

## 8) Edit a scheduled match
If a match is still **Scheduled**, open its details and tap **Edit**.
You can update:
- Venue
- Date/time
- Referee name
- Match duration (minutes per half)
- Break duration

Tap **Save changes**.

---

## 9) Tournaments (full workflow)

### 9.1 Create a tournament
1. Open **Tournaments**.
2. Tap **Create Tournament**.
3. Fill the required fields:
   - **Tournament name**
   - **Venue / location**
   - **Start date**
   - **End date**
4. Submit to create the tournament.

What happens after creation:
- The tournament is added to the tournament list.
- You can open the tournament to schedule matches inside the event.

### 9.2 Open tournament details
Open any tournament card to see the tournament detail pages with multiple tabs:

#### Overview
- High-level info about the tournament (name, venue, dates)

#### Fixtures (upcoming)
- Matches that are not completed yet
- Use this to keep track of what is coming up

#### Results (completed)
- Matches that are finished
- Useful for checking overall progress

#### Standings
- Team table (played/won/drawn/lost, goals for/against, points)
- This is built from match events that were recorded during completed matches

#### Scorers
- List of players with the most goals

#### Report
- Entry point for generating tournament reports (PDF flow)

---

## 10) Reports (PDF) (full workflow)

### 10.1 Where reports are
You can generate reports from:
- **Reports** page (all completed match & tournament reports)
- A specific **Match** (match report)
- A specific **Tournament** (tournament report)

### 10.2 Open the Reports page
1. Open **Reports**.
2. You’ll see:
   - **Completed match reports**
   - **Tournament reports**

### 10.3 Generate and download a report
1. Tap the **PDF** button next to the item you want.
2. The report page opens.
3. Tap **Download PDF**.
4. Your device downloads the PDF report.

### 10.4 If a PDF looks missing
- Only **completed** matches are typically included in match reports.
- If your match/tournament is not showing up as expected:
  - Go back to the related **match status** (Scheduled/Live/Completed)
  - For matches: make sure it is marked **Completed** (and locked if needed).


---

## 11) History
Open **History** to see completed work.
Use search (for matches) to quickly find a team.

---

## 12) Settings (theme + data)
Open **Settings**.

### Appearance
Choose theme:
- Dark
- Light
- System

### Storage & Data
- **Export All Data (.pdf)**: downloads a PDF backup
- **Import Data**: lets you load previously exported data
- **Clear All Data**: permanently deletes everything (requires typing **CONFIRM**)

---

## 13) Offline support & troubleshooting
When you go offline:
- You may see an offline indicator.
- Any action that needs an API may fail or be delayed.

### What “full offline” access means (how the app behaves)
- The app has an offline service worker enabled, so pages and static UI assets can remain accessible.
- When offline, **actions that require server API calls** may fail or take longer (depending on browser/background sync).
- Timer/event handling can be delayed if the app needs API calls to persist state.

### How to use the app when offline
1. **Open a page you already loaded before going offline** (Dashboard / Matches list / Match live screen if cached).
2. Continue recording events only if the UI updates immediately.
3. If an event/timer change doesn’t persist:
   - go back after reconnect
   - refresh the page
   - re-check the match state.

### Common fixes
- Events/timer not updating? Reconnect to the internet and refresh, then try again.
- If you keep getting errors:
  - Check the browser **Network** tab to see which request failed.


---

## 14) Quick troubleshooting checklist (real-world)
**I started a match but score/timeline didn’t update:**
- Make sure you tapped and saved the modal for the event.
- If offline, reconnect and refresh.

**Timer resumed incorrectly after leaving the page:**
- Re-open the same live match from the dashboard (Resume).

**I completed a match but can’t generate the report:**
- Ensure the match status is **Completed** and (if required) lock it first.

---