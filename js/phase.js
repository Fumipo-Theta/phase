/*
	分配係数の温度・圧力・組成依存性を考慮する
	
*/

/* Phase.profile:{
		ascend:{
			SiO2:[],
			MgO:[],
			...,
			F:[],	mass fraction of phase
			T:[],	system temperature [K]
			P:[],	system pressure [GPa]
			N:[],	atom number of phase
			x:[]	radius of phase
		},
		descend:{
			...
		}
	}
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["geochem", "chemical_profile"], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.phase = factory(root.GeoChem, root.ChemicalProfile);
  }
}(this, function (_GeoChem, _ChemicalProfile) {

  const GeoChem = (typeof require === 'undefined' && typeof _GeoChem === 'object')
    ? _GeoChem
    : require("./geochem");

  const ChemicalProfile = (typeof require === 'undefined' && typeof _ChemicalProfile === 'object')
    ? _ChemicalProfile
    : require("./chemical_profile");


  const sum = (a, b) => a + b;


  /** class Phase
   *
   * @param {*} _type 
   * @param {*} _phaseName 
   */
  class Phase {
    constructor(name) {
      this.cationNum = GeoChem.getCationNum();
      this.molarValue = GeoChem.getMolarValue();
      this.majorList = GeoChem.getMajorList();
      this.traceList = GeoChem.getTraceList();
      this.name = name;
    };

    static isPhase(obj) {
      return obj instanceof Phase;
    }

    setMajorList(es) {
      this.majorList = es;
    }

    setTraceList(es) {
      this.traceList = es;
    }

    initialize() {
      this.major = this.initMajor();
      this.major0 = this.initMajor();
      this.trace = this.initTrace();
      this.atom = this.initMajor();
      this.profile = {
        "ascend": new ChemicalProfile(
          this.majorList,
          this.traceList
        ),
        "descend": new ChemicalProfile(
          this.majorList,
          this.traceList
        )
      }
      this.isInitialized = true;
      return this;
    }

    static initComposition(elementList) {
      const obj = {};
      elementList.map(e => {
        obj[e] = 0;
      })
      return obj;
    }

    initMajor() {
      return Phase.initComposition(this.majorList);
    }

    initTrace() {
      return Phase.initComposition(this.traceList);
    }

    getMixture() { }

    setComposition(_compo) {

      Object.entries(_compo).map(kv => {
        let k = kv[0];
        let v = kv[1]
        if (this.major.hasOwnProperty(k)) {
          this.major[k] = v * 1.;
          this.major0[k] = v * 1.;
        } else if (this.trace.hasOwnProperty(k)) {
          this.trace[k] = v * 1.;
        }
      })
      return this;
    }

    updateComposition(_compo) {
      this.setComposition(_compo);
      return this;
    }

    setMolar(_molar) {
      Object.entries(_molar).map(kv => {
        let k = kv[0];
        let v = kv[1];
        if (this.atom.hasOwnProperty(k)) {
          this.atom[k] = v * 1.;
        } else {
          this.atom[k] = 0;
        }
      })
      return this;
    }

    getWeight(exceptH2O = True) {
      const molar = GeoChem.getMolarValue();

      return Object.entries(molar).map(kv => {
        let k = kv[0];
        let v = kv[1];
        return (exceptH2O === True && k === "H2O")
          ? 0
          : (!this.atom.hasOwnProperty(k))
            ? 0
            : this.atom[k] * v
      }).reduce(sum);
    }
    /*
    getWeight(hydrous = false) {
      let molar = Phase.getMolarValue();
      let weight = 0;
      for (let elem in molar) {
        if (hydrous === false && elem === "H2O") continue;
        if (!this.atom[elem]) continue;
        weight += this.atom[elem] * molar[elem];
      };
    */

    getAtomSum(exceptH2O = true) {
      const molar = GeoChem.getMolarValue();

      return Object.entries(molar).map(kv => {
        let k = kv[0];
        let v = kv[1];
        return (exceptH2O === true && k === "H2O")
          ? 0
          : (!this.atom.hasOwnProperty(k))
            ? 0
            : this.atom[k];
      }).reduce(sum);
    }
    /*
    getAtomSum(hydrous = false) {
      let molar = Phase.getMolarValue();

      let atomSum = 0;
      for (let elem in molar) {
        if (hydrous === false && elem === "H2O") continue;
        if (!this.atom[elem]) continue;
        atomSum = atomSum + this.atom[elem];
      };
      return atomSum;
    }
    */

    normalizeComposition(exceptH2O = True) {
      const elements = Object.keys(this.major);
      const w = elements.map(e => {
        return (e === "H2O")
          ? (exceptH2O)
            ? 0
            : this.major[e]
          : this.major[e];
      }).reduce(sum);

      elements.map(e => {
        this.major[e] = (e === "H2O")
          ? (exceptH2O)
            ? this.major[e]
            : this.major[e] * 100 / w
          : this.major[e] * 100 / w;
      })

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

    atom2compo(exceptH2O = true) {
      const atom = this.atom;
      const molar = GeoChem.getMolarValue();

      const w = Object.entries(atom).map(kv => {
        let k = kv[0], v = kv[1], m = molar[k];
        return (exceptH2O === true && k === "H2O")
          ? 0
          : v * m;
      }).reduce(sum);

      Object.entries(atom).map(kv => {
        let k = kv[0], v = kv[1], m = molar[k];
        this.major[k] = (exceptH2O === true && k === "H2O")
          ? this.major[k]
          : v * m / w;
      })
      /*
      let weight = 0;
      for (let elem in molar) {
        if (hydrous === false && elem === "H2O") {

          continue;
        }
        if (!atom[elem]) major[elem] = 0;
        if (atom[elem] < 0) return false;
        major[elem] = atom[elem] * molar[elem];
        weight += major[elem];
      };

      for (let elem in molar) {
        if (hydrous === false && elem === "H2O") {
          major.H2O = this.major.H2O;
          continue;
        }
        major[elem] = major[elem] / weight * 100;
      };

      this.major = major;
      */
      return this;
    }

    getCationSum(exceptH2O = true) {
      return Object.entries(GeoChem.getCationNum())
        .map(kv => {
          let k = kv[0], v = kv[1];
          return (exceptH2O === true && k === "H2O")
            ? 0
            : this.atom[k] / v;
        }).reduce(sum);
    }

    getComposition() {
      return { major: this.getMajor(), trace: this.getTrace() };
    }

    getMajor() {
      return this.major;
    }

    getTrace() {
      return this.trace;
    }

    getMolarNumber() {
      return this.atom;
    }

    getFeMgRatio() {
      return this.major.FeO / this.major.MgO * 40.32 / 71.84;
    }

    getMgNumber() {
      return 100 / (1 + this.getFeMgRatio());
    }

    pushProfile(F, T, P, path) {
      this.profile[path].push(
        this.major,
        this.trace,
        F,
        T,
        P,
        this.getAtomSum()
      )
      return this;
    }

    getProfile(path) {
      return this.profile[path].get();
    }

    resetProfile(path) {
      this.profile[path].reset(this.majorList, this.traceList);
      this.major0 = {};
      return this;
    }

    profileToCsv(path, separator = ",") {
      let str = ""
      let profile = this.getProfile(path);
      const keys = Object.keys(profile);

      end = new RegExp(separator + "$");

      keys.map((v) => {
        str += '"' + v.toString().replace('"', '') + '"' + separator;
      })
      str = str.replace(end, '');
      str += "\n";

      for (let i = 0, l = profile[keys[0]].length; i < l; i++) {
        keys.map((k) => {
          str += '"' + profile[k][i].toString().replace('"', '') + '"' + separator;
        })
        str = str.replace(end, '\n');
      }
      return str;
    }
  }


  /** Resampler */
  // profile as argument should have property c,x,f(crystallization fraction)


  /** transformSectionToEqualDivision */
  // sampled point number is divideNum + 1
  // F[0] ~ g(F[i-1], F[i]) ~ F[N]

  Phase.transformSectionToEqualDivision = function (sectionObj, _divideNum = 1, _prop = 'f') {
    const divideNum = parseInt(_divideNum);
    if (divideNum < 1) return sectionObj;


    const newProfile = [];
    const keys = Object.keys(sectionObj);

    for (key of keys) {

      if (!sectionObj[key][_prop]) {
        newProfile[key] = sectionObj[key];
        continue;
      }
      //if(sectionObj[key].f.length < 2) return sectionObj;
      let profile = sectionObj[key];
      let l = profile[_prop].length;
      let extent = { 'max': profile[_prop][l - 1], 'min': profile[_prop][0] };

      newProfile[key] = {
        'name': key,
        'f': [],
        'c': [],
        'x': []
      };

      newProfile[key].f[0] = profile.f[0];
      newProfile[key].c[0] = profile.c[0];
      let dF = (extent.max - extent.min) / divideNum;
      let F = profile[_prop][0] + dF;
      let k = 0;

      for (let i = 1; i < divideNum + 1; i = (i + 1) | 0) {
        while (F > profile[_prop][k + 1]) {
          if (k == l - 2) break;
          k = (k + 1) | 0;
        }

        let factor = (F - profile[_prop][k]) / (profile[_prop][k + 1] - profile[_prop][k]);

        newProfile[key].f[i] = F;
        newProfile[key].c[i] = profile.c[k] * (1 - factor) + profile.c[k + 1] * factor;

        F += dF;
      }

    }

    return newProfile;
  }

  Phase.formatProfile = function (sectionObj) {
    const newProfile = {};
    const keys = Object.keys(sectionObj[0]);

    keys.map((key) => {
      newProfile[key] = [];
    })

    for (let i = 0, l = sectionObj.length; i < l; i++) {

      keys.map((key) => {
        newProfile[key][i] = sectionObj[i][key];
      })
    }

    return newProfile;
  }

  return Phase;
}));