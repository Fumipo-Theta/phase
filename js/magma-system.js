(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([

    ], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.MagmaSystem = factory(
      root.Solid,
      root.Liquid
    );
  }
}(this, function (_Solid, _Liquid, ) {

  const Solid = (typeof require === 'undefined' && (typeof _Solid === 'object' || typeof _Solid === 'function'))
    ? _Solid
    : require("./solid");

  const Liquid = (typeof require === 'undefined' && (typeof _Liquid === 'object' || typeof _Liquid === 'function'))
    ? _Liquid
    : require("./liquid");


  class Magma {
    constructor(parameters) {
      this.phase = {};
      this.model = (parameters, magma) => null;
      this.diffusionProfiles = {};
      this.thermometer = {};
      this.barometer = {};
      this.oxybarometer = {};

      this.actionFuncList = [(magma, opt) => null];
      this.finalAction = (magma, opt) => null;
      this.thermodynamicProperties = {};
      this.custom = {};
    }


    filterPhase(func) {
      const obj = {}
      Object.entries(this.phase)
        .filter(kv => func(kv[1]))
        .map(kv => {
          obj[kv[0]] = kv[1]
        })
      return obj
    }

    liquids() {
      return this.filterPhase(p => p instanceof Liquid);
    }

    solids() {
      return this.filterPhase(p => p instanceof Solid)
    }

    /** 
     * 予めセットアップしたPhaseや温度圧力計を登録する.
     * Phaseはclass内部で, {phase.name:Phase}という辞書として保存される
     * 
     * @param {Object} obj
     */
    setThermodynamicAgent(obj) {
      Object.entries(obj).map(kv => {
        let k = kv[0], v = kv[1];
        switch (k) {
          case "phase":
            v.map(phase => {
              this.phase[phase.name] = phase;
              this.diffusionProfiles[phase.name] = {};
            });
            break;

          case "thermometer":
            this.thermometer = v;
            break;

          case "barometer":
            this.barometer = v;
            break;
          default:
            break;
        }
      })
      return this;
    }

    setThermodynamicHandler(func) {
      this.thermodynamicHandler = func;
      return this;
    }

    getThermodynamicProperty(opt) {
      return this.thermodynamicHandler(this, opt);
    }


    setDiffusionProfile(diffusion, phaseName, component) {
      this.diffusionProfiles[phaseName][component] = diffusion;
      return this;
    }

    getDiffusionProfile(phaseName) {
      return this.diffusionProfiles[phaseName];
    }

    setAction(actionFuncList) {
      this.action = actionFuncList;
      return this;
    }

    setFinalAction(actionFunc) {
      this.finalAction = actionFunc;
      return this;
    }

    execAction(opt) {
      let result = {}
      this.action.map((act, i) => {
        result = act(this, opt[i], result);
      })
      return this.finalAction(this, opt[opt.length - 1], result);
    }


  }

  return Magma;
}))

