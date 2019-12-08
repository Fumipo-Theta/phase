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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/equilibrate.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/equilibrate.js":
/*!****************************!*\
  !*** ./src/equilibrate.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar GeoChem = __webpack_require__(/*! ./geochem */ \"./src/geochem.js\");\n\nvar Matrix = __webpack_require__(/*! ./matrix */ \"./src/matrix.js\");\n\nvar Equilibrate =\n/*#__PURE__*/\nfunction () {\n  function Equilibrate() {\n    _classCallCheck(this, Equilibrate);\n  }\n  /**\n   *\n   * @param {Liquid} melt\n   * @param {Solid} opx\n   */\n\n\n  _createClass(Equilibrate, null, [{\n    key: \"opx_melt\",\n    value: function opx_melt(melt) {\n      var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : \"solve\";\n      var mv = GeoChem.getMolarValue();\n      return function (opx) {\n        return function (T, P) {\n          var A = [];\n          A[0] = [1, 1, 1, 1, 1, 1, 1, 1];\n          A[1] = [0, -1, opx.KD.Fe_Mg(T, P) * melt.major.FeO / melt.major.MgO, 0, 0, 0, 0, 0];\n          A[2] = [1 / mv.SiO2, -1 / mv.FeO, -1 / mv.MgO, 0, 0, 0, 0, 0];\n          A[3] = [0, 0, 0, 1, 0, 0, 0, 0];\n          A[4] = [0, 0, 0, 0, 1, 0, 0, 0];\n          A[5] = [0, 0, 0, 0, 0, 1, 0, 0];\n          A[6] = [0, 0, 0, 0, 0, 0, 1, 0];\n          A[7] = [0, 0, 0, 0, 0, 0, 0, 1];\n          var v = [100, 0, 0, opx.D.hasOwnProperty(\"TiO2\") ? melt.major.TiO2 * opx.D.TiO2(T, P) : 0, opx.D.hasOwnProperty(\"Al2O3\") ? melt.major.Al2O3 * opx.D.Al2O3(T, P) : 0, opx.D.hasOwnProperty(\"CaO\") ? melt.major.CaO * opx.D.CaO(T, P) : 0, opx.D.hasOwnProperty(\"Cr2O3\") ? melt.major.Cr2O3 * opx.D.Cr2O3(T, P) : 0, opx.D.hasOwnProperty(\"NiO\") ? melt.major.NiO * opx.D.NiO(T, P) : 0];\n          var x = Equilibrate[method](A, v);\n          var trace = {};\n\n          for (var e in melt.trace) {\n            trace[e] = opx.D.hasOwnProperty(e) ? melt.trace[e] * opx.D[e](T, P) : 0;\n          }\n\n          return {\n            major: {\n              SiO2: x[0],\n              FeO: x[1],\n              MgO: x[2],\n              TiO2: x[3],\n              Al2O3: x[4],\n              CaO: x[5],\n              Cr2O3: x[6],\n              NiO: x[7],\n              Fe2O3: 0,\n              Na2O: 0,\n              K2O: 0,\n              P2O5: 0,\n              MnO: 0,\n              H2O: 0\n            },\n            trace: trace\n          };\n        };\n      };\n    }\n  }, {\n    key: \"olivine_melt\",\n    value: function olivine_melt(melt) {\n      var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : \"solve\";\n      var mv = GeoChem.getMolarValue();\n      return function (olivine) {\n        return function (T, P) {\n          var A = [];\n          A[0] = [1, 1, 1, 1, 1, 1, 1, 1];\n          A[1] = [-melt.major.FeO / melt.major.MgO, 1 / olivine.KD.Fe_Mg(T, P), 0, 0, 0, 0, 0, 0];\n          A[2] = [-1 / mv.MgO, -1 / mv.FeO, 2. / mv.SiO2, 0, 0, 0, 0, 0];\n          A[3] = [0, 0, 0, 1, 0, 0, 0, 0];\n          A[4] = [0, 0, 0, 0, 1, 0, 0, 0];\n          A[5] = [0, 0, 0, 0, 0, 1, 0, 0];\n          A[6] = [0, 0, 0, 0, 0, 0, 1, 0];\n          A[7] = [0, 0, 0, 0, 0, 0, 0, 1];\n          var v = [100, 0, 0, olivine.D.hasOwnProperty(\"TiO2\") ? melt.major.TiO2 * olivine.D.TiO2(T, P) : 0, olivine.D.hasOwnProperty(\"Al2O3\") ? melt.major.Al2O3 * olivine.D.Al2O3(T, P) : 0, olivine.D.hasOwnProperty(\"CaO\") ? melt.major.CaO * olivine.D.CaO(T, P) : 0, olivine.D.hasOwnProperty(\"Cr2O3\") ? melt.major.Cr2O3 * olivine.D.Cr2O3(T, P) : 0, olivine.D.hasOwnProperty(\"NiO\") ? melt.major.NiO * olivine.D.NiO(T, P) : 0];\n          var x = Equilibrate[method](A, v, 1e-6, 0.9);\n          var trace = {};\n\n          for (var e in melt.trace) {\n            trace[e] = olivine.D.hasOwnProperty(e) ? melt.trace[e] * olivine.D[e](T, P) : 0;\n          }\n\n          return {\n            major: {\n              SiO2: x[2],\n              FeO: x[1],\n              MgO: x[0],\n              TiO2: x[3],\n              Al2O3: x[4],\n              CaO: x[5],\n              Cr2O3: x[6],\n              NiO: x[7],\n              Fe2O3: 0,\n              Na2O: 0,\n              K2O: 0,\n              P2O5: 0,\n              MnO: 0,\n              H2O: 0\n            },\n            trace: trace\n          };\n        };\n      };\n    }\n  }, {\n    key: \"spinel_melt\",\n    value: function spinel_melt(melt) {\n      var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : \"solve\";\n      var mv = GeoChem.getMolarValue();\n      return function (spinel) {\n        return function (T, P) {\n          var trace = {};\n\n          for (var e in melt.trace) {\n            trace[e] = spinel.D.hasOwnProperty(e) ? melt.trace[e] * spinel.D[e](T, P) : 0;\n          }\n\n          return {\n            major: {\n              SiO2: 0,\n              FeO: 0,\n              MgO: 0,\n              TiO2: 0,\n              Al2O3: 0,\n              CaO: 0,\n              Cr2O3: spinel.D.Cr2O3(T, P) * melt.major.Cr2O3,\n              NiO: spinel.D.NiO(T, P) * melt.major.NiO,\n              Fe2O3: 0,\n              Na2O: 0,\n              K2O: 0,\n              P2O5: 0,\n              MnO: 0,\n              H2O: 0\n            },\n            trace: trace\n          };\n        };\n      };\n    }\n  }, {\n    key: \"solve\",\n    value: function solve(_A, _v) {\n      var _eps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.0e-6;\n\n      var _w = arguments.length > 3 ? arguments[3] : undefined;\n\n      var A = new Matrix(_A);\n      var v = new Matrix(_v.map(function (a) {\n        return [a];\n      }));\n      var invA = Matrix.inverse(A, _eps);\n      var x = Matrix.multiple(invA, v);\n      return x.m.map(function (a) {\n        return a[0];\n      });\n    }\n  }, {\n    key: \"SOR\",\n    value: function SOR(A, v) {\n      var eps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1e-6;\n      var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.;\n      var dX = 1;\n      var absX = 1;\n      var raw = A.length;\n      var col = A[0].length;\n      var x = v.map(function (v) {\n        return 0;\n      });\n      var k = 0;\n\n      while (dX / absX > eps) {\n        dX = 0;\n        absX = 0;\n\n        for (var i = 0; i < raw; i++) {\n          var sum = 0;\n\n          for (var j = 0; j < col; j++) {\n            if (i !== j) {\n              sum += A[i][j] * x[j];\n            }\n          }\n\n          var newX = 1. / A[i][i] * (v[i] - sum);\n          dX += Math.abs(newX - x[i]);\n          absX += Math.abs(newX);\n          x[i] += w * (newX - x[i]);\n          k++;\n        }\n      } //console.log(k++)\n\n\n      return x;\n    }\n  }]);\n\n  return Equilibrate;\n}();\n\nmodule.exports = Equilibrate;\n\n//# sourceURL=webpack:///./src/equilibrate.js?");

