"use strict";
var eaUtils = {
  domUniqueId: 0,
  eventPrefix: "",
  eventsFallbackAlias: { mouseenter: "mouseover", mouseleave: "mouseout" },
  cssStyle: {},
  cssStyleArray: [],
  rawCssStyle: "",
  cssPropsAlias: {
    fontFamily: "font-family",
    fontWeight: "font-weight",
    fontStyle: "font-style",
    fontSize: "font-size",
    lineHeight: "line-height",
  },
  extractRGB: function (e) {
    if (e) {
      e = e.toLowerCase();
      var t = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
        ],
        i = { r: "", g: "", b: "" };
      return (
        (i.r = parseInt((16 * t.indexOf(e[1]) + t.indexOf(e[2])).toString())),
        (i.g = parseInt((16 * t.indexOf(e[3]) + t.indexOf(e[4])).toString())),
        (i.b = parseInt((16 * t.indexOf(e[5]) + t.indexOf(e[6])).toString())),
        i
      );
    }
  },
  detectHTML5: function () {
    return Detect.transformOrigin;
  },
  extractRGBA: function (e) {
    var t = e.replace(/[^\d,.]/g, "").split(",");
    return { r: t[0], g: t[1], b: t[2], a: t[3] };
  },
  rgba2hex: function (e, t) {
    return (
      "#" +
      (0 != t
        ? (256 + parseInt(256 * Number(e.a))).toString(16).substr(1)
        : "") +
      (256 + parseInt(e.r)).toString(16).substr(1) +
      (256 + parseInt(e.g)).toString(16).substr(1) +
      (256 + parseInt(e.b)).toString(16).substr(1)
    );
  },
  hex2rgb: function (e) {
    return [e >> 16, (e >> 8) & 255, 255 & e];
  },
  hex2rgba: function (e, t) {
    var i = "#" === e[0] ? e.substr(1) : e,
      r = this.hex2rgb(parseInt(i, 16));
    return "rgba(" + r[0] + ", " + r[1] + ", " + r[2] + ", " + t + ")";
  },
  getIEVersion: function () {
    if (null != eaUtils.IEVersion) return eaUtils.IEVersion;
    var e = -1;
    if ("Microsoft Internet Explorer" == navigator.appName) {
      var t = navigator.userAgent;
      null != new RegExp("MSIE ([0-9]+[.0-9]*)").exec(t) &&
        (e = parseFloat(RegExp.$1));
    }
    return (eaUtils.IEVersion = e);
  },
  detectIE: function () {
    return -1 != eaUtils.getIEVersion();
  },
  _is_safari: null,
  isSafari: function () {
    return (
      null === this._is_safari &&
        (this._is_safari =
          /Safari/.test(navigator.userAgent) &&
          /Apple Computer/.test(navigator.vendor)),
      this._is_safari
    );
  },
  isMobile: {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        eaUtils.isMobile.Android() ||
        eaUtils.isMobile.BlackBerry() ||
        eaUtils.isMobile.iOS() ||
        eaUtils.isMobile.Opera() ||
        eaUtils.isMobile.Windows()
      );
    },
  },
  getBrowser: function () {
    var e,
      t,
      i,
      r = navigator.userAgent,
      n = navigator.appName,
      s = "" + parseFloat(navigator.appVersion),
      a = parseInt(navigator.appVersion, 10);
    return (
      -1 != (t = r.indexOf("OPR/"))
        ? ((n = "Opera"), (s = r.substring(t + 4)))
        : -1 != (t = r.indexOf("Opera Mini"))
        ? ((n = "Opera Mini"), (s = r.substring(t + 11)))
        : -1 != (t = r.indexOf("Opera"))
        ? ((n = "Opera"),
          (s = r.substring(t + 6)),
          -1 != (t = r.indexOf("Version")) && (s = r.substring(t + 8)))
        : -1 != (t = r.indexOf("Edge"))
        ? ((n = "Edge"), (s = r.substring(t + 5)))
        : -1 != (t = r.indexOf("MSIE"))
        ? ((n = "MSIE"), (s = r.substring(t + 5)))
        : /x64|x32/gi.test(r)
        ? ((n = "MSIE"), (s = "12.0"))
        : -1 != (t = r.indexOf("Chrome"))
        ? ((n = "Chrome"), (s = r.substring(t + 7)))
        : -1 != (t = r.indexOf("Safari"))
        ? ((n = "Safari"),
          (s = r.substring(t + 7)),
          -1 != (t = r.indexOf("Version")) && (s = r.substring(t + 8)))
        : -1 != (t = r.indexOf("Firefox"))
        ? ((n = "Firefox"), (s = r.substring(t + 8)))
        : (e = r.lastIndexOf(" ") + 1) < (t = r.lastIndexOf("/")) &&
          ((n = r.substring(e, t)),
          (s = r.substring(t + 1)),
          n.toLowerCase() == n.toUpperCase() && (n = navigator.appName)),
      "Netscape" !== n ||
        5 != s ||
        window.ActiveXObject ||
        ((n = "MSIE"), (s = "11.0")),
      -1 != (i = s.indexOf(";")) && (s = s.substring(0, i)),
      -1 != (i = s.indexOf(" ")) && (s = s.substring(0, i)),
      (a = parseInt("" + s, 10)),
      isNaN(a) &&
        ((s = "" + parseFloat(navigator.appVersion)),
        (a = parseInt(navigator.appVersion, 10))),
      isNaN(a) && (a = 0),
      /Chrome|Firefox|MSIE|Edge|Safari|Opera|Opera Mini/.test(n) ||
        ((n = "Other"), (a = 0)),
      [n, a]
    );
  },
  getOS: function () {
    var e,
      t = navigator.userAgent,
      i = [
        { s: "Windows 10", r: /(Windows 10.0|Windows NT 10.0)/ },
        { s: "Windows 8.1", r: /(Windows 8.1|Windows NT 6.3)/ },
        { s: "Windows 8", r: /(Windows 8|Windows NT 6.2)/ },
        { s: "Windows 7", r: /(Windows 7|Windows NT 6.1)/ },
        { s: "Windows Vista", r: /Windows NT 6.0/ },
        { s: "Windows Server 2003", r: /Windows NT 5.2/ },
        { s: "Windows XP", r: /(Windows NT 5.1|Windows XP)/ },
        { s: "Windows 2000", r: /(Windows NT 5.0|Windows 2000)/ },
        { s: "Windows ME", r: /(Win 9x 4.90|Windows ME)/ },
        { s: "Windows 98", r: /(Windows 98|Win98)/ },
        { s: "Windows 95", r: /(Windows 95|Win95|Windows_95)/ },
        {
          s: "Windows NT 4.0",
          r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/,
        },
        { s: "Windows CE", r: /Windows CE/ },
        { s: "Windows 3.11", r: /Win16/ },
        { s: "Windows Phone", r: /Windows Phone|iemobile|WPDesktop/ },
        { s: "Chrome OS", r: /\bCrOS\b/ },
        { s: "Android", r: /Android/ },
        { s: "Open BSD", r: /OpenBSD/ },
        { s: "Sun OS", r: /SunOS/ },
        { s: "Linux", r: /(Linux|X11)/ },
        { s: "iOS", r: /(iPhone|iPad|iPod)/ },
        { s: "Mac OS X", r: /Mac OS X/ },
        { s: "Mac OS", r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
        { s: "QNX", r: /QNX/ },
        { s: "UNIX", r: /UNIX/ },
        { s: "BeOS", r: /BeOS/ },
        { s: "OS/2", r: /OS\/2/ },
        {
          s: "Search Bot",
          r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
        },
      ];
    for (var r in i) {
      var n = i[r];
      if (n.r.test(t)) {
        e = n.s;
        break;
      }
    }
    return (
      /Windows/.test(e) && !/Windows Phone/.test(e) && (e = "Windows"),
      /Mac OS/.test(e) && (e = "Macintosh"),
      /Windows|Windows Phone|Macintosh|Linux|Android|iOS|Chrome OS/.test(e) ||
        (e = "Other"),
      e
    );
  },
  getScreenSize: function () {
    var e = window.devicePixelRatio || 1,
      t = window.screen.width ? window.screen.width : 0,
      i = window.screen.height ? window.screen.height : 0;
    return (
      eaUtils.isAndroidStockBrowser() &&
        ((t /= e), (t = Math.round(t)), (i /= e), (i = Math.round(i))),
      t + "x" + i
    );
  },
  isAndroidStockBrowser: function () {
    var e,
      t = !1,
      i = !1;
    return (
      "Android" == eaUtils.getOS() &&
      ((t = (e = navigator.userAgent.match(/firefox/i)) && 0 < e.length),
      (i = (e = navigator.userAgent.match(/chrome/i)) && 0 < e.length),
      !t && !i)
    );
  },
  isTablet: function () {
    var e = navigator.userAgent.match(
        /(ipad|android|windows phone|silk|blackberry|iemobile)/i
      ),
      t = eaUtils.getScreenSize().split("x");
    return !!(e && 0 < e.length && (960 <= t[0] || 960 <= t[1]));
  },
  getDevice: function () {
    return eaUtils.isTablet()
      ? "tablet"
      : eaUtils.isMobile.any()
      ? "mobile"
      : "desktop";
  },
  generateLighterColor: function (e, t) {
    if (e) {
      null == t && (t = 26);
      var i = eaUtils.extractRGB(e);
      return (
        (i.r = Math.min(255, parseInt(i.r) + t)),
        (i.g = Math.min(255, parseInt(i.g) + t)),
        (i.b = Math.min(255, parseInt(i.b) + t)),
        "#" +
          eaUtils.fixed2(i.r.toString(16)) +
          eaUtils.fixed2(i.g.toString(16)) +
          eaUtils.fixed2(i.b.toString(16))
      );
    }
  },
  fixed2: function (e) {
    return e.length < 2 ? "0" + e : e;
  },
  getTransparentImageURL: function () {
    return "data:image/gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
  },
  getElementStyle: function (e, t) {
    var i;
    return (
      e.currentStyle
        ? (i = e.currentStyle[t])
        : window.getComputedStyle &&
          (i = window.getComputedStyle(e, null).getPropertyValue(t)),
      i
    );
  },
  addCSSById: function (e, t) {
    var i,
      r = "eautils-css",
      n = document.getElementsByTagName("head")[0],
      s = document.getElementById(r);
    if (
      ((null != s && null != s) ||
        (((s = document.createElement("style")).type = "text/css"),
        (s.id = r),
        n.appendChild(s)),
      null != eaUtils.cssStyle[t])
    ) {
      (eaUtils.rawCssStyle = ""), (eaUtils.cssStyle[t].css = e);
      for (var a = 0; a < eaUtils.cssStyleArray.length; a++)
        (i = eaUtils.cssStyleArray[a]), (eaUtils.rawCssStyle += i.css);
    } else
      (eaUtils.rawCssStyle += e),
        ((i = {}).css = e),
        (eaUtils.cssStyle[t] = i),
        eaUtils.cssStyleArray.push(i);
    s.styleSheet
      ? (s.styleSheet.cssText = eaUtils.rawCssStyle)
      : (s.innerHTML = eaUtils.rawCssStyle);
  },
  backwardBackgroundTile: function (e) {
    return (
      e &&
        e.type &&
        "image" == e.type &&
        e.tile &&
        ((e.scaleMode = "tile"),
        (e.contentScale = 100),
        (e.contentOffsetX = 50),
        (e.contentOffsetY = 50),
        delete e.tile),
      e
    );
  },
  toggleBackroundClasses: function (e, t) {
    if (!e || !t) return this.addClass(e, "background"), !1;
    var i = [
        "background",
        "background-crop",
        "background-stretch",
        "background-mask",
        "background-aspect",
        "background-tile",
      ],
      r = i[0] + "-" + t.toLowerCase();
    for (var n in i) this.removeClass(e, i[n]);
    this.addClass(e, i[0]), this.addClass(e, r);
  },
  hasClass: function (e, t) {
    return e.className.match(new RegExp("(\\s|^)" + t + "(\\s|$)"));
  },
  addClass: function (e, t) {
    this.hasClass(e, t) || (e.className += " " + t);
  },
  removeClass: function (e, t) {
    if (this.hasClass(e, t)) {
      var i = new RegExp("(\\s|^)" + t + "(\\s|$)");
      e.className = e.className.replace(i, " ");
    }
  },
  getTextShadowCss: function (e) {
    if (!e) return null;
    var t = { "text-shadow": "" };
    return (
      (1 != e.useShadow && "true" != e.useShadow) ||
        ((t.textShadow =
          e.hShadow + "px " + e.vShadow + "px " + e.blur + "px " + e.color),
        (t["text-shadow"] =
          e.hShadow + "px " + e.vShadow + "px " + e.blur + "px " + e.color),
        (t["-moz-text-shadow"] =
          e.hShadow + "px " + e.vShadow + "px " + e.blur + "px " + e.color),
        (t["-o-text-shadow"] =
          e.hShadow + "px " + e.vShadow + "px " + e.blur + "px " + e.color),
        (t["-ms-text-shadow"] =
          e.hShadow + "px " + e.vShadow + "px " + e.blur + "px " + e.color)),
      t
    );
  },
  getBoxShadowCss: function (e) {
    if (!e) return null;
    var t = { "-webkit-box-shadow": "", "box-shadow": "" };
    return (
      (1 != e.useShadow && "true" != e.useShadow) ||
        (t["-webkit-box-shadow"] = t.boxShadow =
          e.hShadow +
          "px " +
          e.vShadow +
          "px " +
          e.blur +
          "px " +
          e.spread +
          "px " +
          e.color),
      t
    );
  },
  getDropShadowCss: function (e) {
    var t = { "-webkit-filter": "", filter: "" };
    return (
      (1 != e.useShadow && "true" != e.useShadow) ||
        (t["-webkit-filter"] = t.filter =
          "drop-shadow(" +
          e.hShadow +
          "px " +
          e.vShadow +
          "px " +
          e.blur +
          "px " +
          e.color +
          ")"),
      t
    );
  },
  getFiltersCss: function (e, t, i) {
    var r = { "-webkit-filter": "", filter: "" };
    return (
      !e ||
        (1 != e.useAdjustColor && "true" != e.useAdjustColor) ||
        ((r.filter +=
          "brightness(" + (parseInt(e.brightness) + 100) / 100 + ") "),
        (r.filter += "contrast(" + (parseInt(e.contrast) + 100) / 100 + ") "),
        (r.filter += "saturate(" + (parseInt(e.saturate) + 100) / 100 + ") "),
        (r.filter += "hue-rotate(" + e.hue + "deg)")),
      !t ||
        (1 != t.useBlur && "true" != t.useBlur) ||
        (r.filter += "blur(" + t.pixels + "px)"),
      !i ||
        (1 != i.useShadow && "true" != i.useShadow) ||
        (r.filter +=
          "drop-shadow(" +
          i.hShadow +
          "px " +
          i.vShadow +
          "px " +
          i.blur +
          "px " +
          i.color +
          ")"),
      (r["-webkit-filter"] = r.filter),
      r
    );
  },
  convertCssProps: function (e) {
    var t = {};
    for (var i in e) t[eaUtils.cssPropsAlias[i] || i] = e[i];
    return t;
  },
  fixCSSProp: function (e, t, i) {
    if (null != e)
      return (
        null == t && (t = "fontSize"),
        null == i && (i = "px"),
        (e[t] = parseInt(e[t]) + i),
        e
      );
  },
  getCssAsClass: function (e, t) {
    var i = "." + t + "{";
    for (var r in e) {
      var n = e[r];
      if (n instanceof Array)
        for (var s = 0, a = n.length; s < a; s++) i += r + ":" + n[s] + ";";
      else i += r + ":" + n + ";";
    }
    return (i += "}");
  },
  getBackgroundCss: function (e) {
    var t = {};
    if (!e) return t;
    var i = e.type,
      r = e.scolor;
    switch (
      (("lgrad" != i && "rgrad" != i) ||
        (e.gradColors && e.gradColors.length
          ? e.gradColors.length < 2 &&
            0 < e.gradColors.length &&
            ((r = e.gradColors[0].c), (i = "solid"))
          : ((i = "solid"), (r = "#fff"))),
      "true" == String(e.useBorder) &&
        (t.border = "1px solid " + e.borderColor),
      (t["background-image"] = ""),
      i)
    ) {
      case "none":
        break;
      case "image":
        (e = this.backwardBackgroundTile(e)),
          (t = this.getImageBackgroundCSS(t, e));
        break;
      case "solid":
        if (r && -1 != r.indexOf("rgba")) {
          var n = eaUtils.getIEVersion();
          -1 < n && n < 9 && (r = eaUtils.rgba2hex(eaUtils.extractRGBA(r), !1));
        }
        t["background-color"] = r;
        break;
      case "rgrad":
      case "lgrad":
        for (var s = e.gradColors, a = [], o = 0; o < s.length; o++)
          a.push(s[o].c + " " + s[o].p + "%");
        var l = a.join(),
          p = "linear",
          d = (e.rotation || "0") + "deg";
        if ("rgrad" == e.type) {
          p = "radial";
          var c = e.rgradPos || "center";
          if ("custom" == c) {
            var h = "";
            (e.gradPosX && -1 != e.gradPosX.indexOf("%")) || (h = "px");
            var u = "";
            (e.gradPosY && -1 != e.gradPosY.indexOf("%")) || (u = "px"),
              (c = (e.gradPosX || "0") + h + " " + (e.gradPosY || "0") + u);
          }
          d = c + ", circle cover";
        } else e.backgroundRotation && (d = e.backgroundRotation + "deg");
        s &&
          0 < s.length &&
          ((e = t["background-image"] = []).push(
            "-webkit-" + p + "-gradient(" + d + ",  " + l + ")"
          ),
          e.push("-moz-" + p + "-gradient(" + d + ",  " + l + ")"),
          e.push("-o-" + p + "-gradient(" + d + ",  " + l + ")"),
          e.push("-ms-" + p + "-gradient(" + d + ",  " + l + ")")),
          (t.filter =
            "progid:DXImageTransform.Microsoft.gradient( startColorstr='" +
            s[0].c +
            "', endColorstr='" +
            s[s.length - 1].c +
            "',GradientType=0 )");
    }
    return t;
  },
  getImagePathFromBackground: function (e) {
    if (bannerConfig.hqImages && e.hqUrl) return e.hqUrl;
    if (e.localUrl) {
      var t = "images/" + e.localUrl;
      return bannerConfig.embedUrl && (t = bannerConfig.embedUrl + t), t;
    }
    return e.url && -1 !== e.url.indexOf("//")
      ? e.url
      : bannerConfig.photosUrl + e.url;
  },
  setSvgColors: function (e, t) {
    var i = document.createElement("div");
    i.innerHTML = e;
    for (
      var r = i.querySelectorAll("[data-color-group]"), n = 0;
      n < r.length;
      n++
    )
      r[n] &&
        r[n].dataset &&
        r[n].setAttribute("fill", t[parseInt(r[n].dataset.colorGroup)]);
    return i.innerHTML;
  },
  applyImageSizeOnBackground: function (e, t) {
    var i = !1,
      r = this.getImagePathFromBackground(t);
    for (var n in t)
      switch (n) {
        case "scaleMode":
        case "verticalAlign":
        case "horizontalAlign":
        case "contentScale":
          i = !0;
      }
    if (i) {
      e.style.backgroundSize = "";
      var s = t.originalWidth;
      if (s)
        "tile" == t.scaleMode &&
          ((e.style.backgroundSize = s
            ? (t.contentScale * s) / 100 + "px"
            : t.contentScale + "%"),
          (e.style.visibility = "visible"));
      else {
        var a = new Image();
        (a.onload = function () {
          s != a.width && (s = a.width),
            (e.style.backgroundSize = ""),
            "tile" == t.scaleMode &&
              ((e.style.backgroundSize = s
                ? (t.contentScale * s) / 100 + "px"
                : t.contentScale + "%"),
              (e.style.visibility = "visible"));
        }),
          (a.src = r);
      }
    }
  },
  getImageBackgroundCSS: function (e, t) {
    var i,
      r,
      n = this.getImagePathFromBackground(t);
    for (var s in ((e["background-image"] = "url(" + n + ")"),
    (e["--retina-src"] = n),
    t))
      switch (s) {
        case "scaleMode":
        case "verticalAlign":
        case "horizontalAlign":
          switch (t.verticalAlign) {
            case "top":
              i = "0";
              break;
            case "middle":
              i = "50%";
              break;
            case "bottom":
              i = "100%";
          }
          switch (t.horizontalAlign) {
            case "left":
              r = "0";
              break;
            case "center":
              r = "50%";
              break;
            case "right":
              r = "100%";
          }
          e["background-position"] = r + " " + i;
          break;
        case "contentOffsetX":
          "tile" === t.scaleMode && (e["background-position-x"] = t[s] + "%");
          break;
        case "contentOffsetY":
          "tile" === t.scaleMode && (e["background-position-y"] = t[s] + "%");
      }
    return e;
  },
  getBorderCss: function (e) {
    var t = {};
    return (
      e &&
        ((1 != e.useBorder && "true" != e.useBorder) ||
          (t.border = "1px solid " + e.borderColor)),
      t
    );
  },
  applyCss: function (e, t) {
    for (var i in t) e.style[i] = t[i];
  },
  isURLValid: function (e) {
    return !(0 <= e.indexOf(" ") || -1 == e.indexOf("."));
  },
  getAppValidURL: function (e) {
    return eaUtils.isURLValid(e) ? e : EAdConfig.baseDomain;
  },
  getElementUniqueId: function () {
    return "e_" + eaUtils.domUniqueId++;
  },
  getImagePath: function (e, t, i) {
    return e ? e.replace("{hash}", t).replace("{wxh}", i) : "";
  },
  getUniqueId: function () {
    return (Math.random() + new Date().getTime()).toString(36).replace(".", "");
  },
  preloadImage: function (e, t) {
    var i = new Image();
    (i.onerror = i.onload =
      function () {
        t && t();
      }),
      (i.src = e);
  },
  isTouchDevice: function () {
    try {
      return (
        document.createEvent("TouchEvent"),
        "ontouchstart" in document.documentElement
      );
    } catch (e) {
      return !1;
    }
  },
  getSharePageURL: function (e) {
    var t = 1 == e ? "" : "&v=" + ((12345 + 1e3 * Math.random()) >> 0),
      i = URLPaths.sharePageUrlFormat
        .replace("{domain}", EAdConfig.shareSubdomain)
        .replace("{hash}", EAdConfig.creativeHash);
    return this.getAppValidURL(i + t);
  },
  cloneObject: function (e) {
    return JSON.parse(JSON.stringify(e));
  },
  getClickTagValue: function () {
    var e = window.location.search.substring(1).split("clickTag=");
    if (!e[1]) return !1;
    var t = e[1].replace(/&.+$/, "");
    return decodeURIComponent(t);
  },
  getProtocol: function () {
    return "http:" != location.protocol && "https:" != location.protocol
      ? "https:"
      : "";
  },
  addProtocolToUrl: function (e) {
    return -1 == e.indexOf("://") ? "http://" + e : e;
  },
  getProportion: function (e, t) {
    var i = window.innerWidth / e,
      r = window.innerHeight / t;
    return { proportion: Math.min(i, r) };
  },
  getTextSubstr: function (e, t, i) {
    return e ? e.substring(t, t + i) : e;
  },
  camelCaseToDash: function (e) {
    return e.replace(/([A-Z])/g, function (e) {
      return "-" + e.toLowerCase();
    });
  },
  getRichTextStyleString: function (e) {
    if (!e) return "";
    var t = "";
    for (var i in e)
      if ({}.hasOwnProperty.call(e, i) && e[i])
        switch (i) {
          case "fontFamily":
            t +=
              "font-family:" +
              (0 === e[i].indexOf('"')
                ? e[i]
                : '"' + (e.fontPrefix || "") + e[i] + '"') +
              ";";
            break;
          case "fontWeight":
          case "fontStyle":
          case "color":
          case "textTransform":
          case "textDecoration":
            t += eaUtils.camelCaseToDash(i) + ":" + e[i] + ";";
        }
    return t;
  },
  replaceSpacesWithNbsps: function (e) {
    if (!e) return e;
    for (var t = "", i = !1, r = 0; r < e.length; r++) {
      var n = e[r];
      (i = " " === n && (!i || ((n = String.fromCharCode(160)), !1))), (t += n);
    }
    return t;
  },
};
Array.prototype.indexOf ||
  (Array.prototype.indexOf = function (e) {
    if (null == this) throw new TypeError();
    var t = Object(this),
      i = t.length >>> 0;
    if (0 == i) return -1;
    var r = 0;
    if (
      (0 < arguments.length &&
        ((r = Number(arguments[1])) != r
          ? (r = 0)
          : 0 !== r &&
            r !== 1 / 0 &&
            r !== -1 / 0 &&
            (r = (0 < r || -1) * Math.floor(Math.abs(r)))),
      i <= r)
    )
      return -1;
    for (var n = 0 <= r ? r : Math.max(i - Math.abs(r), 0); n < i; n++)
      if (n in t && t[n] === e) return n;
    return -1;
  });
