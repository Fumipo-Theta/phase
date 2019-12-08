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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/liquid.js");
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

/***/ }),

/***/ "./src/geochem.js":
/*!************************!*\
  !*** ./src/geochem.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/* _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ */\n\n/** class GeoChem\r\n * Provide calculation method for composition.\r\n */\nvar GeoChem =\n/*#__PURE__*/\nfunction () {\n  function GeoChem() {\n    _classCallCheck(this, GeoChem);\n  }\n\n  _createClass(GeoChem, null, [{\n    key: \"getCationNum\",\n    value: function getCationNum() {\n      return {\n        \"SiO2\": 1,\n        \"TiO2\": 1,\n        \"Al2O3\": 2,\n        \"FeO\": 1,\n        \"Fe2O3\": 2,\n        \"MgO\": 1,\n        \"CaO\": 1,\n        \"Na2O\": 2,\n        \"K2O\": 2,\n        \"P2O5\": 2,\n        \"MnO\": 2,\n        \"Cr2O3\": 2,\n        \"NiO\": 1,\n        \"H2O\": 2\n      };\n    }\n  }, {\n    key: \"getMolarValue\",\n    value: function getMolarValue() {\n      return {\n        SiO2: 60.06,\n        TiO2: 79.90,\n        Al2O3: 101.94,\n        FeO: 71.84,\n        MgO: 40.32,\n        Fe2O3: 159.69,\n        CaO: 56.08,\n        Na2O: 61.99,\n        K2O: 94.20,\n        P2O5: 141.94,\n        MnO: 70.94,\n        Cr2O3: 151.99,\n        NiO: 74.69,\n        H2O: 18\n      };\n    }\n  }, {\n    key: \"getMajorList\",\n    value: function getMajorList() {\n      return [\"SiO2\", \"TiO2\", \"Al2O3\", \"FeO\", \"Fe2O3\", \"MgO\", \"CaO\", \"Na2O\", \"K2O\", \"P2O5\", \"MnO\", \"Cr2O3\", \"NiO\", \"H2O\"];\n    }\n  }, {\n    key: \"getTraceList\",\n    value: function getTraceList() {\n      return [];\n    }\n  }]);\n\n  return GeoChem;\n}();\n\nmodule.exports = GeoChem;\n\n//# sourceURL=webpack:///./src/geochem.js?");

/***/ }),

/***/ "./src/liquid.js":
/*!***********************!*\
  !*** ./src/liquid.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("function _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nvar GeoChem = __webpack_require__(/*! ./geochem */ \"./src/geochem.js\");\n\nvar Phase = __webpack_require__(/*! ./phase */ \"./src/phase.js\");\n\nvar sum = function sum(a, b) {\n  return a + b;\n};\n\nvar Liquid =\n/*#__PURE__*/\nfunction (_Phase) {\n  _inherits(Liquid, _Phase);\n\n  function Liquid(name) {\n    var _this;\n\n    _classCallCheck(this, Liquid);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(Liquid).call(this, name));\n    _this.fFe2 = 1;\n    _this.outOfRange = false;\n    return _this;\n  }\n\n  _createClass(Liquid, [{\n    key: \"setH2O\",\n    value: function setH2O(waterContent) {\n      this.major.H2O = waterContent;\n      return this;\n    }\n  }, {\n    key: \"setFe2Ratio\",\n    value: function setFe2Ratio(Fe2Fraction) {\n      this.fFe2 = Fe2Fraction; // Fe2 / (Fe2 + Fe3);\n\n      return this;\n    }\n  }, {\n    key: \"compensateFe\",\n    value: function compensateFe() {\n      var exceptH2O = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n      this.compo2atom(exceptH2O, true).atom2compo();\n      return this;\n    }\n  }, {\n    key: \"compo2atom\",\n    value: function compo2atom() {\n      var _this2 = this;\n\n      var exceptH2O = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n      var normalize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n      var molar = GeoChem.getMolarValue();\n      var major = this.major;\n      Object.entries(major).forEach(function (kv) {\n        var k = kv[0],\n            v = kv[1],\n            m = molar[k];\n        _this2.atom[k] = exceptH2O === true && k === \"H2O\" ? 0 : v / m;\n      });\n      var totalFe = this.atom.FeO + this.atom.Fe2O3 * 2;\n      this.atom.FeO = totalFe * this.fFe2;\n      this.atom.Fe2O3 = totalFe * (1 - this.fFe2) * 0.5;\n\n      if (normalize) {\n        var atomSum = this.getAtomSum(exceptH2O);\n        Object.keys(major).forEach(function (k) {\n          var v = _this2.atom[k];\n          _this2.atom[k] = exceptH2O === true && k === \"H2O\" ? 0 : v / atomSum;\n        });\n      }\n\n      return this;\n    }\n    /**\r\n     *\r\n     * @param {*} objs = [{\"phase\": Phase, \"f\":Number}]\r\n     * @param {*} massFraction\r\n     */\n\n  }, {\n    key: \"differentiate\",\n    value: function differentiate(objs, massFraction) {\n      var _this3 = this;\n\n      var self = this;\n      if (self.outOfRange) throw new Error(\"Composition out of range\");\n\n      var _loop = function _loop(prop) {\n        var component = objs.map(function (o) {\n          return o.phase.major[prop] * o.f;\n        }).reduce(sum);\n        var candidate = (_this3.major[prop] + massFraction * component) / (1 + massFraction);\n\n        if (0 <= candidate && candidate <= 100) {\n          self.major[prop] = candidate;\n        } else {\n          self.outOfRange === true;\n        }\n      };\n\n      for (var prop in this.major) {\n        _loop(prop);\n      }\n\n      ;\n\n      var _loop2 = function _loop2(_prop) {\n        var component = objs.map(function (o) {\n          return o.phase.trace[_prop] * o.f;\n        }).reduce(sum);\n        var candidate = (_this3.trace[_prop] + massFraction * component) / (1 + massFraction);\n\n        if (0 <= candidate && candidate <= 100000000) {\n          self.trace[_prop] = candidate;\n        } else {\n          self.outOfRange === true;\n        }\n      };\n\n      for (var _prop in this.trace) {\n        _loop2(_prop);\n      }\n\n      ;\n      return this;\n    }\n  }, {\n    key: \"startDifferentiate\",\n    value: function startDifferentiate() {\n      this.outOfRange = false;\n      return this;\n    }\n  }, {\n    key: \"desolve\",\n    value: function desolve(obj, massFraction) {\n      return this;\n    }\n  }], [{\n    key: \"isLiquid\",\n    value: function isLiquid(obj) {\n      return obj instanceof Liquid;\n    }\n  }]);\n\n  return Liquid;\n}(Phase);\n\nmodule.exports = Liquid;\n\n//# sourceURL=webpack:///./src/liquid.js?");

