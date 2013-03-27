/*
* Author: Tim Garrison
* URI: http://mitnosirrag.tumblr.com
* GitHub: https://github.com/mitnosirrag
* License: Apache 2.0 <http://www.apache.org/licenses/LICENSE-2.0>
*/
(function($) {
    $.mnTextSelector = {};

    $.fn.mnTextSelector = function(opts) {

        opts = $.extend({
            fontSize                : 10,
            fontColor               : '#fff',
            backgroundColor         : '#000',
            hoverBackgroundColor    : 'rgb(80,25,180)',
            border                  : '1px solid #000',
            highlightBorder         : '1px solid #ccc'
        },opts);

        var actions  = new Array();
        var selector = 'mnTextSelector';

        var divCss = {
            border   : opts.border,
            position : 'absolute',
            overflow : 'hidden'
        }
        var aCss = {
            fontSize        : opts.fontSize,
            backgroundColor : opts.backgroundColor,
            border          : opts.border,
            borderTop       : opts.highlightBorder,
            color           : opts.fontColor,
            'padding'       : '5px 8px',
            'float'         : 'left'
        }
        var hCss = {
            backgroundColor : opts.hoverBackgroundColor
        }

        function mnGetSelectedText() {
            var str = "";
            if ( window.getSelection ) {
                str = window.getSelection().toString();
            } else if ( document.selection && 
                        'Control' != document.selection.type ) {
                str = document.selection.createRange().text;
            }
            return str;
        }

        $.mnTextSelector.showOptions = function() {
            var coords = getSelectionCoords();
            divCss.top = coords.y;
            divCss.left = coords.x;
            var html;
            var str = mnGetSelectedText();
            str = encodeURIComponent(str);
            html = '<div class="' + selector + '">';
            if ( actions.length ) {
                var label, callback;
                for ( var i=0; i<actions.length; i++ ) {
                    var label    = actions[i].label;
                    var callback = actions[i].callback;
                    var href;
                    if ( 'function' != typeof callback ) {
                        href = callback;
                    } else {
                        $.mnTextSelector.tempMethod = function(i){
                            actions[i].callback.call(this,str);
                        }
                        href = 'javascript:;" onclick="$.mnTextSelector.tempMethod('+ i + ')';
                    }
                    html += '<a href="' + href + '">' + label + '</a>';
                }
            } else {
                html += '<span>No options available...</span>';
            }
            html += '</div>';
            $(html).css(divCss).appendTo('body').show();
            $('.' + selector).find('a, span').css(aCss);
            $('.' + selector).find('a').on('mouseover',function() {
                $(this).css(hCss);
            }).on('mouseout',function() {
                $(this).css(aCss);
            });

        }

        $.mnTextSelector.hideOptions = function() {
            $('.' + selector).remove();
        }

        $.mnTextSelector.addOption = function(label,callback) {
            var option = new Object();
            option.label = label;
            option.callback = callback;
            actions[actions.length] = option;
        }

        var to;
        return this.each(function() {
            $(this).mouseup(function(e) {
                $.mnTextSelector.hideOptions();
                clearTimeout(to);
                to = setTimeout(function() {
                    var str = mnGetSelectedText();
                    if ( '' != str ) {
                        $.mnTextSelector.showOptions();
                    }
                },500);
            });
            $(document).click(function() {
                $.mnTextSelector.hideOptions();
            });

        });

        /* modified from http://stackoverflow.com/a/6847328 */
        function getSelectionCoords() {
            var sel = document.selection, range;
            var x = 0, y = 0;
            if (sel) {
                if (sel.type != "Control") {
                    range = sel.createRange();
                    range.collapse(true);
                    x = range.boundingLeft;
                    y = range.boundingTop;
                }
            } else if (window.getSelection) {
                sel = window.getSelection();
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0).cloneRange();
                    if (range.getClientRects) {
                        range.collapse(true);
                        var rect = range.getClientRects()[0];
                        x = rect.left + $(window).scrollLeft();
                        y = rect.top + $(window).scrollTop();
                    }
                }
            }
            return { x: x, y: y };
        }

    }
})(jQuery);
