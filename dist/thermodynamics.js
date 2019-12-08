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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/thermodynamics.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/thermodynamics.js":
/*!*******************************!*\
  !*** ./src/thermodynamics.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\r\n * thermodynamic model to get equilibrium phase and their composition\r\n *\r\n * Model Interface\r\n * SET:\r\n * \tsetCalibratedModel(calibrateParameters) => this;\r\n * \tsetSystemComposition(composition) => this;\r\n *\r\n * GET:\r\n * \tgetEquilibriumPhase() => [Phase name] @[String];\r\n * \tgetPhaseComposition(phaseName) => {component : wt%} @{String : Float};\r\n *\r\n *\r\n * calibration model:\r\n * \tCompatible for machine learning.\r\n *\r\n *\r\n */\nmodel = {};\n/**\r\n * model.Gibbs\r\n *\r\n * thermodynamic model using Gibbs method\r\n * Minimise Gibbs free energy under a given system (bulk composition, temperature, pressure, oxide fugacity)\r\n */\n\nmodel.Gibbs = new function () {\n  this.system = {\n    dH: 0,\n    dCp: 0,\n    dS: 0,\n    dV: 0\n  };\n  this.bulkCompo = {};\n  return this;\n}();\n/**\r\n * @method setSystemComposition\r\n *\r\n * @param _compo={\r\n * \tSiO2 : Float,\r\n * \tAl2O3 : Float,\r\n * \t...,\r\n * \tH2O : Float\r\n * }\r\n *\r\n * @return this\r\n */\n\nmodel.Gibbs.prototype.setSystemComposition = function (_compo) {\n  this.bulkCompo = _compo;\n  return this;\n};\n\nmodel.Gibbs.prototype.getEquilibriumPhase = function () {};\n\nmodel.Gibbs.prototype._getAffinity_ = function (_phaseName) {};\n\nmodel.Gibbs.prototype._getdG_ = function () {};\n\nmodule.exports = model;\n\n//# sourceURL=webpack:///./src/thermodynamics.js?");

/***/ })

/******/ });
});