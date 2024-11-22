import { Action } from "./modules/Action";
import { Resource } from "./modules/Resource";

chrome.runtime.onMessage.addListener((message : Action, _, sendResponse) => {
    switch (message) {
        case Action.getAllResources:
            getAllResources().then((resources: string[]) => {
                sendResponse(resources)
            })
    }
    return true
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