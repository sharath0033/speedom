
var toggleButton
    ,   savedSpeedList = []
    ,   averageSpeed = []
    ,   tabIndex = ''
    ,   speedListHtml = ''

document.body.onload = function(){
    chrome.storage.sync.get('data', function(_items){
        browser.tabs.query({currentWindow: true, active:true}, function(_tabs){
            tabIndex = _.findIndex(_items.data, {tabId: _tabs[0].id});
            if(_tabs[0]!=undefined && tabIndex!=-1){
                _items.data[tabIndex].speedStamps.reverse();
                savedSpeedList = _items.data[tabIndex];
                init();
                buildSpeedList();
            }else{
                init();
                setNoData();
            }
        });
    });
}

function init(){
    $('#switchBtn').on('click', function(){
        if($('#speedList').is(':visible')) {
            $('#speedList, #saveBtn').hide();
            $('#aboutSpeedom').show();
            $(this).removeClass('rotateToggle');
        } else {
            $('#aboutSpeedom').hide();
            $('#speedList, #saveBtn').show();
            $(this).addClass('rotateToggle');
        }
    });

    $('#saveBtn').on('click', function(){
        saveData();
    });
}

function buildSpeedList() {
    $('.appendList').remove();
    averageSpeed = 0;
    speedListHtml = '<span class="appendList">\
                        <div class="infoGroup">\
                            <div>Avg DOM Speed:<span id="avgSpeed">10sec</span></div>\
                        </div>';
        _.each(savedSpeedList.speedStamps, function(item) {
            averageSpeed = averageSpeed+item.domSpeed;
            speedListHtml += '<div class="listGroup">\
                                    <div class="speedNumber"><span class="label">DOM Speed: </span>'+item.formattedDomSpeed+'</div>\
                                    <div class="container">\
                                        <div class="timeStamp"><span class="label">&nbsp;Timestamp: </span>'+item.timeStamp+'</div>\
                                    </div>\
                                </div>';
        });
        speedListHtml += '</span>';
        averageSpeed = new Date(averageSpeed/savedSpeedList.speedStamps.length);
    $(speedListHtml).appendTo('#speedList');
    $('#avgSpeed').text(averageSpeed.getUTCMinutes()+' m : '+averageSpeed.getUTCSeconds()+' s : '+averageSpeed.getMilliseconds()+' ms');
}

function setNoData(){
    $('#speedList').append('<div id="noData"><div>Empty Road?</div><div>This page is not supported by the extension.</div></div>');
}

function saveData(){
    console.log("Data Saved", savedSpeedList);
}