document.addEventListener("DOMContentLoaded", () => {
    const memo = document.getElementById("memo");
    const save = document.getElementById("save");
  
    // 현재 탭의 URL을 키로 사용해서 저장된 메모를 불러옵니다.
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      chrome.storage.local.get(url, (data) => {
        // 배열이 아니면 빈 배열로 초기화
        const memoList = Array.isArray(data[url]) ? data[url] : [];
        memo.value = ""; // 최근 메모 내용을 보여주지 않습니다.
      });
    });
  
    // 메모를 저장하는 함수
    function saveMemo() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        chrome.storage.local.get(url, (data) => {
          // 배열이 아니면 빈 배열로 초기화
          const memoList = Array.isArray(data[url]) ? data[url] : [];
          memoList.push(memo.value); // 새로운 메모를 추가
  
          // 업데이트된 메모 배열을 저장
          chrome.storage.local.set({ [url]: memoList }, () => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else {
              alert("Memo saved!");
              memo.value = "";
              window.close();
            }
          });
        });
      });
    }
  
    // 저장 버튼을 누르면 메모를 저장합니다.
    save.addEventListener("click", saveMemo);
  
    // cmd+enter 또는 ctrl+enter가 눌리면 메모를 저장합니다.
    memo.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Enter") {
        saveMemo();
      }
    });
  
    // 자동으로 텍스트 필드에 포커스를 줍니다.
    memo.focus();
  });
  