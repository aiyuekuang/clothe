(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[15,27,90,118],{

/***/ 1459:
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (true) // CommonJS
    mod(__webpack_require__(91));
  else {}
})(function(CodeMirror) {
"use strict";

var htmlConfig = {
  autoSelfClosers: {'area': true, 'base': true, 'br': true, 'col': true, 'command': true,
                    'embed': true, 'frame': true, 'hr': true, 'img': true, 'input': true,
                    'keygen': true, 'link': true, 'meta': true, 'param': true, 'source': true,
                    'track': true, 'wbr': true, 'menuitem': true},
  implicitlyClosed: {'dd': true, 'li': true, 'optgroup': true, 'option': true, 'p': true,
                     'rp': true, 'rt': true, 'tbody': true, 'td': true, 'tfoot': true,
                     'th': true, 'tr': true},
  contextGrabbers: {
    'dd': {'dd': true, 'dt': true},
    'dt': {'dd': true, 'dt': true},
    'li': {'li': true},
    'option': {'option': true, 'optgroup': true},
    'optgroup': {'optgroup': true},
    'p': {'address': true, 'article': true, 'aside': true, 'blockquote': true, 'dir': true,
          'div': true, 'dl': true, 'fieldset': true, 'footer': true, 'form': true,
          'h1': true, 'h2': true, 'h3': true, 'h4': true, 'h5': true, 'h6': true,
          'header': true, 'hgroup': true, 'hr': true, 'menu': true, 'nav': true, 'ol': true,
          'p': true, 'pre': true, 'section': true, 'table': true, 'ul': true},
    'rp': {'rp': true, 'rt': true},
    'rt': {'rp': true, 'rt': true},
    'tbody': {'tbody': true, 'tfoot': true},
    'td': {'td': true, 'th': true},
    'tfoot': {'tbody': true},
    'th': {'td': true, 'th': true},
    'thead': {'tbody': true, 'tfoot': true},
    'tr': {'tr': true}
  },
  doNotIndent: {"pre": true},
  allowUnquoted: true,
  allowMissing: true,
  caseFold: true
}

var xmlConfig = {
  autoSelfClosers: {},
  implicitlyClosed: {},
  contextGrabbers: {},
  doNotIndent: {},
  allowUnquoted: false,
  allowMissing: false,
  allowMissingTagName: false,
  caseFold: false
}

CodeMirror.defineMode("xml", function(editorConf, config_) {
  var indentUnit = editorConf.indentUnit
  var config = {}
  var defaults = config_.htmlMode ? htmlConfig : xmlConfig
  for (var prop in defaults) config[prop] = defaults[prop]
  for (var prop in config_) config[prop] = config_[prop]

  // Return variables for tokenizers
  var type, setStyle;

  function inText(stream, state) {
    function chain(parser) {
      state.tokenize = parser;
      return parser(stream, state);
    }

    var ch = stream.next();
    if (ch == "<") {
      if (stream.eat("!")) {
        if (stream.eat("[")) {
          if (stream.match("CDATA[")) return chain(inBlock("atom", "]]>"));
          else return null;
        } else if (stream.match("--")) {
          return chain(inBlock("comment", "-->"));
        } else if (stream.match("DOCTYPE", true, true)) {
          stream.eatWhile(/[\w\._\-]/);
          return chain(doctype(1));
        } else {
          return null;
        }
      } else if (stream.eat("?")) {
        stream.eatWhile(/[\w\._\-]/);
        state.tokenize = inBlock("meta", "?>");
        return "meta";
      } else {
        type = stream.eat("/") ? "closeTag" : "openTag";
        state.tokenize = inTag;
        return "tag bracket";
      }
    } else if (ch == "&") {
      var ok;
      if (stream.eat("#")) {
        if (stream.eat("x")) {
          ok = stream.eatWhile(/[a-fA-F\d]/) && stream.eat(";");
        } else {
          ok = stream.eatWhile(/[\d]/) && stream.eat(";");
        }
      } else {
        ok = stream.eatWhile(/[\w\.\-:]/) && stream.eat(";");
      }
      return ok ? "atom" : "error";
    } else {
      stream.eatWhile(/[^&<]/);
      return null;
    }
  }
  inText.isInText = true;

  function inTag(stream, state) {
    var ch = stream.next();
    if (ch == ">" || (ch == "/" && stream.eat(">"))) {
      state.tokenize = inText;
      type = ch == ">" ? "endTag" : "selfcloseTag";
      return "tag bracket";
    } else if (ch == "=") {
      type = "equals";
      return null;
    } else if (ch == "<") {
      state.tokenize = inText;
      state.state = baseState;
      state.tagName = state.tagStart = null;
      var next = state.tokenize(stream, state);
      return next ? next + " tag error" : "tag error";
    } else if (/[\'\"]/.test(ch)) {
      state.tokenize = inAttribute(ch);
      state.stringStartCol = stream.column();
      return state.tokenize(stream, state);
    } else {
      stream.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/);
      return "word";
    }
  }

  function inAttribute(quote) {
    var closure = function(stream, state) {
      while (!stream.eol()) {
        if (stream.next() == quote) {
          state.tokenize = inTag;
          break;
        }
      }
      return "string";
    };
    closure.isInAttribute = true;
    return closure;
  }

  function inBlock(style, terminator) {
    return function(stream, state) {
      while (!stream.eol()) {
        if (stream.match(terminator)) {
          state.tokenize = inText;
          break;
        }
        stream.next();
      }
      return style;
    }
  }

  function doctype(depth) {
    return function(stream, state) {
      var ch;
      while ((ch = stream.next()) != null) {
        if (ch == "<") {
          state.tokenize = doctype(depth + 1);
          return state.tokenize(stream, state);
        } else if (ch == ">") {
          if (depth == 1) {
            state.tokenize = inText;
            break;
          } else {
            state.tokenize = doctype(depth - 1);
            return state.tokenize(stream, state);
          }
        }
      }
      return "meta";
    };
  }

  function Context(state, tagName, startOfLine) {
    this.prev = state.context;
    this.tagName = tagName;
    this.indent = state.indented;
    this.startOfLine = startOfLine;
    if (config.doNotIndent.hasOwnProperty(tagName) || (state.context && state.context.noIndent))
      this.noIndent = true;
  }
  function popContext(state) {
    if (state.context) state.context = state.context.prev;
  }
  function maybePopContext(state, nextTagName) {
    var parentTagName;
    while (true) {
      if (!state.context) {
        return;
      }
      parentTagName = state.context.tagName;
      if (!config.contextGrabbers.hasOwnProperty(parentTagName) ||
          !config.contextGrabbers[parentTagName].hasOwnProperty(nextTagName)) {
        return;
      }
      popContext(state);
    }
  }

  function baseState(type, stream, state) {
    if (type == "openTag") {
      state.tagStart = stream.column();
      return tagNameState;
    } else if (type == "closeTag") {
      return closeTagNameState;
    } else {
      return baseState;
    }
  }
  function tagNameState(type, stream, state) {
    if (type == "word") {
      state.tagName = stream.current();
      setStyle = "tag";
      return attrState;
    } else if (config.allowMissingTagName && type == "endTag") {
      setStyle = "tag bracket";
      return attrState(type, stream, state);
    } else {
      setStyle = "error";
      return tagNameState;
    }
  }
  function closeTagNameState(type, stream, state) {
    if (type == "word") {
      var tagName = stream.current();
      if (state.context && state.context.tagName != tagName &&
          config.implicitlyClosed.hasOwnProperty(state.context.tagName))
        popContext(state);
      if ((state.context && state.context.tagName == tagName) || config.matchClosing === false) {
        setStyle = "tag";
        return closeState;
      } else {
        setStyle = "tag error";
        return closeStateErr;
      }
    } else if (config.allowMissingTagName && type == "endTag") {
      setStyle = "tag bracket";
      return closeState(type, stream, state);
    } else {
      setStyle = "error";
      return closeStateErr;
    }
  }

  function closeState(type, _stream, state) {
    if (type != "endTag") {
      setStyle = "error";
      return closeState;
    }
    popContext(state);
    return baseState;
  }
  function closeStateErr(type, stream, state) {
    setStyle = "error";
    return closeState(type, stream, state);
  }

  function attrState(type, _stream, state) {
    if (type == "word") {
      setStyle = "attribute";
      return attrEqState;
    } else if (type == "endTag" || type == "selfcloseTag") {
      var tagName = state.tagName, tagStart = state.tagStart;
      state.tagName = state.tagStart = null;
      if (type == "selfcloseTag" ||
          config.autoSelfClosers.hasOwnProperty(tagName)) {
        maybePopContext(state, tagName);
      } else {
        maybePopContext(state, tagName);
        state.context = new Context(state, tagName, tagStart == state.indented);
      }
      return baseState;
    }
    setStyle = "error";
    return attrState;
  }
  function attrEqState(type, stream, state) {
    if (type == "equals") return attrValueState;
    if (!config.allowMissing) setStyle = "error";
    return attrState(type, stream, state);
  }
  function attrValueState(type, stream, state) {
    if (type == "string") return attrContinuedState;
    if (type == "word" && config.allowUnquoted) {setStyle = "string"; return attrState;}
    setStyle = "error";
    return attrState(type, stream, state);
  }
  function attrContinuedState(type, stream, state) {
    if (type == "string") return attrContinuedState;
    return attrState(type, stream, state);
  }

  return {
    startState: function(baseIndent) {
      var state = {tokenize: inText,
                   state: baseState,
                   indented: baseIndent || 0,
                   tagName: null, tagStart: null,
                   context: null}
      if (baseIndent != null) state.baseIndent = baseIndent
      return state
    },

    token: function(stream, state) {
      if (!state.tagName && stream.sol())
        state.indented = stream.indentation();

      if (stream.eatSpace()) return null;
      type = null;
      var style = state.tokenize(stream, state);
      if ((style || type) && style != "comment") {
        setStyle = null;
        state.state = state.state(type || style, stream, state);
        if (setStyle)
          style = setStyle == "error" ? style + " error" : setStyle;
      }
      return style;
    },

    indent: function(state, textAfter, fullLine) {
      var context = state.context;
      // Indent multi-line strings (e.g. css).
      if (state.tokenize.isInAttribute) {
        if (state.tagStart == state.indented)
          return state.stringStartCol + 1;
        else
          return state.indented + indentUnit;
      }
      if (context && context.noIndent) return CodeMirror.Pass;
      if (state.tokenize != inTag && state.tokenize != inText)
        return fullLine ? fullLine.match(/^(\s*)/)[0].length : 0;
      // Indent the starts of attribute names.
      if (state.tagName) {
        if (config.multilineTagIndentPastTag !== false)
          return state.tagStart + state.tagName.length + 2;
        else
          return state.tagStart + indentUnit * (config.multilineTagIndentFactor || 1);
      }
      if (config.alignCDATA && /<!\[CDATA\[/.test(textAfter)) return 0;
      var tagAfter = textAfter && /^<(\/)?([\w_:\.-]*)/.exec(textAfter);
      if (tagAfter && tagAfter[1]) { // Closing tag spotted
        while (context) {
          if (context.tagName == tagAfter[2]) {
            context = context.prev;
            break;
          } else if (config.implicitlyClosed.hasOwnProperty(context.tagName)) {
            context = context.prev;
          } else {
            break;
          }
        }
      } else if (tagAfter) { // Opening tag spotted
        while (context) {
          var grabbers = config.contextGrabbers[context.tagName];
          if (grabbers && grabbers.hasOwnProperty(tagAfter[2]))
            context = context.prev;
          else
            break;
        }
      }
      while (context && context.prev && !context.startOfLine)
        context = context.prev;
      if (context) return context.indent + indentUnit;
      else return state.baseIndent || 0;
    },

    electricInput: /<\/[\s\w:]+>$/,
    blockCommentStart: "<!--",
    blockCommentEnd: "-->",

    configuration: config.htmlMode ? "html" : "xml",
    helperType: config.htmlMode ? "html" : "xml",

    skipAttribute: function(state) {
      if (state.state == attrValueState)
        state.state = attrState
    },

    xmlCurrentTag: function(state) {
      return state.tagName ? {name: state.tagName, close: state.type == "closeTag"} : null
    },

    xmlCurrentContext: function(state) {
      var context = []
      for (var cx = state.context; cx; cx = cx.prev)
        if (cx.tagName) context.push(cx.tagName)
      return context.reverse()
    }
  };
});

CodeMirror.defineMIME("text/xml", "xml");
CodeMirror.defineMIME("application/xml", "xml");
if (!CodeMirror.mimeModes.hasOwnProperty("text/html"))
  CodeMirror.defineMIME("text/html", {name: "xml", htmlMode: true});

});


/***/ }),