/***/ }),

/***/ "./src/geochem.js":
/*!************************!*\
  !*** ./src/geochem.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n/* _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ */\n\n/** class GeoChem\r\n * Provide calculation method for composition.\r\n */\nvar GeoChem =\n/*#__PURE__*/\nfunction () {\n  function GeoChem() {\n    _classCallCheck(this, GeoChem);\n  }\n\n  _createClass(GeoChem, null, [{\n    key: \"getCationNum\",\n    value: function getCationNum() {\n      return {\n        \"SiO2\": 1,\n        \"TiO2\": 1,\n        \"Al2O3\": 2,\n        \"FeO\": 1,\n        \"Fe2O3\": 2,\n        \"MgO\": 1,\n        \"CaO\": 1,\n        \"Na2O\": 2,\n        \"K2O\": 2,\n        \"P2O5\": 2,\n        \"MnO\": 2,\n        \"Cr2O3\": 2,\n        \"NiO\": 1,\n        \"H2O\": 2\n      };\n    }\n  }, {\n    key: \"getMolarValue\",\n    value: function getMolarValue() {\n      return {\n        SiO2: 60.06,\n        TiO2: 79.90,\n        Al2O3: 101.94,\n        FeO: 71.84,\n        MgO: 40.32,\n        Fe2O3: 159.69,\n        CaO: 56.08,\n        Na2O: 61.99,\n        K2O: 94.20,\n        P2O5: 141.94,\n        MnO: 70.94,\n        Cr2O3: 151.99,\n        NiO: 74.69,\n        H2O: 18\n      };\n    }\n  }, {\n    key: \"getMajorList\",\n    value: function getMajorList() {\n      return [\"SiO2\", \"TiO2\", \"Al2O3\", \"FeO\", \"Fe2O3\", \"MgO\", \"CaO\", \"Na2O\", \"K2O\", \"P2O5\", \"MnO\", \"Cr2O3\", \"NiO\", \"H2O\"];\n    }\n  }, {\n    key: \"getTraceList\",\n    value: function getTraceList() {\n      return [];\n    }\n  }]);\n\n  return GeoChem;\n}();\n\nmodule.exports = GeoChem;\n\n//# sourceURL=webpack:///./src/geochem.js?");

/***/ }),

/***/ "./src/matrix.js":
/*!***********************!*\
  !*** ./src/matrix.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/** 行列インスタンスを生成するジェネレーター\n *\n *\n * Correspondance between Matrix sturucture and Array structure\n * [\n * \t[a11 a12 a13],\n * \t[a21 a22 a23],\n * \t[a31 a32 a33]\n * ]\n*/\nvar Matrix = function Matrix() {\n  var matrix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;\n  var rowNum = arguments.length > 1 ? arguments[1] : undefined;\n  var columnNum = arguments.length > 2 ? arguments[2] : undefined;\n  this.m = [];\n\n  if (matrix) {\n    if (Matrix.isMatrix(matrix)) {\n      this.rowNum = matrix.length;\n      this.columnNum = matrix[0].length;\n      this.m = matrix;\n    } else {\n      return false;\n    }\n  } else {\n    for (var _i = 0; _i < rowNum; _i = _i + 1 | 0) {\n      this.m[_i] = [];\n\n      for (var _j = 0; _j < columnNum; _j = _j + 1 | 0) {\n        this.m[_i][_j] = 0.0;\n      }\n\n      ;\n    }\n\n    ;\n    this.rowNum = rowNum;\n    this.columnNum = columnNum;\n  }\n};\n\nMatrix.isMatrix = function (array) {\n  if (Array.isArray(array)) {\n    return array.map(function (a) {\n      return Array.isArray(a);\n    }).reduce(function (a, b) {\n      return a && b ? true : false;\n    });\n  } else {\n    return false;\n  }\n};\n\nMatrix.prototype.getRowNum = function () {\n  return this.rowNum;\n};\n\nMatrix.prototype.getColumnNum = function () {\n  return this.columnNum;\n}; //>> 行列の掛け算を行う関数\n\n\nMatrix.multiple = function (matA, matB) {\n  //>> 引数の行列サイズが不正ならエラーを返す\n  if (matA.getColumnNum() != matB.getRowNum()) {\n    alert(\"multipleMatrix: Invarid matrix size !\");\n    return;\n  }\n\n  var rowNum = matA.getRowNum();\n  var columnNum = matB.getColumnNum();\n  var iterNum = matA.getColumnNum();\n  var resultMat = new Matrix(null, rowNum, columnNum);\n\n  for (var _i2 = 0; _i2 < rowNum; _i2 = _i2 + 1 | 0) {\n    for (var _j2 = 0; _j2 < columnNum; _j2 = _j2 + 1 | 0) {\n      for (var k = 0; k < iterNum; k = k + 1 | 0) {\n        resultMat.m[_i2][_j2] = resultMat.m[_i2][_j2] + matA.m[_i2][k] * matB.m[k][_j2];\n      }\n    }\n  }\n\n  return resultMat;\n}; //>> 行列の足し算を行う関数\n\n\nMatrix.add = function (matA, matB) {\n  var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.;\n\n  if (matA.getRowNum() != matB.getRowNum() || matA.getColumnNum() != matB.getColumnNum()) {\n    console.log(\"addMatrix: Invarid matrix size !\");\n    return;\n  }\n\n  var rowNum = matA.getRowNum();\n  var columnNum = matA.getColumnNum();\n  var resultMat = new Matrix(null, rowNum, columnNum);\n\n  for (var _i3 = 0; _i3 < rowNum; _i3 = _i3 + 1 | 0) {\n    for (var _j3 = 0; _j3 < columnNum; _j3 = _j3 + 1 | 0) {\n      resultMat.m[_i3][_j3] = matA.m[_i3][_j3] + matB.m[_i3][_j3] * f;\n    }\n  }\n\n  return resultMat;\n}; //>> 逆行列を返す関数\n\n\nMatrix.inverse = function (mat, eps) {\n  if (mat.getRowNum() != mat.getColumnNum()) {\n    console.log(\"inverseMatrix: Invarid matrix size!\");\n    return;\n  }\n\n  var rowNum = mat.getRowNum();\n  var columnNum = mat.getColumnNum();\n  var invMat = new Matrix(null, rowNum, columnNum);\n  var tempMat = new Matrix(null, rowNum, columnNum); //>> Initialize\n\n  for (var _i4 = 0; _i4 < rowNum; _i4 = _i4 + 1 | 0) {\n    for (var _j4 = 0; _j4 < columnNum; _j4 = _j4 + 1 | 0) {\n      tempMat.m[_i4][_j4] = mat.m[_i4][_j4];\n\n      if (_i4 == _j4) {\n        invMat.m[_i4][_j4] = 1.0;\n      } else {\n        invMat.m[_i4][_j4] = 0.0;\n      }\n    }\n  } //>> Pivot transformation\n\n\n  for (var pv = 0; pv < rowNum; pv = pv + 1 | 0) {\n    var big = 0.0;\n    var pv_big = pv;\n\n    for (var _i5 = pv; _i5 < rowNum; _i5 = _i5 + 1 | 0) {\n      if (Math.abs(tempMat.m[_i5][pv]) > big) {\n        big = Math.abs(tempMat.m[_i5][pv]);\n        pv_big = _i5;\n      }\n    }\n\n    for (var _j5 = 0; _j5 < columnNum; _j5 = _j5 + 1 | 0) {\n      var temp = tempMat.m[pv][_j5];\n      tempMat.m[pv][_j5] = tempMat.m[pv_big][_j5];\n      tempMat.m[pv_big][_j5] = temp;\n      temp = invMat.m[pv][_j5];\n      invMat.m[pv][_j5] = invMat.m[pv_big][_j5];\n      invMat.m[pv_big][_j5] = temp;\n    }\n\n    if (big <= eps) {\n      console.log(\"inverseMatrix: There is no inverse matrix !\");\n      return;\n    }\n\n    var amp = tempMat.m[pv][pv];\n\n    for (var _j6 = 0; _j6 < columnNum; _j6 = _j6 + 1 | 0) {\n      tempMat.m[pv][_j6] = tempMat.m[pv][_j6] / amp;\n      invMat.m[pv][_j6] = invMat.m[pv][_j6] / amp;\n    }\n\n    for (var _i6 = 0; _i6 < rowNum; _i6 = _i6 + 1 | 0) {\n      amp = tempMat.m[_i6][pv];\n\n      for (var _j7 = 0; _j7 < columnNum; _j7 = _j7 + 1 | 0) {\n        if (_i6 != pv) {\n          tempMat.m[_i6][_j7] = tempMat.m[_i6][_j7] - tempMat.m[pv][_j7] * amp;\n          invMat.m[_i6][_j7] = invMat.m[_i6][_j7] - invMat.m[pv][_j7] * amp;\n        }\n      }\n    }\n  }\n\n  return invMat;\n};\n/** SOR\n *\n */\n\n\nMatrix.SOR = function (A, v) {\n  var eps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1e-6;\n  var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.;\n  var dX = 1;\n  var absX = 1;\n  var raw = A.getRowNum();\n  var col = A.getColumnNum();\n  var x = new Matrix(null, raw, 1);\n  var k = 0;\n\n  while (dX / absX > eps) {\n    dX = 0;\n    absX = 0;\n\n    for (i = 0; i < raw; i++) {\n      var sum = 0;\n\n      for (j = 0; j < col; j++) {\n        if (i !== j) {\n          sum += A.m[i][j] * x.m[j][0];\n        }\n      }\n\n      var newX = 1. / A.m[i][i] * (v.m[i][0] - sum);\n      dX += Math.abs(newX - x.m[i][0]);\n      absX += Math.abs(newX);\n      x.m[i][0] += w * (newX - x.m[i][0]);\n      k++;\n    }\n  }\n\n  console.log(k++);\n  return x;\n};\n\nMatrix.transpose = function (mat) {\n  //if (! Matrix.isMatrix(mat)) return false\n  var rowNum = mat.getRowNum();\n  var columnNum = mat.getColumnNum();\n  var tMat = new Matrix(null, columnNum, rowNum);\n\n  for (var _i7 = 0; _i7 < rowNum; _i7++) {\n    for (var _j8 = 0; _j8 < columnNum; _j8++) {\n      tMat.m[_j8][_i7] = mat.m[_i7][_j8];\n    }\n  }\n\n  return tMat;\n};\n\nmodule.exports = Matrix;\n\n//# sourceURL=webpack:///./src/matrix.js?");

/***/ })

/******/ });
});