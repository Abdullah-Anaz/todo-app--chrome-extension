class ActionItems {
    addQuickActionItem = (id, text, tab, callback) =>{
       let website = null;
       
        if(id == 'quick-action-2'){
            website = {
                url: tab.url,
                fav_icon: tab.favIconUrl,
                title: tab.title
            }
        }
        

        this.add(text, website, callback);
    }

    add = (text, website=null, callback) => {
        let actionItem = {
            id: uuidv4(),
            added: new Date().toString(),
            text: text,
            completed: null,
            website: website
        }
    
        chrome.storage.sync.get(["actionItems"]).then((data) => {
            let items = data.actionItems;
            if (!items) {
                items = [actionItem]
            } else {
                items.push(actionItem)
            }
    
            chrome.storage.sync.set({
                actionItems: items
            }).then(() => {
                callback(actionItem);
            });
        });
    
    }


    remove = (id, callback) => {
        chrome.storage.sync.get(["actionItems"]).then((data) => {
            let items = data.actionItems;
            let foundItemIndex = items.findIndex((item)=> item.id == id);
            if(foundItemIndex >= 0){
                items.splice(foundItemIndex, 1);
                chrome.storage.sync.set({
                    actionItems: items
                }).then(() => {
                    callback();
                });
            }
        });
    }

    markUnmarkCompleted = (id, completeStatus) => {
        chrome.storage.sync.get(["actionItems"]).then((data) => {
            let items = data.actionItems;
            let foundItemIndex = items.findIndex((item)=> item.id == id);
            if(foundItemIndex >= 0){
                items[foundItemIndex].completed = completeStatus;
                chrome.storage.sync.set({
                    actionItems: items
                })
            }
        });
    }

    setProgress = () => {
        chrome.storage.sync.get(["actionItems"]).then((data) => {
            let actionItems = data.actionItems;
            let completedItems = actionItems.filter(item => item.completed).length;
            let totalItems = actionItems.length;
    
            let progress = 0;
    
            if(totalItems > 0) progress = completedItems / totalItems;
            
            if(typeof circle !== "undefined") circle.animate(progress);

            this.setBrowserBadge(totalItems - completedItems);
        });
    }

    setBrowserBadge = (todoItems) => {
        let text = `${todoItems}`
        if (todoItems > 9){
            text = '9+'
        }
        chrome.action.setBadgeText({text: text});
    }

    saveName = (name, callback) => {
        chrome.storage.sync.set({
            name: name
        }).then(() => {
            callback(name);
        })
    }
}