/***/ 1460:
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (true) // CommonJS
    mod(__webpack_require__(91), __webpack_require__(1459), __webpack_require__(1462), __webpack_require__(1461));
  else {}
})(function(CodeMirror) {
  "use strict";

  var defaultTags = {
    script: [
      ["lang", /(javascript|babel)/i, "javascript"],
      ["type", /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i, "javascript"],
      ["type", /./, "text/plain"],
      [null, null, "javascript"]
    ],
    style:  [
      ["lang", /^css$/i, "css"],
      ["type", /^(text\/)?(x-)?(stylesheet|css)$/i, "css"],
      ["type", /./, "text/plain"],
      [null, null, "css"]
    ]
  };

  function maybeBackup(stream, pat, style) {
    var cur = stream.current(), close = cur.search(pat);
    if (close > -1) {
      stream.backUp(cur.length - close);
    } else if (cur.match(/<\/?$/)) {
      stream.backUp(cur.length);
      if (!stream.match(pat, false)) stream.match(cur);
    }
    return style;
  }

  var attrRegexpCache = {};
  function getAttrRegexp(attr) {
    var regexp = attrRegexpCache[attr];
    if (regexp) return regexp;
    return attrRegexpCache[attr] = new RegExp("\\s+" + attr + "\\s*=\\s*('|\")?([^'\"]+)('|\")?\\s*");
  }

  function getAttrValue(text, attr) {
    var match = text.match(getAttrRegexp(attr))
    return match ? /^\s*(.*?)\s*$/.exec(match[2])[1] : ""
  }

  function getTagRegexp(tagName, anchored) {
    return new RegExp((anchored ? "^" : "") + "<\/\s*" + tagName + "\s*>", "i");
  }

  function addTags(from, to) {
    for (var tag in from) {
      var dest = to[tag] || (to[tag] = []);
      var source = from[tag];
      for (var i = source.length - 1; i >= 0; i--)
        dest.unshift(source[i])
    }
  }

  function findMatchingMode(tagInfo, tagText) {
    for (var i = 0; i < tagInfo.length; i++) {
      var spec = tagInfo[i];
      if (!spec[0] || spec[1].test(getAttrValue(tagText, spec[0]))) return spec[2];
    }
  }

  CodeMirror.defineMode("htmlmixed", function (config, parserConfig) {
    var htmlMode = CodeMirror.getMode(config, {
      name: "xml",
      htmlMode: true,
      multilineTagIndentFactor: parserConfig.multilineTagIndentFactor,
      multilineTagIndentPastTag: parserConfig.multilineTagIndentPastTag
    });

    var tags = {};
    var configTags = parserConfig && parserConfig.tags, configScript = parserConfig && parserConfig.scriptTypes;
    addTags(defaultTags, tags);
    if (configTags) addTags(configTags, tags);
    if (configScript) for (var i = configScript.length - 1; i >= 0; i--)
      tags.script.unshift(["type", configScript[i].matches, configScript[i].mode])

    function html(stream, state) {
      var style = htmlMode.token(stream, state.htmlState), tag = /\btag\b/.test(style), tagName
      if (tag && !/[<>\s\/]/.test(stream.current()) &&
          (tagName = state.htmlState.tagName && state.htmlState.tagName.toLowerCase()) &&
          tags.hasOwnProperty(tagName)) {
        state.inTag = tagName + " "
      } else if (state.inTag && tag && />$/.test(stream.current())) {
        var inTag = /^([\S]+) (.*)/.exec(state.inTag)
        state.inTag = null
        var modeSpec = stream.current() == ">" && findMatchingMode(tags[inTag[1]], inTag[2])
        var mode = CodeMirror.getMode(config, modeSpec)
        var endTagA = getTagRegexp(inTag[1], true), endTag = getTagRegexp(inTag[1], false);
        state.token = function (stream, state) {
          if (stream.match(endTagA, false)) {
            state.token = html;
            state.localState = state.localMode = null;
            return null;
          }
          return maybeBackup(stream, endTag, state.localMode.token(stream, state.localState));
        };
        state.localMode = mode;
        state.localState = CodeMirror.startState(mode, htmlMode.indent(state.htmlState, "", ""));
      } else if (state.inTag) {
        state.inTag += stream.current()
        if (stream.eol()) state.inTag += " "
      }
      return style;
    };

    return {
      startState: function () {
        var state = CodeMirror.startState(htmlMode);
        return {token: html, inTag: null, localMode: null, localState: null, htmlState: state};
      },

      copyState: function (state) {
        var local;
        if (state.localState) {
          local = CodeMirror.copyState(state.localMode, state.localState);
        }
        return {token: state.token, inTag: state.inTag,
                localMode: state.localMode, localState: local,
                htmlState: CodeMirror.copyState(htmlMode, state.htmlState)};
      },

      token: function (stream, state) {
        return state.token(stream, state);
      },

      indent: function (state, textAfter, line) {
        if (!state.localMode || /^\s*<\//.test(textAfter))
          return htmlMode.indent(state.htmlState, textAfter, line);
        else if (state.localMode.indent)
          return state.localMode.indent(state.localState, textAfter, line);
        else
          return CodeMirror.Pass;
      },

      innerMode: function (state) {
        return {state: state.localState || state.htmlState, mode: state.localMode || htmlMode};
      }
    };
  }, "xml", "javascript", "css");

  CodeMirror.defineMIME("text/html", "htmlmixed");
});


/***/ }),

