document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({active: true, currentWindow : true}).then((tabs : chrome.tabs.Tab[]) => {
        let tabUrl = tabs[0].url;
        let popupContent = ""
        if (tabUrl?.match(/https:\/\/.*\.vittascience\.com\/learn.*/gm)?.length != null) {
            popupContent = "La page est supportée youhou"
        }
        else {
            popupContent = "La page n'est pas supportée. C'est trop triste"
        }
        document.querySelector("#popup-content")!.innerHTML = popupContent

    });
})