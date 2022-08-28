//Powered By Yorushi & Yowot
//定义烈度配色
const intColor = {
    "1": {
        "bkcolor": "#9bc4e4"
    },
    "2": {
        "bkcolor": "#00a0f1"
    },
    "3": {
        "bkcolor": "#0062f5"
    },
    "4": {
        "bkcolor": "#2de161"
    },
    "5": {
        "bkcolor": "#1cac5d"
    },
    "6": {
        "bkcolor": "#bdb93b"
    },
    "7": {
        "bkcolor": "#ffba3d"
    },
    "8": {
        "bkcolor": "#c38b2c"
    },
    "9": {
        "bkcolor": "#c75622"
    },
    "10": {
        "bkcolor": "#ff000d"
    },
    "11": {
        "bkcolor": "#c20007"
    },
    "12": {
        "bkcolor": "#fd2fc2"
    }
};

//第一行
function getMainData() {
    $.getJSON("https://api.projectbs.cn/cenc/get_data.json?" + new Date().getTime(), function(json) {
        mainType = json.CENC.type;
        mainDepth = json.CENC.depth;
        mainEpicenter = json.CENC.epicenter;
        mainStartAt = json.CENC.startAt;
        mainMagnitude = json.CENC.magnitude;
        mainMaxInt = calcMaxInt(mainMagnitude, mainDepth);
        if (mainType == "自动") mainDepth = "?";
        //startAt 转换
        mainStartAt = mainStartAt.replace("月", "/");
        mainStartAt = mainStartAt.replace("日", " ")
        mainStartAt = mainStartAt.replace("时", ":")
        mainTime = mainStartAt.replace("分", "")
            //写入数据
        $("#mainTime").text(mainTime);
        $("#mainEpicenter").text(mainEpicenter);
        document.getElementById("mainDepth").innerHTML = mainDepth + '<font size="3">&nbsp;km</font>';
        document.getElementById("mainMagnitude").innerHTML = '<font size="4">M</font>' + mainMagnitude;
        $("#mainMaxInt").css("background-color", intColor[mainMaxInt].bkcolor);
        $("#mainMaxInt").text(mainMaxInt);
    })
};

//剩下的行
for (ii = 4; ii <= 50; ii++) {
            $("#subBar" + Number(ii - 1)).after('<div id="subBar' + ii + '"><div id="subLeft' + ii + '"><div id="subTime' + ii + '">01/01 00:00</div><div id="subEpicenter' + ii + '">载入中</div><div id="subMagnitude' + ii + '">M0.0</div></div><div id="subMaxInt' + ii + '">-</div></div>')
};

function getSubData() {
    $.getJSON("https://api.wolfx.jp/cenc_eqlist.json?" + new Date().getTime(), function(json) {
        for (i = 2; i <= 50; i++) {
            subTime = eval("json.No" + i + ".time");
            subTime = subTime.substring(5, 16);
            subTime = subTime.replace(/-/g, '/');
            subEpicenter = eval("json.No" + i + ".location");
            subMagnitude = eval("json.No" + i + ".magnitude");
            subDepth = eval("json.No" + i + ".depth");
            subMaxInt = calcMaxInt(subMagnitude, subDepth);
            calcSubEpicenterFontSize(subEpicenter, i);
            $("#subTime" + i).text(subTime);
            $("#subEpicenter" + i).text(subEpicenter);
            $("#subMagnitude" + i).text("M" + subMagnitude);
            $("#subMaxInt" + i).text(subMaxInt);
            $("#subMaxInt" + i).css("background-color", intColor[subMaxInt].bkcolor);
        }
    })
};

//计算sub最大烈度
function calcMaxInt(calcMagnitude, calcDepth) {
    numa = (calcMagnitude) / 2.08 * 2.82;
    numb = (calcDepth) * -0.013;
    maxInt = Math.round(numa + numb);
    if (maxInt > 12) maxInt = 12;
    if (maxInt < 1) maxInt = 1;
    return (maxInt);
};

//subEpicenter 字体大小自适应
function calcSubEpicenterFontSize(epicenter, locate) {
    if (epicenter.length >= 10) {
        $("#subEpicenter" + locate).css("font-size", "16px")
        $("#subEpicenter" + locate).css("top", "4px");
    } else {
        $("#subEpicenter" + locate).css("font-size", "20px")
    }
};

//初始化运行函数 & 计时器
getMainData();
getSubData();
setInterval(getMainData, 5000);
setInterval(getSubData, 5000);
