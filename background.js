
function show(notification, timeTill, nextPeriod) {
    notification = window.webkitNotifications.createNotification(
    '48.png',  // The image.
    timeTill + ' min',  // The title.
    '... until ' + nextPeriod // The body. 
    );
    notification.show();
    return notification;
}

var notificationTimes = new Array(0, 1, 2, 3, 4, 5, 6, 7, 10, 15, 20, 30);
//creates blank notification
var notification = window.webkitNotifications.createNotification(
'48.png',  // The image.
'blank',  // The title.
'blank' // The body.

);

function update() 
{
    //dont want to query server off hours
    var nowHours = new Date().getHours();
    if(nowHours>6 && nowHours < 16)
    {
    try 
    {
        notification.cancel();
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://lion-time.appspot.com/timeinfo", true);
  
        xhr.onreadystatechange = function() {
            
            if (xhr.readyState == 4) {
                var timeCorrection = (60 - new Date().getSeconds()) * 1000;
                var result = xhr.responseText;
                var timeTill = parseInt(result.split(",")[0]);
                var period = result.split(",")[1];
                if (notificationTimes.indexOf(timeTill) != -1)  //checks if it is time to show a notification
                {
                    notification = show(notification, timeTill, period);
                }
                setTimeout(function() {
                    notification.cancel();
                }, 10000);
                setTimeout(function() {
                    update();
                }, timeCorrection);
            }
        
        
        
        }
        xhr.send();
    } 
    catch (err)  //no internet
    {
        var timeCorrection = (60 - new Date().getSeconds()) * 1000;
        setTimeout(function() {
            notification.cancel();
        }, 10000);
        setTimeout(function() {
            update();
        }, timeCorrection);
    }
    }
}
update();
