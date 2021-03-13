$(document).ready(function () {
  "use strict";
  // Background Image
  $(".bg_img").each(function (i, elem) {
    var img = $(elem);
    $(this).hide();
    $(this).parent().css({
      background: "url(" + img.attr("src") + ") no-repeat center center",
    });
  });

  // code split
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  //document.addEventListener("DOMContentLoaded", init, false);
  window.onload = function init() {
    var codeblock = document.querySelectorAll("pre code");
    if (codeblock.length) {
      for (var i = 0, len = codeblock.length; i < len; i++) {
        var dom = codeblock[i];
        var html = dom.innerHTML;
        html = escapeHtml(html);
        dom.innerHTML = html;
      }
      $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
      });
    }
  }

  // Search Icon
  $("#filter_input").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#filter_list .fa-hover").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  // form-control on focus add class
  $(".form-control").on('focus', function () {
    $(this).parent().addClass("focus");
  })
  $(".form-control").on('focusout', function () {
    $(this).parent().removeClass("focus");
  })

  var w = $(window).width();
  $(document).on('touchstart click', function (e) {
    if ($(e.target).parents('.left-side-bar').length == 0 && !$(e.target).is('.menu-icon, .menu-icon img')) {
      $('.left-side-bar').removeClass('open');
      $('.menu-icon').removeClass('open');
      $('.mobile-menu-overlay').removeClass('show');
    }

  });
  $(window).on('resize', function () {
    var w = $(window).width();
    if ($(window).width() > 1200) {
      $('.left-side-bar').removeClass('open');
      $('.menu-icon').removeClass('open');
      $('.mobile-menu-overlay').removeClass('show');
    }
  });

  // sidebar menu Active Class
  $('#accordion-menu').each(function () {
    var vars = window.location.href.split("/").pop();
    $(this).find('a[href="' + vars + '"]').addClass('active');
  });

  // click to copy icon
  $(".fa-hover").click(function (event) {
    event.preventDefault();
    var $html = $(this).find('.icon-copy').first();
    var str = $html.prop('outerHTML');
    CopyToClipboard(str, true, "Copied");
  });

  $("[data-color]").each(function () {
    $(this).css('color', $(this).attr('data-color'));
  });
  $("[data-bgcolor]").each(function () {
    $(this).css('background-color', $(this).attr('data-bgcolor'));
  });
  $("[data-border]").each(function () {
    $(this).css('border', $(this).attr('data-border'));
  });

  $("#accordion-menu").vmenuModule({
    Speed: 400,
    autostart: false,
    autohide: true
  });

});

// sidebar menu accordion
(function ($) {
  $.fn.vmenuModule = function (option) {
    var obj,
      item;
    var options = $.extend({
        Speed: 220,
        autostart: true,
        autohide: 1
      },
      option);
    obj = $(this);

    item = obj.find("ul").parent("li").children("a");
    item.attr("data-option", "off");

    item.unbind('click').on("click", function () {
      var a = $(this);
      if (options.autohide) {
        a.parent().parent().find("a[data-option='on']").parent("li").children("ul").slideUp(options.Speed / 1.2,
          function () {
            $(this).parent("li").children("a").attr("data-option", "off");
            $(this).parent("li").removeClass("show");
          })
      }
      if (a.attr("data-option") == "off") {
        a.parent("li").children("ul").slideDown(options.Speed,
          function () {
            a.attr("data-option", "on");
            a.parent('li').addClass("show");
          });
      }
      if (a.attr("data-option") == "on") {
        a.attr("data-option", "off");
        a.parent("li").children("ul").slideUp(options.Speed)
        a.parent('li').removeClass("show");
      }
    });
    if (options.autostart) {
      obj.find("a").each(function () {

        $(this).parent("li").parent("ul").slideDown(options.Speed,
          function () {
            $(this).parent("li").children("a").attr("data-option", "on");
          })
      })
    } else {
      obj.find("a.active").each(function () {

        $(this).parent("li").parent("ul").slideDown(options.Speed,
          function () {
            $(this).parent("li").children("a").attr("data-option", "on");
            $(this).parent('li').addClass("show");
          })
      })
    }

  }
})(window.$ || window.Zepto);

// copy to clipboard function
function CopyToClipboard(value, showNotification, notificationText) {
  var $temp = $("<input>");
  if (value != '') {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(value).select();
    document.execCommand("copy");
    $temp.remove();
  }
  if (typeof showNotification === 'undefined') {
    showNotification = true;
  }
  if (typeof notificationText === 'undefined') {
    notificationText = "Copied to clipboard";
  }
  var notificationTag = $("div.copy-notification");
  if (showNotification && notificationTag.length == 0) {
    notificationTag = $("<div/>", {"class": "copy-notification", text: notificationText});
    $("body").append(notificationTag);

    notificationTag.fadeIn("slow", function () {
      setTimeout(function () {
        notificationTag.fadeOut("slow", function () {
          notificationTag.remove();
        });
      }, 1000);
    });
  }
}

// detectIE Browser
(function detectIE() {
  var ua = window.navigator.userAgent;

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    var ieV = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    document.querySelector('body').className += ' IE';
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    var ieV = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    document.querySelector('body').className += ' IE';
  }

  // other browser
  return false;
})();
