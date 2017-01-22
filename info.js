console.log("start");
var request = require("superagent");
var jsdom = require("jsdom");
var fs = require("fs");
var lib = {
    "8": "低风险",
    "4": "中风险",
    "5": "高风险",
    "test": "测试"
}

var fileName = "4.json";
var f = fileName.replace(".json", "");
var id = lib[f];

var data = fs.readFileSync("./" + fileName);
var json = JSON.parse(data.toString());
var len = json.length;
var i = 0;

var sum = [];

core(json[0]);

function core(url) {
    request.get(url).end(function(err, res) {
        if (err) {
            console.error("获取失败，跳过本条");
            core(json[i]);
        } else {
            console.log("[" + i + "/" + len + "]" + "已获取到" + url + "正在解析");
            jsdom.env(res.text, [], function(err, window) {
                if (err) {
                    console.error("解析失败跳过本条");
                    core(json[i]);
                } else {
                    var query = function(x) {
                        return window.document.querySelector(x);
                    }
                    var queryAll = function(x) {
                        return window.document.querySelectorAll(x);
                    }
                    var de = query(".newLendDetailMoneyLeft").textContent;
                    var detail = de.split(/\n/).map(function(e) {
                        return e.replace(/(&nbsp;|\s|<br>)/g, "");
                    });
                    var lender = Array.from(queryAll(".lender-info>div>.ex")).map(function(e) {
                        return e.textContent.split("：")[1];
                    });
                    var detail2 = Array.from(queryAll(".ex")).map(function(e, index) {
                        return e.textContent.split("：")[1].replace(/(&nbsp;|\s|<br>)/g, "");
                    });
                    if (detail2.length <= 6) {
                        detail2 = detail2.concat(["未知", "次", "未知", "未知", "未知", "未知", "未知", "未知", "未知"]);
                    }
                    detail2.splice(0, 6);
                    if (detail2[1].indexOf("次") >= 0) {
                        var first = "这次"
                    } else {
                        var first = detail2[1];
                        detail2.splice(1, 1);
                    }
                    var obj = {
                        "风险等级": id,
                        "魔镜等级": query(".creditRating").classList[1],
                        "昵称": query(".username").textContent,
                        "借款金额": detail[3].replace(",", ""),
                        "年利率": detail[7],
                        "期限": detail[12],
                        "进度": query("#process").style.width,
                        "性别": lender[0],
                        "年龄": lender[1],
                        "注册时间": lender[2],
                        "文化程度": lender[3],
                        "毕业院校": lender[4],
                        "学习形式": lender[5],
                        "成功借款次数": detail2[0],
                        "第一次借款时间": first,
                        "历史记录": query(".flex>.num") ? query(".flex>.num").textContent : "未知",
                        "正常还请次数": detail2[1],
                        "逾期15天内还清次数": detail2[2],
                        "逾期15天以上还清此时": detail2[3],
                        "累计借款金额": detail2[4],
                        "待还金额": detail2[5],
                        "待收金额": detail2[6],
                        "单笔最高借款金额": detail2[7],
                        "历史最高负债": detail2[8],
                    };
                    sum.push(obj);
                    i++;
                    console.log("[" + i + "/" + len + "]" + "本条解析成功");
                    if (!!json[i]) {
                        core(json[i]);
                    } else {
                        fs.writeFile("./" + id + ".json", JSON.stringify(sum), function(err) {
                            console.log("完成，已写入到" + id + ".json");
                        })
                    }
                }
            })
        }
    });
}