chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local") {
      chrome.runtime.sendMessage({ type: "memoUpdated" });
    }
  });
  