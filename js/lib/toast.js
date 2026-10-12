let hideTimer;

/** Show a short message at the bottom of the screen. */
export const showToast = (message) => {
  const el = document.querySelector('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => el.classList.remove('show'), 2600);
};
