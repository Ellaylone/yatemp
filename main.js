function get_browser_info(){
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)\.(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name:'IE',version:(tem[1]||'')};
    }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version: parseFloat(tem[1] + "." + tem[2])};}
    }
    M=M[2]? [M[1], M[2], M[3]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
        name: M[0],
        version: parseFloat(M[1] + "." + M[2])
    };
}

// Check if browser supports string repeat
if(typeof "test".repeat === "undefined"){
    String.prototype.repeat = function(count) {
        if (count < 1) return '';
        var result = '', pattern = this.valueOf();
        while (count > 1) {
            if (count & 1) result += pattern;
            count >>= 1, pattern += pattern;
        }
        return result + pattern;
    };
}

// If browser does not support 2D Transforms - split text and show it one letter at a time
var brReplace = "##";
function verticalSplit(){
    var ths = document.getElementsByClassName("rotate-demo");
    if(ths.length > 0){
        for(var i = 0; i < ths.length; i++){
            var temp = ths[i].innerHTML.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
            temp = temp.replace(/\<[bB][rR]\s{0,1}\\{0,1}\>/g, brReplace);
            if(temp.indexOf(brReplace) >= 0){
                temp = temp.split(brReplace);
            }
            if(typeof temp === "string"){
                temp = temp.split("").join("<br />");
            } else {
                if(temp.length > 0){
                    var cleanTemp = [];
                    for(var j = 0; j < temp.length; j++){
                        temp[j] = temp[j].split("").join("<br />");
                        temp[j] = "<div class='pull-left th-part'>" + temp[j] + "</div>";
                    }
                    temp = temp.join("");
                }
            }
            var clear = document.createElement("div");
            clear.className = "clear";
            ths[i].innerHTML = temp;
            ths[i].appendChild(clear);
        }
    }
}

// In some browsers after rotation th keeps original width
// Compensate with negative margin
var lineHeight = 20;
function adaptMargin(){
    if(document.getElementsByClassName){
        var ths = document.getElementsByClassName("rotate-demo");
        if(ths.length > 0){
            for(var i = 0; i < ths.length; i++){
                var th = ths[i];
                var marginValue = (th.offsetWidth - lineHeight) / 2;
                var margin = (marginValue > 0 ? "-" + marginValue + "px" : "0px");
                if(th.style.setAttribute){
                    th.style.setAttribute("marginLeft", margin);
                    th.style.setAttribute("marginRight", margin);
                } else {
                    th.setAttribute("style", "margin-left:" + margin + "; margin-right:" + margin);
                }
            }
        }
    }
}


// Adjust th size
function adjustTh(){
    var ths = document.getElementsByTagName("th");
    if(ths.length > 0){
        var thHeight = ths[0].offsetHeight + "px";
        for(var i = 0; i < ths.length; i++){
            if(ths[i].getElementsByClassName){
                var rd = ths[i].getElementsByClassName("rotate-demo")[0];
                ths[i].setAttribute("style",
                                    "height:" + rd.offsetWidth + "px;" +
                                    "width:" + rd.offsetHeight + "px;"
                                   );
            } else {
                // IE7 needs adjusting inner div height
                ths[i].children[0].children[0].style.setAttribute("height", thHeight);
                ths[i].setAttribute("style",
                                    "height:" + ths[i].children[0].children[0].offsetWidth + "px;" +
                                    "width:" + ths[i].children[0].children[0].offsetHeight + "px;"
                                   );
            }
        }
    }
}

function adjustments(){
    adaptMargin();
    adjustTh();
}

var browserInfo = get_browser_info();

switch(browserInfo.name){
case "Firefox":
    // FF 3.5 starts using 2D Transforms
    if(browserInfo.version < 3.5){
        verticalSplit();
    } else {
        adjustments();
    }
    break;
case "Opera":
    // Opera 11.5 starts using 2D Transforms
    if(browserInfo.version < 11.5){
        verticalSplit();
    } else {
        adjustments();
    }
    break;
case "MSIE":
    if(browserInfo.version != 8){
        adjustments();
    }
default:
    break;
}
