# Championship Day

A small React exercise for a WCAG engineering interview. The page is a one-day competition dashboard: switch views, filter sessions, open alert preferences, expand a session, and read results.

## Brief

People using a keyboard, a screen reader, and low-vision settings have reported that the page is difficult to use. The visual layout is intentional. Treat the behaviour you can operate with a mouse as the product behaviour that must keep working.

Please:

1. Audit the rendered page. Record each issue with the user impact, the WCAG 2.1 criterion, and a concrete fix.
2. Implement the fixes in this application.
3. Add or update tests that lock the repaired behaviour.
4. Keep the same content, the same mouse interactions, and a usable layout from a narrow phone width through a desktop width.
5. Publish the result on GitHub.

Two reports from colleagues, without a prescribed root cause:

- The session filter is awkward when using only a keyboard.
- Result status is not clear for colleagues who cannot rely on colour.

Do not assume those are the only issues. Do not change the event, the athlete names, or the available views.

## Run

This app is self-contained. Install and run it from this folder:

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints. The app uses port `5174` when that port is free.

```bash
pnpm test
pnpm check
pnpm lint
```

Suggested time box: 2–3 hours. A written audit plus a partial implementation is more useful than an unfinished rewrite. Simple, native fixes are fully acceptable.

## Publish the result

Publish the finished result on GitHub. The repository must contain the repaired application and your written audit. Send the repository URL when you are done.

## Accessibility Audit

### Theme (global)

#### 1. `panda.config.ts`: semantic color tokens are never applied; rule being violated: [1.4.3 Contrast (Minimum) (AA)](https://www.w3.org/TR/WCAG21/#contrast-minimum)

- **Impact**

  The `sv` helper defines every semantic color only under the `_light` and `_dark` conditions, which generate `.light` and `.dark` selectors. Nothing in the app sets either class, so all `--colors-*` variables are undefined and every color falls back to browser defaults. The most severe effect is in the AlertsModal component: its background and backdrop render transparent, so the dialog text overlaps the page content and is unreadable, and the page behind is not visually dimmed. Borders, text and surfaces elsewhere also lose the designed palette.

- **Solution**

  Change `sv` to use `base` for the light value (`{ base: light, _dark: dark }`), so light tokens are defined on `:root` by default and `.dark` overrides them. Also fix `styles.css`, where `body` references a non-existent `--colors-background-base` token (replace with `--colors-surface-base`).

- **Note**

  The app has no theme switching. Dark mode would remain available via the `.dark` class after this change; adding a toggle or `prefers-color-scheme` support is out of scope.

### SiteHeader

#### 1. Lines 66-75 - img tag with an empty alt attribute; rules being violated: [1.1.1 Non-text Content (A)](https://www.w3.org/TR/WCAG21/#non-text-content) and [1.4.5 Images of Text (AA)](https://www.w3.org/TR/WCAG21/#images-of-text)

- **Impact**

  The empty alt attribute marks the image as decorative, so screen readers skip it and blind users do not receive the information it contains. In addition, because the text is rendered as an image, users with low vision or cognitive disabilities cannot adapt its presentation: high-contrast modes, custom fonts, colors and text spacing are not applied, browser text resizing has no effect, and zooming causes the text to pixelate. The text also cannot be selected, copied or translated.

- **Solution**

  Replace the image of text with real HTML and text styled with CSS (e.g. two `<p>` elements, wrapped in a flex container). The course details ("58 gates, 180m vertical drop") are not available anywhere else on the page as text.

#### 2. Lines 88-106 - button with star-shaped svg; rules being violated: [4.1.2 Name, Role, Value (A)](https://www.w3.org/TR/WCAG21/#name-role-value)

- **Impact**

  The button has no accessible name, so screen readers announce it only as “button”. Screen reader users cannot tell what the button does or whether the option is currently on or off.

- **Solution**

  Add `aria-label="Add to favourites"` to give the button an accessible name, and `aria-pressed={isStarFilled}` to expose its state. The button will then be announced as a toggle button with its name and current state (pressed/not pressed), and the state change is exposed to assistive technologies.