var Detect = (function () {
  var e,
    t,
    i =
      "transformOrigin,textShadow,textStroke,boxShadow,borderRadius,borderImage,opacity".split(
        ","
      ),
    s = "Webkit,Moz,O,ms,Khtml".split(","),
    a = document.createElement("detect"),
    r = [];
  function n(e) {
    if ("string" != typeof e) return !1;
    for (
      var t = e.substr(0, 1).toUpperCase() + e.substr(1),
        i = (e + " " + s.join(t + " ") + t).split(" "),
        r = 0,
        n = i.length;
      r < n;
      r++
    )
      if ("" === a.style[i[r]]) return !0;
    return !1;
  }
  for (e in i) r[(t = i[e])] = n(t);
  return r;
})();
function Preload() {
  (window.assetsCache = {}),
    (this.fontTypes = {
      CUSTOM: "custom",
      BANNERSNACK: "bannersnack",
      GOOGLE: "google",
    }),
    (this.loadedSlides = {}),
    (this.imagesToLoad = []),
    (this.fontsToLoad = []),
    (this.getFontUrl = function (e) {
      if (e.localUrl) {
        var t = "fonts/" + e.localUrl;
        return bannerConfig.embedUrl && (t = bannerConfig.embedUrl + t), t;
      }
      switch (((e.fontFamily = this.unquoted(e.fontFamily)), e.fontType)) {
        case this.fontTypes.BANNERSNACK:
          return "//" + e.fontUrl;
        case this.fontTypes.CUSTOM:
          return "//" + (e.fontFaceUrl ? e.fontUrl : e.fontUrl + ".ttf");
        case this.fontTypes.GOOGLE:
          var i =
            "https://fonts.googleapis.com/css?family=" +
            e.fontFamily.split(" ").join("+") +
            ":" +
            parseInt(e.fontWeight);
          return (
            "italic" === e.fontStyle && (i += "i"),
            this.bannerConfig.preview &&
              (i +=
                "&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin,latin-ext,vietnamese"),
            i
          );
        default:
          return "";
      }
    }),
    (this.addFontToDOM = function (e) {
      var t,
        i,
        r,
        n,
        s = this,
        a = "ttf";
      if (
        (e.fontType || (e.fontType = this.fontTypes.GOOGLE),
        (t = this.getFontUrl(e)),
        !window.assetsCache[t])
      ) {
        switch (
          (this.fontsToLoad.push(t),
          (i = function () {
            s.fontsToLoad.pop(), s.resolveIfAssetsLoaded();
          }),
          e.fontType)
        ) {
          case this.fontTypes.GOOGLE:
            (n = document.createElement("link")).setAttribute(
              "rel",
              "stylesheet"
            ),
              n.setAttribute("type", "text/css"),
              n.setAttribute("href", t),
              n.addEventListener("load", i),
              n.addEventListener("error", i),
              document.head.appendChild(n);
            break;
          case this.fontTypes.BANNERSNACK:
          case this.fontTypes.CUSTOM:
            if (
              (this.relPreloadSupported() &&
                ((a = t.substr(t.lastIndexOf(".") + 1)),
                (n = document.createElement("link")).setAttribute(
                  "rel",
                  "preload"
                ),
                n.setAttribute("type", "font/" + a),
                n.setAttribute("as", "font"),
                n.setAttribute("href", t),
                "file:" !== window.location.protocol &&
                  n.setAttribute("crossorigin", "anonymous"),
                n.addEventListener("load", i),
                n.addEventListener("error", i),
                document.head.appendChild(n)),
              e.fontFamily)
            ) {
              var o =
                "@font-face {\nfont-family: '" +
                (e.fontPrefix || "") +
                e.fontFamily.replace(/'/g, "\\'") +
                "';\nfont-style: " +
                e.fontStyle +
                ";\nfont-weight: " +
                e.fontWeight +
                ";\nsrc: url(" +
                t +
                ");\n}\n";
              (r = document.createElement("style")).appendChild(
                document.createTextNode(o)
              ),
                this.relPreloadSupported() ||
                  (r.addEventListener("load", i),
                  r.addEventListener("error", i)),
                document.head.appendChild(r);
            }
        }
        window.assetsCache[t] = !0;
      }
    }),
    (this.unquoted = function (e) {
      return "string" == typeof e ? e.replace(/(^")|("$)/g, "") : e;
    }),
    (this.relPreloadSupported = function () {
      return (function (e, t) {
        if (e && e.supports)
          try {
            return e.supports(t);
          } catch (e) {
            return !1;
          }
      })(document.createElement("link").relList, "preload");
    }),
    (this.getSlideId = function (e) {
      return e.displayData ? e.displayData.properties.id : e.properties.id;
    }),
    (this.getSlideLoaded = function (e) {
      var t = this.getSlideId(e);
      return !!this.loadedSlides[t] && this.loadedSlides[t];
    }),
    (this.setSlideLoaded = function (e) {
      var t = this.getSlideId(e);
      this.loadedSlides[t] = !0;
    }),
    (this.resolveIfAssetsLoaded = function (e) {
      ((0 === this.imagesToLoad.length && 0 === this.fontsToLoad.length) ||
        (0 === this.imagesToLoad.length && !0 === e)) &&
        (window.loadAssetsTimer && clearTimeout(window.loadAssetsTimer),
        this.currentSlide
          ? this.setSlideLoaded(this.currentSlide)
          : this.setAllSlidesLoaded(),
        "function" == typeof this.callback && this.callback());
    }),
    (this.preloadImage = function (e, t, i, r) {
      var n = this,
        s = e;
      i && (s += i);
      var a = bannerConfig.pdf;
      if (!window.assetsCache[s] || a) {
        var o = new Image();
        this.imagesToLoad.push(o);
        var l = function () {
            n.imagesToLoad.pop(), n.resolveIfAssetsLoaded();
          },
          p = function () {
            a
              ? n.preloadResizedImageForPdf(e, o, t, bannerConfig.hqImages, l)
              : l();
          };
        o.addEventListener("load", p),
          o.addEventListener("error", function () {
            l(),
              o.removeEventListener("load", p),
              (this.src =
                "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=");
          }),
          this.bannerConfig.preview && r && !t.resourceKey
            ? this.setColorGroups(e, o, r)
            : (o.src = e),
          (window.assetsCache[s] = o);
      }
    }),
    (this.preloadElementAssets = function (e) {
      var t;
      if ("layer" === e.type)
        switch (e.layerType) {
          case "shape":
            "image" === e.properties.backgroundColor.type &&
              this.preloadImage(
                eaUtils.getImagePathFromBackground(
                  e.properties.backgroundColor
                ),
                e.properties
              );
            break;
          case "image":
            this.bannerConfig.hqImages && e.properties.hqUrl
              ? (t = e.properties.hqUrl)
              : e.properties.localUrl
              ? ((t = "images/" + e.properties.localUrl),
                this.bannerConfig.embedUrl &&
                  (t = this.bannerConfig.embedUrl + t))
              : (t =
                  e.properties.url && -1 !== e.properties.url.indexOf("//")
                    ? e.properties.url
                    : this.bannerConfig.photosUrl + e.properties.url),
              t && this.preloadImage(t, e.properties);
            break;
          case "svg":
            e.properties.localUrl
              ? ((t = "images/" + e.properties.localUrl),
                bannerConfig.embedUrl && (t = bannerConfig.embedUrl + t))
              : (t = e.properties.url
                  ? this.bannerConfig.s3Url + "files/" + e.properties.url
                  : null),
              t &&
                this.preloadImage(
                  t,
                  e.properties,
                  e.properties.id,
                  e.properties.colorGroups
                );
            break;
          case "text":
            var i = e.properties.config;
            if (i) {
              var r = this;
              i.forEach(function (e) {
                var i = e.style,
                  t = e.children;
                i &&
                  (i.fontFamily || (i.fontFamily = "Open Sans"),
                  r.addFontToDOM(i)),
                  t &&
                    t.forEach(function (e) {
                      var t = e.style;
                      t &&
                        (t.fontFamily
                          ? (t.fontType &&
                              t.fontType !== r.fontTypes.GOOGLE &&
                              !t.fontUrl) ||
                            r.addFontToDOM(t)
                          : t.fontWeight &&
                            i &&
                            ((t.fontFamily = i.fontFamily),
                            (t.fontType = i.fontType),
                            r.addFontToDOM(t)));
                    });
              });
            } else this.addFontToDOM(e.properties);
            break;
          case "button":
            e.properties.localUrl || this.addFontToDOM(e.properties.labelStyle);
        }
      else if ("slide" === e.type)
        for (var n = 0; n < e.elements.length; n++)
          this.preloadElementAssets(e.elements[n]);
    });
}
(Preload.prototype.assets = function (e, t, i, r) {
  if (
    ((this.bannerConfig = i),
    (this.callback = r),
    (this.currentSlide = t.displayData ? t.displayData : t),
    this.getSlideLoaded(this.currentSlide))
  )
    this.resolveIfAssetsLoaded();
  else {
    var n = [this.currentSlide];
    if (null !== e) {
      "image" === e.properties.backgroundColor.type &&
        this.preloadImage(
          eaUtils.getImagePathFromBackground(e.properties.backgroundColor),
          e.properties
        );
      var s = e.elements.filter(function (e) {
        return "layer" === e.type;
      });
      n = n.concat(s);
    }
    for (var a = 0; a < n.length; a++) this.preloadElementAssets(n[a]);
    this.resolveIfAssetsLoaded();
  }
}),
  (window.eff = null),
  (function () {
    function g(e) {
      if ("Linear" === e.tween || "linear" === e.ease) return "linear";
      var t = "ease";
      switch (e.ease) {
        default:
          t += "Out";
          break;
        case "easeIn":
          t += "In";
          break;
        case "easeInOut":
          t += "InOut";
      }
      return (t += e.tween), i[t] || "linear";
    }
    function p(e, t) {
      for (
        var i, r, n, s = e + "% {", a = Object.keys(t), o = 0;
        (i = a[o]);
        o++
      )
        s += ((n = t[(r = i)]), r + ":" + n + ";-webkit-" + r + ":" + n + ";");
      return (s += "}");
    }
    function y(e, t) {
      if (!x[e]) {
        for (
          var i,
            r,
            n = "@keyframes " + e + " {",
            s = "@-webkit-keyframes " + e + " {",
            a = 0;
          (i = t[a]);
          a++
        )
          (n += r = p(i.percent, i.props)), (s += r);
        var o = (n += "}") + (s += "}"),
          l = document.createElement("style");
        (l.type = "text/css"),
          l.styleSheet ? (l.styleSheet.cssText = o) : (l.innerHTML = o),
          document.getElementsByTagName("head")[0].appendChild(l),
          (x[e] = !0);
      }
    }
    function b(e, t) {
      e.offsetWidth,
        (e.style.animation = t),
        (e.style.webkitAnimation = t),
        (e.style.animationPlayState = window.eff.PLAYING_STATE),
        (e.style.webkitAnimationPlayState = window.eff.PLAYING_STATE);
    }
    function m(e, t) {
      return parseFloat(e.toFixed(t));
    }
    function u(e, t) {
      var i = 0,
        r = 0,
        n = parseInt(e.slideOffset);
      switch (e.direction) {
        case "custom":
          (i = parseInt(e.slidePosX)), (r = parseInt(e.slidePosY));
          break;
        case "l2r":
          i = t ? -n : n;
          break;
        case "r2l":
          i = t ? n : -n;
          break;
        case "t2b":
          r = t ? -n : n;
          break;
        case "b2t":
          r = t ? n : -n;
      }
      return { translateX: i, translateY: r, alpha: parseInt(e.alphaOffset) };
    }
    function v(e, t) {
      var i = 1,
        r = 1,
        n = "top left";
      switch (e.direction) {
        case "l2r":
          (i = 0), (n = t ? "left center" : "right center");
          break;
        case "r2l":
          (i = 0), (n = t ? "right center" : "left center");
          break;
        case "t2b":
          (r = 0), (n = t ? "center top" : "center bottom");
          break;
        case "b2t":
          (r = 0), (n = t ? "center bottom" : "center top");
          break;
        case "center":
          (r = i = 0), (n = "center center");
      }
      return { startScaleX: i, startScaleY: r, transformOrigin: n };
    }
    function w(e, t) {
      var i = "buildIn" === t,
        r = "blur_" + t + "_" + e.blurAmount;
      if (x[r]) return r;
      var n = { filter: "blur(" + e.blurAmount + "px)", opacity: "0" };
      return (
        y(r, [
          { percent: i ? 0 : 100, props: n },
          { percent: i ? 30 : 70, props: { opacity: 1 } },
          { percent: i ? 100 : 0, props: { filter: "blur(0px)" } },
        ]),
        r
      );
    }
    function S(e, t) {
      var i = "buildIn" === t,
        r = "alpha_" + t;
      return (
        x[r] ||
          y(r, [
            {
              percent: i ? 0 : 100,
              props: { opacity: "0", transform: "translateX(0) translateY(0)" },
            },
            { percent: i ? 100 : 0, props: { opacity: "1" } },
          ]),
        r
      );
    }
    function C(e) {
      if (e.length) {
        var i = String.fromCharCode(160);
        e.forEach(function (t) {
          if (t.getElementsByTagName("br").length) return !1;
          var e = t.getElementsByTagName("span");
          e = [].slice.call(e);
          var a = [],
            o = document.createElement("span");
          for (
            o.className = "word",
              e.forEach(function (n) {
                var e = n.textContent;
                if (-1 === e.indexOf(" ") && -1 === e.indexOf(i))
                  o.appendChild(n);
                else {
                  var s = (function (e) {
                    if (!e) return e;
                    for (
                      var t = "",
                        i = !1,
                        r = " " === e[0] && " " === e[1],
                        n = 0;
                      n < e.length;
                      n++
                    ) {
                      var s = e[n];
                      (i =
                        " " === s &&
                        (i
                          ? ((s = r ? s : String.fromCharCode(160)), !1)
                          : ((s = r ? String.fromCharCode(160) : s), !0))),
                        (t += s);
                    }
                    return t;
                  })(
                    (function (e) {
                      var t = new RegExp(String.fromCharCode(160), "g");
                      return e.replace(t, " ");
                    })(e)
                  ).split(" ");
                  s.forEach(function (e, t) {
                    var i = n.cloneNode(!0);
                    i.textContent = e;
                    var r = null;
                    0 !== t &&
                      (a.push(o),
                      ((o = document.createElement("span")).className = "word"),
                      ((r = n.cloneNode(!0)).textContent = " "),
                      a.push(r)),
                      "" !== e && o.appendChild(i),
                      t === s.length - 1 && a.push(o);
                  });
                }
              }),
              a.push(o);
            t.firstChild;

          )
            t.removeChild(t.firstChild);
          a.forEach(function (e) {
            t.appendChild(e);
          });
        });
      }
    }
    var i = {
        linear: "linear",
        ease: "ease",
        easeIn: "ease-in",
        easeOut: "ease-out",
        easeInOut: "ease-in-out",
        easeInCubic: "cubic-bezier(.55,.055,.675,.19)",
        easeOutCubic: "cubic-bezier(.215,.61,.355,1)",
        easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",
        easeInCirc: "cubic-bezier(.6,.04,.98,.335)",
        easeOutCirc: "cubic-bezier(.075,.82,.165,1)",
        easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",
        easeInExpo: "cubic-bezier(.95,.05,.795,.035)",
        easeOutExpo: "cubic-bezier(.19,1,.22,1)",
        easeInOutExpo: "cubic-bezier(1,0,0,1)",
        easeInQuad: "cubic-bezier(.55,.085,.68,.53)",
        easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",
        easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",
        easeInQuart: "cubic-bezier(.895,.03,.685,.22)",
        easeOutQuart: "cubic-bezier(.165,.84,.44,1)",
        easeInOutQuart: "cubic-bezier(.77,0,.175,1)",
        easeInQuint: "cubic-bezier(.755,.05,.855,.06)",
        easeOutQuint: "cubic-bezier(.23,1,.32,1)",
        easeInOutQuint: "cubic-bezier(.86,0,.07,1)",
        easeInSine: "cubic-bezier(.47,0,.745,.715)",
        easeOutSine: "cubic-bezier(.39,.575,.565,1)",
        easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",
        easeInStrong: "cubic-bezier(.97,.09,.79,.21)",
        easeOutStrong: "cubic-bezier(.21,.79,.09,.97)",
        easeInOutStrong: "cubic-bezier(.78,.03,.24,.99)",
        easeInBack: "cubic-bezier(.6,-.28,.735,.045)",
        easeOutBack: "cubic-bezier(.175, .885,.32,1.275)",
        easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)",
      },
      x = {};
    window.eff = {
      PLAYING_STATE: "running",
      clearAll: function (e) {
        e && e.firstChild && b(e.firstChild, "");
      },
      clearWordsTimeout: function (e, t) {
        for (var i, r = 0; (i = t[r]); r++) b(i, "");
      },
      animate: function (e, t, i, r) {
        if ("none" !== t.type) {
          r = r || 0;
          var n = t.zoom || 1,
            s = null,
            a = "both";
          switch (t.type) {
            case "rotate":
              s = (function (e, t, i) {
                var r = "buildIn" === t,
                  n = parseInt(e.alphaOffset),
                  s = Math.round(0.3 * i.offsetWidth + 0.3 * i.offsetHeight),
                  a = 45;
                (("forward" === e.direction && r) ||
                  ("backward" === e.direction && !r)) &&
                  ((a *= -1), (s *= -1));
                var o =
                  e.type +
                  "_" +
                  t +
                  "_" +
                  e.direction +
                  "_" +
                  n +
                  "_" +
                  s +
                  "_" +
                  a;
                if (x[o]) return o;
                return (
                  y(o, [
                    {
                      percent: r ? 0 : 100,
                      props: {
                        transform:
                          "translateZ(" + s + "px) rotate(" + a + "deg)",
                        opacity: n / 100,
                      },
                    },
                    {
                      percent: r ? 100 : 0,
                      props: {
                        transform: "translateZ(0) rotate(0)",
                        opacity: "1",
                      },
                    },
                  ]),
                  o
                );
              })(t, i, e);
              break;
            case "instant":
              break;
            case "flip":
              s = (function (e, t) {
                var i = "buildIn" === t,
                  r = e.deg || 80,
                  n = 0,
                  s = 0,
                  a = parseInt(e.alphaOffset),
                  o = "1, 1, 0, 0deg";
                switch ((i || (r *= -1), e.direction)) {
                  case "bottom":
                    n = r;
                    break;
                  case "top":
                    n = -r;
                    break;
                  case "right":
                    s = -r;
                    break;
                  case "left":
                    s = r;
                    break;
                  case "topLeft":
                    o = "-1, 1, 0, " + r + "deg";
                    break;
                  case "topRight":
                    o = "1, 1, 0, " + -r + "deg";
                    break;
                  case "bottomLeft":
                    o = "1, 1, 0, " + r + "deg";
                    break;
                  case "bottomRight":
                    o = "-1, 1, 0, " + -r + "deg";
                }
                var l =
                  e.type + "_" + t + "_" + e.direction + "_" + a + "_" + r;
                if (x[l]) return l;
                return (
                  y(l, [
                    {
                      percent: i ? 0 : 100,
                      props: {
                        transform:
                          "rotateX(" +
                          n +
                          "deg) rotateY(" +
                          s +
                          "deg) rotate3d(" +
                          o +
                          ")",
                        opacity: a / 100,
                      },
                    },
                    { percent: 50, props: { opacity: "1" } },
                    {
                      percent: i ? 100 : 0,
                      props: {
                        transform:
                          "rotateX(0) rotateY(0) rotate3d(1, 1, 0, 0deg)",
                        opacity: "1",
                      },
                    },
                  ]),
                  l
                );
              })(t, i);
              break;
            case "zoom":
              s = (function (e, t) {
                var i = "buildIn" === t,
                  r = parseInt(e.alphaOffset),
                  n = 0,
                  s = 0;
                switch (e.direction) {
                  case "l2r":
                    n = -50;
                    break;
                  case "r2l":
                    n = 50;
                    break;
                  case "t2b":
                    s = -50;
                    break;
                  case "b2t":
                    s = 50;
                }
                i || ((n *= -1), (s *= -1));
                var a =
                  e.type +
                  "_" +
                  t +
                  "_" +
                  n +
                  "_" +
                  s +
                  "_" +
                  e.zoom +
                  "_" +
                  r +
                  "_" +
                  e.blurAmount;
                if (x[a]) return a;
                var o = {
                  transform:
                    "scale(" +
                    e.zoom +
                    ") translateX(" +
                    n +
                    "%) translateY(" +
                    s +
                    "%)",
                  filter: "blur(" + e.blurAmount + "px)",
                  opacity: r / 100,
                };
                return (
                  y(a, [
                    { percent: i ? 0 : 100, props: o },
                    {
                      percent: i ? 100 : 0,
                      props: {
                        transform: "scale(1)",
                        filter: "blur(0)",
                        opacity: "1",
                      },
                    },
                  ]),
                  a
                );
              })(t, i);
              break;
            case "roll":
              s = (function (e, t) {
                var i = "buildIn" === t,
                  r = u(e, i),
                  n = r.translateX,
                  s = r.translateY,
                  a = r.alpha,
                  o = 1;
                ((n < 0 && 0 <= s) || (s < 0 && n <= 0)) && (o = -1);
                var l = 540 * o,
                  p =
                    e.type +
                    "_" +
                    t +
                    "_" +
                    n +
                    "_" +
                    s +
                    "_" +
                    a +
                    "_" +
                    l +
                    "_" +
                    e.blurAmount;
                if (x[p]) return p;
                var d = {
                  transform:
                    "translateX(" +
                    n +
                    "px) translateY(" +
                    s +
                    "px) rotate(" +
                    l +
                    "deg)",
                  filter: "blur(" + e.blurAmount + "px)",
                  opacity: a / 100,
                };
                return (
                  y(p, [
                    { percent: i ? 0 : 100, props: d },
                    {
                      percent: i ? 100 : 0,
                      props: {
                        transform: "translateX(0) translateY(0) rotate(0deg)",
                        filter: "blur(0)",
                        opacity: "1",
                      },
                    },
                  ]),
                  p
                );
              })(t, i);
              break;
            case "slide":
              s = (function (e, t) {
                var i = "buildIn" === t,
                  r = u(e, i),
                  n = r.translateX,
                  s = r.translateY,
                  a = r.alpha,
                  o = e.type + "_" + t + "_" + n + "_" + s + "_" + a;
                if (x[o]) return o;
                return (
                  y(o, [
                    {
                      percent: i ? 0 : 100,
                      props: {
                        transform:
                          "translateX(" + n + "px) translateY(" + s + "px)",
                        opacity: a / 100,
                      },
                    },
                    {
                      percent: i ? 100 : 0,
                      props: {
                        transform: "translateX(0) translateY(0)",
                        opacity: "1",
                      },
                    },
                  ]),
                  o
                );
              })(t, i);
              break;
            case "slideBounce":
              s = (function (e, t) {
                var i = "buildIn" === t,
                  r = u(e, i),
                  n = r.translateX,
                  s = r.translateY,
                  a = r.alpha,
                  o = "slideBounce_" + t + "_" + n + "_" + s + "_" + a;
                if (x[o]) return o;
                for (
                  var l,
                    p = [
                      [0, n, s, a / 100],
                      [38, 0, 0, 1],
                      [55, 0.11 * n, 0.11 * s, 1],
                      [72, 0, 0, 1],
                      [81, 0.05 * n, 0.05 * s, 1],
                      [90, 0, 0, 1],
                      [95, 0.02 * n, 0.02 * s, 1],
                      [100, 0, 0, 1],
                    ],
                    d = [],
                    c = 0;
                  (l = p[c]);
                  c++
                ) {
                  var h = {
                    transform:
                      "translateX(" + l[1] + "px) translateY(" + l[2] + "px)",
                    opacity: l[3],
                    "animation-timing-function": c % 2 ? "ease-out" : "ease-in",
                  };
                  d.push({ percent: i ? l[0] : 100 - l[0], props: h });
                }
                return y(o, d), o;
              })(t, i);
              break;
            case "slideElastic":
              s = (function (e, t) {
                var i = "buildIn" === t,
                  r = u(e, i),
                  n = r.translateX,
                  s = r.translateY,
                  a = r.alpha,
                  o = "slideElastic_" + t + "_" + n + "_" + s + "_" + a;
                if (x[o]) return o;
                for (
                  var l,
                    p = [
                      [0, n, s, a / 100],
                      [16, -0.25 * n, -0.25 * s, 1],
                      [28, 0.11 * n, 0.11 * s, 1],
                      [44, -0.05 * n, -0.05 * s, 1],
                      [60, 0.02 * n, 0.02 * s, 1],
                      [72, -0.01 * n, -0.01 * s, 1],
                      [88, 0.01 * n, 0.01 * s, 1],
                      [100, 0, 0, 1],
                    ],
                    d = [],
                    c = 0;
                  (l = p[c]);
                  c++
                ) {
                  var h = {
                    transform:
                      "translateX(" + l[1] + "px) translateY(" + l[2] + "px)",
                    opacity: l[3],
                  };
                  d.push({ percent: i ? l[0] : 100 - l[0], props: h });
                }
                return y(o, d), o;
              })(t, i);
              break;
            case "scale":
              s = (function (e, t) {
                var i = "buildIn" === t,
                  r = v(e, i),
                  n = r.startScaleX,
                  s = r.startScaleY,
                  a = r.transformOrigin,
                  o =
                    "scale_" +
                    t +
                    "_" +
                    a.replace(" ", "_") +
                    "_" +
                    n +
                    "_" +
                    s;
                return (
                  x[o] ||
                    y(o, [
                      {
                        percent: i ? 0 : 100,
                        props: {
                          transform: "scaleX(" + n + ") scaleY(" + s + ")",
                          "transform-origin": a,
                        },
                      },
                      {
                        percent: i ? 100 : 0,
                        props: {
                          transform: "scaleX(1) scaleY(1)",
                          "transform-origin": a,
                        },
                      },
                    ]),
                  o
                );
              })(t, i);
              break;
            case "scaleBounce":
              s = (function (e, t) {
                var i = "buildIn" === t,
                  r = v(e, i),
                  n = r.startScaleX,
                  s = r.startScaleY,
                  a = r.transformOrigin,
                  o =
                    "scaleBounce_" +
                    t +
                    "_" +
                    a.replace(" ", "_") +
                    "_" +
                    n +
                    "_" +
                    s;
                if (x[o]) return o;
                for (
                  var l,
                    p = function (e) {
                      return n || e;
                    },
                    d = function (e) {
                      return s || e;
                    },
                    c = [
                      [0, n, s],
                      [38, 1, 1],
                      [55, p(0.7), d(0.7)],
                      [72, 1, 1],
                      [81, p(0.84), d(0.84)],
                      [90, 1, 1],
                      [95, p(0.95), d(0.95)],
                      [100, 1, 1],
                    ],
                    h = [],
                    u = 0;
                  (l = c[u]);
                  u++
                ) {
                  var f = {
                    transform: "scaleX(" + l[1] + ") scaleY(" + l[2] + ")",
                    "transform-origin": a,
                    "animation-timing-function": u % 2 ? "ease-out" : "ease-in",
                  };
                  h.push({ percent: i ? l[0] : 100 - l[0], props: f });
                }
                return y(o, h), o;
              })(t, i);
              break;
            case "scaleElastic":
              s = (function (e, t) {
                var i = "buildIn" === t,
                  r = v(e, i),
                  n = r.startScaleX,
                  s = r.startScaleY,
                  a = r.transformOrigin,
                  o =
                    "scaleElastic_" +
                    t +
                    "_" +
                    a.replace(" ", "_") +
                    "_" +
                    n +
                    "_" +
                    s;
                if (x[o]) return o;
                for (
                  var l,
                    p = function (e) {
                      return n || e;
                    },
                    d = function (e) {
                      return s || e;
                    },
                    c = [
                      [0, n, s],
                      [16, p(1.35), d(1.35)],
                      [28, p(0.86), d(0.86)],
                      [44, p(1.05), d(1.05)],
                      [60, p(0.98), d(0.98)],
                      [72, p(1.01), d(1.01)],
                      [88, p(0.99), d(0.99)],
                      [100, 1, 1],
                    ],
                    h = [],
                    u = 0;
                  (l = c[u]);
                  u++
                )
                  h.push({
                    percent: i ? l[0] : 100 - l[0],
                    props: {
                      transform: "scaleX(" + l[1] + ") scaleY(" + l[2] + ")",
                      "transform-origin": a,
                    },
                  });
                return y(o, h), o;
              })(t, i);
              break;
            case "blur":
              s = w(t, i);
              break;
            case "alpha":
              s = S(0, i);
              break;
            case "alpha-words":
            case "blur-words":
              s = (function (e, t, i, r) {
                var n,
                  s = e.getElementsByClassName("text-content")[0],
                  a = e.getElementsByClassName("row");
                if (s && !a.length)
                  !(function (e) {
                    if (!e.getElementsByTagName("span").length) {
                      for (
                        var t = e.innerHTML,
                          i = "<span>",
                          r = !1,
                          n = !1,
                          s = 0;
                        s < t.length;
                        s++
                      )
                        (n =
                          " " === t[s] || "\n" === t[s]
                            ? (n && (i += "</span>"), !(r = !0))
                            : (r && (i += "<span>"), !(r = !1))),
                          (i += t[s]);
                      (i += "</span>"), (e.innerHTML = i);
                    }
                  })(s),
                    (n = s.getElementsByTagName("span"));
                else {
                  if (!a.length) return;
                  e.getElementsByClassName("word").length ||
                    ((a = [].slice.call(a)), C(a)),
                    (n = e.getElementsByClassName("word"));
                }
                var o = (t.duration - t.wordsDuration) / (n.length - 1 || 1);
                o < 0 && (o = 0);
                var l = t.wordsAppearOrder || "random",
                  p = 0,
                  d = 0;
                for (n = [].slice.call(n); n.length; ) {
                  var c, h;
                  (c =
                    "r2l" === l
                      ? n.pop()
                      : "l2r" === l
                      ? n.shift()
                      : ((d = Math.floor(Math.random() * n.length)),
                        n.splice(d, 1)[0])),
                    (h = {
                      tween: t.tween,
                      ease: t.ease,
                      duration: Math.min(t.wordsDuration, t.duration),
                      blurAmount: t.blurAmount,
                      delay: p * o + Number(t.delay),
                    });
                  var u = null;
                  switch (t.type) {
                    case "alpha-words":
                      u = S(0, i);
                      break;
                    case "blur-words":
                      u = w(t, i);
                  }
                  if (u) {
                    var f = Number(h.duration) || 1e-4,
                      y =
                        u +
                        " " +
                        Number(f) +
                        "s " +
                        g(t) +
                        " " +
                        m(h.delay + r, 3) +
                        "s both";
                    b(c, y), c.setAttribute("word-delay", p * o);
                  }
                  p++;
                }
              })(e, t, i, r);
              break;
            case "pulsate":
              switch ((o = t.variation)) {
                case "heartbeat":
                  (a = "none"),
                    (s = (function (e, t) {
                      for (
                        var i,
                          r =
                            e.type +
                            "_" +
                            t +
                            "_" +
                            e.ease +
                            "_" +
                            e.tween +
                            "_" +
                            10 * e.motionTime +
                            "_" +
                            e.variation,
                          n = [
                            [0, 1, "ease-out"],
                            [10, 0.91, "ease-in"],
                            [17, 0.98, "ease-out"],
                            [33, 0.87, "ease-in"],
                            [45, 1, "ease-out"],
                          ],
                          s = [],
                          a = 0;
                        (i = n[a]);
                        a++
                      )
                        s.push({
                          percent: i[0],
                          props: {
                            transform: "scale(" + i[1] + ")",
                            "animation-timing-function": i[2],
                          },
                        });
                      return y(r, s), r;
                    })(t, i));
                  break;
                case "backward":
                case "forward":
                  (a = "none"),
                    (s = (function (e, t, i) {
                      var r =
                          e.type +
                          "_" +
                          t +
                          "_" +
                          e.ease +
                          "_" +
                          e.tween +
                          "_" +
                          10 * e.motionTime +
                          "_" +
                          e.variation,
                        n = { transform: "scale(1)" };
                      return (
                        y(r, [
                          { percent: 0, props: n },
                          {
                            percent: 50,
                            props: {
                              transform:
                                "scale(" + ("forward" === i ? 1.1 : 0.9) + ")",
                            },
                          },
                          { percent: 100, props: n },
                        ]),
                        r
                      );
                    })(t, i, o));
                  break;
                case "ping":
                  (a = "none"),
                    (s = (function (e, t) {
                      for (
                        var i,
                          r =
                            e.type +
                            "_" +
                            t +
                            "_" +
                            e.ease +
                            "_" +
                            e.tween +
                            "_" +
                            10 * e.motionTime +
                            "_" +
                            e.variation,
                          n = [
                            [0, 0.2, 0.8],
                            [80, 1.2, 0],
                            [100, 2.2, 0],
                          ],
                          s = [],
                          a = 0;
                        (i = n[a]);
                        a++
                      )
                        s.push({
                          percent: i[0],
                          props: {
                            transform: "scale(" + i[1] + ")",
                            opacity: i[2],
                          },
                        });
                      return y(r, s), r;
                    })(t, i));
              }
              break;
            case "vibrate":
              (a = "none"),
                (s = (function (e, t, i) {
                  for (
                    var r,
                      n = Math.ceil(2 * i),
                      s =
                        e.type +
                        "_" +
                        t +
                        "_" +
                        e.ease +
                        "_" +
                        e.tween +
                        "_" +
                        10 * e.motionTime +
                        "_" +
                        n,
                      a = [
                        [0, 0, 0],
                        [20, -n, n],
                        [40, -n, -n],
                        [60, n, n],
                        [80, n, -n],
                        [100, 0, 0],
                      ],
                      o = [],
                      l = 0;
                    (r = a[l]);
                    l++
                  )
                    o.push({
                      percent: r[0],
                      props: {
                        transform: "translate(" + r[1] + "px," + r[2] + "px)",
                      },
                    });
                  return y(s, o), s;
                })(t, i, n));
              break;
            case "shake":
              var o;
              switch (((a = "none"), (o = t.variation))) {
                case "leftRight":
                case "top":
                case "left":
                case "right":
                  s = (function (e) {
                    for (
                      var t,
                        i = e.variation,
                        r =
                          e.type +
                          "_" +
                          e.ease +
                          "_" +
                          e.tween +
                          "_" +
                          10 * e.motionTime +
                          "_" +
                          i,
                        n = "leftRight" === i ? 8 : 2,
                        s = "leftRight" === i ? 10 : 4,
                        a = (function (e) {
                          switch (e) {
                            case "top":
                              return "50% 0";
                            case "leftRight":
                              return "50% 50%";
                            case "right":
                              return "100% 50%";
                            case "left":
                              return "0 50%";
                            default:
                              return "";
                          }
                        })(i),
                        o = [
                          [0, 0],
                          [100, 0],
                          [10, n],
                          [20, -s],
                          [40, -s],
                          [60, -s],
                          [30, s],
                          [50, s],
                          [70, s],
                          [80, -n],
                          [90, n],
                        ],
                        l = [],
                        p = 0;
                      (t = o[p]);
                      p++
                    )
                      l.push({
                        percent: t[0],
                        props: {
                          transform: "rotate(" + t[1] + "deg)",
                          "transform-origin": a,
                        },
                      });
                    return y(r, l), r;
                  })(t);
                  break;
                case "horizontal":
                case "vertical":
                  s = (function (e, t) {
                    for (
                      var i,
                        r = e.variation,
                        n = "horizontal" === r,
                        s = n ? Math.ceil(10 * t) : Math.ceil(8 * t),
                        a = n ? Math.ceil(8 * t) : Math.ceil(6 * t),
                        o =
                          e.type +
                          "_" +
                          e.ease +
                          "_" +
                          e.tween +
                          "_" +
                          10 * e.motionTime +
                          "_" +
                          r +
                          "_" +
                          s,
                        l = [
                          [0, 0],
                          [100, 0],
                          [10, -s],
                          [30, -s],
                          [50, -s],
                          [70, -s],
                          [20, s],
                          [40, s],
                          [60, s],
                          [80, a],
                          [90, -a],
                        ],
                        p = [],
                        d = 0;
                      (i = l[d]);
                      d++
                    )
                      p.push({
                        percent: i[0],
                        props: {
                          transform:
                            "translate" + (n ? "X" : "Y") + "(" + i[1] + "px)",
                        },
                      });
                    return y(o, p), o;
                  })(t, n);
              }
              break;
            case "flicker":
              (a = "none"),
                (s = (function (e) {
                  for (
                    var t,
                      i =
                        e.type +
                        "_" +
                        10 * e.motionTime +
                        "_" +
                        e.ease +
                        "_" +
                        e.tween,
                      r = [
                        [0, 1],
                        [100, 1],
                        [32.98, 1],
                        [33, 0],
                        [34, 0],
                        [34.02, 1],
                        [34.98, 1],
                        [35, 0],
                        [35.9, 0],
                        [35.92, 1],
                        [38.98, 1],
                        [39, 0],
                        [39.8, 0],
                        [39.82, 1],
                        [83.98, 1],
                        [84, 0],
                        [84.9, 0],
                        [84.92, 1],
                      ],
                      n = [],
                      s = 0;
                    (t = r[s]);
                    s++
                  )
                    n.push({ percent: t[0], props: { opacity: t[1] } });
                  return y(i, n), i;
                })(t));
              break;
            case "blink":
              (a = "none"),
                (s = (function (e) {
                  var t =
                      e.type +
                      "_" +
                      e.ease +
                      "_" +
                      e.tween +
                      "_" +
                      10 * e.motionTime,
                    i = { opacity: "1" };
                  return (
                    y(t, [
                      { percent: 0, props: i },
                      { percent: 50, props: { opacity: "0.2" } },
                      { percent: 100, props: i },
                    ]),
                    t
                  );
                })(t));
              break;
            case "jello":
              (a = "none"),
                (s = (function (e, t) {
                  for (
                    var i,
                      r =
                        e.type +
                        "_" +
                        t +
                        "_" +
                        e.ease +
                        "_" +
                        e.tween +
                        "_" +
                        10 * e.motionTime +
                        "_" +
                        e.direction,
                      n = [
                        [0, 1, 1, 1],
                        [30, 0.75, 1.25, 1],
                        [40, 1.25, 0.75, 1],
                        [50, 0.85, 1.15, 1],
                        [65, 1.05, 0.95, 1],
                        [75, 0.95, 1.05, 1],
                        [100, 1, 1, 1],
                      ],
                      s = [],
                      a = 0;
                    (i = n[a]);
                    a++
                  ) {
                    var o =
                      "vertical" === e.direction
                        ? "scale3d(" + i[1] + "," + i[2] + "," + i[3] + ")"
                        : "scale3d(" + i[2] + "," + i[1] + "," + i[3] + ")";
                    s.push({ percent: i[0], props: { transform: o } });
                  }
                  return y(r, s), r;
                })(t, i));
              break;
            case "bounce":
              (a = "none"),
                (s = (function (e, t) {
                  for (
                    var i,
                      r =
                        e.type +
                        "_" +
                        e.ease +
                        "_" +
                        e.tween +
                        "_" +
                        10 * e.motionTime +
                        "_" +
                        e.direction +
                        "_" +
                        100 * t,
                      n =
                        "right" === e.direction || "left" === e.direction
                          ? [
                              [0, "X", 48, "ease-in"],
                              [40, "X", 26, "ease-in"],
                              [65, "X", 13, "ease-in"],
                              [82, "X", 6.5, "ease-in"],
                              [93, "X", 4, "ease-in"],
                              [25, "X", 0, "ease-out"],
                              [55, "X", 0, "ease-out"],
                              [75, "X", 0, "ease-out"],
                              [87, "X", 0, "ease-out"],
                              [100, "X", 0, "ease-out"],
                            ]
                          : [
                              [0, "Y", 45, "ease-in"],
                              [40, "Y", 24, "ease-in"],
                              [65, "Y", 12, "ease-in"],
                              [82, "Y", 6, "ease-in"],
                              [93, "Y", 4, "ease-in"],
                              [25, "Y", 0, "ease-out"],
                              [55, "Y", 0, "ease-out"],
                              [75, "Y", 0, "ease-out"],
                              [87, "Y", 0, "ease-out"],
                              [100, "Y", 0, "ease-out"],
                            ],
                      s = [],
                      a = 0;
                    (i = n[a]);
                    a++
                  ) {
                    var o =
                      "left" === e.direction || "top" === e.direction
                        ? "translate" + i[1] + "(" + -1 * i[2] * t + "px)"
                        : "translate" + i[1] + "(" + i[2] * t + "px)";
                    s.push({
                      percent: i[0],
                      props: {
                        transform: o,
                        "animation-timing-function": i[3],
                      },
                    });
                  }
                  return y(r, s), r;
                })(t, t.zoom || 1));
          }
          if ("rotate" === t.type || "flip" === t.type) {
            var l =
              Math.round(0.7 * e.offsetWidth + 0.7 * e.offsetHeight) + "px";
            (e.style.perspective = l), (e.style.webkitPerspective = l);
          }
          if (e && s) {
            var p = (function (e, t) {
                return (
                  Number("buildMid" === t ? e.motionTime : e.duration) || 1e-4
                );
              })(t, i),
              d = (function (e, t) {
                return "buildMid" === t
                  ? Math.ceil(e.duration / e.motionTime)
                  : 1;
              })(t, i),
              c =
                s +
                " " +
                p +
                "s " +
                g(t) +
                " " +
                m(t.delay + r, 3) +
                "s " +
                d +
                " " +
                a;
            b(
              e.firstChild &&
                1 === e.firstChild.nodeType &&
                !e.classList.contains("word")
                ? e.firstChild
                : e,
              c
            );
          }
          var h = Number(t.duration) + Number(t.delay) + r;
          setTimeout(function () {
            t.onAnimationEnd && t.onAnimationEnd();
          }, Math.max(1e3 * h, 0));
        } else t.onAnimationEnd && t.onAnimationEnd();
      },
    };
  })();
