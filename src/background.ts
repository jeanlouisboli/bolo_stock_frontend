// This is the background script for the Chrome extension
console.log("Background script loaded");

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message, "from:", sender);
  sendResponse({ status: "ok" });
  return true;
});

// Keep service worker alive
chrome.runtime.onConnect.addListener(function (port) {
  console.log("Port connected:", port);
});

// Export empty object to make it a module
export {};
