browser.runtime.onMessage.addListener(function(_request){
    if(_request.startClockTab){
        var startTime = 0;
        var endTime = 0;
        var speed = 0;
        startTime = window.performance.now();

        document.addEventListener('DOMContentLoaded', function(){ 
            endTime = window.performance.now();
            speed = new Date(endTime - startTime)
            browser.runtime.sendMessage({
                tabId: _request.startClockTab,
                speedStamps:[{
                    formattedDomSpeed: (speed.getUTCMinutes()+' <span class="suffix">min</span> : '+speed.getUTCSeconds()+' <span class="suffix">sec</span> : '+speed.getMilliseconds()+' <span class="suffix">ms</span>'),
                    domSpeed: endTime - startTime,
                    timeStamp: new Date().toLocaleString().split(', ')[1]
                }]
            });
        }, false);
    }
});