#### 3. Lines 107-148 - share icon button with a misleading accessible name; rule being violated: [2.4.6 Headings and Labels (AA)](https://www.w3.org/TR/WCAG21/#headings-and-labels)

- **Impact**

  The button's accessible name is "Menu", while it actually copies the page link. Screen reader users are given incorrect information about its purpose.

- **Solution**

  Change the label to describe the action: `aria-label="Copy link"`.

#### 4. Lines 157-164 - "Link copied" status message; rule being violated: [4.1.3 Status Messages (AA)](https://www.w3.org/TR/WCAG21/#status-messages)

- **Impact**

  The confirmation uses `role="status"`, but the live region is rendered conditionally, so it is inserted into the DOM together with its content. Many screen readers do not announce live regions added this way. Consequently, screen reader users may get no feedback that the link was copied. Additionally, `hasCopiedLink` is never reset, so repeated activations produce no new announcement.

- **Solution**

  Render the `role="status"` container persistently and change only its content `({hasCopiedLink? copy.linkCopied : ''})`. Reset hasCopiedLink after a few seconds.

- **Note**

  The "Copy link" button does not actually write URL to the clipboard. This is the original behaviour and I decided not to change that.

#### 5. Lines 157-164 - layout shift when the status message appears (advisory, not a WCAG 2.1 violation)

- **Impact**

  When the message appears, the adjacent buttons move. This can disorient users with cognitive disabilities, cause screen magnifier users to lose track of the controls, and lead to accidental activation of the wrong button.

- **Solution**

  Reserve space for the persistent status container (e.g. with `min-height`), so changing its content does not affect the layout.

### AlertsModal

#### 1. Lines 79–92: dialog has no accessible name and is not exposed as modal; rule being violated: [4.1.2 Name, Role, Value (A)](https://www.w3.org/TR/WCAG21/#name-role-value)

- **Impact**

  The container has `role="dialog"` but no accessible name and no `aria-modal`. Screen readers announce only "dialog" without its title, and are not told that content outside it is unavailable.

- **Solution**

  Replace the `div` with a native `<dialog>` opened via `showModal()`, which is exposed as a modal dialog. Link the heading with `aria-labelledby`, so the dialog is announced as "Alert preferences, dialog".

#### 2. Keyboard focus is not contained in the dialog; rule being violated: [2.4.3 Focus Order (A)](https://www.w3.org/TR/WCAG21/#focus-order)

- **Impact**

  Tabbing past the Close button moves focus to controls on the page behind the overlay, which are visually covered. Keyboard users lose track of where focus is and can activate hidden controls. Screen reader users can also browse the background content. Because the Escape handler is attached to the dialog element, Escape stops working once focus has left it.

- **Solution**

  The native `<dialog>` opened via `showModal()` (see item 1) renders in the top layer and makes the rest of the page inert, so focus and the screen reader virtual cursor stay inside the dialog. Handle Escape through the native `cancel` event (`onCancel`) instead of the custom `keydown` handler.

#### 3. Focus is not returned to the trigger on close; rule being violated: [2.4.3 Focus Order (A)](https://www.w3.org/TR/WCAG21/#focus-order)

- **Impact**

  After the dialog closes, focus is lost to `<body>`. Keyboard and screen reader users are sent back to the top of the page and have to navigate again to "Manage alerts" to continue where they were.

- **Solution**

  Render the dialog persistently in `App.tsx` and control it with an `open` prop instead of mounting it conditionally (`{isAlertsOpen && <AlertsModal />}`). Opening it with `showModal()` and closing it with `close()` lets the browser return focus to the element that opened it ("Manage alerts").

### ViewSwitcher

#### 1. Lines 55–64: tabs implemented as links without the tab keyboard pattern; rule being violated: [4.1.2 Name, Role, Value (A)](https://www.w3.org/TR/WCAG21/#name-role-value)

