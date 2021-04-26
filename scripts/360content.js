/*global alert: false, console: false, jQuery: false */

var threeSixtyManager = (function () {
    'use strict';
    
    var iframe, embed360View, clear360View;
    
    embed360View = function (container, src, args) {
        var data = {};
        data.url = src;
        
        if (args) {
            data.args = args;
        }
        
        iframe = document.createElement('iframe');
        iframe.src = '/video/360/embed/embed.html?data=' + encodeURI(window.btoa(JSON.stringify(data)));
        
        container.appendChild(iframe);
    };
    
    clear360View = function () {
        
        if (iframe && iframe.parentElement) {
            iframe.parentElement.removeChild(iframe);
        }
        
        iframe = null;
    };

    return {
        embed360View: function (container, src, args) { embed360View(container, src, args); return this; },
        clear360View: function (container) { clear360View(container); return this; }
    };
}());