var EventDispatcher = function () {};
function Stats(e) {
  (this.hash = e.hash),
    (this.userId = e.userId),
    (this.rotatorHash = e.rotatorHash),
    (this.sqsURI =
      "dev" === window.bannerConfig.env || "local" === window.bannerConfig.env
        ? "/174496846625/stats-bannersnack-dev"
        : "/174496846625/stats-bannersnack"),
    (this.sqsURL = "https://sqs.us-east-1.amazonaws.com" + this.sqsURI),
    (this.timestamp = !1),
    (this.ip = !1),
    (this.vid = !1),
    (this.viewTime = !1),
    (this.browser = eaUtils.getBrowser()),
    (this.params = {
      uid: this.userId,
      h: this.hash,
      eid: !1,
      ip: !1,
      b: this.browser[0],
      bv: this.browser[1],
      os: eaUtils.getOS(),
      d: eaUtils.getDevice(),
      r: eaUtils.getScreenSize(),
      mp: !1,
      t: !1,
      vid: !1,
      elt: !1,
      et: "view",
    }),
    this.rotatorHash && (this.params.rh = this.rotatorHash),
    (this.planned = {}),
    (this.slideSaved = !1),
    (this.banner = e.banner),
    (this.currentDomain = e.currentDomain),
    EventDispatcher.call(this);
}
function BaseDisplay() {
  window.EventDispatcher.call(this);
}
function BannerDisplay() {
  (this.startSlide = 0), (this.overflowSlide = null), BaseDisplay.call(this);
}
(EventDispatcher.prototype = {
  constructor: EventDispatcher,
  apply: function (e) {
    (e.on = EventDispatcher.prototype.on),
      (e.off = EventDispatcher.prototype.off),
      (e.trigger = EventDispatcher.prototype.trigger);
  },
  on: function (e, t) {
    void 0 === this._listeners && (this._listeners = {});
    var i,
      r,
      n = this._listeners;
    for (e = e.split(" "), r = 0; (i = e[r]); r++)
      (n[i] = n[i] || []), -1 === n[i].indexOf(t) && n[i].push(t);
  },
  off: function (e, t) {
    if (void 0 !== this._listeners) {
      var i = this._listeners[e];
      if (void 0 !== i) {
        var r = i.indexOf(t);
        -1 !== r && i.splice(r, 1);
      }
    }
  },
  trigger: function (e, t) {
    if (void 0 !== this._listeners) {
      var i = this._listeners[e];
      if (void 0 !== i) {
        var r = {};
        (r.target = this), (r.type = e), (r.data = t);
        for (var n = i.length, s = 0; s < n; s++) i[s].call(this, r);
      }
    }
  },
}),
  (Stats.prototype = new EventDispatcher()),
  ((Stats.prototype.constructor = Stats).prototype.plan = function (e, t, i) {
    if (this.timestamp) {
      this.planned[e] || (this.planned[e] = []);
      var r =
        t.displayData && t.displayData.type && "slide" == t.displayData.type;
      if (!this.slideSaved || !r) {
        !this.slideSaved && r && (this.slideSaved = r);
        var n = {};
        for (var s in this.params) n[s] = this.params[s];
        var a =
          (t.displayData &&
            t.displayData.properties &&
            t.displayData.properties.id) ||
          t.id;
        a && (n.eid = a),
          (n.ip = this.ip),
          (n.vid = this.vid),
          (n.t =
            this.timestamp +
            (Math.floor(new Date().getTime() / 1e3) - this.viewTime)),
          (n.mp = i.clientX + "x" + i.clientY),
          (n.et = i.type),
          (n.elt = this.getElementType(t)),
          this.planned[e].push(n);
      }
    }
  }),
  (Stats.prototype.launch = function (e) {
    if (e) this.sendSQSRequest(this.planned[e]), (this.planned[e] = []);
    else {
      var t = [];
      for (var i in this.planned)
        for (var r in this.planned[i]) t.push(this.planned[i][r]);
      this.sendSQSRequest(t), (this.planned = {});
    }
    this.slideSaved = !1;
  }),
  (Stats.prototype.isBlockedDomain = function (e) {
    return !!e && /bannersnack\.(local|net|com)/.test(e);
  }),
  (Stats.prototype.track = function () {
    var i = this,
      e = this.getStatsRequestUrl(),
      t = "bsStats_" + this.hash,
      r = this.isBlockedDomain(this.currentDomain),
      n = { h: this.hash, c: t },
      s = "";
    for (var a in n) s += a + "=" + encodeURIComponent(n[a]) + "&";
    (e += "?" + (s = s.replace(/&$/, ""))),
      (window[t] = function (e) {
        var t = i.params;
        (i.timestamp = t.t = e.t),
          (i.ip = t.ip = e.ip),
          (i.vid = t.vid = e.vid),
          (t.et = "view"),
          (i.viewTime = Math.floor(new Date().getTime() / 1e3)),
          e.premium || i.banner.showWatermark(),
          r || i.trackView(t);
      });
    var o = document.createElement("script");
    (o.src = e), document.getElementsByTagName("head")[0].appendChild(o);
  }),
  (Stats.prototype.trackView = function (e) {
    delete e.mp, delete e.eid, delete e.elt;
    var t = [];
    t.push(e), this.sendSQSRequest(t);
  }),
  (Stats.prototype.trackEvent = function (e, i) {
    var r = this;
    e.addEventListener("click", function (e) {
      var t = r.getCurrentSlideFromOverflow(i);
      t && r.plan("click", t, e), r.plan("click", i, e);
    });
  }),
  (Stats.prototype.getCurrentSlideFromOverflow = function (e) {
    return e && e.properties && e.properties.showOnAllSlides
      ? e.slide.banner.currentSlide
      : !!(
          e &&
          e.menu &&
          e.menu.properties &&
          e.menu.properties.showOnAllSlides
        ) && e.menu.slide.banner.currentSlide;
  }),
  (Stats.prototype.sendSQSRequest = function (e) {
    this.sendData(
      this.sqsURL +
        "?Action=SendMessage&MessageBody=" +
        encodeURIComponent(JSON.stringify(e))
    );
  }),
  (Stats.prototype.sendData = function (e) {
    if (!e) return !1;
    var t = new XMLHttpRequest();
    t.open("GET", e, !0), t.send();
  }),
  (Stats.prototype.getStatsRequestUrl = function () {
    if (window.bannerConfig.env) {
      if ("live" === window.bannerConfig.env)
        return "//stats.bannersnack.com/info/";
      if ("dev" === window.bannerConfig.env)
        return "//stats-dev.bannersnack.net/info/";
      if ("local" === window.bannerConfig.env)
        return "//stats-dev.bannersnack.net/info/";
    }
    return "//stats.bannersnack.com/info/";
  }),
  (Stats.prototype.getElementType = function (e) {
    if (!e) return !1;
    var t = e.displayData && e.displayData.type;
    if ("slide" == t) return t;
    if ("layer" != t) return e.itemIndex && e.menu ? "menuItem" : "banner";
    var i = e.displayData && e.displayData.layerType;
    return i || !1;
  }),
  (BaseDisplay.prototype = new window.EventDispatcher()),
  (BaseDisplay.prototype.constructor = window.EventDispatcher),
  (BaseDisplay.prototype.container = null),
  (BaseDisplay.prototype.displayContainer = null),
  (BaseDisplay.prototype.properties = null),
  (BaseDisplay.prototype.displayData = null),
  (BaseDisplay.prototype.buildTimeouts = []),
  (BaseDisplay.prototype.init = function (e) {
    return (
      (this.displayData = e),
      (this.displayData.properties = this.parseProps(
        this.displayData.properties
      )),
      this.trigger("init"),
      this
    );
  }),
  (BaseDisplay.prototype.parseProps = function (e) {
    for (
      var t, i = ["buildIn", "buildOut", "transition"], r = 0;
      (t = i[r]);
      r++
    )
      if (e[t])
        switch (e[t].tween) {
          case "Bounce":
          case "Elastic":
            ("scale" !== e[t].type && "slide" !== e[t].type) ||
              ((e[t].type += e[t].tween),
              "Elastic" === e[t].tween && (e[t].ease = "easeOut")),
              (e[t].tween = "");
        }
    return e;
  }),
  (BaseDisplay.prototype.render = function () {}),
  (BaseDisplay.prototype.reset = function () {
    var e, t;
    for (
      window.eff.clearAll(this.container), e = 0;
      (t = this.buildTimeouts[e]);
      e++
    )
      clearTimeout(t);
    for (
      this.buildTimeouts = [],
        this.transform("none"),
        this.webkitTransform("translate3d(0,0,0)"),
        this.setStyle(this.container, "x,y,width,height", "px"),
        this.container.style.opacity = "1",
        this.container.style.display = "",
        this.container.style.filter = "",
        this.container.style["-webkit-filter"] = "",
        this.container.style.animation = "",
        this.container.style["-webkit-animation"] = "",
        e = 0;
      (t = this.buildTimeouts[e]);
      e++
    )
      clearTimeout(t);
    if (((this.buildTimeouts = []), this.displayContainer)) {
      var i =
        void 0 !== this.properties.opacity ? this.properties.opacity : 100;
      this.displayContainer.style.opacity = i / 100;
    }
  }),
  (BaseDisplay.prototype.createMainContainers = function (e, t, i) {
    var r;
    if (
      (this.properties &&
        this.properties.actions &&
        this.slide &&
        this.slide.banner.config.pdf &&
        (r = this.properties.actions.find(function (e) {
          return "click" === e.event && "gotoURL" === e.type && e.url;
        })),
      (this.container = this.createElement("div", e)),
      this.properties && (this.properties.text || this.properties.buttonLabel))
    ) {
      var n = "none" !== this.properties.buildIn.type,
        s =
          this.properties.buildMid && "none" !== this.properties.buildMid.type,
        a = "none" !== this.properties.buildOut.type;
      (n || s || a) && (this.container.style.perspective = "1px");
    }
    (this.effHelper = this.createElement("div", "eff-helper")),
      r &&
        ((this.actionContainer = this.createElement("a", "action-container")),
        (this.actionContainer.href = r.url),
        (this.actionContainer.target = r.target || "_blank"),
        (this.actionContainer.style.cursor = r.useHandCursor ? "" : "auto")),
      (this.displayContainer = this.createElement(i || "div", t)),
      this.container.appendChild(this.effHelper),
      r
        ? (this.effHelper.appendChild(this.actionContainer),
          this.actionContainer.appendChild(this.displayContainer))
        : this.effHelper.appendChild(this.displayContainer);
  }),
  (BaseDisplay.prototype.applyActions = function (n, e) {
    var s = this;
    if (!n || !e) return !1;
    if ("none" === n.type) return !1;
    var t = "pointer";
    void 0 !== n.useHandCursor && !1 === n.useHandCursor && (t = ""),
      (e.style.cursor = t),
      e.addEventListener(n.event, function (e) {
        if (e.clickFlag) return (e.clickFlag = !1);
        if (n.disabled) return !1;
        if (((e.clickFlag = this), "gotoSlide" === n.type)) {
          var t = s.slide.getBuildOutTime();
          t &&
            ((n.disabled = !0),
            setTimeout(function () {
              n.disabled = !1;
            }, t)),
            null === n.slideOrUrl && (n.slideOrUrl = "next");
          var i = s.slide.banner.currentSlide;
          switch (n.slideOrUrl) {
            case "first":
              s.slide.banner.preload.assets(
                null,
                s.slide.getFirstSlide(),
                s.slide.banner.config
              ),
                i.buildOut(s.slide.getFirstSlide());
              break;
            case "last":
              s.slide.banner.preload.assets(
                null,
                s.slide.getLastSlide(),
                s.slide.banner.config
              ),
                i.buildOut(s.slide.getLastSlide());
              break;
            case "next":
              s.slide.banner.preload.assets(
                null,
                s.slide.getNextSlide(),
                s.slide.banner.config
              ),
                i.buildOut(s.slide.getNextSlide());
              break;
            case "prev":
              s.slide.banner.preload.assets(
                null,
                s.slide.getPrevSlide(),
                s.slide.banner.config
              ),
                i.buildOut(s.slide.getPrevSlide());
              break;
            default:
              s.slide.banner.preload.assets(
                null,
                i.getSlideByHashOrId(n.slideOrUrl),
                s.slide.banner.config
              ),
                i.buildOut(i.getSlideByHashOrId(n.slideOrUrl));
          }
        } else if (s.hash || !window.bannerConfig.pdf) {
          var r = "";
          (r = eaUtils.getClickTagValue()
            ? eaUtils.addProtocolToUrl(eaUtils.getClickTagValue())
            : window.clickTag
            ? eaUtils.addProtocolToUrl(window.clickTag)
            : n.slideOrUrl),
            window.open(r, n.target);
        }
      });
  }),
  (BaseDisplay.prototype.createElement = function (e, t, i, r, n) {
    var s = n || document.createElement(e);
    return (
      s.setAttribute("class", t),
      0 != i && (r || this.container) && (r || this.container).appendChild(s),
      s.setAttribute("id", eaUtils.getElementUniqueId()),
      s
    );
  }),
  (BaseDisplay.prototype.setStyle = function (e, t, i) {
    i = i || "";
    var r = {
      x: "left",
      y: "top",
      labelOffsetX: "margin-left",
      labelOffsetY: "margin-top",
      lineHeight: "line-height",
    };
    for (var n in (t = t.split(",")))
      if (t.hasOwnProperty(n)) {
        var s = r[t[n]] || t[n],
          a = this.properties[t[n]];
        if ("width" === s || "height" === s) {
          var o = this.properties.scale || 1;
          e.style[s] = Math.round(a) * o + i;
        } else
          e.style[s] =
            "left" === s || "right" === s ? Math.round(a) + i : a + i;
      }
    return this;
  }),
  (BaseDisplay.prototype.getContainer = function () {
    return this.container;
  }),
  (BaseDisplay.prototype.show = function () {
    return (this.container.style.display = ""), this;
  }),
  (BaseDisplay.prototype.hide = function () {
    return (this.container.style.display = "none"), this;
  }),
  (BaseDisplay.prototype.hasClass = function (e, t) {
    return !!e && new RegExp("(\\s|^)" + t + "(\\s|$)").test(e.className);
  }),
  (BaseDisplay.prototype.removeClass = function (e, t) {
    return (
      this.hasClass(e, t) &&
        (e.className = e.className
          .replace(new RegExp("(\\s|^)" + t + "(\\s|$)"), " ")
          .replace(/^\s+|\s+$/g, "")),
      this
    );
  }),
  (BaseDisplay.prototype.addClass = function (e, t) {
    return (
      e &&
        (this.hasClass(e, t) || (e.className += (e.className ? " " : "") + t)),
      this
    );
  }),
  (BaseDisplay.prototype.toggleClass = function (e, t) {
    return (
      e && (this.hasClass(e, t) ? this.removeClass(e, t) : this.addClass(e, t)),
      this
    );
  }),
  (BaseDisplay.prototype.applyBackground = function (e, t, i) {
    var r = eaUtils.getBackgroundCss(t);
    for (var n in r)
      switch (n) {
        default:
          e.style[n] = r[n];
          break;
        case "background-image":
          if ("lgrad" === t.type || "rgrad" === t.type)
            for (var s = 0; s < r[n].length; s++)
              e.style.backgroundImage = r[n][s];
          else e.style[n] = r[n];
          break;
        case "background":
          for (s = 0; s < r[n].length; s++) e.style.background = r[n][s];
          break;
        case "--retina-src":
          i &&
            this.properties.retinaReady &&
            (e.classList.add("retina"),
            e.style.setProperty(n, 'url("' + this.getRetinaUrl(r[n]) + '")'));
      }
    t &&
      t.type &&
      "image" == t.type &&
      ("userCrop" !== t.scaleMode &&
        eaUtils.toggleBackroundClasses(e, t.scaleMode),
      eaUtils.applyImageSizeOnBackground(e, t));
  }),
  (BaseDisplay.prototype.applyBoxShadow = function (e, t) {
    eaUtils.applyCss(e, eaUtils.getBoxShadowCss(t));
  }),
  (BaseDisplay.prototype.applyFilters = function (e, t, i, r) {
    eaUtils.applyCss(e, eaUtils.getFiltersCss(t, i, r));
  }),
  (BaseDisplay.prototype.getFlipString = function (e) {
    return e
      ? "scale(" +
          ("both" === e || "horizontal" === e ? "-1" : "1") +
          ", " +
          ("both" === e || "vertical" === e ? "-1" : "1") +
          ")"
      : "";
  }),
  (BaseDisplay.prototype.getBRadius = function () {
    var e = this.properties,
      t = e.border || {},
      i = 0;
    return (
      "rectangle" === e.type &&
        (void 0 !== t.radius
          ? (i = t.radius)
          : void 0 !== e.bradius && (i = e.bradius)),
      i
    );
  }),
  (BaseDisplay.prototype.getBorderString = function (e) {
    var t = e || this.properties.border || {};
    return void 0 === t.weight || void 0 === t.color
      ? ""
      : t.weight + "px solid " + t.color;
  }),
  (BaseDisplay.prototype.getAnimationEl = function () {
    return this.container;
  }),
  (BaseDisplay.prototype.setBuildMidAnimation = function () {
    var e = this;
    function t() {
      (e.isHover = !0), window.eff.animate(o, p, "buildMid");
    }
    function i() {
      e.isHover = !1;
    }
    function r() {
      e.isHover || e.reset();
    }
    function n() {
      d &&
        !c &&
        (p.onAnimationEnd = function () {
          e.setBuildOutAnimation();
        });
    }
    var s = 1 !== e.slide.banner.properties.loopCount,
      a = this.displayData.properties,
      o = this.getAnimationEl(),
      l = a.buildIn,
      p = a.buildMid,
      d = a.buildOut,
      c = "none" === d.type,
      h = p.delay,
      u = p.duration;
    if (!e.properties.showOnAllSlides) {
      var f = e.slide.displayData.properties.duration,
        y = e.slide.displayData.properties.stopSlide,
        g = "none" !== l.type ? l.delay + l.duration : 0,
        b = p && "none" !== p.type ? p.delay + p.duration : 0,
        m = g + b + d.delay + d.duration;
      (("instant" === d.type && f < m) || (d && !y && f < g)) && (d = null),
        s &&
          p &&
          "none" !== p.type &&
          f < g + b &&
          (p.duration = parseFloat((f - g - p.delay).toFixed(1)));
    }
    "hover" !== p.startEnd
      ? (window.eff.animate(o, p, "buildMid"),
        setTimeout(function () {
          ((s && u === p.duration) || !s) &&
            ((p.delay = 0),
            (p.duration = 0),
            n(),
            window.eff.animate(o, p, "buildMid")),
            (p.delay = h),
            (p.duration = u);
        }, 1e3 * (p.delay + p.duration)))
      : ((e.isHover = !1),
        d && !c && (p.onAnimationEnd = null),
        setTimeout(function () {
          (p.delay = 0),
            o.addEventListener("mouseenter", t),
            o.addEventListener("animationiteration", r),
            o.addEventListener("mouseleave", i),
            setTimeout(function () {
              o.removeEventListener("mouseenter", t),
                o.removeEventListener("animationiteration", r),
                o.removeEventListener("mouseleave", i),
                ((s && u === p.duration) || (!s && d && !c)) &&
                  ((p.delay = 0),
                  (p.duration = 0),
                  n(),
                  window.eff.animate(o, p, "buildMid")),
                (p.delay = h),
                (p.duration = u);
            }, 1e3 * p.duration);
        }, 1e3 * p.delay));
  }),
  (BaseDisplay.prototype.setBuildOutAnimation = function () {
    var e = this.getAnimationEl(),
      t = this.displayData.properties.buildOut,
      i = this;
    i.buildTimeouts.push(
      setTimeout(function () {
        i.trigger("buildOutStart");
      }, 1e3 * t.delay)
    ),
      window.eff.animate(e, t, "buildOut"),
      i.buildTimeouts.push(
        setTimeout(function () {
          i.trigger("buildOutEnd"), (e.style.display = "none");
        }, 1e3 * (t.duration + t.delay))
      );
  }),
  (BaseDisplay.prototype.playAnimation = function (e) {
    var t = this,
      i = this.getAnimationEl(),
      r = this.displayData.properties,
      n = r.buildIn,
      s = r.buildMid,
      a = r.buildOut;
    if (((e = e || 0), !this.properties.showOnAllSlides)) {
      var o = this.slide.displayData.properties.duration,
        l = this.slide.displayData.properties.stopSlide,
        p = "none" !== n.type ? n.delay + n.duration : 0,
        d =
          p +
          (s && "none" !== s.type ? s.delay + s.duration : 0) +
          a.delay +
          a.duration;
      (("instant" === a.type && o < d) || (a && !l && o < p)) && (a = null);
    }
    n && "none" != n.type
      ? (this.buildTimeouts.push(
          setTimeout(function () {
            t.trigger("buildInStart");
          }, 1e3 * n.delay)
        ),
        "instant" === n.type &&
          0 < n.delay &&
          ((i.style.display = "none"),
          this.buildTimeouts.push(
            setTimeout(function () {
              i.style.display = "";
            }, 1e3 * (n.delay + e))
          )),
        (n.onAnimationEnd = function () {
          s && "none" != s.type
            ? t.setBuildMidAnimation()
            : a && "none" != a.type && t.setBuildOutAnimation();
        }),
        window.eff.animate(i, n, "buildIn", e),
        this.buildTimeouts.push(
          setTimeout(function () {
            t.trigger("buildInEnd");
          }, 1e3 * (n.duration + n.delay + e))
        ))
      : s && "none" != s.type
      ? t.setBuildMidAnimation()
      : a && "none" != a.type && t.setBuildOutAnimation();
  }),
  (BaseDisplay.prototype.transform = function (e, t) {
    ((t = t || this.container).style["-webkit-transform"] = e),
      (t.style["-o-transform"] = e),
      (t.style["-ms-transform"] = e),
      (t.style["-moz-transform"] = e),
      (t.style.transform = e);
  }),
  (BaseDisplay.prototype.webkitTransform = function (e, t) {
    (t = t || this.container).style["-webkit-transform"] = e;
  }),
  (BaseDisplay.prototype.createActionProperties = function (e) {
    var t =
      e ||
      (this.properties &&
        this.properties.actions &&
        this.properties.actions[0]);
    if (!t) return !1;
    var i = "";
    if ("gotoURL" == t.type) {
      if (!(i = t.url)) return !1;
      -1 == i.indexOf("://") && (i = "http://" + i);
    }
    return {
      event: t.event,
      slideOrUrl: "gotoSlide" == t.type ? t.slide : i,
      type: t.type,
      target: t.target,
      useHandCursor: t.useHandCursor,
    };
  }),
  (BaseDisplay.prototype.applyExtraPropertiesForGradients = function (e) {
    if ("string" != typeof this.properties.backgroundColor) {
      var t = this.properties.backgroundColor.type,
        i = this.properties.border ? this.properties.border.weight : 0;
      if ("lgrad" === t || "rgrad" === t) {
        var r = "-" + i + "px",
          n = "calc(100% + " + 2 * i + "px)";
        eaUtils.applyCss(e, {
          backgroundPosition: r + " " + r,
          backgroundSize: n + " " + n,
        });
      }
    }
  }),
  (BaseDisplay.prototype.getCropBackgroundPosition = function (e) {
    var t = e.cropData.x,
      i = e.cropData.y,
      r = e.width,
      n = e.height,
      s = e.border ? e.border.weight : 0,
      a = t - s,
      o = i - s;
    return (
      ("horizontal" !== e.flip && "both" !== e.flip) ||
        (a = r - (t + e.cropData.width) - s),
      ("vertical" !== e.flip && "both" !== e.flip) ||
        (o = n - (i + e.cropData.height) - s),
      { x: a, y: o }
    );
  }),
  (BaseDisplay.prototype.getRetinaUrl = function (e) {
    var t = "2x",
      i = e.lastIndexOf(".");
    return e.lastIndexOf("/") > i
      ? e + t
      : (-1 === i && (i = e.length), [e.slice(0, i), t, e.slice(i)].join(""));
  }),
  (BannerDisplay.prototype = new BaseDisplay()),
  ((BannerDisplay.prototype.constructor =
    BannerDisplay).prototype.currentSlide = null),
  (BannerDisplay.prototype.lastSlide = null);
