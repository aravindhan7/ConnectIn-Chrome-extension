document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button");
  const stopButton = document.getElementById("stop-button");

  let timerId;
  let tabId;

  const startConnect = () => {
    console.log("Start button clicked");
    console.log("Querying for buttons...");
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        function: () => {
          let connectButtons = document.querySelectorAll(
            "button[aria-label^='Invite']"
          );
          console.log("Found buttons:", connectButtons);
          let connectButtonsArray = Array.from(connectButtons);

          if (connectButtonsArray.length === 0) {
            console.log("No connect buttons found. Stopping script.");
            return;
          }

          connectButtonsArray.forEach((button) => {
            if (button.innerText === "Connect") {
              button.closest("button").click();
              console.log("Connect button clicked");
              setTimeout(() => {
                let sendButton = document.querySelector(
                  "button[aria-label='Send now']"
                );
                if (sendButton) {
                  sendButton.click();
                  console.log("Send button clicked");
                }
              }, 1000);
            }
          });
        },
      },
      () => {
        let waitTime = Math.floor(Math.random() * 5) + 5;
        timerId = setTimeout(startConnect, waitTime * 1000);
      }
    );
  };

  const stopConnect = () => {
    clearTimeout(timerId);
    startButton.disabled = false;
  };

  startButton.addEventListener("click", () => {
    startButton.disabled = true;
    stopButton.disabled = false;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      tabId = tabs[0].id;
      startConnect(tabId);
    });
  });

  stopButton.addEventListener("click", () => {
    stopButton.disabled = true;
    startButton.disabled = false;
    stopConnect();
  });
});
