(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/chemical_profile.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/chemical_profile.js":
/*!*********************************!*\
  !*** ./src/chemical_profile.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance\"); }\n\nfunction _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === \"[object Arguments]\") return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }\n\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); }\n\nfunction _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === \"[object Arguments]\")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/** ChemicalProfile\r\n *  profile:{\r\n *  x:[],\r\n *  SiO2:[],\r\n *  ...\r\n * }\r\n */\nvar ChemicalProfile =\n/*#__PURE__*/\nfunction () {\n  function ChemicalProfile(propList) {\n    _classCallCheck(this, ChemicalProfile);\n\n    this.profile = ChemicalProfile.initialize(propList);\n  }\n\n  _createClass(ChemicalProfile, [{\n    key: \"reset\",\n    value: function reset(propList) {\n      this.profile = ChemicalProfile.initialize(propList);\n    }\n  }, {\n    key: \"push\",\n    value: function push(objs) {\n      var _this = this;\n\n      var objectArray = Array.isArray(objs) ? objs : [objs];\n      objectArray.forEach(function (obj) {\n        Object.entries(obj).forEach(function (kv) {\n          var k = kv[0],\n              v = kv[1];\n\n          _this.profile[k].push(v);\n        });\n      });\n    }\n  }, {\n    key: \"concat\",\n    value: function concat(objs) {\n      var _this2 = this;\n\n      var objectArray = Array.isArray(objs) ? objs : [objs];\n      objectArray.forEach(function (obj) {\n        Object.entries(obj).forEach(function (_ref) {\n          var _ref2 = _slicedToArray(_ref, 2),\n              k = _ref2[0],\n              v = _ref2[1];\n\n          _this2.profile[k] = [].concat(_toConsumableArray(_this2.profile[k]), _toConsumableArray(v));\n        });\n      });\n    }\n  }, {\n    key: \"pop\",\n    value: function pop() {\n      var obj = {};\n      Object.entries(this.profile).forEach(function (kv) {\n        var k = kv[0],\n            v = kv[1];\n        obj[k] = v.pop();\n      });\n      return obj;\n    }\n  }, {\n    key: \"get\",\n    value: function get() {\n      var _this3 = this;\n\n      var _keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n\n      var obj = {};\n      var keys = Array.isArray(_keys) ? _keys : [_keys];\n\n      if (keys.length === 0) {\n        obj = JSON.parse(JSON.stringify(this.profile));\n      } else {\n        keys.forEach(function (k) {\n          obj[k] = JSON.parse(JSON.stringify(_this3.profile[k]));\n        });\n      }\n\n      return obj;\n    }\n  }, {\n    key: \"set\",\n    value: function set(opt) {\n      var _this4 = this;\n\n      Object.entries(opt).forEach(function (_ref3) {\n        var _ref4 = _slicedToArray(_ref3, 2),\n            k = _ref4[0],\n            array = _ref4[1];\n\n        _this4.profile[k] = array;\n      });\n    }\n  }, {\n    key: \"pick\",\n    value: function pick(k, i) {\n      return this.profile[k][i];\n    }\n  }, {\n    key: \"direct\",\n    value: function direct(k, i, v) {\n      this.profile[k][i] = v;\n    }\n  }, {\n    key: \"getLength\",\n    value: function getLength(k) {\n      return this.profile[k].length;\n    }\n  }, {\n    key: \"transformByEqualStep\",\n    value: function transformByEqualStep() {\n      var _divNum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;\n\n      var _prop = arguments.length > 1 ? arguments[1] : undefined;\n\n      var _profile = this.profile;\n      var divNum = parseInt(_divNum);\n      if (divNum < 1) throw new Error(\"divNum must positive\");\n      if (!_profile.hasOwnProperty(_prop)) throw new Error(\"profile does not have key [\".concat(_prop, \"]\"));\n      var l = _profile[_prop].length;\n      var dF = (_profile[_prop][l - 1] - _profile[_prop][0]) / divNum;\n      var newProfile = {};\n      var props = Object.keys(_profile);\n      props.forEach(function (k) {\n        newProfile[k] = [_profile[k][0]];\n      });\n      var F = _profile[_prop][0] + dF;\n      var k = 0;\n\n      for (var i = 1; i < divNum + 1; i++) {\n        while (F > _profile[_prop][k + 1]) {\n          if (k === l - 2) break;\n          k++;\n        }\n\n        var f = _profile[_prop][k + 1] - _profile[_prop][k] === 0 ? 0 : (F - _profile[_prop][k]) / (_profile[_prop][k + 1] - _profile[_prop][k]);\n        var _iteratorNormalCompletion = true;\n        var _didIteratorError = false;\n        var _iteratorError = undefined;\n\n        try {\n          for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n            var prop = _step.value;\n            newProfile[prop][i] = _profile[prop][k] * (1 - f) + _profile[prop][k + 1] * f;\n          }\n        } catch (err) {\n          _didIteratorError = true;\n          _iteratorError = err;\n        } finally {\n          try {\n            if (!_iteratorNormalCompletion && _iterator[\"return\"] != null) {\n              _iterator[\"return\"]();\n            }\n          } finally {\n            if (_didIteratorError) {\n              throw _iteratorError;\n            }\n          }\n        }\n\n        F += dF;\n      }\n\n      this.profile = newProfile;\n    }\n  }, {\n    key: \"transformByRadius\",\n    value: function transformByRadius(positions) {\n      var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : \"x\";\n      if (positions.length < 1) throw new Error(\"Length of positions is 0\");\n      var profile = this.profile;\n      var props = Object.keys(profile).filter(function (v) {\n        return v !== x;\n      });\n      var profLen = profile[props[0]].length;\n      var posLen = positions.length;\n      var newProfile = {};\n      var _iteratorNormalCompletion2 = true;\n      var _didIteratorError2 = false;\n      var _iteratorError2 = undefined;\n\n      try {\n        for (var _iterator2 = props[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {\n          var _prop2 = _step2.value;\n          newProfile[_prop2] = [];\n        }\n      } catch (err) {\n        _didIteratorError2 = true;\n        _iteratorError2 = err;\n      } finally {\n        try {\n          if (!_iteratorNormalCompletion2 && _iterator2[\"return\"] != null) {\n            _iterator2[\"return\"]();\n          }\n        } finally {\n          if (_didIteratorError2) {\n            throw _iteratorError2;\n          }\n        }\n      }\n\n      var k = 0;\n\n      for (var i = 0; i < posLen; i++) {\n        while (positions[i] > profile[x][k + 1]) {\n          if (k === profLen - 2) break;\n          k++;\n        }\n\n        var f = profile[x][k + 1] - profile[x][k] === 0 ? 0 : (positions[i] - profile[x][k]) / (profile[x][k + 1] - profile[x][k]);\n        var _iteratorNormalCompletion3 = true;\n        var _didIteratorError3 = false;\n        var _iteratorError3 = undefined;\n\n        try {\n          for (var _iterator3 = props[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {\n            var prop = _step3.value;\n            newProfile[prop][i] = profile[prop][k] * (1 - f) + profile[prop][k + 1] * f;\n          }\n        } catch (err) {\n          _didIteratorError3 = true;\n          _iteratorError3 = err;\n        } finally {\n          try {\n            if (!_iteratorNormalCompletion3 && _iterator3[\"return\"] != null) {\n              _iterator3[\"return\"]();\n            }\n          } finally {\n            if (_didIteratorError3) {\n              throw _iteratorError3;\n            }\n          }\n        }\n      }\n\n      newProfile[x] = _toConsumableArray(positions);\n      this.profile = newProfile;\n    }\n    /** section Resampler */\n    // profile as argument should have property c,x,f(crystallization fraction)\n\n    /** transformSectionToEqualDivision */\n    // sampled point number is divideNum + 1\n    // F[0] ~ g(F[i-1], F[i]) ~ F[N]\n\n  }], [{\n    key: \"initialize\",\n    value: function initialize(propList) {\n      var profile = {};\n      propList.forEach(function (propName) {\n        if (Array.isArray(propName)) {\n          propName.forEach(function (p) {\n            profile[p] = [];\n          });\n        } else {\n          profile[propName] = [];\n        }\n      });\n      return profile;\n    }\n  }, {\n    key: \"transformSectionByEqualStep\",\n    value: function transformSectionByEqualStep(section) {\n      var _divideNum = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;\n\n      var prop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : \"f\";\n      var divideNum = parseInt(_divideNum);\n      if (divideNum < 1) throw new Error(\"divideNum must be positive\");\n      var newProfile = [];\n      var keys = Object.keys(sectionObj);\n\n      for (var _i2 = 0, _keys2 = keys; _i2 < _keys2.length; _i2++) {\n        key = _keys2[_i2];\n\n        if (!sectionObj[key][_prop]) {\n          newProfile[key] = sectionObj[key];\n          continue;\n        } //if(sectionObj[key].f.length < 2) return sectionObj;\n\n\n        var profile = sectionObj[key];\n        var l = profile[_prop].length;\n        var extent = {\n          'max': profile[_prop][l - 1],\n          'min': profile[_prop][0]\n        };\n        newProfile[key] = {\n          'name': key,\n          'f': [],\n          'c': [],\n          'x': []\n        };\n        newProfile[key].f[0] = profile.f[0];\n        newProfile[key].c[0] = profile.c[0];\n        var dF = (extent.max - extent.min) / divideNum;\n        var F = profile[_prop][0] + dF;\n        var k = 0;\n\n        for (var i = 1; i < divideNum + 1; i = i + 1 | 0) {\n          while (F > profile[_prop][k + 1]) {\n            if (k == l - 2) break;\n            k = k + 1 | 0;\n          }\n\n          var factor = (F - profile[_prop][k]) / (profile[_prop][k + 1] - profile[_prop][k]);\n          newProfile[key].f[i] = F;\n          newProfile[key].c[i] = profile.c[k] * (1 - factor) + profile.c[k + 1] * factor;\n          F += dF;\n        }\n      }\n\n      return newProfile;\n    }\n  }, {\n    key: \"formatProfile\",\n    value: function formatProfile(sectionObj) {\n      var newProfile = {};\n      var keys = Object.keys(sectionObj[0]);\n      keys.map(function (key) {\n        newProfile[key] = [];\n      });\n\n      var _loop = function _loop(i, l) {\n        keys.map(function (key) {\n          newProfile[key][i] = sectionObj[i][key];\n        });\n      };\n\n      for (var i = 0, l = sectionObj.length; i < l; i++) {\n        _loop(i, l);\n      }\n\n      return newProfile;\n    }\n  }]);\n\n  return ChemicalProfile;\n}();\n\nmodule.exports = ChemicalProfile;\n\n//# sourceURL=webpack:///./src/chemical_profile.js?");

/***/ })

/******/ });
});