var scripts = document.getElementsByTagName("script");
function ButtonDisplay() {
  BaseDisplay.call(this);
}
function ClipartDisplay() {
  BaseDisplay.call(this);
}
function ImageDisplay(e) {
  BaseDisplay.call(this), (this.retina = e);
}
function ShapeDisplay(e) {
  BaseDisplay.call(this), (this.retina = e);
}
function SlideDisplay() {
  (this.banner = null),
    (this.rendered = !1),
    (this._buildOutTimeout = null),
    (this.container = null),
    (this.elements = []),
    (this.LOOP_COUNT_FOREVER = 0);
}
function SvgDisplay() {
  BaseDisplay.call(this);
}
function TextDisplay() {
  BaseDisplay.call(this);
}
function EmbedCanvas() {
  EventDispatcher.call(this);
  var e = this;
  this.initBanner = function () {
    e.banner.init(
      e.json.banner,
      e.bannerContainer,
      e.config,
      e.preload,
      e.json.hash
    ),
      ((e.config.video || e.config.pdf) &&
        !e.config.autoPlay &&
        void 0 !== e.config.autoPlay) ||
        e.banner.play(),
      (e.inited = !0);
  };
}
(BannerDisplay.prototype.jsFileSrc = scripts[scripts.length - 1].src),
  (BannerDisplay.prototype.initPaths = function () {
    if (!window.bannerConfig.resourcesUrl) {
      var e = this.jsFileSrc.split("/");
      (e = e.slice(0, e.indexOf("js")).join("/")),
        (window.bannerConfig.resourcesUrl = e);
    }
  }),
  (BannerDisplay.prototype.init = function (e, t, i, r, n) {
    var s = this;
    (this.container = t),
      (this.displayContainer = this.createElement("div", "bs-helper")),
      this.displayContainer.setAttribute("style", "z-index: -1;"),
      this.container.appendChild(this.displayContainer),
      (this.properties = e.properties),
      (this.config = i),
      (this.startSlide = parseInt(i.startSlide) || 0),
      (this.noAnimation = Boolean(i.noAnimation) || !1),
      (this.showOnlyOneSlide = Boolean(i.showOnlyOneSlide) || !1),
      (this.preload = r),
      (this.hash = n),
      this.setStyle(this.container, "width,height", "px"),
      this.setStyle(this.displayContainer, "width,height", "px");
    var a = this.properties.backgroundColor || {};
    (this.properties.width < 2 || this.properties.height < 2) &&
      (a.useBorder = !1),
      a.useBorder &&
        ((this.displayContainer.style.left = "-1px"),
        (this.displayContainer.style.top = "-1px")),
      this.applyBackground(this.container, a, this.properties.retina),
      this.applyActions(this.createActionProperties(), this.container),
      BaseDisplay.prototype.init.call(this, e),
      this.initSlides(e.elements),
      this.container.addEventListener("click", function () {
        s.statsPresent &&
          !s.stats.isBlockedDomain(document.referrer) &&
          s.stats.launch();
      });
    var o = eaUtils.getProportion(
      this.properties.width,
      this.properties.height
    );
    window.addEventListener("resize", function () {
      (o = eaUtils.getProportion(s.properties.width, s.properties.height)),
        (s.container.style.transform = "scale(" + o.proportion + ")");
    }),
      (this.properties.transform = "scale(" + o.proportion + ")"),
      (this.properties.transformOrigin = "0 0 0"),
      this.setStyle(this.container, "transform,transformOrigin");
  }),
  (BannerDisplay.prototype.showWatermark = function () {
    var e = "11px",
      t = "normal",
      i = "Arial, sans-serif",
      r = "400",
      n = "pointer",
      s = "#fff",
      a = "rgba(100, 100, 100, .8)",
      o = "0",
      l = "-68px",
      p = "absolute",
      d = "999",
      c = document.createElement("div");
    c.setAttribute(
      "style",
      'position: absolute;right: 5px;bottom: 5px;z-index: 99999999999999;background: url("' +
        window.bannerConfig.resourcesUrl +
        '/images/watermark.svg"); width: 178px; height: 32px;background-repeat: no-repeat;'
    );
    var h = document.createElement("div");
    h.appendChild(c),
      document.getElementById("bs").appendChild(h),
      h.setAttribute(
        "style",
        "background-color: " +
          a +
          ";bottom: " +
          o +
          ";color: " +
          s +
          ";cursor: " +
          n +
          ";fill: " +
          s +
          ";font-family: " +
          i +
          ";font-size: " +
          e +
          ";font-style: " +
          t +
          ";font-weight: " +
          r +
          ";position: " +
          p +
          ";right: " +
          l +
          ";z-index: " +
          d +
          ";"
      ),
      this._addClickWatermarkListener(h);
  }),
  (BannerDisplay.prototype._addClickWatermarkListener = function (e) {
    var i = this;
    e.addEventListener("click", function (e) {
      var t =
        "//www.bannersnack.com/?utm_source=freebanner&utm_medium=watermark1&utm_content=" +
        i.properties.width +
        "x" +
        i.properties.height +
        "&utm_campaign=BannerSnackEmbed&utm_hash=" +
        i.hash;
      window.open(t, "_blank"), e.stopPropagation();
    });
  }),
  (BannerDisplay.prototype.initSlides = function (e) {
    this.slides = [];
    var t,
      i,
      r,
      n,
      s = [],
      a = { properties: {}, elements: [] };
    for (t = 0; (i = e[t]); t++)
      "slide" === i.type
        ? s.push(i)
        : (i.properties && (i.properties.showOnAllSlides = !0),
          a.elements.push(i));
    for (
      this.overflowSlide = new SlideDisplay(),
        this.overflowSlide.isOverflowSlide = !0,
        (this.overflowSlide.banner = this).overflowSlide.init(
          a,
          this.displayContainer
        ),
        t = 0;
      (n = s[t]);
      t++
    )
      ((r = new SlideDisplay()).banner = this),
        r.init(n, this.displayContainer),
        this.slides.push(r);
  }),
  (BannerDisplay.prototype.getWidth = function () {
    return this.properties.width;
  }),
  (BannerDisplay.prototype.getHeight = function () {
    return this.properties.height;
  }),
  (BannerDisplay.prototype.play = function () {
    this.overflowSlide.render(),
      (this.loopsPlayed = 1),
      this.slides[this.startSlide] &&
        this.slides[this.startSlide].play(null, !0);
  }),
  (BannerDisplay.prototype.createActionProperties = function () {
    var e = eaUtils.getClickTagValue(),
      t = {
        event: "click",
        slideOrUrl: "",
        type: "gotoURL",
        target: "_blank",
        useHandCursor: !0,
      };
    if (
      (e =
        e ||
        window.clickTag ||
        window.clickTAG ||
        (this.config && this.config.clickTag))
    )
      return (t.slideOrUrl = eaUtils.addProtocolToUrl(e)), t;
    var i = this.properties;
    return (
      !!i &&
      !(
        !i.bannerUrl ||
        "http://" === i.bannerUrl ||
        "https://" === i.bannerUrl
      ) &&
      ((t.slideOrUrl = eaUtils.addProtocolToUrl(i.bannerUrl)),
      (t.target = i.urlTarget),
      (t.useHandCursor = i.useHandCursor),
      t)
    );
  }),
  (ButtonDisplay.prototype = new BaseDisplay()),
  ((ButtonDisplay.prototype.constructor =
    ButtonDisplay).prototype.getHoverBackgroundColor = function () {
    var e = JSON.parse(JSON.stringify(this.properties.backgroundColor));
    switch (e.type) {
      case "solid":
        e.scolor = eaUtils.generateLighterColor(e.scolor, 10);
        break;
      case "rgrad":
      case "lgrad":
        for (var t = e.gradColors, i = 0; i < t.length; i++)
          t[i].c = eaUtils.generateLighterColor(t[i].c, 10);
    }
    return e;
  }),
  (ButtonDisplay.prototype.getBackgroundHoverCss = function (e) {
    var t = eaUtils.getBackgroundCss(e),
      i = "";
    for (var r in t)
      switch (r) {
        default:
          t[r] && (i += r + ": " + t[r] + " !important;");
          break;
        case "background-image":
          for (var n = 0; n < t[r].length; n++)
            i += "background-image:" + t[r][n] + " !important;";
      }
    return i;
  }),
  (ButtonDisplay.prototype.getBorderColorHoverCss = function (e) {
    if (!e) return "";
    var t = eaUtils.extractRGBA(e),
      i = eaUtils.rgba2hex(t, !1);
    return (
      "border-color: " +
      eaUtils.hex2rgba(eaUtils.generateLighterColor(i, 10), t.a) +
      " !important;"
    );
  }),
  (ButtonDisplay.prototype.init = function (e) {
    var t = e.properties;
    "string" == typeof t.backgroundColor &&
      (t.backgroundColor = { type: "solid", scolor: t.backgroundColor });
    var i = t.border || {};
    if (
      ((t["border-radius"] =
        t.border && t.border.radius ? t.border.radius : t.borderRadius),
      (this.properties = t),
      this.createMainContainers("element", "bs-btn btn" + t.id),
      t.localUrl && -1 !== t.localUrl.indexOf(".svg"))
    ) {
      var r = "images/" + t.localUrl;
      bannerConfig.embedUrl && (r = bannerConfig.embedUrl + r),
        (this.textContainer = this.createElement(
          "div",
          "bs-btn-label image-crop",
          !0,
          this.displayContainer
        )),
        (this.textContainer.style.backgroundImage = "url(" + r + ")"),
        this.applyFilters(this.textContainer, null, null, t.labelShadow),
        i.weight &&
          this.applyExtraPropertiesForGradients(this.displayContainer);
    } else
      (this.textContainer = this.createElement(
        "label",
        "bs-btn-label",
        !0,
        this.displayContainer
      )),
        (this.textContainer.textContent = t.buttonLabel),
        (this.textContainer.dir = t.labelStyle.textDirection || "ltr"),
        (t["line-height"] = t.height - (i.weight ? 2 * i.weight : 0)),
        this.setStyle(
          this.textContainer,
          "line-height,labelOffsetX,labelOffsetY",
          "px"
        ),
        ("string" != typeof t.labelStyle.fontSize ||
          ("string" == typeof t.labelStyle.fontSize &&
            -1 === t.labelStyle.fontSize.indexOf("px"))) &&
          (t.labelStyle.fontSize = t.labelStyle.fontSize + "px"),
        ("string" != typeof t.labelStyle.letterSpacing ||
          ("string" == typeof t.labelStyle.letterSpacing &&
            -1 === t.labelStyle.letterSpacing.indexOf("px"))) &&
          (t.labelStyle.letterSpacing = t.labelStyle.letterSpacing + "px"),
        "string" == typeof t.labelStyle.fontFamily &&
          -1 === t.labelStyle.fontFamily.indexOf('"') &&
          (t.labelStyle.fontFamily =
            '"' +
            (t.labelStyle.fontPrefix || "") +
            t.labelStyle.fontFamily +
            '"'),
        eaUtils.applyCss(this.textContainer, t.labelStyle),
        eaUtils.applyCss(
          this.textContainer,
          eaUtils.getTextShadowCss(t.labelShadow)
        ),
        i.weight &&
          this.applyExtraPropertiesForGradients(this.displayContainer);
    eaUtils.applyCss(
      this.displayContainer,
      eaUtils.getBoxShadowCss(t.dropShadow)
    ),
      (this.displayContainer.style.border = this.getBorderString()),
      this.applyBackground(this.displayContainer, t.backgroundColor);
    var n = ".bs-btn.btn" + t.id,
      s = "bs-btn" + t.id,
      a =
        n +
        ":hover{" +
        this.getBackgroundHoverCss(this.getHoverBackgroundColor()) +
        this.getBorderColorHoverCss(i.color) +
        "}";
    eaUtils.addCSSById(a, s), this.reset();
    var o = this.createActionProperties();
    return (
      o &&
        "click" === o.event &&
        !o.useHandCursor &&
        this.addClass(this.displayContainer, "no-hand-cursor"),
      this.slide.banner.statsPresent &&
        this.slide.banner.stats.trackEvent(this.container, this),
      this.applyActions(o, this.container),
      BaseDisplay.prototype.init.call(this, e)
    );
  }),
  (ButtonDisplay.prototype.reset = function () {
    BaseDisplay.prototype.reset.call(this),
      this.setStyle(this.displayContainer, "width,height,border-radius", "px");
  }),
  (ClipartDisplay.prototype = new BaseDisplay()),
  (ClipartDisplay.prototype.constructor = BaseDisplay),
  (ClipartDisplay.prototype.init = function (e) {
    if (
      ((this.properties = e.properties),
      (this.clipart = this.properties.svgObject),
      this.createMainContainers("element", "bs-clipart"),
      (this.transformContainer = this.createElement(
        "div",
        "transform-container"
      )),
      this.displayContainer.parentNode.appendChild(this.transformContainer),
      this.transformContainer.appendChild(this.displayContainer),
      this.displayContainer.setAttribute("id", "ce-" + eaUtils.getUniqueId()),
      this.clipart.attributes && this.clipart.attributes["data-height"])
    ) {
      var t = parseFloat(this.clipart.attributes["data-height"]);
      for (var i in this.clipart.children)
        this.clipart.children[i].attributes &&
          this.clipart.children[i].attributes.transform &&
          0 != t &&
          (this.clipart.children[i].attributes.transform =
            "scale(" + (this.properties.height / t).toFixed(3) + ")");
    }
    this.makeClipartItem(this.clipart, this.displayContainer),
      this.applyFilters(
        this.displayContainer,
        !1,
        this.properties.blur,
        this.properties.dropShadow
      ),
      (this.transformContainer.style.height = "100%"),
      (this.transformContainer.style.width = "100%");
    var r = this.getFlipString(this.properties.flip);
    if (
      (this.transform(
        "translateZ(0) rotate(" + this.properties.rotation + "deg) " + r,
        this.transformContainer
      ),
      this.reset(),
      this.slide.banner.statsPresent)
    ) {
      var n = this.displayContainer.querySelector(".actionMask")
        ? this.displayContainer.querySelector(".actionMask")
        : this.displayContainer;
      this.slide.banner.stats.trackEvent(n, this);
    }
    return (
      this.applyActions(
        this.createActionProperties(),
        this.displayContainer.querySelector(".actionMask")
      ),
      BaseDisplay.prototype.init.call(this, e)
    );
  }),
  (ClipartDisplay.prototype.makeClipartItem = function (e, t) {
    var i,
      r,
      n = this,
      s = {
        preserveAspectRatio: "none",
        version: "1.1",
        width: "100%",
        height: "100%",
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "xml:space": "preserve",
      },
      a = document.createElementNS("http://www.w3.org/2000/svg", e.type);
    if ("svg" == e.type) for (i in s) a.setAttribute(i, s[i]);
    for (i in (-1 <
      [
        "ellipse",
        "image",
        "line",
        "path",
        "polygon",
        "polyline",
        "rect",
        "use",
        "circle",
      ].indexOf(e.type) && a.setAttribute("fill", this.properties.fillColor),
    e.attributes))
      if ("fill" == i && "url" == e.attributes[i].slice(0, 3)) {
        var o = e.attributes[i].slice(5).slice(0, -1);
        a.setAttribute(
          i,
          "url(#" + o + this.displayContainer.getAttribute("id") + ")"
        );
      } else
        (r = "className" === i ? "class" : i),
          a.setAttribute(r, e.attributes[i]);
    "pattern" == e.type &&
      a.setAttribute(
        "id",
        e.attributes.id + this.displayContainer.getAttribute("id")
      ),
      t.appendChild(a),
      e.children &&
        e.children.forEach(function (e) {
          n.makeClipartItem(e, this);
        }, a);
  }),
  (ImageDisplay.prototype = new BaseDisplay()),
  (ImageDisplay.prototype.constructor = BaseDisplay),
  (ImageDisplay.prototype.init = function (e) {
    (this.triggerReadyOnRender = !1), (this.properties = e.properties);
    var t,
      i = this.properties;
    this.createMainContainers("element", "bs-image image-" + i.scaleMode),
      (this.transformContainer = this.createElement(
        "div",
        "transform-container"
      )),
      this.displayContainer.parentNode.appendChild(this.transformContainer),
      this.transformContainer.appendChild(this.displayContainer);
    var r,
      n,
      s = window.bannerConfig;
    switch (
      (s.hqImages && this.properties.hqUrl
        ? (t = this.properties.hqUrl)
        : this.properties.localUrl
        ? ((t = "images/" + this.properties.localUrl),
          s.embedUrl && (t = s.embedUrl + t))
        : (t =
            i.url && -1 != i.url.indexOf("//") ? i.url : s.photosUrl + i.url),
      !0 === this.retina &&
        this.properties.retinaReady &&
        (this.displayContainer.classList.add("retina"),
        this.displayContainer.style.setProperty(
          "--retina-src",
          'url("' + this.getRetinaUrl(t) + '")'
        )),
      (this.displayContainer.style.backgroundImage = "url(" + t + ")"),
      this.applyFilters(
        this.displayContainer,
        i.adjustColor,
        i.blur,
        i.dropShadow
      ),
      i.verticalAlign)
    ) {
      case "top":
        r = "0";
        break;
      case "middle":
        r = "50%";
        break;
      case "bottom":
        r = "100%";
    }
    switch (i.horizontalAlign) {
      case "left":
        n = "0";
        break;
      case "center":
        n = "50%";
        break;
      case "right":
        n = "100%";
    }
    if (
      ((this.displayContainer.style.backgroundPosition = n + " " + r),
      "tile" == i.scaleMode)
    ) {
      var a = i.contentScale,
        o = i.originalWidth ? i.originalWidth : i.oWidth;
      (this.displayContainer.style.backgroundSize = (a / 100) * o + "px"),
        (this.displayContainer.style.backgroundPositionX =
          i.contentOffsetX + "%"),
        (this.displayContainer.style.backgroundPositionY =
          i.contentOffsetY + "%");
    } else if ("userCrop" == i.scaleMode && i.cropData) {
      var l = i.cropData.width,
        p = i.cropData.height,
        d = this.getCropBackgroundPosition(i);
      (this.displayContainer.style.backgroundSize = l + "px " + p + "px"),
        (this.displayContainer.style.backgroundPositionX = d.x + "px"),
        (this.displayContainer.style.backgroundPositionY = d.y + "px"),
        (this.displayContainer.style.backgroundRepeat = "no-repeat");
    }
    (this.transformContainer.style.height = "100%"),
      (this.transformContainer.style.width = "100%");
    var c = this.getFlipString(i.flip);
    return (
      this.transform(
        "translateZ(0) rotate(" + i.rotation + "deg) " + c,
        this.transformContainer
      ),
      this.reset(),
      this.slide.banner.statsPresent &&
        this.slide.banner.stats.trackEvent(this.displayContainer, this),
      this.applyActions(this.createActionProperties(), this.displayContainer),
      BaseDisplay.prototype.init.call(this, e)
    );
  }),
  (ShapeDisplay.prototype = new BaseDisplay()),
  ((ShapeDisplay.prototype.constructor = ShapeDisplay).prototype.init =
    function (e) {
      var t = e.properties;
      if (
        ((this.properties = t),
        this.createMainContainers("element", "shape " + t.type),
        eaUtils.detectIE())
      ) {
        var i = this.createElement("img", "fakeImage");
        (i.src = eaUtils.getTransparentImageURL()),
          this.displayContainer.appendChild(i);
      }
      "line" === t.type &&
        ((t.type = "rectangle"),
        (t.width = t.len),
        (t.height = t.thick),
        delete t.len,
        delete t.thick,
        (this.properties = t)),
        (this.container.style.width = t.width + "px"),
        (this.container.style.height = t.height + "px");
      var r = this.getBRadius();
      if (
        (r && (this.displayContainer.style.borderRadius = r + "px"),
        (this.displayContainer.style.border = this.getBorderString()),
        this.applyBackground(
          this.displayContainer,
          t.backgroundColor,
          this.retina
        ),
        this.applyExtraPropertiesForGradients(this.displayContainer),
        t.backgroundColor &&
          t.backgroundColor.type &&
          "image" == t.backgroundColor.type &&
          "userCrop" == t.backgroundColor.scaleMode &&
          t.cropData)
      ) {
        var n = t.cropData.width,
          s = t.cropData.height,
          a = this.getCropBackgroundPosition(t);
        (this.displayContainer.style.backgroundSize = n + "px " + s + "px"),
          (this.displayContainer.style.backgroundPositionX = a.x + "px"),
          (this.displayContainer.style.backgroundPositionY = a.y + "px"),
          (this.displayContainer.style.backgroundRepeat = "no-repeat");
      }
      this.displayData = e;
      var o = this.getFlipString(t.flip);
      return (
        this.transform(
          "rotate(" + this.properties.rotation + "deg) " + o,
          this.displayContainer
        ),
        this.applyFilters(
          this.displayContainer,
          !1,
          this.properties.blur,
          this.properties.dropShadow
        ),
        this.reset(),
        this.slide.banner.statsPresent &&
          this.slide.banner.stats.trackEvent(this.displayContainer, this),
        this.applyActions(this.createActionProperties(), this.displayContainer),
        BaseDisplay.prototype.init.call(this, e)
      );
    }),
  (SlideDisplay.prototype = new BaseDisplay()),
  ((SlideDisplay.prototype.constructor = SlideDisplay).prototype.init =
    function (e, t) {
      if (this.isOverflowSlide)
        (this.container = t), (this.displayContainer = t), this.resetElements();
      else {
        this.createMainContainers("slide", "slide-inner"),
          t.appendChild(this.container);
        var i = e.properties;
        (this.ah = e.ah),
          !this.ah && i && (this.ah = i.id),
          (i.duration = parseFloat(i.duration)),
          i.duration < 0.1 && (i.duration = 0.1);
        var r = (i.transition = i.transition || {
          type: "none",
          delay: 0,
          duration: 0.1,
        });
        this.parseTransition(r),
          this.applyBackground(this.displayContainer, i.backgroundColor),
          this.reset();
      }
      return (
        this.banner.statsPresent &&
          this.banner.stats.trackEvent(this.container, this),
        BaseDisplay.prototype.init.call(this, e)
      );
    }),
  (SlideDisplay.prototype.parseTransition = function (e) {
    switch (
      ((e.duration = parseFloat(e.duration) || 0),
      (e.delay = parseFloat(e.delay) || 0),
      e.type)
    ) {
      case "slide":
      case "slideBounce":
      case "slideElastic":
        if (!parseInt(e.slideOffset))
          switch (e.direction) {
            case "r2l":
            case "l2r":
              e.slideOffset = this.banner.getWidth();
              break;
            case "t2b":
            case "b2t":
              e.slideOffset = this.banner.getHeight();
          }
        break;
      case "flip":
        "cross" === e.crosstype && (e.deg = 180);
    }
  }),
  (SlideDisplay.prototype.isFirstSlide = function () {
    return 0 === this.banner.slides.indexOf(this);
  }),
  (SlideDisplay.prototype.isLastSlide = function () {
    return this.banner.slides.indexOf(this) === this.banner.slides.length - 1;
  }),
  (SlideDisplay.prototype.reset = function () {
    window.eff.clearAll(this.container);
    var e = this.displayContainer.style;
    (e.zIndex = 0),
      (e.width = "100%"),
      (e.height = "100%"),
      (e.top = "0"),
      (e.left = "0"),
      (e.filter = ""),
      (e["-webkit-filter"] = ""),
      (e.animation = ""),
      (e["-webkit-animation"] = ""),
      this.transform("none"),
      this.resetElements();
  }),
  (SlideDisplay.prototype.resetElements = function () {
    for (var e = 0; e < this.elements.length; e++) this.elements[e].reset();
  }),
  (SlideDisplay.prototype.play = function (e, t) {
    (this.banner.lastSlide = this.banner.currentSlide),
      (this.banner.currentSlide = this),
      t || this.banner.trigger("changeSlide"),
      this.rendered
        ? this.reset()
        : (this.banner.preload.assets(
            null,
            this.getNextSlide(),
            this.banner.config
          ),
          this.render()),
      (this.container.style.opacity = 1),
      this.playSlideAnimation(e);
  }),
  (SlideDisplay.prototype.render = function () {
    var e,
      t,
      i = this.displayData.elements;
    for (t = 0; t < i.length; t++)
      (e = this.renderElement(i[t])) && this.elements.push(e);
    if (
      (this.on(
        "buildInStart buildInEnd buildOutStart buildOutEnd",
        function (e) {
          for (var t = 0; t < this.elements.length; t++) {
            var i = "slide" + e.type.charAt(0).toUpperCase() + e.type.substr(1);
            this.elements[t].trigger(i, this);
          }
        }
      ),
      this.isOverflowSlide)
    ) {
      if (!this.banner.noAnimation)
        for (t = 0; t < this.elements.length; t++)
          this.elements[t].playAnimation(0);
      this.trigger("buildInStart"), this.trigger("buildInEnd");
    } else this.createElement("div", "slide-hover", !0, this.container);
    this.rendered = !0;
  }),
  (SlideDisplay.prototype.getDurationToStartSlide = function () {
    var n = this;
    return this.banner.slides.reduce(function (e, t, i) {
      var r;
      return i < n.banner.startSlide
        ? ((r =
            "none" !== t.displayData.properties.transition.type
              ? t.displayData.properties.transition.duration
              : 0),
          e + t.displayData.properties.duration + r)
        : e;
    }, 0);
  }),
  (SlideDisplay.prototype.renderElement = function (e) {
    var t,
      i = e.properties,
      r = (i.buildIn = i.buildIn || { type: "none", delay: 0, duration: 0 }),
      n = (i.buildOut = i.buildOut || { type: "none", delay: 0, duration: 0 });
    function s(e) {
      (e.duration = parseFloat(e.duration) || 0),
        (e.delay = parseFloat(e.delay) || 0),
        ("alpha-words" != e.type && "blur-words" != e.type) ||
          (e.duration = Math.max(Number(e.duration), Number(e.wordsDuration)));
    }
    if ((s(r), s(n), this.isOverflowSlide)) {
      var a = this.getDurationToStartSlide(),
        o = r.delay - a;
      r.duration + o < 0
        ? ((r.type = "none"), (n.delay -= a - r.duration - r.delay))
        : (r.delay = o);
    }
    switch (e.layerType) {
      case "text":
        t = new window.TextDisplay();
        break;
      case "image":
        t = new window.ImageDisplay(this.banner.properties.retina);
        break;
      case "clipart":
        t = new window.ClipartDisplay();
        break;
      case "button":
        t = new window.ButtonDisplay();
        break;
      case "shape":
        t = new window.ShapeDisplay(this.banner.properties.retina);
        break;
      case "youtube":
        t = new window.YoutubeDisplay();
        break;
      case "embed":
        t = new window.EmbedDisplay(this.banner.properties.retina);
        break;
      case "svg":
        t = new window.SvgDisplay();
    }
    if (t) {
      t.slide = this;
      var l = t.init(e).getContainer();
      this.displayContainer.appendChild(l),
        t.render(),
        this.isOverflowSlide &&
          ((t.container.style.zIndex = 10),
          (t.container.style.webkitTransform = "translate3d(0, 0, 0)"));
    }
    return t;
  }),
  (SlideDisplay.prototype.getNextSlide = function (e) {
    e = e || this.banner.currentSlide;
    var t = this.banner.slides,
      i = t.indexOf(e);
    return i + 1 >= t.length
      ? this.banner.slides[0]
      : this.banner.slides[i + 1];
  }),
  (SlideDisplay.prototype.getPrevSlide = function (e) {
    e = e || this.banner.currentSlide;
    var t = this.banner.slides.indexOf(e);
    return t - 1 < 0
      ? this.banner.slides[this.banner.slides.length - 1]
      : this.banner.slides[t - 1];
  }),
  (SlideDisplay.prototype.getFirstSlide = function () {
    return this.banner.slides[0];
  }),
  (SlideDisplay.prototype.getLastSlide = function () {
    return this.banner.slides[this.banner.slides.length - 1];
  }),
  (SlideDisplay.prototype.playSlideAnimation = function (e) {
    clearTimeout(this._buildOutTimeout);
    var t,
      i,
      r = this.getAnimationEl(),
      n = this,
      s = this.displayData.properties,
      a = this.banner.lastSlide ? this.banner.lastSlide.container : null,
      o = this.banner.slides.length,
      l = 0;
    for (t = 0; t < this.banner.slides.length; t++)
      ((i = this.banner.slides[t].container).style.zIndex = 0),
        (i.style.display = "none");
    (this.container.style.display = ""),
      (this.container.style.zIndex = "1"),
      this.trigger("buildInStart"),
      e && "none" !== e.type && !this.banner.noAnimation && 1 < o
        ? (this.addClass(this.container, "buildin"),
          (l = parseFloat(e.duration) || 0),
          a && (a.style.display = ""),
          "hide" !== e.crosstype
            ? window.eff.animate(r, e, "buildIn")
            : a && (a.style.zIndex = "2"),
          setTimeout(function () {
            n.removeClass(n.container, "buildin"), n.trigger("buildInEnd");
          }, 1e3 * e.duration))
        : this.trigger("buildInEnd");
    var p =
        !this.banner.properties.loopCount ||
        this.banner.properties.loopCount === this.LOOP_COUNT_FOREVER,
      d = this.banner.loopsPlayed >= this.banner.properties.loopCount;
    if (
      (!this.isLastSlide() || d || p || this.banner.loopsPlayed++,
      s.stopSlide ||
        this.banner.showOnlyOneSlide ||
        (!p && d && this.isLastSlide()) ||
        (this._buildOutTimeout = setTimeout(function () {
          n.buildOut();
        }, 1e3 * (l + s.duration))),
      !this.banner.noAnimation)
    )
      for (t = 0; t < this.elements.length; t++)
        this.elements[t].playAnimation(l);
  }),
  (SlideDisplay.prototype.buildOut = function (e) {
    this._buildOutTimeout && clearTimeout(this._buildOutTimeout);
    var t = this.banner.slides.length,
      i = this.displayData.properties.transition,
      r = this;
    r.trigger("buildOutStart");
    var n = null;
    if (i && "none" !== i.type && 1 < t) {
      if ((r.addClass(r.container, "buildout"), "show" !== i.crosstype)) {
        var s = eaUtils.cloneObject(i);
        window.eff.animate(this.getAnimationEl(), s, "buildOut");
      }
      n = setTimeout(function () {
        r.banner.currentSlide !== r && (r.container.style.display = "none"),
          r.removeClass(r.container, "buildout"),
          r.trigger("buildOutEnd");
      }, 1e3 * i.duration);
    } else r.trigger("buildOutEnd");
    (e = e || this.getNextSlide()) === this &&
      n &&
      (clearTimeout(n),
      r.removeClass(r.container, "buildout"),
      r.trigger("buildOutEnd")),
      e.play(eaUtils.cloneObject(i));
  }),
  (SlideDisplay.prototype.getBuildOutTime = function () {
    var e = this.displayData.properties.transition;
    return e && "none" !== e.type ? 1e3 * e.duration : 0;
  }),
  (SlideDisplay.prototype.getSlideByHashOrId = function (e) {
    if (!e) return !1;
    for (var t = this.banner.slides, i = 0; i < t.length; i++) {
      var r = t[i].displayData.properties;
      if (e === t[i].ah || (r && e === r.id)) return t[i];
    }
    return !1;
  }),
  (SvgDisplay.prototype = new BaseDisplay()),
  (SvgDisplay.prototype.constructor = BaseDisplay),
  (SvgDisplay.prototype.init = function (e) {
    var t, i;
    if (
      ((this.properties = e.properties),
      this.createMainContainers("element", "svg"),
      this.properties.resourceKey && this.slide.banner.displayData.resources)
    ) {
      var r =
          this.slide.banner.displayData.resources[this.properties.resourceKey],
        n = r && eaUtils.setSvgColors(r.content, this.properties.colorGroups);
      (i = this.createElement("img", "svg-img", !1, null)).setAttribute(
        "src",
        "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(n)
      );
    } else {
      this.properties.localUrl
        ? ((t = "images/" + this.properties.localUrl),
          bannerConfig.embedUrl && (t = bannerConfig.embedUrl + t))
        : this.properties.url &&
          (t = window.bannerConfig.s3Url + "files/" + this.properties.url);
      var s = t + this.properties.id;
      i = this.createElement("img", "svg-img", !1, null, window.assetsCache[s]);
    }
    this.displayContainer.appendChild(i);
    var a = this.getFlipString(this.properties.flip);
    return (
      this.transform(
        "translateZ(0) rotate(" + this.properties.rotation + "deg) " + a,
        this.displayContainer
      ),
      this.applyFilters(
        this.displayContainer,
        this.properties.adjustColor,
        this.properties.blur,
        this.properties.dropShadow
      ),
      this.reset(),
      this.slide.banner.statsPresent &&
        this.slide.banner.stats.trackEvent(this.displayContainer, this),
      this.applyActions(this.createActionProperties(), this.displayContainer),
      BaseDisplay.prototype.init.call(this, e)
    );
  }),
  (window.SvgDisplay = SvgDisplay),
  (TextDisplay.prototype = new BaseDisplay()),
  ((TextDisplay.prototype.constructor = TextDisplay).prototype.init = function (
    e
  ) {
    this.properties = e.properties;
    var t = this.properties;
    return (
      this.createMainContainers("element", "text"),
      (this.innerDisplayContainer = this.createElement(
        "div",
        "innerDisplayContainer",
        !0,
        this.displayContainer,
        null
      )),
      (this.innerDisplayContainer.dir = t.textDirection || "ltr"),
      this.initCommonProperties(),
      t.config ? this.initRichText() : this.initSimpleText(),
      this.reset(),
      BaseDisplay.prototype.init.call(this, e)
    );
  }),
  (TextDisplay.prototype.initCommonProperties = function () {
    var e = this.properties;
    this.transform(
      "rotate(" + this.properties.rotation + "deg)",
      this.displayContainer
    ),
      this.setStyle(this.displayContainer, "opacity"),
      this.setStyle(this.displayContainer, "fontSize", "px");
    var t = this.displayContainer.style;
    if (
      ((t.textAlign = e.alignment),
      (t.lineHeight = e.lineHeight),
      (t.letterSpacing = e.letterSpacing + "px"),
      (t.width = "100%"),
      (t.height = "100%"),
      eaUtils.applyCss(
        this.displayContainer,
        eaUtils.getTextShadowCss(this.properties.textShadow)
      ),
      this.applyFilters(this.displayContainer, !1, this.properties.blur),
      this.properties.scale)
    ) {
      var i = this.innerDisplayContainer.style;
      (i.width = e.width + "px"),
        (i.height = e.height + "px"),
        this.transform(
          "scale(" + this.properties.scale + ")",
          this.innerDisplayContainer
        ),
        (i["transform-origin"] = "0 0");
    }
  }),
  (TextDisplay.prototype.initSimpleText = function () {
    (this.text = this.createElement("span", "text-content")),
      this.innerDisplayContainer.appendChild(this.text);
    var e = this.properties;
    this.setStyle(this.innerDisplayContainer, "fontWeight,fontStyle,color");
    var t = this.innerDisplayContainer.style;
    (t.fontFamily = '"' + (e.fontPrefix || "") + e.fontFamily + '"'),
      e.textTransform && (t.textTransform = e.textTransform),
      e.textDecoration && (t.textDecoration = e.textDecoration);
    try {
      this.text.textContent = this.properties.text;
    } catch (e) {}
    this.slide.banner.statsPresent &&
      this.slide.banner.stats.trackEvent(this.text, this),
      this.applyActions(this.createActionProperties(), this.text);
  }),
  (TextDisplay.prototype.initRichText = function () {
    this.applyConfigElements();
  }),
  (TextDisplay.prototype.applyConfigElements = function () {
    var a = this.properties.text,
      e = this.properties.config,
      o = a.replace(/\n/g, ""),
      l = this;
    e.forEach(function (e) {
      var t = e.offset,
        i = e.length,
        r = e.nodeType,
        n = e.style,
        s = e.children;
      0 === t && i === a.length
        ? l.innerDisplayContainer.appendChild(l.getNode(r, o, n, o, s))
        : l.innerDisplayContainer.appendChild(
            l.getNode(r, eaUtils.getTextSubstr(o, t, i), n, o, s)
          );
    });
  }),
  (TextDisplay.prototype.attachEventsAndActions = function (e) {
    this.slide.banner.statsPresent &&
      this.slide.banner.stats.trackEvent(e, this),
      this.applyActions(this.createActionProperties(), e);
  }),
  (TextDisplay.prototype.getNode = function (e, t, i, s, r) {
    (i = i || null), (s = s || null), (r = r || null);
    var a = document.createElement(e),
      n = eaUtils.getRichTextStyleString(i);
    if (
      (n && (a.style.cssText = n),
      "div" === e
        ? (a.className = "row")
        : "span" === e && this.attachEventsAndActions(a),
      !r || !r.length)
    ) {
      if (t || "div" !== e)
        if ("div" === e) {
          var o = document.createElement("span");
          (o.textContent = eaUtils.replaceSpacesWithNbsps(t)),
            a.appendChild(o),
            this.attachEventsAndActions(o);
        } else a.textContent = eaUtils.replaceSpacesWithNbsps(t);
      else a.appendChild(document.createElement("BR"));
      return a;
    }
    var l = this;
    return (
      r.forEach(function (e) {
        var t = e.offset,
          i = e.length,
          r = e.nodeType,
          n = e.style;
        a.appendChild(l.getNode(r, eaUtils.getTextSubstr(s, t, i), n));
      }),
      a
    );
  }),
  (TextDisplay.prototype.reset = function () {
    if ((BaseDisplay.prototype.reset.call(this), this.properties.config))
      var e = this.container.getElementsByClassName("word");
    else
      e = this.container
        .getElementsByClassName("text-content")[0]
        .getElementsByTagName("span");
    window.eff.clearWordsTimeout(this.container, e);
    for (var t = 0; t < e.length; t++) {
      var i = e[t].style;
      (i.opacity = 1), (i.animation = ""), (i["-webkit-animation"] = "");
    }
  }),
  (EmbedCanvas.prototype = new EventDispatcher()),
  ((EmbedCanvas.prototype.constructor = EmbedCanvas).prototype.init = function (
    e,
    t,
    i
  ) {
    var r = Math.round(t.banner.properties.width),
      n = Math.round(t.banner.properties.height);
    (t.banner.properties.width = r),
      (t.banner.properties.height = n),
      (this.json = t),
      (this.config = i),
      (this.banner = new BannerDisplay()),
      this.banner.initPaths(),
      (this.bannerContainer = e);
    var s = !i.preview && !i.download;
    if (s) {
      var a = new Stats({
        hash: t.hash,
        userId: t.userId,
        rotatorHash: this.getRotatorHashFromUrl(),
        banner: this.banner,
        currentDomain: document.referrer,
      });
      a.track(), (this.banner.stats = a);
    }
    if (((this.banner.statsPresent = s), this.config.video || this.config.pdf))
      this.initBanner();
    else {
      this.preload = new Preload();
      var o = parseInt(i.startSlide) || 0,
        l = t.banner.elements.filter(function (e) {
          return "slide" === e.type;
        });
      this.preload.assets(t.banner, l[o], i, this.initBanner);
      var p = this.preload;
      window.loadAssetsTimer = setTimeout(function () {
        p.resolveIfAssetsLoaded(!0);
      }, 3e3);
    }
  }),
  (EmbedCanvas.prototype.showWatermark = function () {
    this.banner.showWatermark();
  }),
  (EmbedCanvas.prototype.getRotatorHashFromUrl = function () {
    var e = !1,
      t = window.location.search;
    if (t) {
      var i,
        r = t.substr(1).split("&");
      for (var n in r)
        if ("rotator_hash" == (i = r[n].split("=", 2))[0]) {
          e = i[1];
          break;
        }
    }
    return e;
  });
