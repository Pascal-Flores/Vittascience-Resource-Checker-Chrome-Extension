import { Action } from "./modules/Action";

document.addEventListener("DOMContentLoaded", async () => {
    let tabUrl = (await getCurrentTab()).url!
    if (tabUrl?.match(/https:\/\/.*\.vittascience\.com\/learn.*/gm)?.length != null) {
        document.querySelector("#popup-content")!.innerHTML = `
        <button id="scan">Lancer un scan des ressources</button>
        <button id="checkResource" />Checker la première ressource de la page</button>
        <button id="checkAllResources">Checker toutes les ressources</button>
        `
        document.querySelector("#scan")!.addEventListener("click", getAllResources)
        document.querySelector("#checkResource")!.addEventListener("click", checkResource)
        document.querySelector("#checkAllResources")!.addEventListener("click", checkAllResources)
    }
    else {
        document.querySelector("#popup-content")!.innerHTML = `
        <p>La page n'est pas supportée. Pour réaliser un check des ressources, veuillez vous rendre sur la page suivante :</p>
        <br/>
        <a href="https://vittascience.com/learn/" target="_blank">Centre de ressources de Vittascience</a>`
    }

})

async function getCurrentTab() : Promise<chrome.tabs.Tab> {
    return (await chrome.tabs.query({active:true, currentWindow:true}))[0]
}

async function getAllResources() {
    const resources = await chrome.tabs.sendMessage((await getCurrentTab()).id!, Action.getAllResources)
    alert(`${resources.length} ressources ont été trouvées.`)
}

async function checkResource() {
    await chrome.tabs.sendMessage((await getCurrentTab()).id!, Action.checkResource)
}

async function checkAllResources() {
    await chrome.tabs.sendMessage((await getCurrentTab()).id!, Action.checkAllResources)
}