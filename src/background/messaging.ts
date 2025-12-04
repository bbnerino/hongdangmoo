// 활성화된 탭에만 메시지 전송
export function sendMessageToActiveTab(message: any): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.log('[Hongdangmoo BG] No active tab found');
      return;
    }

    const activeTab = tabs[0];
    if (!activeTab.id || !activeTab.url) {
      console.log('[Hongdangmoo BG] Active tab has no id or url');
      return;
    }

    // chrome:// 페이지는 제외
    if (activeTab.url.startsWith('chrome://') || activeTab.url.startsWith('chrome-extension://')) {
      console.log('[Hongdangmoo BG] Active tab is chrome:// page, skipping');
      return;
    }

    console.log(`[Hongdangmoo BG] Sending message to active tab ${activeTab.id}`);
    chrome.tabs.sendMessage(activeTab.id, message)
      .then(() => {
        console.log(`[Hongdangmoo BG] Message sent successfully to tab ${activeTab.id}`);
      })
      .catch((error) => {
        // content script가 아직 로드되지 않은 경우
        console.log(`[Hongdangmoo BG] Failed to send message: ${error.message}`);
      });
  });
}