/***/ 1463:
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (true) // CommonJS
    mod(__webpack_require__(91));
  else {}
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("ruby", function(config) {
  function wordObj(words) {
    var o = {};
    for (var i = 0, e = words.length; i < e; ++i) o[words[i]] = true;
    return o;
  }
  var keywords = wordObj([
    "alias", "and", "BEGIN", "begin", "break", "case", "class", "def", "defined?", "do", "else",
    "elsif", "END", "end", "ensure", "false", "for", "if", "in", "module", "next", "not", "or",
    "redo", "rescue", "retry", "return", "self", "super", "then", "true", "undef", "unless",
    "until", "when", "while", "yield", "nil", "raise", "throw", "catch", "fail", "loop", "callcc",
    "caller", "lambda", "proc", "public", "protected", "private", "require", "load",
    "require_relative", "extend", "autoload", "__END__", "__FILE__", "__LINE__", "__dir__"
  ]);
  var indentWords = wordObj(["def", "class", "case", "for", "while", "until", "module", "then",
                             "catch", "loop", "proc", "begin"]);
  var dedentWords = wordObj(["end", "until"]);
  var opening = {"[": "]", "{": "}", "(": ")"};
  var closing = {"]": "[", "}": "{", ")": "("};
  var curPunc;

  function chain(newtok, stream, state) {
    state.tokenize.push(newtok);
    return newtok(stream, state);
  }

  function tokenBase(stream, state) {
    if (stream.sol() && stream.match("=begin") && stream.eol()) {
      state.tokenize.push(readBlockComment);
      return "comment";
    }
    if (stream.eatSpace()) return null;
    var ch = stream.next(), m;
    if (ch == "`" || ch == "'" || ch == '"') {
      return chain(readQuoted(ch, "string", ch == '"' || ch == "`"), stream, state);
    } else if (ch == "/") {
      if (regexpAhead(stream))
        return chain(readQuoted(ch, "string-2", true), stream, state);
      else
        return "operator";
    } else if (ch == "%") {
      var style = "string", embed = true;
      if (stream.eat("s")) style = "atom";
      else if (stream.eat(/[WQ]/)) style = "string";
      else if (stream.eat(/[r]/)) style = "string-2";
      else if (stream.eat(/[wxq]/)) { style = "string"; embed = false; }
      var delim = stream.eat(/[^\w\s=]/);
      if (!delim) return "operator";
      if (opening.propertyIsEnumerable(delim)) delim = opening[delim];
      return chain(readQuoted(delim, style, embed, true), stream, state);
    } else if (ch == "#") {
      stream.skipToEnd();
      return "comment";
    } else if (ch == "<" && (m = stream.match(/^<([-~])[\`\"\']?([a-zA-Z_?]\w*)[\`\"\']?(?:;|$)/))) {
      return chain(readHereDoc(m[2], m[1]), stream, state);
    } else if (ch == "0") {
      if (stream.eat("x")) stream.eatWhile(/[\da-fA-F]/);
      else if (stream.eat("b")) stream.eatWhile(/[01]/);
      else stream.eatWhile(/[0-7]/);
      return "number";
    } else if (/\d/.test(ch)) {
      stream.match(/^[\d_]*(?:\.[\d_]+)?(?:[eE][+\-]?[\d_]+)?/);
      return "number";
    } else if (ch == "?") {
      while (stream.match(/^\\[CM]-/)) {}
      if (stream.eat("\\")) stream.eatWhile(/\w/);
      else stream.next();
      return "string";
    } else if (ch == ":") {
      if (stream.eat("'")) return chain(readQuoted("'", "atom", false), stream, state);
      if (stream.eat('"')) return chain(readQuoted('"', "atom", true), stream, state);

      // :> :>> :< :<< are valid symbols
      if (stream.eat(/[\<\>]/)) {
        stream.eat(/[\<\>]/);
        return "atom";
      }

      // :+ :- :/ :* :| :& :! are valid symbols
      if (stream.eat(/[\+\-\*\/\&\|\:\!]/)) {
        return "atom";
      }

      // Symbols can't start by a digit
      if (stream.eat(/[a-zA-Z$@_\xa1-\uffff]/)) {
        stream.eatWhile(/[\w$\xa1-\uffff]/);
        // Only one ? ! = is allowed and only as the last character
        stream.eat(/[\?\!\=]/);
        return "atom";
      }
      return "operator";
    } else if (ch == "@" && stream.match(/^@?[a-zA-Z_\xa1-\uffff]/)) {
      stream.eat("@");
      stream.eatWhile(/[\w\xa1-\uffff]/);
      return "variable-2";
    } else if (ch == "$") {
      if (stream.eat(/[a-zA-Z_]/)) {
        stream.eatWhile(/[\w]/);
      } else if (stream.eat(/\d/)) {
        stream.eat(/\d/);
      } else {
        stream.next(); // Must be a special global like $: or $!
      }
      return "variable-3";
    } else if (/[a-zA-Z_\xa1-\uffff]/.test(ch)) {
      stream.eatWhile(/[\w\xa1-\uffff]/);
      stream.eat(/[\?\!]/);
      if (stream.eat(":")) return "atom";
      return "ident";
    } else if (ch == "|" && (state.varList || state.lastTok == "{" || state.lastTok == "do")) {
      curPunc = "|";
      return null;
    } else if (/[\(\)\[\]{}\\;]/.test(ch)) {
      curPunc = ch;
      return null;
    } else if (ch == "-" && stream.eat(">")) {
      return "arrow";
    } else if (/[=+\-\/*:\.^%<>~|]/.test(ch)) {
      var more = stream.eatWhile(/[=+\-\/*:\.^%<>~|]/);
      if (ch == "." && !more) curPunc = ".";
      return "operator";
    } else {
      return null;
    }
  }

  function regexpAhead(stream) {
    var start = stream.pos, depth = 0, next, found = false, escaped = false
    while ((next = stream.next()) != null) {
      if (!escaped) {
        if ("[{(".indexOf(next) > -1) {
          depth++
        } else if ("]})".indexOf(next) > -1) {
          depth--
          if (depth < 0) break
        } else if (next == "/" && depth == 0) {
          found = true
          break
        }
        escaped = next == "\\"
      } else {
        escaped = false
      }
    }
    stream.backUp(stream.pos - start)
    return found
  }

  function tokenBaseUntilBrace(depth) {
    if (!depth) depth = 1;
    return function(stream, state) {
      if (stream.peek() == "}") {
        if (depth == 1) {
          state.tokenize.pop();
          return state.tokenize[state.tokenize.length-1](stream, state);
        } else {
          state.tokenize[state.tokenize.length - 1] = tokenBaseUntilBrace(depth - 1);
        }
      } else if (stream.peek() == "{") {
        state.tokenize[state.tokenize.length - 1] = tokenBaseUntilBrace(depth + 1);
      }
      return tokenBase(stream, state);
    };
  }
  function tokenBaseOnce() {
    var alreadyCalled = false;
    return function(stream, state) {
      if (alreadyCalled) {
        state.tokenize.pop();
        return state.tokenize[state.tokenize.length-1](stream, state);
      }
      alreadyCalled = true;
      return tokenBase(stream, state);
    };
  }
  function readQuoted(quote, style, embed, unescaped) {
    return function(stream, state) {
      var escaped = false, ch;

      if (state.context.type === 'read-quoted-paused') {
        state.context = state.context.prev;
        stream.eat("}");
      }

      while ((ch = stream.next()) != null) {
        if (ch == quote && (unescaped || !escaped)) {
          state.tokenize.pop();
          break;
        }
        if (embed && ch == "#" && !escaped) {
          if (stream.eat("{")) {
            if (quote == "}") {
              state.context = {prev: state.context, type: 'read-quoted-paused'};
            }
            state.tokenize.push(tokenBaseUntilBrace());
            break;
          } else if (/[@\$]/.test(stream.peek())) {
            state.tokenize.push(tokenBaseOnce());
            break;
          }
        }
        escaped = !escaped && ch == "\\";
      }
      return style;
    };
  }
  function readHereDoc(phrase, mayIndent) {
    return function(stream, state) {
      if (mayIndent) stream.eatSpace()
      if (stream.match(phrase)) state.tokenize.pop();
      else stream.skipToEnd();
      return "string";
    };
  }
  function readBlockComment(stream, state) {
    if (stream.sol() && stream.match("=end") && stream.eol())
      state.tokenize.pop();
    stream.skipToEnd();
    return "comment";
  }

  return {
    startState: function() {
      return {tokenize: [tokenBase],
              indented: 0,
              context: {type: "top", indented: -config.indentUnit},
              continuedLine: false,
              lastTok: null,
              varList: false};
    },

    token: function(stream, state) {
      curPunc = null;
      if (stream.sol()) state.indented = stream.indentation();
      var style = state.tokenize[state.tokenize.length-1](stream, state), kwtype;
      var thisTok = curPunc;
      if (style == "ident") {
        var word = stream.current();
        style = state.lastTok == "." ? "property"
          : keywords.propertyIsEnumerable(stream.current()) ? "keyword"
          : /^[A-Z]/.test(word) ? "tag"
          : (state.lastTok == "def" || state.lastTok == "class" || state.varList) ? "def"
          : "variable";
        if (style == "keyword") {
          thisTok = word;
          if (indentWords.propertyIsEnumerable(word)) kwtype = "indent";
          else if (dedentWords.propertyIsEnumerable(word)) kwtype = "dedent";
          else if ((word == "if" || word == "unless") && stream.column() == stream.indentation())
            kwtype = "indent";
          else if (word == "do" && state.context.indented < state.indented)
            kwtype = "indent";
        }
      }
      if (curPunc || (style && style != "comment")) state.lastTok = thisTok;
      if (curPunc == "|") state.varList = !state.varList;

      if (kwtype == "indent" || /[\(\[\{]/.test(curPunc))
        state.context = {prev: state.context, type: curPunc || style, indented: state.indented};
      else if ((kwtype == "dedent" || /[\)\]\}]/.test(curPunc)) && state.context.prev)
        state.context = state.context.prev;

      if (stream.eol())
        state.continuedLine = (curPunc == "\\" || style == "operator");
      return style;
    },

    indent: function(state, textAfter) {
      if (state.tokenize[state.tokenize.length-1] != tokenBase) return CodeMirror.Pass;
      var firstChar = textAfter && textAfter.charAt(0);
      var ct = state.context;
      var closed = ct.type == closing[firstChar] ||
        ct.type == "keyword" && /^(?:end|until|else|elsif|when|rescue)\b/.test(textAfter);
      return ct.indented + (closed ? 0 : config.indentUnit) +
        (state.continuedLine ? config.indentUnit : 0);
    },

    electricInput: /^\s*(?:end|rescue|elsif|else|\})$/,
    lineComment: "#",
    fold: "indent"
  };
});

CodeMirror.defineMIME("text/x-ruby", "ruby");

});


/***/ }),

/***/ 1548:
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// Slim Highlighting for CodeMirror copyright (c) HicknHack Software Gmbh

(function(mod) {
  if (true) // CommonJS
    mod(__webpack_require__(91), __webpack_require__(1460), __webpack_require__(1463));
  else {}
})(function(CodeMirror) {
"use strict";

  CodeMirror.defineMode("slim", function(config) {
    var htmlMode = CodeMirror.getMode(config, {name: "htmlmixed"});
    var rubyMode = CodeMirror.getMode(config, "ruby");
    var modes = { html: htmlMode, ruby: rubyMode };
    var embedded = {
      ruby: "ruby",
      javascript: "javascript",
      css: "text/css",
      sass: "text/x-sass",
      scss: "text/x-scss",
      less: "text/x-less",
      styl: "text/x-styl", // no highlighting so far
      coffee: "coffeescript",
      asciidoc: "text/x-asciidoc",
      markdown: "text/x-markdown",
      textile: "text/x-textile", // no highlighting so far
      creole: "text/x-creole", // no highlighting so far
      wiki: "text/x-wiki", // no highlighting so far
      mediawiki: "text/x-mediawiki", // no highlighting so far
      rdoc: "text/x-rdoc", // no highlighting so far
      builder: "text/x-builder", // no highlighting so far
      nokogiri: "text/x-nokogiri", // no highlighting so far
      erb: "application/x-erb"
    };
    var embeddedRegexp = function(map){
      var arr = [];
      for(var key in map) arr.push(key);
      return new RegExp("^("+arr.join('|')+"):");
    }(embedded);

    var styleMap = {
      "commentLine": "comment",
      "slimSwitch": "operator special",
      "slimTag": "tag",
      "slimId": "attribute def",
      "slimClass": "attribute qualifier",
      "slimAttribute": "attribute",
      "slimSubmode": "keyword special",
      "closeAttributeTag": null,
      "slimDoctype": null,
      "lineContinuation": null
    };
    var closing = {
      "{": "}",
      "[": "]",
      "(": ")"
    };

    var nameStartChar = "_a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD";
    var nameChar = nameStartChar + "\\-0-9\xB7\u0300-\u036F\u203F-\u2040";
    var nameRegexp = new RegExp("^[:"+nameStartChar+"](?::["+nameChar+"]|["+nameChar+"]*)");
    var attributeNameRegexp = new RegExp("^[:"+nameStartChar+"][:\\."+nameChar+"]*(?=\\s*=)");
    var wrappedAttributeNameRegexp = new RegExp("^[:"+nameStartChar+"][:\\."+nameChar+"]*");
    var classNameRegexp = /^\.-?[_a-zA-Z]+[\w\-]*/;
    var classIdRegexp = /^#[_a-zA-Z]+[\w\-]*/;

    function backup(pos, tokenize, style) {
      var restore = function(stream, state) {
        state.tokenize = tokenize;
        if (stream.pos < pos) {
          stream.pos = pos;
          return style;
        }
        return state.tokenize(stream, state);
      };
      return function(stream, state) {
        state.tokenize = restore;
        return tokenize(stream, state);
      };
    }

    function maybeBackup(stream, state, pat, offset, style) {
      var cur = stream.current();
      var idx = cur.search(pat);
      if (idx > -1) {
        state.tokenize = backup(stream.pos, state.tokenize, style);
        stream.backUp(cur.length - idx - offset);
      }
      return style;
    }

    function continueLine(state, column) {
      state.stack = {
        parent: state.stack,
        style: "continuation",
        indented: column,
        tokenize: state.line
      };
      state.line = state.tokenize;
    }
    function finishContinue(state) {
      if (state.line == state.tokenize) {
        state.line = state.stack.tokenize;
        state.stack = state.stack.parent;
      }
    }

    function lineContinuable(column, tokenize) {
      return function(stream, state) {
        finishContinue(state);
        if (stream.match(/^\\$/)) {
          continueLine(state, column);
          return "lineContinuation";
        }
        var style = tokenize(stream, state);
        if (stream.eol() && stream.current().match(/(?:^|[^\\])(?:\\\\)*\\$/)) {
          stream.backUp(1);
        }
        return style;
      };
    }
    function commaContinuable(column, tokenize) {
      return function(stream, state) {
        finishContinue(state);
        var style = tokenize(stream, state);
        if (stream.eol() && stream.current().match(/,$/)) {
          continueLine(state, column);
        }
        return style;
      };
    }

    function rubyInQuote(endQuote, tokenize) {
      // TODO: add multi line support
      return function(stream, state) {
        var ch = stream.peek();
        if (ch == endQuote && state.rubyState.tokenize.length == 1) {
          // step out of ruby context as it seems to complete processing all the braces
          stream.next();
          state.tokenize = tokenize;
          return "closeAttributeTag";
        } else {
          return ruby(stream, state);
        }
      };
    }
    function startRubySplat(tokenize) {
      var rubyState;
      var runSplat = function(stream, state) {
        if (state.rubyState.tokenize.length == 1 && !state.rubyState.context.prev) {
          stream.backUp(1);
          if (stream.eatSpace()) {
            state.rubyState = rubyState;
            state.tokenize = tokenize;
            return tokenize(stream, state);
          }
          stream.next();
        }
        return ruby(stream, state);
      };
      return function(stream, state) {
        rubyState = state.rubyState;
        state.rubyState = CodeMirror.startState(rubyMode);
        state.tokenize = runSplat;
        return ruby(stream, state);
      };
    }

    function ruby(stream, state) {
      return rubyMode.token(stream, state.rubyState);
    }

    function htmlLine(stream, state) {
      if (stream.match(/^\\$/)) {
        return "lineContinuation";
      }
      return html(stream, state);
    }
    function html(stream, state) {
      if (stream.match(/^#\{/)) {
        state.tokenize = rubyInQuote("}", state.tokenize);
        return null;
      }
      return maybeBackup(stream, state, /[^\\]#\{/, 1, htmlMode.token(stream, state.htmlState));
    }

    function startHtmlLine(lastTokenize) {
      return function(stream, state) {
        var style = htmlLine(stream, state);
        if (stream.eol()) state.tokenize = lastTokenize;
        return style;
      };
    }

    function startHtmlMode(stream, state, offset) {
      state.stack = {
        parent: state.stack,
        style: "html",
        indented: stream.column() + offset, // pipe + space
        tokenize: state.line
      };
      state.line = state.tokenize = html;
      return null;
    }

    function comment(stream, state) {
      stream.skipToEnd();
      return state.stack.style;
    }

    function commentMode(stream, state) {
      state.stack = {
        parent: state.stack,
        style: "comment",
        indented: state.indented + 1,
        tokenize: state.line
      };
      state.line = comment;
      return comment(stream, state);
    }

    function attributeWrapper(stream, state) {
      if (stream.eat(state.stack.endQuote)) {
        state.line = state.stack.line;
        state.tokenize = state.stack.tokenize;
        state.stack = state.stack.parent;
        return null;
      }
      if (stream.match(wrappedAttributeNameRegexp)) {
        state.tokenize = attributeWrapperAssign;
        return "slimAttribute";
      }
      stream.next();
      return null;
    }
    function attributeWrapperAssign(stream, state) {
      if (stream.match(/^==?/)) {
        state.tokenize = attributeWrapperValue;
        return null;
      }
      return attributeWrapper(stream, state);
    }
    function attributeWrapperValue(stream, state) {
      var ch = stream.peek();
      if (ch == '"' || ch == "\'") {
        state.tokenize = readQuoted(ch, "string", true, false, attributeWrapper);
        stream.next();
        return state.tokenize(stream, state);
      }
      if (ch == '[') {
        return startRubySplat(attributeWrapper)(stream, state);
      }
      if (stream.match(/^(true|false|nil)\b/)) {
        state.tokenize = attributeWrapper;
        return "keyword";
      }
      return startRubySplat(attributeWrapper)(stream, state);
    }

    function startAttributeWrapperMode(state, endQuote, tokenize) {
      state.stack = {
        parent: state.stack,
        style: "wrapper",
        indented: state.indented + 1,
        tokenize: tokenize,
        line: state.line,
        endQuote: endQuote
      };
      state.line = state.tokenize = attributeWrapper;
      return null;
    }

    function sub(stream, state) {
      if (stream.match(/^#\{/)) {
        state.tokenize = rubyInQuote("}", state.tokenize);
        return null;
      }
      var subStream = new CodeMirror.StringStream(stream.string.slice(state.stack.indented), stream.tabSize);
      subStream.pos = stream.pos - state.stack.indented;
      subStream.start = stream.start - state.stack.indented;
      subStream.lastColumnPos = stream.lastColumnPos - state.stack.indented;
      subStream.lastColumnValue = stream.lastColumnValue - state.stack.indented;
      var style = state.subMode.token(subStream, state.subState);
      stream.pos = subStream.pos + state.stack.indented;
      return style;
    }
    function firstSub(stream, state) {
      state.stack.indented = stream.column();
      state.line = state.tokenize = sub;
      return state.tokenize(stream, state);
    }

    function createMode(mode) {
      var query = embedded[mode];
      var spec = CodeMirror.mimeModes[query];
      if (spec) {
        return CodeMirror.getMode(config, spec);
      }
      var factory = CodeMirror.modes[query];
      if (factory) {
        return factory(config, {name: query});
      }
      return CodeMirror.getMode(config, "null");
    }

    function getMode(mode) {
      if (!modes.hasOwnProperty(mode)) {
        return modes[mode] = createMode(mode);
      }
      return modes[mode];
    }

    function startSubMode(mode, state) {
      var subMode = getMode(mode);
      var subState = CodeMirror.startState(subMode);

      state.subMode = subMode;
      state.subState = subState;

      state.stack = {
        parent: state.stack,
        style: "sub",
        indented: state.indented + 1,
        tokenize: state.line
      };
      state.line = state.tokenize = firstSub;
      return "slimSubmode";
    }

    function doctypeLine(stream, _state) {
      stream.skipToEnd();
      return "slimDoctype";
    }

    function startLine(stream, state) {
      var ch = stream.peek();
      if (ch == '<') {
        return (state.tokenize = startHtmlLine(state.tokenize))(stream, state);
      }
      if (stream.match(/^[|']/)) {
        return startHtmlMode(stream, state, 1);
      }
      if (stream.match(/^\/(!|\[\w+])?/)) {
        return commentMode(stream, state);
      }
      if (stream.match(/^(-|==?[<>]?)/)) {
        state.tokenize = lineContinuable(stream.column(), commaContinuable(stream.column(), ruby));
        return "slimSwitch";
      }
      if (stream.match(/^doctype\b/)) {
        state.tokenize = doctypeLine;
        return "keyword";
      }

      var m = stream.match(embeddedRegexp);
      if (m) {
        return startSubMode(m[1], state);
      }

      return slimTag(stream, state);
    }

    function slim(stream, state) {
      if (state.startOfLine) {
        return startLine(stream, state);
      }
      return slimTag(stream, state);
    }

    function slimTag(stream, state) {
      if (stream.eat('*')) {
        state.tokenize = startRubySplat(slimTagExtras);
        return null;
      }
      if (stream.match(nameRegexp)) {
        state.tokenize = slimTagExtras;
        return "slimTag";
      }
      return slimClass(stream, state);
    }
    function slimTagExtras(stream, state) {
      if (stream.match(/^(<>?|><?)/)) {
        state.tokenize = slimClass;
        return null;
      }
      return slimClass(stream, state);
    }
    function slimClass(stream, state) {
      if (stream.match(classIdRegexp)) {
        state.tokenize = slimClass;
        return "slimId";
      }
      if (stream.match(classNameRegexp)) {
        state.tokenize = slimClass;
        return "slimClass";
      }
      return slimAttribute(stream, state);
    }
    function slimAttribute(stream, state) {
      if (stream.match(/^([\[\{\(])/)) {
        return startAttributeWrapperMode(state, closing[RegExp.$1], slimAttribute);
      }
      if (stream.match(attributeNameRegexp)) {
        state.tokenize = slimAttributeAssign;
        return "slimAttribute";
      }
      if (stream.peek() == '*') {
        stream.next();
        state.tokenize = startRubySplat(slimContent);
        return null;
      }
      return slimContent(stream, state);
    }
    function slimAttributeAssign(stream, state) {
      if (stream.match(/^==?/)) {
        state.tokenize = slimAttributeValue;
        return null;
      }
      // should never happen, because of forward lookup
      return slimAttribute(stream, state);
    }

    function slimAttributeValue(stream, state) {
      var ch = stream.peek();
      if (ch == '"' || ch == "\'") {
        state.tokenize = readQuoted(ch, "string", true, false, slimAttribute);
        stream.next();
        return state.tokenize(stream, state);
      }
      if (ch == '[') {
        return startRubySplat(slimAttribute)(stream, state);
      }
      if (ch == ':') {
        return startRubySplat(slimAttributeSymbols)(stream, state);
      }
      if (stream.match(/^(true|false|nil)\b/)) {
        state.tokenize = slimAttribute;
        return "keyword";
      }
      return startRubySplat(slimAttribute)(stream, state);
    }
    function slimAttributeSymbols(stream, state) {
      stream.backUp(1);
      if (stream.match(/^[^\s],(?=:)/)) {
        state.tokenize = startRubySplat(slimAttributeSymbols);
        return null;
      }
      stream.next();
      return slimAttribute(stream, state);
    }
    function readQuoted(quote, style, embed, unescaped, nextTokenize) {
      return function(stream, state) {
        finishContinue(state);
        var fresh = stream.current().length == 0;
        if (stream.match(/^\\$/, fresh)) {
          if (!fresh) return style;
          continueLine(state, state.indented);
          return "lineContinuation";
        }
        if (stream.match(/^#\{/, fresh)) {
          if (!fresh) return style;
          state.tokenize = rubyInQuote("}", state.tokenize);
          return null;
        }
        var escaped = false, ch;
        while ((ch = stream.next()) != null) {
          if (ch == quote && (unescaped || !escaped)) {
            state.tokenize = nextTokenize;
            break;
          }
          if (embed && ch == "#" && !escaped) {
            if (stream.eat("{")) {
              stream.backUp(2);
              break;
            }
          }
          escaped = !escaped && ch == "\\";
        }
        if (stream.eol() && escaped) {
          stream.backUp(1);
        }
        return style;
      };
    }
    function slimContent(stream, state) {
      if (stream.match(/^==?/)) {
        state.tokenize = ruby;
        return "slimSwitch";
      }
      if (stream.match(/^\/$/)) { // tag close hint
        state.tokenize = slim;
        return null;
      }
      if (stream.match(/^:/)) { // inline tag
        state.tokenize = slimTag;
        return "slimSwitch";
      }
      startHtmlMode(stream, state, 0);
      return state.tokenize(stream, state);
    }

    var mode = {
      // default to html mode
      startState: function() {
        var htmlState = CodeMirror.startState(htmlMode);
        var rubyState = CodeMirror.startState(rubyMode);
        return {
          htmlState: htmlState,
          rubyState: rubyState,
          stack: null,
          last: null,
          tokenize: slim,
          line: slim,
          indented: 0
        };
      },

      copyState: function(state) {
        return {
          htmlState : CodeMirror.copyState(htmlMode, state.htmlState),
          rubyState: CodeMirror.copyState(rubyMode, state.rubyState),
          subMode: state.subMode,
          subState: state.subMode && CodeMirror.copyState(state.subMode, state.subState),
          stack: state.stack,
          last: state.last,
          tokenize: state.tokenize,
          line: state.line
        };
      },

      token: function(stream, state) {
        if (stream.sol()) {
          state.indented = stream.indentation();
          state.startOfLine = true;
          state.tokenize = state.line;
          while (state.stack && state.stack.indented > state.indented && state.last != "slimSubmode") {
            state.line = state.tokenize = state.stack.tokenize;
            state.stack = state.stack.parent;
            state.subMode = null;
            state.subState = null;
          }
        }
        if (stream.eatSpace()) return null;
        var style = state.tokenize(stream, state);
        state.startOfLine = false;
        if (style) state.last = style;
        return styleMap.hasOwnProperty(style) ? styleMap[style] : style;
      },

      blankLine: function(state) {
        if (state.subMode && state.subMode.blankLine) {
          return state.subMode.blankLine(state.subState);
        }
      },

      innerMode: function(state) {
        if (state.subMode) return {state: state.subState, mode: state.subMode};
        return {state: state, mode: mode};
      }

      //indent: function(state) {
      //  return state.indented;
      //}
    };
    return mode;
  }, "htmlmixed", "ruby");

  CodeMirror.defineMIME("text/x-slim", "slim");
  CodeMirror.defineMIME("application/x-slim", "slim");
});


/***/ })

}]);