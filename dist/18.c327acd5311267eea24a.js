(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[18,27,118],{

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

/***/ 1552:
/***/ (function(module, exports, __webpack_require__) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (true) // CommonJS
    mod(__webpack_require__(91), __webpack_require__(1460));
  else {}
})(function(CodeMirror) {
  "use strict";

  var paramData = { noEndTag: true, soyState: "param-def" };
  var tags = {
    "alias": { noEndTag: true },
    "delpackage": { noEndTag: true },
    "namespace": { noEndTag: true, soyState: "namespace-def" },
    "@param": paramData,
    "@param?": paramData,
    "@inject": paramData,
    "@inject?": paramData,
    "@state": paramData,
    "template": { soyState: "templ-def", variableScope: true},
    "literal": { },
    "msg": {},
    "fallbackmsg": { noEndTag: true, reduceIndent: true},
    "select": {},
    "plural": {},
    "let": { soyState: "var-def" },
    "if": {},
    "elseif": { noEndTag: true, reduceIndent: true},
    "else": { noEndTag: true, reduceIndent: true},
    "switch": {},
    "case": { noEndTag: true, reduceIndent: true},
    "default": { noEndTag: true, reduceIndent: true},
    "foreach": { variableScope: true, soyState: "for-loop" },
    "ifempty": { noEndTag: true, reduceIndent: true},
    "for": { variableScope: true, soyState: "for-loop" },
    "call": { soyState: "templ-ref" },
    "param": { soyState: "param-ref"},
    "print": { noEndTag: true },
    "deltemplate": { soyState: "templ-def", variableScope: true},
    "delcall": { soyState: "templ-ref" },
    "log": {},
    "element": { variableScope: true },
  };

  var indentingTags = Object.keys(tags).filter(function(tag) {
    return !tags[tag].noEndTag || tags[tag].reduceIndent;
  });

  CodeMirror.defineMode("soy", function(config) {
    var textMode = CodeMirror.getMode(config, "text/plain");
    var modes = {
      html: CodeMirror.getMode(config, {name: "text/html", multilineTagIndentFactor: 2, multilineTagIndentPastTag: false}),
      attributes: textMode,
      text: textMode,
      uri: textMode,
      trusted_resource_uri: textMode,
      css: CodeMirror.getMode(config, "text/css"),
      js: CodeMirror.getMode(config, {name: "text/javascript", statementIndent: 2 * config.indentUnit})
    };

    function last(array) {
      return array[array.length - 1];
    }

    function tokenUntil(stream, state, untilRegExp) {
      if (stream.sol()) {
        for (var indent = 0; indent < state.indent; indent++) {
          if (!stream.eat(/\s/)) break;
        }
        if (indent) return null;
      }
      var oldString = stream.string;
      var match = untilRegExp.exec(oldString.substr(stream.pos));
      if (match) {
        // We don't use backUp because it backs up just the position, not the state.
        // This uses an undocumented API.
        stream.string = oldString.substr(0, stream.pos + match.index);
      }
      var result = stream.hideFirstChars(state.indent, function() {
        var localState = last(state.localStates);
        return localState.mode.token(stream, localState.state);
      });
      stream.string = oldString;
      return result;
    }

    function contains(list, element) {
      while (list) {
        if (list.element === element) return true;
        list = list.next;
      }
      return false;
    }

    function prepend(list, element) {
      return {
        element: element,
        next: list
      };
    }

    function popcontext(state) {
      if (!state.context) return;
      if (state.context.scope) {
        state.variables = state.context.scope;
      }
      state.context = state.context.previousContext;
    }

    // Reference a variable `name` in `list`.
    // Let `loose` be truthy to ignore missing identifiers.
    function ref(list, name, loose) {
      return contains(list, name) ? "variable-2" : (loose ? "variable" : "variable-2 error");
    }

    // Data for an open soy tag.
    function Context(previousContext, tag, scope) {
      this.previousContext = previousContext;
      this.tag = tag;
      this.kind = null;
      this.scope = scope;
    }

    function expression(stream, state) {
      var match;
      if (stream.match(/[[]/)) {
        state.soyState.push("list-literal");
        state.context = new Context(state.context, "list-literal", state.variables);
        state.lookupVariables = false;
        return null;
      } else if (stream.match(/map\b/)) {
        state.soyState.push("map-literal");
        return "keyword";
      } else if (stream.match(/record\b/)) {
        state.soyState.push("record-literal");
        return "keyword";
      } else if (stream.match(/([\w]+)(?=\()/)) {
        return "variable callee";
      } else if (match = stream.match(/^["']/)) {
        state.soyState.push("string");
        state.quoteKind = match[0];
        return "string";
      } else if (stream.match(/^[(]/)) {
        state.soyState.push("open-parentheses");
        return null;
      } else if (stream.match(/(null|true|false)(?!\w)/) ||
          stream.match(/0x([0-9a-fA-F]{2,})/) ||
          stream.match(/-?([0-9]*[.])?[0-9]+(e[0-9]*)?/)) {
        return "atom";
      } else if (stream.match(/(\||[+\-*\/%]|[=!]=|\?:|[<>]=?)/)) {
        // Tokenize filter, binary, null propagator, and equality operators.
        return "operator";
      } else if (match = stream.match(/^\$([\w]+)/)) {
        return ref(state.variables, match[1], !state.lookupVariables);
      } else if (match = stream.match(/^\w+/)) {
        return /^(?:as|and|or|not|in|if)$/.test(match[0]) ? "keyword" : null;
      }

      stream.next();
      return null;
    }

    return {
      startState: function() {
        return {
          soyState: [],
          variables: prepend(null, 'ij'),
          scopes: null,
          indent: 0,
          quoteKind: null,
          context: null,
          lookupVariables: true, // Is unknown variables considered an error
          localStates: [{
            mode: modes.html,
            state: CodeMirror.startState(modes.html)
          }]
        };
      },

      copyState: function(state) {
        return {
          tag: state.tag, // Last seen Soy tag.
          soyState: state.soyState.concat([]),
          variables: state.variables,
          context: state.context,
          indent: state.indent, // Indentation of the following line.
          quoteKind: state.quoteKind,
          lookupVariables: state.lookupVariables,
          localStates: state.localStates.map(function(localState) {
            return {
              mode: localState.mode,
              state: CodeMirror.copyState(localState.mode, localState.state)
            };
          })
        };
      },

      token: function(stream, state) {
        var match;

        switch (last(state.soyState)) {
          case "comment":
            if (stream.match(/^.*?\*\//)) {
              state.soyState.pop();
            } else {
              stream.skipToEnd();
            }
            if (!state.context || !state.context.scope) {
              var paramRe = /@param\??\s+(\S+)/g;
              var current = stream.current();
              for (var match; (match = paramRe.exec(current)); ) {
                state.variables = prepend(state.variables, match[1]);
              }
            }
            return "comment";

          case "string":
            var match = stream.match(/^.*?(["']|\\[\s\S])/);
            if (!match) {
              stream.skipToEnd();
            } else if (match[1] == state.quoteKind) {
              state.quoteKind = null;
              state.soyState.pop();
            }
            return "string";
        }

        if (!state.soyState.length || last(state.soyState) != "literal") {
          if (stream.match(/^\/\*/)) {
            state.soyState.push("comment");
            return "comment";
          } else if (stream.match(stream.sol() ? /^\s*\/\/.*/ : /^\s+\/\/.*/)) {
            return "comment";
          }
        }

        switch (last(state.soyState)) {
          case "templ-def":
            if (match = stream.match(/^\.?([\w]+(?!\.[\w]+)*)/)) {
              state.soyState.pop();
              return "def";
            }
            stream.next();
            return null;

          case "templ-ref":
            if (match = stream.match(/(\.?[a-zA-Z_][a-zA-Z_0-9]+)+/)) {
              state.soyState.pop();
              // If the first character is '.', it can only be a local template.
              if (match[0][0] == '.') {
                return "variable-2"
              }
              // Otherwise
              return "variable";
            }
            if (match = stream.match(/^\$([\w]+)/)) {
              state.soyState.pop();
              return ref(state.variables, match[1], !state.lookupVariables);
            }

            stream.next();
            return null;

          case "namespace-def":
            if (match = stream.match(/^\.?([\w\.]+)/)) {
              state.soyState.pop();
              return "variable";
            }
            stream.next();
            return null;

          case "param-def":
            if (match = stream.match(/^\w+/)) {
              state.variables = prepend(state.variables, match[0]);
              state.soyState.pop();
              state.soyState.push("param-type");
              return "def";
            }
            stream.next();
            return null;

          case "param-ref":
            if (match = stream.match(/^\w+/)) {
              state.soyState.pop();
              return "property";
            }
            stream.next();
            return null;

          case "open-parentheses":
            if (stream.match(/[)]/)) {
              state.soyState.pop();
              return null;
            }
            return expression(stream, state);

          case "param-type":
            var peekChar = stream.peek();
            if ("}]=>,".indexOf(peekChar) != -1) {
              state.soyState.pop();
              return null;
            } else if (peekChar == "[") {
              state.soyState.push('param-type-record');
              return null;
            } else if (peekChar == "(") {
              state.soyState.push('param-type-template');
              return null;
            } else if (peekChar == "<") {
              state.soyState.push('param-type-parameter');
              return null;
            } else if (match = stream.match(/^([\w]+|[?])/)) {
              return "type";
            }
            stream.next();
            return null;

          case "param-type-record":
            var peekChar = stream.peek();
            if (peekChar == "]") {
              state.soyState.pop();
              return null;
            }
            if (stream.match(/^\w+/)) {
              state.soyState.push('param-type');
              return "property";
            }
            stream.next();
            return null;

          case "param-type-parameter":
            if (stream.match(/^[>]/)) {
              state.soyState.pop();
              return null;
            }
            if (stream.match(/^[<,]/)) {
              state.soyState.push('param-type');
              return null;
            }
            stream.next();
            return null;

          case "param-type-template":
            if (stream.match(/[>]/)) {
              state.soyState.pop();
              state.soyState.push('param-type');
              return null;
            }
            if (stream.match(/^\w+/)) {
              state.soyState.push('param-type');
              return "def";
            }
            stream.next();
            return null;

          case "var-def":
            if (match = stream.match(/^\$([\w]+)/)) {
              state.variables = prepend(state.variables, match[1]);
              state.soyState.pop();
              return "def";
            }
            stream.next();
            return null;

          case "for-loop":
            if (stream.match(/\bin\b/)) {
              state.soyState.pop();
              return "keyword";
            }
            if (stream.peek() == "$") {
              state.soyState.push('var-def');
              return null;
            }
            stream.next();
            return null;

          case "record-literal":
            if (stream.match(/^[)]/)) {
              state.soyState.pop();
              return null;
            }
            if (stream.match(/[(,]/)) {
              state.soyState.push("map-value")
              state.soyState.push("record-key")
              return null;
            }
            stream.next()
            return null;

          case "map-literal":
            if (stream.match(/^[)]/)) {
              state.soyState.pop();
              return null;
            }
            if (stream.match(/[(,]/)) {
              state.soyState.push("map-value")
              state.soyState.push("map-value")
              return null;
            }
            stream.next()
            return null;

          case "list-literal":
            if (stream.match(/\]/)) {
              state.soyState.pop();
              state.lookupVariables = true;
              popcontext(state);
              return null;
            }
            if (stream.match(/\bfor\b/)) {
              state.lookupVariables = true;
              state.soyState.push('for-loop');
              return "keyword";
            }
            return expression(stream, state);

          case "record-key":
            if (stream.match(/[\w]+/)) {
              return "property";
            }
            if (stream.match(/^[:]/)) {
              state.soyState.pop();
              return null;
            }
            stream.next();
            return null;

          case "map-value":
            if (stream.peek() == ")" || stream.peek() == "," || stream.match(/^[:)]/)) {
              state.soyState.pop();
              return null;
            }
            return expression(stream, state);

          case "import":
            if (stream.eat(";")) {
              state.soyState.pop();
              state.indent -= 2 * config.indentUnit;
              return null;
            }
            if (stream.match(/\w+(?=\s+as)/)) {
              return "variable";
            }
            if (match = stream.match(/\w+/)) {
              return /(from|as)/.test(match[0]) ? "keyword" : "def";
            }
            if (match = stream.match(/^["']/)) {
              state.soyState.push("string");
              state.quoteKind = match[0];
              return "string";
            }
            stream.next();
            return null;

          case "tag":
            var endTag = state.tag[0] == "/";
            var tagName = endTag ? state.tag.substring(1) : state.tag;
            var tag = tags[tagName];
            if (stream.match(/^\/?}/)) {
              var selfClosed = stream.current() == "/}";
              if (selfClosed && !endTag) {
                popcontext(state);
              }
              if (state.tag == "/template" || state.tag == "/deltemplate") {
                state.variables = prepend(null, 'ij');
                state.indent = 0;
              } else {
                state.indent -= config.indentUnit *
                    (selfClosed || indentingTags.indexOf(state.tag) == -1 ? 2 : 1);
              }
              state.soyState.pop();
              return "keyword";
            } else if (stream.match(/^([\w?]+)(?==)/)) {
              if (state.context && state.context.tag == tagName && stream.current() == "kind" && (match = stream.match(/^="([^"]+)/, false))) {
                var kind = match[1];
                state.context.kind = kind;
                var mode = modes[kind] || modes.html;
                var localState = last(state.localStates);
                if (localState.mode.indent) {
                  state.indent += localState.mode.indent(localState.state, "", "");
                }
                state.localStates.push({
                  mode: mode,
                  state: CodeMirror.startState(mode)
                });
              }
              return "attribute";
            }
            return expression(stream, state);

          case "literal":
            if (stream.match(/^(?=\{\/literal})/)) {
              state.soyState.pop();
              return this.token(stream, state);
            }
            return tokenUntil(stream, state, /\{\/literal}/);
        }

        if (stream.match(/^\{literal}/)) {
          state.indent += config.indentUnit;
          state.soyState.push("literal");
          state.context = new Context(state.context, "literal", state.variables);
          return "keyword";

        // A tag-keyword must be followed by whitespace, comment or a closing tag.
        } else if (match = stream.match(/^\{([/@\\]?\w+\??)(?=$|[\s}]|\/[/*])/)) {
          var prevTag = state.tag;
          state.tag = match[1];
          var endTag = state.tag[0] == "/";
          var indentingTag = !!tags[state.tag];
          var tagName = endTag ? state.tag.substring(1) : state.tag;
          var tag = tags[tagName];
          if (state.tag != "/switch")
            state.indent += ((endTag || tag && tag.reduceIndent) && prevTag != "switch" ? 1 : 2) * config.indentUnit;

          state.soyState.push("tag");
          var tagError = false;
          if (tag) {
            if (!endTag) {
              if (tag.soyState) state.soyState.push(tag.soyState);
            }
            // If a new tag, open a new context.
            if (!tag.noEndTag && (indentingTag || !endTag)) {
              state.context = new Context(state.context, state.tag, tag.variableScope ? state.variables : null);
            // Otherwise close the current context.
            } else if (endTag) {
              if (!state.context || state.context.tag != tagName) {
                tagError = true;
              } else if (state.context) {
                if (state.context.kind) {
                  state.localStates.pop();
                  var localState = last(state.localStates);
                  if (localState.mode.indent) {
                    state.indent -= localState.mode.indent(localState.state, "", "");
                  }
                }
                popcontext(state);
              }
            }
          } else if (endTag) {
            // Assume all tags with a closing tag are defined in the config.
            tagError = true;
          }
          return (tagError ? "error " : "") + "keyword";

        // Not a tag-keyword; it's an implicit print tag.
        } else if (stream.eat('{')) {
          state.tag = "print";
          state.indent += 2 * config.indentUnit;
          state.soyState.push("tag");
          return "keyword";
        } else if (!state.context && stream.match(/\bimport\b/)) {
          state.soyState.push("import");
          state.indent += 2 * config.indentUnit;
          return "keyword";
        }

        return tokenUntil(stream, state, /\{|\s+\/\/|\/\*/);
      },

      indent: function(state, textAfter, line) {
        var indent = state.indent, top = last(state.soyState);
        if (top == "comment") return CodeMirror.Pass;

        if (top == "literal") {
          if (/^\{\/literal}/.test(textAfter)) indent -= config.indentUnit;
        } else {
          if (/^\s*\{\/(template|deltemplate)\b/.test(textAfter)) return 0;
          if (/^\{(\/|(fallbackmsg|elseif|else|ifempty)\b)/.test(textAfter)) indent -= config.indentUnit;
          if (state.tag != "switch" && /^\{(case|default)\b/.test(textAfter)) indent -= config.indentUnit;
          if (/^\{\/switch\b/.test(textAfter)) indent -= config.indentUnit;
        }
        var localState = last(state.localStates);
        if (indent && localState.mode.indent) {
          indent += localState.mode.indent(localState.state, textAfter, line);
        }
        return indent;
      },

      innerMode: function(state) {
        if (state.soyState.length && last(state.soyState) != "literal") return null;
        else return last(state.localStates);
      },

      electricInput: /^\s*\{(\/|\/template|\/deltemplate|\/switch|fallbackmsg|elseif|else|case|default|ifempty|\/literal\})$/,
      lineComment: "//",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
      blockCommentContinue: " * ",
      useInnerComments: false,
      fold: "indent"
    };
  }, "htmlmixed");

  CodeMirror.registerHelper("wordChars", "soy", /[\w$]/);

  CodeMirror.registerHelper("hintWords", "soy", Object.keys(tags).concat(
      ["css", "debugger"]));

  CodeMirror.defineMIME("text/x-soy", "soy");
});


/***/ })

}]);