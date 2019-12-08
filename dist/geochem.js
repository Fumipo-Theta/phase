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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/geochem.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/geochem.js":
/*!************************!*\
  !*** ./src/geochem.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/* _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ */\n\n/** class GeoChem\r\n * Provide calculation method for composition.\r\n */\nvar GeoChem =\n/*#__PURE__*/\nfunction () {\n  function GeoChem() {\n    _classCallCheck(this, GeoChem);\n  }\n\n  _createClass(GeoChem, null, [{\n    key: \"getCationNum\",\n    value: function getCationNum() {\n      return {\n        \"SiO2\": 1,\n        \"TiO2\": 1,\n        \"Al2O3\": 2,\n        \"FeO\": 1,\n        \"Fe2O3\": 2,\n        \"MgO\": 1,\n        \"CaO\": 1,\n        \"Na2O\": 2,\n        \"K2O\": 2,\n        \"P2O5\": 2,\n        \"MnO\": 2,\n        \"Cr2O3\": 2,\n        \"NiO\": 1,\n        \"H2O\": 2\n      };\n    }\n  }, {\n    key: \"getMolarValue\",\n    value: function getMolarValue() {\n      return {\n        SiO2: 60.06,\n        TiO2: 79.90,\n        Al2O3: 101.94,\n        FeO: 71.84,\n        MgO: 40.32,\n        Fe2O3: 159.69,\n        CaO: 56.08,\n        Na2O: 61.99,\n        K2O: 94.20,\n        P2O5: 141.94,\n        MnO: 70.94,\n        Cr2O3: 151.99,\n        NiO: 74.69,\n        H2O: 18\n      };\n    }\n  }, {\n    key: \"getMajorList\",\n    value: function getMajorList() {\n      return [\"SiO2\", \"TiO2\", \"Al2O3\", \"FeO\", \"Fe2O3\", \"MgO\", \"CaO\", \"Na2O\", \"K2O\", \"P2O5\", \"MnO\", \"Cr2O3\", \"NiO\", \"H2O\"];\n    }\n  }, {\n    key: \"getTraceList\",\n    value: function getTraceList() {\n      return [];\n    }\n  }]);\n\n  return GeoChem;\n}();\n\nmodule.exports = GeoChem;\n\n//# sourceURL=webpack:///./src/geochem.js?");

/***/ })

/******/ });
});