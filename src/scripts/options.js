

chrome.storage.local.get("api_key").then((result) => {
    console.log({result});
    console.log("Value currently is " + result.api_key);
    document.getElementById("api_key").value = result.api_key || "";
  });

document.getElementById("save").addEventListener("click", (e) => {
    let api_key = document.getElementById("api_key").value;
    chrome.storage.local.set({ "api_key": api_key }).then(() => {
        document.getElementById('save').innerText = 'saved';
      });
})