/***/ }),

/***/ "./src/phase.js":
/*!**********************!*\
  !*** ./src/phase.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); }\n\nfunction _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === \"[object Arguments]\")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/*\r\n\t分配係数の温度・圧力・組成依存性を考慮する\r\n\r\n*/\n\n/* Phase.profile:{\r\n\t\tascend:{\r\n\t\t\tSiO2:[],\r\n\t\t\tMgO:[],\r\n\t\t\t...,\r\n\t\t\tF:[],\tmass fraction of phase\r\n\t\t\tT:[],\tsystem temperature [K]\r\n\t\t\tP:[],\tsystem pressure [GPa]\r\n\t\t\tN:[],\tatom number of phase\r\n\t\t\tx:[]\tradius of phase\r\n\t\t},\r\n\t\tdescend:{\r\n\t\t\t...\r\n\t\t}\r\n\t}\r\n */\nvar GeoChem = __webpack_require__(/*! ./geochem */ \"./src/geochem.js\");\n\nvar ChemicalProfile = __webpack_require__(/*! ./chemical_profile */ \"./src/chemical_profile.js\");\n\nvar sum = function sum(a, b) {\n  return a + b;\n};\n/** class Phase\r\n *\r\n * @param {*} _type\r\n * @param {*} _phaseName\r\n */\n\n\nvar Phase =\n/*#__PURE__*/\nfunction () {\n  function Phase(name) {\n    _classCallCheck(this, Phase);\n\n    this.cationNum = GeoChem.getCationNum();\n    this.molarValue = GeoChem.getMolarValue();\n    this.majorList = GeoChem.getMajorList();\n    this.traceList = GeoChem.getTraceList();\n    this.optionalProperty = [\"F\", \"T\", \"N\", \"P\", \"x\"];\n    this.name = name;\n  }\n\n  _createClass(Phase, [{\n    key: \"setMajorList\",\n    value: function setMajorList(es) {\n      this.majorList = es;\n    }\n  }, {\n    key: \"setTraceList\",\n    value: function setTraceList(es) {\n      this.traceList = es;\n    }\n  }, {\n    key: \"initialize\",\n    value: function initialize() {\n      this.major = this.initMajor();\n      this.major0 = this.initMajor();\n      this.trace = this.initTrace();\n      this.atom = this.initMajor();\n      this.profile = {\n        \"ascend\": new ChemicalProfile([this.majorList, this.traceList, this.optionalProperty]),\n        \"descend\": new ChemicalProfile([this.majorList, this.traceList, this.optionalProperty])\n      };\n      this.isInitialized = true;\n      return this;\n    }\n  }, {\n    key: \"initMajor\",\n    value: function initMajor() {\n      return Phase.initComposition(this.majorList);\n    }\n  }, {\n    key: \"initTrace\",\n    value: function initTrace() {\n      return Phase.initComposition(this.traceList);\n    }\n  }, {\n    key: \"getMixture\",\n    value: function getMixture() {}\n  }, {\n    key: \"resetAtom\",\n    value: function resetAtom() {\n      this.atom = this.initMajor();\n      return this;\n    }\n  }, {\n    key: \"setProperty\",\n    value: function setProperty(attrs, prop) {\n      attrs.forEach(function (attr) {\n        Object.entries(prop).forEach(function (_ref) {\n          var _ref2 = _slicedToArray(_ref, 2),\n              k = _ref2[0],\n              v = _ref2[1];\n\n          if (attr.hasOwnProperty(k)) {\n            attr[k] = v * 1.;\n          }\n        });\n      });\n      return this;\n    }\n  }, {\n    key: \"setComposition\",\n    value: function setComposition(_compo) {\n      this.major = this.initMajor();\n      this.major0 = this.initMajor();\n      this.trace = this.initTrace();\n      this.resetAtom();\n      this.setProperty([this.major, this.major0, this.trace], _compo);\n      return this;\n    }\n  }, {\n    key: \"updateComposition\",\n    value: function updateComposition(_compo) {\n      this.setProperty([this.major, this.major0, this.trace], _compo);\n      return this;\n    }\n  }, {\n    key: \"setMolar\",\n    value: function setMolar(_molar) {\n      this.major = this.initMajor();\n      this.major0 = this.initMajor();\n      this.trace = this.initTrace();\n      this.resetAtom();\n      this.setProperty([this.atom], _compo);\n      return this;\n    }\n  }, {\n    key: \"updateMoler\",\n    value: function updateMoler(_compo) {\n      this.setProperty([this.atom], _compo);\n      return this;\n    }\n  }, {\n    key: \"getWeight\",\n    value: function getWeight() {\n      var _this = this;\n\n      var exceptH2O = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : True;\n      var molar = GeoChem.getMolarValue();\n      return Object.entries(molar).map(function (kv) {\n        var k = kv[0];\n        var v = kv[1];\n        return exceptH2O === True && k === \"H2O\" ? 0 : !_this.atom.hasOwnProperty(k) ? 0 : _this.atom[k] * v;\n      }).reduce(sum);\n    }\n    /*\r\n    getWeight(hydrous = false) {\r\n      let molar = Phase.getMolarValue();\r\n      let weight = 0;\r\n      for (let elem in molar) {\r\n        if (hydrous === false && elem === \"H2O\") continue;\r\n        if (!this.atom[elem]) continue;\r\n        weight += this.atom[elem] * molar[elem];\r\n      };\r\n    */\n\n  }, {\n    key: \"getAtomSum\",\n    value: function getAtomSum() {\n      var _this2 = this;\n\n      var exceptH2O = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n      var molar = GeoChem.getMolarValue();\n      return Object.entries(molar).map(function (_ref3) {\n        var _ref4 = _slicedToArray(_ref3, 2),\n            k = _ref4[0],\n            v = _ref4[1];\n\n        return exceptH2O === true && k === \"H2O\" ? 0 : !_this2.atom.hasOwnProperty(k) ? 0 : _this2.atom[k];\n      }).reduce(sum);\n    }\n    /*\r\n    getAtomSum(hydrous = false) {\r\n      let molar = Phase.getMolarValue();\r\n        let atomSum = 0;\r\n      for (let elem in molar) {\r\n        if (hydrous === false && elem === \"H2O\") continue;\r\n        if (!this.atom[elem]) continue;\r\n        atomSum = atomSum + this.atom[elem];\r\n      };\r\n      return atomSum;\r\n    }\r\n    */\n\n  }, {\n    key: \"normalizeComposition\",\n    value: function normalizeComposition() {\n      var _this3 = this;\n\n      var exceptH2O = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : True;\n      var elements = Object.keys(this.major);\n      var w = elements.map(function (e) {\n        return e === \"H2O\" ? exceptH2O ? 0 : _this3.major[e] : _this3.major[e];\n      }).reduce(sum);\n      elements.forEach(function (e) {\n        _this3.major[e] = e === \"H2O\" ? exceptH2O ? _this3.major[e] : _this3.major[e] * 100 / w : _this3.major[e] * 100 / w;\n      });\n      return this;\n    }\n  }, {\n    key: \"compo2atom\",\n    value: function compo2atom() {\n      var _this4 = this;\n\n      var exceptH2O = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n      var normalize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n      var molar = GeoChem.getMolarValue();\n      var major = this.major;\n      Object.entries(major).forEach(function (_ref5) {\n        var _ref6 = _slicedToArray(_ref5, 2),\n            k = _ref6[0],\n            v = _ref6[1];\n\n        var m = molar[k];\n        _this4.atom[k] = exceptH2O === true && k === \"H2O\" ? 0 : v / m;\n      });\n\n      if (normalize) {\n        var atomSum = this.getAtomSum(exceptH2O);\n        Object.keys(major).forEach(function (k) {\n          var v = _this4.atom[k];\n          _this4.atom[k] = exceptH2O === true && k === \"H2O\" ? 0 : v / atomSum;\n        });\n      }\n\n      return this;\n    }\n  }, {\n    key: \"atom2compo\",\n    value: function atom2compo() {\n      var _this5 = this;\n\n      var exceptH2O = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n      var atom = this.atom;\n      var molar = GeoChem.getMolarValue();\n      var w = Object.entries(atom).map(function (kv) {\n        var k = kv[0],\n            v = kv[1],\n            m = molar[k];\n        return exceptH2O === true && k === \"H2O\" ? 0 : v * m;\n      }).reduce(sum);\n      Object.entries(atom).forEach(function (kv) {\n        var k = kv[0],\n            v = kv[1],\n            m = molar[k];\n        _this5.major[k] = exceptH2O === true && k === \"H2O\" ? _this5.major[k] : v * m / w * 100;\n      });\n      return this;\n    }\n  }, {\n    key: \"getCationSum\",\n    value: function getCationSum() {\n      var _this6 = this;\n\n      var exceptH2O = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n      return Object.entries(GeoChem.getCationNum()).map(function (kv) {\n        var k = kv[0],\n            v = kv[1];\n        return exceptH2O === true && k === \"H2O\" ? 0 : _this6.atom[k] / v;\n      }).reduce(sum);\n    }\n  }, {\n    key: \"getComposition\",\n    value: function getComposition() {\n      return {\n        major: this.getMajor(),\n        trace: this.getTrace()\n      };\n    }\n  }, {\n    key: \"getMajor\",\n    value: function getMajor() {\n      return this.major;\n    }\n  }, {\n    key: \"getTrace\",\n    value: function getTrace() {\n      return this.trace;\n    }\n  }, {\n    key: \"getMolarNumber\",\n    value: function getMolarNumber() {\n      return this.atom;\n    }\n  }, {\n    key: \"getFeMgRatio\",\n    value: function getFeMgRatio() {\n      return this.major.FeO / this.major.MgO * 40.32 / 71.84;\n    }\n  }, {\n    key: \"getMgNumber\",\n    value: function getMgNumber() {\n      return 100 / (1 + this.getFeMgRatio());\n    }\n  }, {\n    key: \"pushProfile\",\n    value: function pushProfile(F, T, P, path) {\n      this.profile[path].push([this.major, this.trace, {\n        F: F,\n        T: T,\n        P: P,\n        N: this.getAtomSum(),\n        x: 0\n      }]);\n      return this;\n    }\n  }, {\n    key: \"popProfile\",\n    value: function popProfile(path) {\n      return this.profile[path].pop();\n    }\n  }, {\n    key: \"getProfile\",\n    value: function getProfile(path) {\n      return this.profile[path].get();\n    }\n  }, {\n    key: \"resetProfile\",\n    value: function resetProfile() {\n      var _this7 = this;\n\n      var _path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [\"ascend\", \"descend\"];\n\n      var path = Array.isArray(_path) ? _path : [_path];\n      path.map(function (p) {\n        _this7.profile[p].reset([_this7.majorList, _this7.traceList, _this7.optionalProperty]);\n      });\n      this.major0 = {};\n      return this;\n    }\n  }, {\n    key: \"profileToCsv\",\n    value: function profileToCsv(path) {\n      var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : \",\";\n      var str = \"\";\n      var profile = this.getProfile(path);\n      var keys = Object.keys(profile);\n      end = new RegExp(separator + \"$\");\n      keys.forEach(function (v) {\n        str += '\"' + v.toString().replace('\"', '') + '\"' + separator;\n      });\n      str = str.replace(end, '');\n      str += \"\\n\";\n\n      var _loop = function _loop(i, l) {\n        keys.forEach(function (k) {\n          str += '\"' + profile[k][i].toString().replace('\"', '') + '\"' + separator;\n        });\n        str = str.replace(end, '\\n');\n      };\n\n      for (var i = 0, l = profile[keys[0]].length; i < l; i++) {\n        _loop(i, l);\n      }\n\n      return str;\n    }\n  }], [{\n    key: \"isPhase\",\n    value: function isPhase(obj) {\n      return obj instanceof Phase;\n    }\n  }, {\n    key: \"initComposition\",\n    value: function initComposition(elementList) {\n      var obj = {};\n      elementList.forEach(function (e) {\n        obj[e] = 0;\n      });\n      return obj;\n    }\n  }]);\n\n  return Phase;\n}();\n\nmodule.exports = Phase;\n\n//# sourceURL=webpack:///./src/phase.js?");

/***/ })

/******/ });
});