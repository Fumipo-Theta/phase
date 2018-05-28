(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["geochem", "phase"], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Liquid = factory(root.GeoChem, root.Phase);
  }
}(this, function (_GeoChem, _Phase) {
  const GeoChem = (typeof require === 'undefined' && (typeof _GeoChem === 'object' || typeof _GeoChem === 'function'))
    ? _GeoChem
    : require("./geochem");

  const Phase = (typeof require === 'undefined' && (typeof _Phase === 'object' || typeof _Phase === 'function'))
    ? _Phase
    : require("./phase");

  const sum = (a, b) => a + b;


  class Liquid extends Phase {
    constructor(name) {
      super(name);
      this.fFe2 = 1;
    }

    static isLiquid(obj) {
      return obj instanceof Liquid;
    }

    setH2O(waterContent) {
      this.major.H2O = waterContent;
      return this;
    }

    setFe2Ratio(Fe2Fraction) {
      this.fFe2 = Fe2Fraction; // Fe2 / (Fe2 + Fe3);
      return this;
    }

    compensateFe(exceptH2O = true) {
      this.compo2atom(exceptH2O, true).atom2compo();
      return this;
    }

    compo2atom(exceptH2O = true, normalize = false) {
      const molar = GeoChem.getMolarValue();
      const major = this.major;

      Object.entries(major).map(kv => {
        let k = kv[0], v = kv[1], m = molar[k];
        this.atom[k] = (exceptH2O === true && k === "H2O")
          ? 0
          : v / m
      })

      const totalFe = this.atom.FeO + this.atom.Fe2O3 * 2;
      this.atom.FeO = totalFe * this.fFe2;
      this.atom.Fe2O3 = totalFe * (1 - this.fFe2) * 0.5;


      if (normalize) {
        const atomSum = this.getAtomSum(exceptH2O);

        Object.keys(major).map(k => {
          let v = this.atom[k]
          this.atom[k] = (exceptH2O === true && k === "H2O")
            ? 0
            : v / atomSum
        })
      }

      return this;
    }

    /**
     * 
     * @param {*} objs = [{"phase": Phase, "f":Number}] 
     * @param {*} massFraction 
     */
    differentiate(objs, massFraction) {
      let self = this;
      for (let prop in this.major) {
        let component = objs.map((o) => o.phase.major[prop] * o.f)
          .reduce(sum);
        self.major[prop] = (this.major[prop] + massFraction * component) / (1 + massFraction);
      };

      for (let prop in this.trace) {
        let component = objs.map((o) => o.phase.trace[prop] * o.f)
          .reduce(sum);
        self.trace[prop] = (this.trace[prop] + massFraction * component) / (1 + massFraction);
      };
      return this;
    }

    desolve(obj, massFraction) {

      return this;
    }
  }

  return Liquid;
}))