- **Impact**

  The elements are announced as tabs (`role="tab"`), but they behave as links. Screen reader and keyboard users expect the standard tab interaction: a single Tab stop for the whole tab list and arrow keys to move between tabs. Instead, every tab is a separate Tab stop, arrow keys do nothing, and Space does not activate a tab (anchors respond to Enter only). The `href` values (`#schedule`, `#results`, `#medals`) point to no element on the page and their default navigation is cancelled with `preventDefault()`, so the elements gain nothing from being links.

- **Solution**

  Replace the anchors with `<button type="button" role="tab">`, removing the unused `href` values and `preventDefault()`. Implement roving tabindex: only the selected tab has `tabIndex={0}`, the others `-1`. Arrow keys (Left/Right and Up/Down, since the list is vertical on narrow screens and horizontal from `md`) move focus and switch the view, wrapping at both ends; Home and End jump to the first and last tab. Keep the tab pattern rather than navigation links, because the views switch content in place and do not correspond to separate URLs. The original `href` values suggest the views were meant to be linkable, but `preventDefault()` prevented the URL from changing and the initial view was hard-coded, so deep linking never worked.

#### 2. Lines 45–73 (`App.tsx`): tabs are not associated with their panel; rule being violated: [1.3.1 Info and Relationships (A)](https://www.w3.org/TR/WCAG21/#info-and-relationships)

- **Impact**

  The content below the tab list is rendered in plain `<section>` elements with no `tabpanel` role and no link to the tabs. Screen reader users cannot tell that the content belongs to the selected tab, and the panel has no accessible name.

- **Solution**

  Wrap the view content in a single `<section role="tabpanel" id="view-panel">` labelled by the active tab (``aria-labelledby={`tab-${activeView}`}``). Each tab references the panel with `aria-controls="view-panel"`. Give the panel `tabIndex={0}` for the Results and Medals views, which start with non-interactive content, so keyboard users can reach it with Tab; the Schedule view starts with filter buttons and does not need it.

### SessionFilters

#### 1. Lines 51–61: filter chips cannot be operated with a keyboard; rule being violated: [2.1.1 Keyboard (A)](https://www.w3.org/TR/WCAG21/#keyboard)

- **Impact**

  The filters are `div` elements with `role="button"`. Only the first one is focusable (`tabIndex={0}`); the others have `tabIndex={-1}`, so Tab skips them. Even the first filter cannot be activated: a `div` does not turn Enter or Space into a click, so the `onClick` handler only responds to a mouse. Keyboard users cannot change the session filter at all. Screen reader users may still reach and activate the filters through the virtual cursor, which synthesizes clicks, but not with standard keyboard interaction.

- **Solution**

  Replace the `div` elements with native `<button type="button">`, which are focusable and respond to Enter and Space by default. Remove the manual `role`, `tabIndex` and the props spread. Arrow-key navigation is not needed here: the filters are a small set of independent buttons, not a composite widget.

#### 2. Lines 51–61: selected filter is indicated only visually; rule being violated: [4.1.2 Name, Role, Value (A)](https://www.w3.org/TR/WCAG21/#name-role-value)

- **Impact**

  The active filter differs from the others only by its filled background. Its state is not exposed programmatically, so screen readers announce three identical buttons and users cannot tell which filter is currently applied.

- **Solution**

  Add `aria-pressed={isSelected}` to each filter, so the active one is announced as "pressed" and the others as "not pressed".

#### 3. Line 46: Filter group has no accessible name (advisory); related criterion: [1.3.1 Info and Relationships (A)](https://www.w3.org/TR/WCAG21/#info-and-relationships)

- **Impact**

  The labels "Live only", "All sessions" and "Finished" do not say what they filter. Sighted users get this from the visual position above the list; screen reader users moving through the controls do not.

- **Solution**

  Add `role="group"` and `aria-label="Filter sessions"` to the container, so screen readers announce the group name when focus enters it.

### ScheduleList

#### 1. Lines 91–98: "Details" buttons share the same accessible name (advisory); related criterion: [2.4.6 Headings and Labels (AA)](https://www.w3.org/TR/WCAG21/#headings-and-labels)

