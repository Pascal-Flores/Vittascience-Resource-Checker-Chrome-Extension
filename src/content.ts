import { Action } from "./modules/Action";

chrome.runtime.onMessage.addListener((message : Action) => {
    switch (message) {
        case Action.getAllResources:
            getAllResources()
    }
});

function getAllResources () {
    console.log('not implemented')
}