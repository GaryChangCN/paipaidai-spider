var request = require("superagent");
var jsdom = require("jsdom");
var fs = require("fs");
var url = "http://invest.ppdai.com/loan/listnew";

// balala("8", ["1,", "2,"], 40);
// balala("4", ["3,", "4,", "5,", "6,"], 40);
balala("5", ["7,", "8,"], 40);

Array.prototype.dr = function() {
    var that = this;
    for (var i = 0; i < that.length; i++) {
        if (that[i] instanceof Array) {
            that = that.slice(0, i).concat(that[i], that.slice(i + 1));
            i--;
        }
    }
    return that;
};

console.log("start");

function balala(id, codes, page) {
    var b = [];
    codes.forEach(function(code) {
        var tmp = [];
        for (let i = 1; i <= page; i++) {
            tmp.push(core(id, code, i));
        }
        var P = Promise.all(tmp).then(function(r) {
            var res = r.dr();
            // var obj = {};
            // obj[code] = res;
            return res;
        });
        b.push(P);
    });
    Promise.all(b).then(function(value) {
        // var obj = {};
        // obj[id] = value;
        value = value.dr();
        fs.writeFile("./" + id + ".json", JSON.stringify(value), function(err) {
            console.log("ok");
        });
    }).catch(function(err) {
        console.error(err);
    })
}

function core(id, codes, index) {
    return new Promise(function(resolve, reject) {
        request.get(url).query({
            LoanCategoryId: id,
            SortType: "0",
            PageIndex: index,
            CreditCodes: codes,
            MinAmount: "0",
            MaxAmount: "0"
        }).end(function(err, res) {
            if (err) {
                reject(err);
            } else {
                jsdom.env(res.text, [], function(err, window) {
                    if (err) {
                        reject(err);
                    } else {
                        var a = window.document.querySelectorAll(".ell");
                        var arr = Array.from(a);
                        var arr2 = arr.map(function(e) {
                            return e.href;
                        })
                        resolve(arr2);
                    }
                })
            }
        })

    });
}