- **Impact**

  Every session has a button named "Details". When screen reader users navigate by controls or list all buttons, they hear the same label repeatedly with no indication of which heat it expands.

- **Solution**

  Add visually hidden text with the session name (`<span className={css({ srOnly: true })}>, {session.name}</span>`), so the accessible name becomes "Details Heat 1". The name still starts with the visible label, which keeps the control compliant with [2.5.3 Label in Name](https://www.w3.org/TR/WCAG21/#label-in-name) for speech input users.

#### 2. Lines 62–77: list semantics may be removed in Safari (advisory); related criterion: [1.3.1 Info and Relationships (A)](https://www.w3.org/TR/WCAG21/#info-and-relationships)

- **Impact**

  WebKit drops the list role from lists styled with `list-style: none`, so VoiceOver users on macOS and iOS do not hear that the sessions form a list or how many items it has.

- **Solution**

  Add `role="list"` to the `<ul>` to restore the list semantics explicitly.

### ResultsTable

#### 1. Line 120: Bib sort button is labelled "Sort by rank"; rule being violated: [2.5.3 Label in Name (A)](https://www.w3.org/TR/WCAG21/#label-in-name)

- **Impact**

  Both sort buttons have `aria-label="Sort by rank"`, although the second one sorts by bib number. Screen reader users are told the wrong action, and speech input users cannot activate the button by saying its visible label ("Bib"), because the accessible name does not contain it.

- **Solution**

  Change the second button's label to `aria-label="Sort by bib"`.

#### 2. Current sort column and direction are not exposed; rule being violated: [1.3.1 Info and Relationships (A)](https://www.w3.org/TR/WCAG21/#info-and-relationships)

- **Impact**

  After sorting, nothing tells screen reader users which column the table is sorted by or in which direction. Sighted users get no visual indication either.

- **Solution**

  Add `aria-sort="ascending" | "descending"` to the header cell of the currently sorted column, derived from the existing `column` and `directions` state.

- **Note**

  Sighted users would also benefit from a visual sort indicator, e.g. a decorative arrow icon (`aria-hidden="true"`) next to the label showing the direction. It is not required by WCAG 2.1 and is left as a recommendation.

#### 3. Line 127: athlete column has an empty header; rule being violated: [1.3.1 Info and Relationships (A)](https://www.w3.org/TR/WCAG21/#info-and-relationships)

- **Impact**

  The third column has an empty `<th>`. Screen readers announce athlete names without a column label, and sighted users must infer what the column contains.

- **Solution**

  Add the header text "Athlete".

#### 4. Lines 139–141: qualification status is conveyed only by color; rules being violated: [1.4.1 Use of Color (A)](https://www.w3.org/TR/WCAG21/#use-of-color) and [1.3.1 Info and Relationships (A)](https://www.w3.org/TR/WCAG21/#info-and-relationships)

- **Impact**

  Every Status cell shows "—"; whether an athlete qualified or was eliminated is indicated only by a green or red background. Users with red–green color blindness cannot distinguish the two, and screen reader users hear "—" in every row.

- **Solution**

  Replace the mark with visible text ("Qualified" / "Eliminated") based on `row.standing`, keeping the background colors as a secondary cue.

#### 5. Lines 147–154: duplicate visually hidden table; related criterion: [1.3.1 Info and Relationships (A)](https://www.w3.org/TR/WCAG21/#info-and-relationships)

- **Impact**

  A second, visually hidden table with the same caption ("Heat results") and a single "—" cell is exposed only to screen readers. They encounter two tables with the same name, one of them meaningless.

- **Solution**

  Remove the redundant table.

#### 6. Line 102: horizontally scrollable table cannot be scrolled with a keyboard; rule being violated: [2.1.1 Keyboard (A)](https://www.w3.org/TR/WCAG21/#keyboard)

- **Impact**

  On narrow screens the table overflows and scrolls horizontally, but the scroll container is not focusable. Keyboard users cannot scroll to the columns outside the viewport.

- **Solution**

  Make the scroll container focusable and name it: `tabIndex={0}`, `role="region"`, `aria-labelledby` referencing the table caption.
