/** Trip Lead-only actions (invite + results screens). */
export const toolbox = () => `
  <div class="toolbox">
    <h3>Trip Lead toolbox</h3>
    <p>Only you can see this. Your group just sees the fun bits.</p>
    <div class="tb">
      <button data-action="openNudge">👋 Nudge the group</button>
      <button data-action="openLockShortlist">📌 Lock a shortlist</button>
      <button data-action="openLateArrival">➕ Add a late arrival</button>
      <button data-action="openStartOver">🔄 Start over with a new brief</button>
    </div>
  </div>`;
