
var toggleButton
    ,   savedSpeedList = []
    ,   averageSpeed = []
    ,   tabIndex = ''
    ,   speedListHtml = ''

document.body.onload = function(){
    getData();
}

browser.storage.onChanged.addListener(getData);

function getData(){
    browser.storage.sync.get('data', function(_items){
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
    JSONToXls(savedSpeedList.speedStamps);
}

function JSONToXls(_data) {
    var labelData = ['DOM speed', 'Timestamp'];
    var CSV = '';
    var fileName = "MyReport_";
    var averageSpeed = 0;

    var date = new Date().toLocaleDateString("en-US",{year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'}).replace(' ','_').replace(/ /g,'').replace(/,/g,'_');
    //var fileName1 = fileName + '' 
    CSV += fileName + date + '\r\n\n';

    var labelRow = "";
    for (var index in labelData) {
        labelRow += labelData[index] + ',';
    }
    labelRow = labelRow.slice(0, -1);
    CSV += labelRow + '\r\n';
    
    for (var i = 0; i < _data.length; i++) {
        var row = "";

        for (var index in _data[i]) {
            if(index != 'formattedDomSpeed'){
                if(index == 'domSpeed'){
                    var speed = new Date(_data[i][index])
                    row += '"' + speed.getUTCMinutes()+' min : '+speed.getUTCSeconds()+' sec : '+speed.getMilliseconds()+' ms' + '",';
                    averageSpeed = averageSpeed+_data[i][index];
                }else{
                    row += '"' + _data[i][index] + '",';
                }   
            }
        }

        row.slice(0, row.length - 1);
        CSV += row + '\r\n';
    }
    
    averageSpeed = new Date(averageSpeed/_data.length)

    CSV += '\n'+"Average DOM load speed:, " + averageSpeed.getUTCMinutes()+' min : '+averageSpeed.getUTCSeconds()+' sec : '+averageSpeed.getMilliseconds()+' ms' + '\r\n';

    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    browser.downloads.download({
        url : uri,
        filename : fileName+'.csv',
        saveAs : true
      });
}