console.log("Background script loaded");
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message, "from:", sender);
  sendResponse({ status: "ok" });
  return true;
});
chrome.runtime.onConnect.addListener(function(port) {
  console.log("Port connected:", port);
});
//# sourceMappingURL=background.ts.js.map
