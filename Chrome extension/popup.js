// popup.js
const checkbox = document.getElementById("keepHeader");

// initialize checkbox state from storage
chrome.storage.local.get({ keepHeader: false }, (res) => {
  checkbox.checked = !!res.keepHeader;
});

// when toggled, save setting
checkbox.addEventListener("change", () => {
  const value = !!checkbox.checked;
  chrome.storage.local.set({ keepHeader: value }, () => {
    // optional: show brief visual feedback (not necessary)
    console.log("keepHeader set to", value);
  });
});
