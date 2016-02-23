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

// If browser does not support 2D Transforms - split text and show it one letter at a time
function verticalSplit(){
    var ths = document.getElementsByClassName("rotate-demo");
    if(ths.length > 0){
        for(var i = 0; i < ths.length; i++){
            ths[i].innerHTML = ths[i].innerHTML.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '').split("").join("<br />");
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

var browserInfo = get_browser_info();

// Fallback for oldest and weirdest
switch(browserInfo.name){
case "Firefox":
    // FF 3.5 starts using 2D Transforms
    if(browserInfo.version < 3.5){
        verticalSplit();
    }
    break;
case "Opera":
    // Opera 11.5 starts using 2D Transforms
    if(browserInfo.version < 11.5){
        verticalSplit();
    }
    break;
default:
    break;
}

adaptMargin();
