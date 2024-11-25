import { Action } from "./modules/Action";
import { Resource } from "./modules/Resource";
import {Report, DeadImage, DeadEmbedEditor} from "./modules/Report"


let LOGGING = true

chrome.runtime.onMessage.addListener((message : Action, _, sendResponse) => {
    let returnValue = false
    switch (message) {
        case Action.getAllResources:
            getAllResources().then((resources: string[]) => {
                sendResponse(resources)
                
            })
            returnValue = true
            break
        case Action.checkResource:
            checkResource(document.querySelector(".tutorial-item-link")!.getAttribute("href")!)
            break
        case Action.checkAllResources:
            getAllResources().then((resourcesLinks) => {
                checkAllResources(resourcesLinks)
            })
            break
        case Action.toggleLoggingMode:
            LOGGING = !LOGGING
            break
        case Action.getLoggingMode:
            sendResponse(LOGGING)
            returnValue = true
            break

    }
    return returnValue
});

function generateResourceLink(resourceId: number) : string {
    return `https://fr.vittascience.com/learn/tutorial.php?id=${resourceId}`
}

async function getAllResources () : Promise<string[]>{
    let page = 1
    let resources : string[] = []
    while (true) {
        let bodyData = new URLSearchParams()
        bodyData.append("page", page.toString())

        let pageResources : Resource[] = (await (await fetch("https://fr.vittascience.com/routing/Routing.php?controller=course&action=get_by_filter", {
            method  : "POST",
            headers : {"Content-Type" : "application/x-www-form-urlencoded"},
            body    : bodyData
        })).json())
        if (!pageResources || pageResources.length === 0) break;
        else {
            for (let pageResource of pageResources) {
                resources.push(generateResourceLink(pageResource["id"]))
            }
        }
        page += 1
    }
    return resources
}
async function checkAllResources (resourcesLinks : string[]) : Promise<Report[]> {
    let reports : Report[] = []
    for (let resourceLink of resourcesLinks) {
        const maybeReport = (await checkResource(resourceLink))
        if (maybeReport != null)
            reports.push(maybeReport)
    }

    return reports
}

async function checkResource (resourceLink : string) : Promise<Report | null> {
    if (LOGGING) console.log(`Checking resource ${resourceLink}`)
    let maybeReport : Report | null = null
    const iframe = await createResourceIframe(resourceLink)
    const iframeDocument = iframe.contentDocument
    if (iframeDocument) {
        const deadImages = await checkResourceImages(iframeDocument)

    }
    iframe.remove()
    return maybeReport
}

async function createResourceIframe(resourceLink : string) : Promise<HTMLIFrameElement> {
    return new Promise<HTMLIFrameElement>((resolve) => {
        const iframe = document.createElement('iframe')
        iframe.style.opacity = '0';
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.src = resourceLink
        iframe.id = "temp-iframe"
        document.body.appendChild(iframe)
        iframe.addEventListener("load", () => {
            resolve(iframe)
        })
    }) 
}

async function checkAndRetry(condition : () => boolean, maxRetries : number, time : number, message ?: string) : Promise<boolean> {
    async function wait(ms : number) {
        return new Promise (resolve => setTimeout(resolve, ms))
    }
    let retries = 0
    while (retries < maxRetries) {
        retries += 1
        if (condition()) {
            if (LOGGING) console.log(`${message} Nouvel essai... (${retries}/${maxRetries})`)
            await wait(time)
        }
        else
            break
    }
    return !(retries === maxRetries)
}

async function checkResourceImages(iframeDocument : Document) : Promise<DeadImage[]> {
    const anyImages = await checkAndRetry(() => {return iframeDocument.querySelectorAll(".img-fluid").length === 0}, 10, 500, "    Pas d'images trouvées.")
    if (!anyImages) {
        if (LOGGING) console.log(`    Pas d'images trouvées pour la ressource.`)
        return []
    }
    else {
        let deadImages : DeadImage[] = []
        for (let imageElement of iframeDocument.querySelectorAll(".img-fluid")) {
            if (LOGGING) console.log(`    ${imageElement.getAttribute("src")!} ==> Image trouvée`)
            const imageLink = imageElement.getAttribute("src")
            if ((await fetch(imageLink!)).status >=400) {
                deadImages.push({
                    parentSection : imageElement.closest(".tutorial-part")!.querySelector("h3 > span:[style]")!.textContent!,
                    title : imageElement.getAttribute("title")!,
                    src : imageElement.getAttribute("src")!
                })
                if (LOGGING) console.log(`    ${imageElement.getAttribute("src")!} ==> Lien mort, ajout à la liste`)
            }
            else if (LOGGING) console.log(`    ${imageElement.getAttribute("src")!} ==> Lien valide, RAS`)
        }
        return deadImages
    }
}