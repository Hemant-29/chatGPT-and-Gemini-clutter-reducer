// __________________WORKING OLD CODE_______________________________

// function cleanChatGPT() {
//   // 🧹 Remove header
//   const header = document.querySelector("header#page-header");
//   if (header) {
//     header.remove();
//     console.log("✅ ChatGPT header removed.");
//   }

//   // 🧹 Remove disclaimer/footer
//   const disclaimer = document.querySelector(
//     'div.text-token-text-secondary.relative.mt-auto.flex.min-h-8.w-full.items-center.justify-center.p-2.text-center.text-xs'
//   );
//   if (disclaimer) {
//     disclaimer.remove();
//     console.log("✅ ChatGPT footer disclaimer removed.");
//   }
// }

// function cleanGemini() {
//   // 🧹 Remove Gemini clutter
//   const selectors = [
//     "header",
//     "footer",
//     "div[role='banner']",
//     "div[data-test-id='gemini-promo']",
//     "hallucination-disclaimer",
//     "div.desktop-ogb-buffer"
//   ];

//   selectors.forEach(sel => {
//     document.querySelectorAll(sel).forEach(el => {
//       el.remove();
//       console.log(`✅ Removed Gemini element: ${sel}`);
//     });
//   });
// }

// function modifyPage() {
//   const url = location.hostname;

//   if (url.includes("chat.openai.com") || url.includes("chatgpt.com")) {
//     cleanChatGPT();
//   } else if (url.includes("gemini.google.com")) {
//     cleanGemini();
//   }
// }

// // Run immediately
// modifyPage();

// // Observe for SPA updates
// const observer = new MutationObserver(modifyPage);
// observer.observe(document.body, { childList: true, subtree: true });

// _____________________________________________________________________

// content.js

// default: do NOT keep header (i.e., remove header by default)
let keepHeader = false;

function cleanChatGPT() {
  // 🧹 Remove header (only if user hasn't chosen to keep it)
  const header = document.querySelector("header#page-header");
  if (header && !keepHeader) {
    header.remove();
    console.log("✅ ChatGPT header removed.");
  } else if (header && keepHeader) {
    // header present and user wants to keep it -> do nothing
  }

  // 🧹 Remove disclaimer/footer
  const disclaimer = document.querySelector(
    'div.text-token-text-secondary.relative.mt-auto.flex.min-h-8.w-full.items-center.justify-center.p-2.text-center.text-xs'
  );
  if (disclaimer) {
    disclaimer.remove();
    console.log("✅ ChatGPT footer disclaimer removed.");
  }
}

function cleanGemini() {
  // 🧹 Remove Gemini clutter
  const selectors = [
    "header",
    "footer",
    "div[role='banner']",
    "div[data-test-id='gemini-promo']",
    "hallucination-disclaimer",
    "div.desktop-ogb-buffer"
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.remove();
      console.log(`✅ Removed Gemini element: ${sel}`);
    });
  });

  // (If you previously added grid-template disabling, keep it here if needed)
  // small selector for Gemini input container override (optional)
  const inputSel = 'div.text-input-field.with-toolbox-drawer';
  const el = document.querySelector(inputSel);
  if (el) {
    // no-op here unless you want to override CSS — left out to preserve minimal changes
  }
}

function modifyPage() {
  const url = location.hostname;
  if (url.includes("chat.openai.com") || url.includes("chatgpt.com")) {
    cleanChatGPT();
  } else if (url.includes("gemini.google.com")) {
    cleanGemini();
  }
}

// Start: load stored setting, then run modifyPage and set up observer
chrome.storage.local.get({ keepHeader: false }, (res) => {
  keepHeader = !!res.keepHeader;
  modifyPage();

  // Observe for SPA updates
  const observer = new MutationObserver(modifyPage);
  observer.observe(document.body, { childList: true, subtree: true });
});

// Listen for changes made by popup
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if ("keepHeader" in changes) {
    keepHeader = !!changes.keepHeader.newValue;
    // If user chose to keep the header but it was already removed, reload to restore it
    if (keepHeader) {
      // Reloading is the simplest way to restore removed DOM nodes reliably
      console.log("Keep header enabled — reloading page to restore header.");
      location.reload();
    } else {
      // If user disabled keeping, remove header immediately (if present)
      modifyPage();
    }
  }
});
