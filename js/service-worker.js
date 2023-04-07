importScripts('../packages/uuidv4.min.js', 'action-items-utils.js');

const actionItemUtils = new ActionItems();


chrome.runtime.onInstalled.addListener((details) => {
    if(details.reason == 'install'){
        chrome.storage.sync.set({
            actionItems: []
        })
    }
})

chrome.contextMenus.create({
    "id": "linkSiteMenu",
    "title": "Link site for later",
    "contexts": ["all"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if(info.menuItemId == "linkSiteMenu"){
        actionItemUtils.addQuickActionItem('quick-action-2', "Read this site", tab, ()=>{
            actionItemUtils.setProgress();
        });
    }
});
