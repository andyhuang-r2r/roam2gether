/** Centered dialog with a scrim and a close button. */
export const sheet = (content) => `
  <div class="scrim" data-action="closeModal"></div>
  <div class="sheet"><button class="close" data-action="closeModal">✕</button>${content}</div>`;
