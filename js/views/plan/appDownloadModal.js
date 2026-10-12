import { sheet } from '../components/sheet.js';

/** Shown when someone picks "App notification" for a price alert. */
export const appDownloadModal = () =>
  sheet(`
    <div style="text-align:center">
      <span class="app-icon">R2R</span>
      <h2 style="margin:14px 0 6px">Get price alerts in the Rome2Rio app</h2>
      <p class="muted" style="margin-bottom:18px">App notifications are sent by the Rome2Rio app. Download it, sign in with the same account, and we’ll ping you the moment a fare drops.</p>
      <button class="btn btn-ink btn-block appstore" data-action="openAppStore">
        <svg class="appstore-glyph" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v11"/><path d="m7.5 10 4.5 4.5 4.5-4.5"/><path d="M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3"/></svg>
        <span style="text-align:left;line-height:1.1"><small style="display:block;font-size:11px;font-weight:400">Download on the</small>App Store</span>
      </button>
      <button class="link muted" style="margin-top:14px" data-action="closeModal">Maybe later</button>
    </div>`);
