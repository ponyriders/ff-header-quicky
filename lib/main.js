var data = require("sdk/self").data;
var tabs = require("sdk/tabs");
var events = require("sdk/system/events");
var { Ci } = require("chrome");
var prefs = require('sdk/simple-prefs').prefs;
var storage = require("sdk/simple-storage").storage;


if (!('selected' in storage)) {
    storage.selected = {}
}

function get_prefs() {
    var list = [];
    for (var i = 1; ('domain_' + i) in prefs; i++) {
        if (prefs['domain_' + i].trim().length > 0
            && prefs['name_' + i].trim().length > 0
            && prefs['values_' + i].trim().length > 0) {
            // fill start and end with ^ and $
            var domain = prefs['domain_' + i];
            if (domain.charAt(0) !== '^') {
                domain = '^' + domain;
            }
            if (domain.charAt(domain.length - 1) !== '$') {
                domain = domain + '$';
            }
            list.push({
                index: i,
                domain: prefs['domain_' + i].trim(),
                name: prefs['name_' + i].trim(),
                values: prefs['values_' + i].trim().split('|')
            })
        }
    }
    return list;
}

var popup = require("sdk/panel").Panel({
    width: 150,
    height: 100,
    contentURL: data.url("popup.html"),
    contentScriptFile: data.url("popup.js")
});

var widget = require("sdk/widget").Widget({
    label: "Switch Http Header",
    id: "switch-header-widget",
    contentURL: "http://www.mozilla.org/favicon.ico",
    panel: popup
});

popup.on("show", function () {
    var match = tabs.activeTab.url.match(/:\/\/(.[^/]+)\//);
    if (match) {
        get_prefs().map(function (pref) {
            if (match[1].match(new RegExp(pref.domain))) {
                popup.port.emit("show", {
                    pref: pref,
                    selected: storage.selected[pref.index]
                });
            }
        });
    }
});

popup.port.on("selected", function (data) {
    storage.selected[data.index] = data.value;
    popup.hide();
    tabs.activeTab.reload();
});

function requestlistener(event) {
    var channel = event.subject.QueryInterface(Ci.nsIHttpChannel);
    var host = channel.URI.hostPort;
    get_prefs().map(function (pref) {
        if (host.match(new RegExp(pref.domain)) && pref.index in storage.selected) {
            channel.setRequestHeader(
                pref.name,
                storage.selected[pref.index],
                false
            );
        }
    });
}
events.on("http-on-modify-request", requestlistener);

tabs.activeTab.url = "http://pgl.yoyo.org/http/browser-headers.php";
