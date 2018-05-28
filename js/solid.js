(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["geochem", "phase"], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Solid = factory(root.GeoChem, root.Phase);
  }
}(this, function (_GeoChem, _Phase) {
  const GeoChem = (typeof require === 'undefined' && (typeof _GeoChem === 'object' || typeof _GeoChem === 'function'))
    ? _GeoChem
    : require("./geochem");

  const Phase = (typeof require === 'undefined' && (typeof _Phase === 'object' || typeof _Phase === 'function'))
    ? _Phase
    : require("./phase");

  const sum = (a, b) => a + b;

  /** class Solid extends Phase
   *
   * @param {*} name 
   */
  class Solid extends Phase {
    constructor(name) {
      super(name);
      this.D = {};
      this.KD = {};
      this.dN = 0;
      this.solver = {};
      this.answerVector = {};
    }

    static isSolid(obj) {
      return obj instanceof Solid;
    }

    setAtomFraction(dN) {
      this.dN = dN;
      return this;
    }

    setD(opt) {
      Object.entries(opt).map(o => {
        let e = o[0], D = o[1];
        this.D[e] = D
      })
      return this;
    }

    setKD(opt) {
      Object.entries(opt).map(o => {
        let e = o[0], KD = o[1];
        this.KD[e] = KD
      })
      return this;
    }

    getMeltMgNumber() {
      return 100 / (1 + this.getFeMgRatio() / this.KD.Fe_Mg);
    }

    setRadius(_beforeR, _afterR, _path) {
      const l = this.profile[_path].profile.F.length;
      const f = (Math.pow(_afterR, 3) - Math.pow(_beforeR, 3)) / this.profile[_path].profile.F[l - 1];
      for (let i = 0; i < l; i++) {
        this.profile[_path].profile.x[i] = Math.pow(f * this.profile[_path].F[i] + Math.pow(_beforeR, 3), 0.333333);
      }
      return this;
    }

    setSolver(_adjacentPhaseName, _solverFunc) {
      this.solver[_adjacentPhaseName] = _solverFunc(this);
      return this;
    }

    setAnswerVector(_adjacentPhaseName, _answerVector) {
      this.answerVector[_adjacentPhaseName] = _answerVector;
      return this;
    }

    equilibrate(_adjacentPhaseName, _T, _P) {
      const equiCompo = this.solver[_adjacentPhaseName](_T, _P);
      this.major = equiCompo.major;
      this.trace = equiCompo.trace;
      return this;
    }

    compensateFe(mineral) {
      const method = {
        spinel: spinel => {
          let atom = spinel.atom;
          let atomSum = spinel.getAtomSum();
          let oxygenNum = 16;
        }
      }
    }
  }

  return Solid;
}))