document.addEventListener("DOMContentLoaded", () => {
    const memoList = document.getElementById("memoList");
  
// 메모를 삭제하는 함수
    function deleteMemo(url, index) {
        chrome.storage.local.get(url, (data) => {
        const memos = Array.isArray(data[url]) ? data[url] : [];
        memos.splice(index, 1);
        if (memos.length === 0) {
            // 모든 메모가 삭제되면 해당 URL도 삭제
            chrome.storage.local.remove(url, () => {
            updateMemoList();
            });
        } else {
            chrome.storage.local.set({ [url]: memos }, () => {
            updateMemoList();
            });
        }
        });
    }
  
// 메모 목록을 업데이트하는 함수
function updateMemoList() {
    memoList.innerHTML = "";  // 기존 목록을 초기화
    chrome.storage.local.get(null, (items) => {
      for (const [url, memos] of Object.entries(items)) {
  
        const listItem = document.createElement("li");
        listItem.className = "memo-item";
        memoList.appendChild(listItem);
  
        const memoContainer = document.createElement("div");
        memoContainer.className = "memo-container";
        listItem.appendChild(memoContainer);
  
        memos.forEach((memo, index) => {
          const singleMemoDiv = document.createElement("div");
          singleMemoDiv.className = "single-memo";
  
          const memoText = document.createElement("span");
          memoText.textContent = memo;
          singleMemoDiv.appendChild(memoText);
  
          const deleteButton = document.createElement("button");
          deleteButton.className = "delete-button";
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", () => deleteMemo(url, index));
          singleMemoDiv.appendChild(deleteButton);
  
          memoContainer.appendChild(singleMemoDiv);
        });
  
        const urlDiv = document.createElement("div");
        urlDiv.className = "url";
        const urlLink = document.createElement("a");
        urlLink.setAttribute("href", url);
        urlLink.setAttribute("target", "_blank");  // 새 창에서 링크 열기
        urlLink.textContent = url;
        urlDiv.appendChild(urlLink);
        listItem.appendChild(urlDiv);
  
      }
    });
  }
  
    // 페이지가 로드되면 메모 목록을 불러옵니다.
    updateMemoList();
  
    // 백그라운드 스크립트로부터 메시지를 수신하면 메모 목록을 업데이트합니다.
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "memoUpdated") {
        updateMemoList();
      }
    });
  });
  