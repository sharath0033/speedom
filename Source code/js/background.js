let tabId;
let tabIndex;
function calclateDomTime(){
    browser.tabs.query({currentWindow: true, active:true}, function(_tabs){
        if(_tabs[0]!=undefined && _tabs[0].url!=undefined && _tabs[0].status=="loading"){
            if(_tabs[0].id!=tabId){
                tabId = _tabs[0].id;
                browser.tabs.sendMessage(_tabs[0].id, {startClockTab: tabId});
            }else{
                tabId = '';
            }
        }
    });
}

function updateSpeedomList(_newList){
    browser.storage.sync.set({'data': _newList});
}

browser.runtime.onMessage.addListener(function(_response){
    if(_response.tabId!=undefined){
        browser.storage.sync.get('data', function(_items){
            tabIndex = _.findIndex(_items.data, {tabId: _response.tabId});
            if(tabIndex != -1){
                _items.data[tabIndex].speedStamps.push(_response.speedStamps[0]);
            }else{
                _items.data.push(_response);
            }
            updateSpeedomList(_items.data);
        });
    }
});

browser.tabs.onRemoved.addListener(function(_removedTabInfo){
    browser.storage.sync.get('data', function(_items){
        tabIndex = _.findIndex(_items.data, {tabId: _removedTabInfo});
        if(tabIndex != -1){
            _items.data.splice(tabIndex, 1);
            updateSpeedomList(_items.data);
        }
    });
});

browser.tabs.onUpdated.addListener(calclateDomTime);

browser.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install" || details.reason == "update") {
        updateSpeedomList([]);
    }
})