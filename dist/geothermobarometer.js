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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/geothermobarometer.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/geothermobarometer.js":
/*!***********************************!*\
  !*** ./src/geothermobarometer.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var thermometer = {\n  /** Sugawara (2000) equilibrium temperature of melt saturating olivine.\r\n  *\r\n  * Pressure should be given as unit of GPa.\r\n  *\r\n  * To use this method:\r\n  *\r\n  * T = thermometer.Sugawara2000.bind(liquid)(P);\r\n  *\r\n  * partial application:\r\n  *\r\n  * liquidT = thermometer.Sugawara2000.bind(liquid);\r\n  * T = liquidT(P);\r\n  *\r\n  * @param liquid[Liquid]: instance of Liquid\r\n  * @param P[Number]: pressure [GPa]\r\n  * @return [Number]: temperature [K]\r\n  */\n  Sugawara2000: function Sugawara2000(liquid) {\n    return function (P) {\n      var atom = liquid.atom;\n      var atomSum = liquid.getAtomSum(true, false) * 0.01;\n      var T = 1446 + (-1.44 * atom.SiO2 - 0.5 * atom.FeO + 12.32 * atom.MgO - 3.899 * atom.CaO) / atomSum;\n      return T + 0.0043 * P;\n    };\n  },\n\n  /** Mederd & Grove(2008) Liquidus drop by water (wt %)\r\n   * @param liquid[Liquid]: instance of Liquid\r\n   * @param H2O[Number]: water content [wt%]\r\n   * @return [Number]:temperature\r\n   */\n  liquidusDropMG2008: function liquidusDropMG2008(liquid) {\n    return function (H2O) {\n      var water = H2O === undefined ? liquid.major.H2O : H2O;\n      return water * (40.4 - water * (2.97 - water * 0.0761));\n    };\n  },\n\n  /** olivineSpinel thermometer\r\n  * @param olivine[Solid]: instance of Solid\r\n  * @param spinel[Solid]: instance of Solid\r\n  * @param P[Number]: pressure [GPa]\r\n  * @return [Number]: temperature [K]\r\n  */\n  olivineSpinelBs1991: function olivineSpinelBs1991(olivine, spinel) {\n    return function (P) {\n      var R = spinel.atom.Fe2O3 + spinel.atom.Al2O3 + spinel.atom.Cr2O3;\n      return ((13530 + 388 * P) * (1 - 2 * olivine.atom.FeO / (olivine.atom.FeO + olivine.atom.MgO)) - 1960 * (spinel.atom.MgO - spinel.atom.FeO) / (spinel.atom.FeO + spinel.atom.MgO) + 16150 * spinel.atom.Cr2O3 / R + 25150 * (spinel.atom.Fe2O3 / R)) / (8.3145 * Math.log(olivine.atom.MgO * spinel.atom.FeO / (olivine.atom.FeO * spinel.atom.MgO)) + 4.705);\n    };\n  }\n};\nvar barometer = {};\nvar oxybarometer = {\n  /** olivineSpinel oxygen fugacity\r\n  * Ballhaus et al. (1991)\r\n  * @param olivine[Solid]: instance of Solid\r\n  * @param spinel[Solid]: instance of Solid\r\n  * @param P[Number] : pressure [GPa]\r\n  * @param T[Number] : temperature [K]\r\n  * @return [Number]: divergence of logfO2 from FMQ buffer\r\n  */\n  olivineSpinelBs1991: function olivineSpinelBs1991(olivine, spinel) {\n    return function (T, P) {\n      var R = spinel.atom.Fe2O3 + spinel.atom.Al2O3 + spinel.atom.Cr2O3;\n      return 0.27 + 2505 / T - 400 * P / T - 6. * Math.log(olivine.atom.FeO) - 3200. * (1. - olivine.atom.FeO) * (1. - olivine.atom.FeO) / T + 2. * Math.log(spinel.atom.FeO) + 4. * Math.log(spinel.atom.Fe2O3 / R) + 2630. * (spinel.atom.Al2O3 * spinel.atom.Al2O3) / (R * R * T);\n    };\n  }\n};\nmodule.exports = {\n  thermometer: thermometer,\n  barometer: barometer,\n  oxybarometer: oxybarometer\n};\n\n//# sourceURL=webpack:///./src/geothermobarometer.js?");

/***/ })

/******/ });
});