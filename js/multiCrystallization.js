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
    define(["../../jslib/matrix"], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.phase = factory(root.Matrix);
  }
}(this, function (_Matrix) {

  const Matrix = (typeof require === 'undefined' && typeof _Matrix === 'object')
    ? _Matrix
    : require('../../jslib/matrix.js');



  /* _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ */
  /** class GeoChem
   * Provide calculation method for composition.
   */
  class GeoChem {
    constructor() {
      this.cationNum = GeoChem.getCationNum();
      this.molarValue = GeoChem.getMolarValue();
      this.majorList = GeoChem.getMajorList();
      this.traceList = GeoChem.getTraceList();
    }

    initialize() {
      this.major = this.initMajor();
      this.major0 = this.initMajor();
      this.trace = this.initTrace();
      this.atom = this.initMajor();
      this.profile = this.initProfile();
      this.isInitialized = True;
    }

    static initComposition(elementList) {
      const obj = {};
      elementList.map(e => {
        obj[e] = 0;
      })
      return obj;
    }

    initMajor() {
      return GeoChem.initComposition(this.majorList);
    }

    initTrace() {
      return GeoChem.initComposition(this.traceList);
    }

    static getCationNum() {
      return {
        "SiO2": 1,
        "TiO2": 1,
        "Al2O3": 2,
        "FeO": 1,
        "Fe2O3": 2,
        "MgO": 1,
        "CaO": 1,
        "Na2O": 2,
        "K2O": 2,
        "P2O5": 2,
        "MnO": 2,
        "Cr2O3": 2,
        "NiO": 1,
        "H2O": 2
      }
    };

    static getMolarValue() {
      return {
        SiO2: 60.06,
        TiO2: 79.90,
        Al2O3: 101.94,
        FeO: 71.84,
        MgO: 40.32,
        Fe2O3: 159.69,
        CaO: 56.08,
        Na2O: 61.99,
        K2O: 94.20,
        P2O5: 141.94,
        MnO: 70.94,
        Cr2O3: 151.99,
        NiO: 74.69,
        H2O: 18
      }
    };

    static getMajorList() {
      return [
        "SiO2", "TiO2", "Al2O3", "FeO",
        "Fe2O3", "MgO", "CaO", "Na2O",
        "K2O", "P2O5", "MnO", "Cr2O3",
        "NiO", "H2O"
      ];
    }

    static getTraceList() {
      return [];
    }

    setMajorList(es) {
      this.majorList = es;
    }

    setTraceList(es) {
      this.traceList = es;
    }

    initializeProfile() {
      const self = this;
      const profile = {}
      ["ascend", "descend"].map(path => {
        self.majorList.map(e => {
          profile[path][e] = [];
        })
        self.traceList.map(e => {
          profile[path][e] = [];
        })
        ["F", "T", "N", "P", "x"].map(e => {
          profile[path][e] = [];
        })
      })
      return profile;
    }

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
  }


  /** class Phase
   *
   * @param {*} _type 
   * @param {*} _phaseName 
   */
  class Phase extends GeoChem {
    constructor(_type, _phaseName) {
      super();
      this.type = _type;
      this.name = _name;
    };
  }

  var Phase = function (_type, _phaseName) {
    var phase = Object.create(Phase.prototype);
    phase.type = _type;
    phase.name = _phaseName;

    phase.major = (function () {
      const obj = {}
      for (let e of Phase.getMajorList()) {
        obj[e] = 0;
      }
      return obj;
    })()

    phase.trace = (function () {
      const obj = {}
      for (let e of Phase.getTraceList()) {
        obj[e] = 0;
      }
      return obj;
    })()

    phase.major0 = (function () {
      const obj = {}
      for (let e of Phase.getMajorList()) {
        obj[e] = 0;
      }
      return obj;
    })()

    phase.atom = (function () {
      const obj = {}
      for (let e of Phase.getMajorList()) {
        obj[e] = 0;
      }
      return obj;
    })();

    phase.profile = { ascend: {}, descend: {} };

    phase.initializeProfile();

    return phase;
  }


  Phase.Matrix = Matrix;


  Phase.isPhase = function (obj, type) {
    if (!Phase.prototype.isPrototypeOf(obj)) {
      return false;
    }
    return type ? obj.type === type : true;
  }



  /* Phase のクラスメソッド
   *
  */

  Phase.prototype = {


    initializeProfile() {
      for (let path of ["ascend", "descend"]) {
        for (let e in this.major) {
          this.profile[path][e] = [];
        }
        for (let e in this.trace) {
          this.profile[path][e] = [];
        }
        this.profile[path].F = [];
        this.profile[path].T = [];
        this.profile[path].N = [];
        this.profile[path].P = [];
        this.profile[path].x = [];
      }
      return this;
    },

    setComposition(_compo) {

      for (let prop in _compo) {
        //console.log(prop)
        if (this.major.hasOwnProperty(prop)) {
          this.major[prop] = _compo[prop] * 1.;
          this.major0[prop] = _compo[prop] * 1.;
        } else if (this.trace.hasOwnProperty(prop)) {
          this.trace[prop] = _compo[prop] * 1.;
        }

      }

      return this;
    },

    setMolar(_molar) {
      for (let prop in _molar) {
        if (this.atom.hasOwnProperty(prop)) {
          this.atom[prop] = _molar[prop] * 1.;
        } else {
          this.atom[prop] = 0;
        }
      }
      return this;
    },

    updateComposition(_compo) {
      for (let prop in _compo) {
        if (this.major.hasOwnProperty(prop)) {
          this.major[prop] = _compo[prop] * 1.;
          this.major0[prop] = _compo[prop] * 1.;
        } else if (this.trace.hasOwnProperty(prop)) {
          this.trace[prop] = _compo[prop] * 1.;
        }

      }
      return this;
    },

    normalizeComposition(hydrous = false) {
      let w = 0;
      for (let prop in this.major) {
        if (prop === "H2O") {
          w += (hydrous) ? this.major.H2O : 0;
        } else {
          w += this.major[prop];
        }
      }

      for (let prop in this.major) {
        if (prop === "H2O") {
          this.major.H2O = (hydrous) ? this.major.H2O * 100 / w : this.major.H2O;
        } else {
          this.major[prop] = this.major[prop] * 100 / w;
        }
      };
      return this;
    },



    getComposition() {
      return { major: this.major, trace: this.trace };
    },

    getMajor() {
      return this.major;
    },

    getTrace() {
      return this.trace;
    },

    getMolarNumber() {
      return this.atom;
    },

    compo2atom(hydrous = false, normalize = false) {
      let molar = Phase.getMolarValue();
      let major = this.major;

      let atom = {};
      let atomSum = 0
      for (let elem in molar) {
        if (hydrous === false && elem === "H2O") continue;
        if (!major[elem]) atom[elem] = 0;
        if (major[elem] < 0) return false;
        atom[elem] = major[elem] / molar[elem];
        atomSum += atom[elem];
      };

      if (normalize === true) {
        for (let elem in atom) {
          atom[elem] /= atomSum;
        }
      }
      this.atom = atom;
      return this;
    },

    getAtomSum(hydrous = false) {
      let molar = Phase.getMolarValue();

      let atomSum = 0;
      for (let elem in molar) {
        if (hydrous === false && elem === "H2O") continue;
        if (!this.atom[elem]) continue;
        atomSum = atomSum + this.atom[elem];
      };
      return atomSum;
    },

    atom2compo(hydrous = false) {
      let atom = this.atom;
      let molar = Phase.getMolarValue();

      let major = {};

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
      return this;
    },

    getWeight(hydrous = false) {
      let molar = Phase.getMolarValue();
      let weight = 0;
      for (let elem in molar) {
        if (hydrous === false && elem === "H2O") continue;
        if (!this.atom[elem]) continue;
        weight += this.atom[elem] * molar[elem];
      };
      return weight;
    },

    getCationSum(hydrous = false) {
      let cation = 0;
      for (let elem in Phase.cationNum) {
        if (hydrous === false && elem === "H2O") continue;
        if (!this.atom[elem]) continue;
        cation += this.atom[elem] / Phase.cationNum[elem];

      }
      return cation;
    },

    getFeMgRatio() {
      return this.major.FeO / this.major.MgO * 40.32 / 71.84;
    },

    getMgNumber() {
      return 100 / (1 + this.getFeMgRatio());
    },

    pushProfile(_F, _T, _P, _path) {
      for (let e in this.major) {
        this.profile[_path][e].push(this.major[e]);
      }
      for (let e in this.trace) {
        this.profile[_path][e].push(this.trace[e]);
      }
      this.profile[_path].F.push(_F);
      this.profile[_path].T.push(_T);
      this.profile[_path].P.push(_P);
      this.profile[_path].N.push(this.getAtomSum());
      this.profile[_path].x.push(0);
      return this;
    },

    getProfile(_path) {
      return JSON.parse(JSON.stringify(this.profile[_path]));
    },

    resetProfile() {
      this.initializeProfile();
      this.major0 = {};
      return this;
    },

    profileToCsv(_path, separator = ",") {
      let str = ""
      let profile = this.profile[_path];
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

  };

  /** Create mixture new phase
   * 
   */

  Phase.getMixture = function () {

  }

  /** Themobarometer correction
   * 
   * Apply functions to Phase instance
   */


  Phase.thermometer = {};

  /** Sugawara (2000) equilibrium temperature of melt saturating olivine.
   *
   * Pressure should be given as unit of GPa.
   * 
   * To use this method: 
   *
   * T = thermometer.Sugawara2000.bind(liquid)(P);
   * 
   * partial application:
   * 
   * liquidT = thermometer.Sugawara2000.bind(liquid);
   * T = liquidT(P);
   */
  Phase.thermometer.Sugawara2000 = function (_pressure = 1) {
    if (!Liquid.isLiquid(this)) return false;

    let atom = this.atom;
    let atomSum = this.getAtomSum(false, false) * 0.01;
    let T = 1446 + (-1.44 * atom.SiO2 - 0.5 * atom.FeO + 12.32 * atom.MgO - 3.899 * atom.CaO) / atomSum;

    return T + 0.0043 * _pressure;

  }

  /** Mederd & Grove (2008) Liquidus drop by water (wt%)
   * 
   */

  Phase.thermometer.liquidusDropMG2008 = function (H2O = false) {
    if (!Liquid.isLiquid(this)) return false;
    let water = (H2O) ? H2O : this.major.H2O;
    return water * (40.4 - water * (2.97 - water * 0.0761));
  }

  /** olivineSpinel thermometer
   * @param _P: pressure [GPa]
   * @return temperature [K]
   */
  Phase.thermometer.olivineSpinelBs1991 = function () {
    const olivine = this;
    return function (_P) {
      const spinel = this;
      let R = spinel.atom.Fe2O3 + spinel.atom.Al2O3 + spinel.atom.Cr2O3;

      return ((13530 + 388 * _P) * (1 - 2 * olivine.atom.FeO / (olivine.atom.FeO + olivine.atom.MgO))
        - 1960 * (spinel.atom.MgO - spinel.atom.FeO) / (spinel.atom.FeO + spinel.atom.MgO)
        + 16150 * spinel.atom.Cr2O3 / R
        + 25150 * (spinel.atom.Fe2O3 / R)) / (8.3145 * Math.log((olivine.atom.MgO * spinel.atom.FeO) / (olivine.atom.FeO * spinel.atom.MgO)) + 4.705);
    }
  }

  Phase.oxygenFugacity = {};

  /** olivineSpinel oxygen fugacity
   * Ballhaus et al. (1991)
   * 
   * @param _P : pressure [GPa]
   * @param _T : temperature [K]
   * @return divergence of logfO2 from FMQ buffer
   */
  Phase.oxygenFugacity.olivineSpinelBs1991 = function () {
    const olivine = this;
    return function (_P, _T) {
      const spinel = this;
      let R = spinel.atom.Fe2O3 + spinel.atom.Al2O3 + spinel.atom.Cr2O3;

      return 0.27 + 2505 / _T
        - 400 * _P / _T
        - 6. * Math.log(olivine.atom.FeO)
        - 3200. * (1. - olivine.atom.FeO) * (1. - olivine.atom.FeO) / _T
        + 2. * Math.log(spinel.atom.FeO)
        + 4. * Math.log(spinel.atom.Fe2O3 / R)
        + 2630. * (spinel.atom.Al2O3 * spinel.atom.Al2O3) / (R * R * _T);

    }
  }

  /** partitioning coefficients
   *  すべて最終的に（T,P)の関数
   */

  Phase.partitioningCoefficient = {
    olivine: {
      Al2O3: {
        myCompile(T, P = 0) {
          // P [GPa]
          let melt = this;
          return 0;
        },
        dummy(T, P) {
          return 0;
        }
      },
      CaO: {
        myCompile(T, P = 0) {
          let melt = this;
          return 0;
        },
        dummy(T, P) {
          return 0;
        }
      },
      TiO2: {
        dummy(T, P) {
          return 0;
        }
      },
      Cr2O3: {
        FreiS2009(T, P) {
          return 1.2
        }
      },
      NiO: {
        NormanS2005(T, P) {
          return 10
        }
      }
    },

    orthopyroxene: {
      Al2O3: {
        myCompile(T, P = 0) {
          // P [GPa]
          let melt = this;
          return (-0.0043 * P - 0.0052) * melt.major.MgO + (0.1669 * P + 0.1407);
        },
        dummy(T, P) {
          return 0;
        }
      },
      CaO: {
        myCompile(T, P = 0) {
          let melt = this;
          return (0.0083 * P - 0.0189) * melt.major.MgO + (-0.0451 * P + 0.3185);
        },
        dummy(T, P) {
          return 0;
        }
      },
      TiO2: {
        dummy(T, P) {
          return 0;
        }
      },

      Cr2O3: {
        FreiS2009(T, P) {
          return 4
        }
      },
      NiO: {
        NormanS2005(T, P) {
          return 5
        }
      }
    },

    spinel: {
      Cr2O3: {
        LieS2008(T, P) {
          return 130
        }
      },
      NiO: {
        LieS2008(T, P) {
          return 2
        }
      }
    }
  };


  Phase.exchangePartitioningCoefficient = {
    olivine: {
      Fe_Mg: {
        Beattie1993(T, P) {
          return 0.303;
        }
      }
    },

    orthopyroxene: {
      Fe_Mg: {
        Beattie1993(T, P) {
          return 0.284;
        }
      }
    },

    spinel: {

    }
  };

  Phase.transformProfile = {
    byEqualStep(_profile, _divNum = 1, _prop) {
      const divNum = parseInt(_divNum);
      if (divNum < 1) return false;
      if (!_profile.hasOwnProperty(_prop)) return false;

      const l = _profile[_prop].length;
      const dF = (_profile[_prop][l - 1] - _profile[_prop][0]) / divNum;
      const newProfile = {};
      const props = Object.keys(_profile);

      for (let prop of props) {
        newProfile[prop] = [];
        newProfile[prop][0] = _profile[prop][0];
      }

      let F = _profile[_prop][0] + dF;
      let k = 0;
      for (let i = 1; i < divNum + 1; i++) {
        while (F > _profile[_prop][k + 1]) {
          if (k === l - 2) break;
          k++;
        }

        let f = (F - _profile[_prop][k]) / (_profile[_prop][k + 1] - _profile[_prop][k]);

        for (let prop of props) {
          newProfile[prop][i] = _profile[prop][k] * (1 - f) + _profile[prop][k + 1] * f;
        }
        F += dF;
      }

      return newProfile;
    },

    byRadius(_profile, _positions) {
      if (_profile.length < 1) return false;
      if (_positions.length < 1) return false;

      const newProfile = {}
      const props = Object.keys(_profile[0]);
      for (let prop of props) {
        newProfile[prop] = [];
        //newProfile[prop][0] = _profile[prop][0];
      }

      profLen = _profile.length;
      posLen = _positions.length;

      let k = 0;
      for (let i = 0; i < posLen; i++) {
        while (_positions[i] > _profile[k + 1].x) {
          if (k === profLen - 2) break;
          k++;
        }
        let f = (_positions[i] - _profile[k].x) / (_profile[k + 1].x - _profile[k].x);
        for (let prop of props) {
          newProfile[prop][i] = _profile[k][prop] * (1 - f) + _profile[k + 1][prop] * f;
        }

      }
      return newProfile;
    }

  }

  /* solver
   * メルトとの平衡組成を計算する関数
  */
  Phase.solver = {
    opx_melt(method = "solve") {
      let melt = this;
      let mv = Phase.getMolarValue();
      return function (T, P) {
        let opx = this;
        let A = [];
        A[0] = [1, 1, 1, 1, 1, 1, 1, 1];
        A[1] = [0, -1, opx.KD.Fe_Mg(T, P) * melt.major.FeO / melt.major.MgO, 0, 0, 0, 0, 0];
        A[2] = [1 / mv.SiO2, -1 / mv.FeO, -1 / mv.MgO, 0, 0, 0, 0, 0];
        A[3] = [0, 0, 0, 1, 0, 0, 0, 0];
        A[4] = [0, 0, 0, 0, 1, 0, 0, 0];
        A[5] = [0, 0, 0, 0, 0, 1, 0, 0];
        A[6] = [0, 0, 0, 0, 0, 0, 1, 0];
        A[7] = [0, 0, 0, 0, 0, 0, 0, 1];

        let v = [100,
          0,
          0,
          (opx.D.hasOwnProperty("TiO2")) ? melt.major.TiO2 * opx.D.TiO2(T, P) : 0,
          (opx.D.hasOwnProperty("Al2O3")) ? melt.major.Al2O3 * opx.D.Al2O3(T, P) : 0,
          (opx.D.hasOwnProperty("CaO")) ? melt.major.CaO * opx.D.CaO(T, P) : 0,
          (opx.D.hasOwnProperty("Cr2O3")) ? melt.major.Cr2O3 * opx.D.Cr2O3(T, P) : 0,
          (opx.D.hasOwnProperty("NiO")) ? melt.major.NiO * opx.D.NiO(T, P) : 0
        ];

        let x = Phase[method](A, v);

        const trace = {};
        for (let e in melt.trace) {
          trace[e] = (opx.D.hasOwnProperty(e)) ? melt.trace[e] * opx.D[e](T, P) : 0;
        }

        return {
          major: {
            SiO2: x[0],
            FeO: x[1],
            MgO: x[2],
            TiO2: x[3],
            Al2O3: x[4],
            CaO: x[5],
            Cr2O3: x[6],
            NiO: x[7],
            Fe2O3: 0,
            Na2O: 0,
            K2O: 0,
            P2O5: 0,
            MnO: 0,
            H2O: 0
          },
          trace: trace
        }

      }
    },

    olivine_melt(method = "solve") {
      let melt = this;
      let mv = Phase.getMolarValue();
      return function (T, P) {
        let olivine = this;
        let A = [];
        A[0] = [1, 1, 1, 1, 1, 1, 1, 1];
        A[1] = [-melt.major.FeO / melt.major.MgO, 1 / olivine.KD.Fe_Mg(T, P), 0, 0, 0, 0, 0, 0];
        A[2] = [-1 / mv.MgO, -1 / mv.FeO, 2. / mv.SiO2, 0, 0, 0, 0, 0];
        A[3] = [0, 0, 0, 1, 0, 0, 0, 0];
        A[4] = [0, 0, 0, 0, 1, 0, 0, 0];
        A[5] = [0, 0, 0, 0, 0, 1, 0, 0];
        A[6] = [0, 0, 0, 0, 0, 0, 1, 0];
        A[7] = [0, 0, 0, 0, 0, 0, 0, 1];

        let v = [100,
          0,
          0,
          (olivine.D.hasOwnProperty("TiO2")) ? melt.major.TiO2 * olivine.D.TiO2(T, P) : 0,
          (olivine.D.hasOwnProperty("Al2O3")) ? melt.major.Al2O3 * olivine.D.Al2O3(T, P) : 0,
          (olivine.D.hasOwnProperty("CaO")) ? melt.major.CaO * olivine.D.CaO(T, P) : 0,
          (olivine.D.hasOwnProperty("Cr2O3")) ? melt.major.Cr2O3 * olivine.D.Cr2O3(T, P) : 0,
          (olivine.D.hasOwnProperty("NiO")) ? melt.major.NiO * olivine.D.NiO(T, P) : 0
        ];

        let x = Phase[method](A, v, 1e-6, 0.9);

        const trace = {};
        for (let e in melt.trace) {
          trace[e] = (olivine.D.hasOwnProperty(e)) ? melt.trace[e] * olivine.D[e](T, P) : 0;
        }


        return {
          major: {
            SiO2: x[2],
            FeO: x[1],
            MgO: x[0],
            TiO2: x[3],
            Al2O3: x[4],
            CaO: x[5],
            Cr2O3: x[6],
            NiO: x[7],
            Fe2O3: 0,
            Na2O: 0,
            K2O: 0,
            P2O5: 0,
            MnO: 0,
            H2O: 0
          },
          trace: trace
        }
      }
    },

    spinel_melt() {
      let melt = this;
      let mv = Phase.getMolarValue();
      return function (T, P) {
        let spinel = this;

        const trace = {};
        for (let e in melt.trace) {
          trace[e] = (spinel.D.hasOwnProperty(e)) ? melt.trace[e] * spinel.D[e](T, P) : 0;
        }


        return {
          major: {
            SiO2: 0,
            FeO: 0,
            MgO: 0,
            TiO2: 0,
            Al2O3: 0,
            CaO: 0,
            Cr2O3: spinel.D.Cr2O3(T, P) * melt.major.Cr2O3,
            NiO: spinel.D.NiO(T, P) * melt.major.NiO,
            Fe2O3: 0,
            Na2O: 0,
            K2O: 0,
            P2O5: 0,
            MnO: 0,
            H2O: 0
          },
          trace: trace
        }

      }
    }
  }

  Phase.solve = function (_A, _v, _eps = 1.0e-6, _w) {
    let A = new Phase.Matrix(_A)
    let v = new Phase.Matrix(_v.map((a) => [a]));

    let invA = Phase.Matrix.inverse(A, _eps);
    let x = Phase.Matrix.multiple(invA, v);

    return x.m.map((a) => a[0]);
  }

  Phase.SOR = function (A, v, eps = 1e-6, w = 1.) {
    let dX = 1;
    let absX = 1;
    let raw = A.length;
    let col = A[0].length;
    let x = v.map((v) => 0);
    let k = 0;
    while (dX / absX > eps) {
      dX = 0;
      absX = 0;
      for (i = 0; i < raw; i++) {
        let sum = 0;
        for (j = 0; j < col; j++) {
          if (i !== j) {
            sum += A[i][j] * x[j];
          }
        }

        let newX = 1. / A[i][i] * (v[i] - sum);
        dX += Math.abs(newX - x[i]);
        absX += Math.abs(newX);
        x[i] += w * (newX - x[i]);
        k++
      }
    }
    //console.log(k++)
    return x;
  }

  /** class Solid extends Phase
   *
   * @param {*} _phaseName 
   */
  function Solid(_phaseName) {
    var solid = Object.create(Solid.prototype);
    Object.assign(solid, Phase("solid", _phaseName));

    solid.D = {}; // Dictionary of partitioning coefficients
    solid.KD = {}; // Dictionary of exchange partitioning coefficients
    //solid.stoichiometry = _stoichiometry;
    solid.dN; // atom fraction;
    solid.solver = {};
    solid.answerVector = {};

    return solid;
  };

  Solid.isSolid = function (obj) {
    return Phase.isPhase(obj, "solid");
  };

  Solid.prototype = {
    setAtomFraction(_dN) {
      this.dN = _dN;
      return this;
    },

    setD(_elemName, _Dfunc) {
      this.D[_elemName] = _Dfunc;
      return this;
    },

    setKD(_elementRatio, _KDfunc) {
      this.KD[_elementRatio] = _KDfunc;
      return this;
    },

    getMeltMgNumber() {
      return 100 / (1 + this.getFeMgRatio() / this.KD.Fe_Mg);
    },

    setRadius(_beforeR, _afterR, _path) {
      const l = this.profile[_path].F.length;
      const f = (Math.pow(_afterR, 3) - Math.pow(_beforeR, 3)) / this.profile[_path].F[l - 1];
      for (let i = 0; i < l; i++) {
        this.profile[_path].x[i] = Math.pow(f * this.profile[_path].F[i] + Math.pow(_beforeR, 3), 0.333333);
      }
      return this;
    },

    setSolver(_adjacentPhaseName, _solverFunc) {
      this.solver[_adjacentPhaseName] = _solverFunc.bind(this);
      return this;
    },

    setAnswerVector(_adjacentPhaseName, _answerVector) {
      this.answerVector[_adjacentPhaseName] = _answerVector;
      return this;
    },

    equilibrate(_adjacentPhaseName, _T, _P) {
      const equiCompo = this.solver[_adjacentPhaseName](_T, _P);
      this.major = equiCompo.major;
      this.trace = equiCompo.trace;
      return this;
    },

  };
  Object.setPrototypeOf(Solid.prototype, Phase.prototype);

  Solid.compensateFe = {
    spinel: function (_spinel) {
      // 全鉄=Fe2+ + Fe3+
      // チャージバランス

      let atom = _spinel.atom;
      let atomSum = _spinel.getAtomSum();
      let oxygenNum = 16;

    }
  }



  /** class Liquid extends Phase
   * 
   * @param {*} _phaseName 
   */
  function Liquid(_phaseName) {
    var liquid = Object.create(Liquid.prototype);
    Object.assign(liquid, Phase("liquid", _phaseName));
    liquid.fFe2 = 1;
    return liquid;
  }

  Liquid.isLiquid = function (obj) {
    return Phase.isPhase(obj, "liquid");
  }

  Liquid.prototype = {
    setH2O(_waterContent) {
      this.major.H2O = _waterContent;
      return this;
    },

    setFe2Ratio(Fe2Fraction) {
      this.fFe2 = Fe2Fraction; // Fe2 / (Fe2 + Fe3);
      return this;
    },

    compensateFe() {
      this.compo2atom().atom2compo();
      return this;
    },

    compo2atom(hydrous = false, normalize = false) {
      let molar = Phase.getMolarValue();
      let compo = this.major;

      let atom = {};
      let atomSum = 0
      for (let elem in molar) {
        if (hydrous === false && elem === "H2O") continue;
        if (!compo[elem]) atom[elem] = 0;
        if (compo[elem] < 0) return false;
        atom[elem] = compo[elem] / molar[elem];
        atomSum += atom[elem];
      };

      let totalFe = atom.FeO + atom.Fe2O3 * 2;
      atom.FeO = totalFe * this.fFe2;
      atom.Fe2O3 = totalFe * (1 - this.fFe2) * 0.5;



      if (normalize === true) {
        for (let elem in atom) {
          atom[elem] /= atomSum;
        }
      }
      this.atom = atom;
      return this;
    },

    /**
     * 
     * @param {*} objs = [{"phase": Phase, "f":Number}] 
     * @param {*} massFraction 
     */
    differentiate(objs, massFraction) {
      let self = this;
      for (let prop in this.major) {
        let component = objs.map((o) => o.phase.major[prop] * o.f)
          .reduce((a, b) => a + b);
        self.major[prop] = (this.major[prop] + massFraction * component) / (1 + massFraction);
      };

      for (let prop in this.trace) {
        let component = objs.map((o) => o.phase.trace[prop] * o.f)
          .reduce((a, b) => a + b);
        self.trace[prop] = (this.trace[prop] + massFraction * component) / (1 + massFraction);
      };
      return this;
    },

    desolve(obj, massFraction) {

      return this;
    }

  };
  Object.setPrototypeOf(Liquid.prototype, Phase.prototype);



  /** Object Crystal */
  /** ver 1.5 new Crystal 
   * _Phases : [Phase,Phase,...]
  */

  var Crystal = {};

  Crystal.getAffinity = function (_liquid, _solids) {
    let affinity = {};
    // 結晶化のアフィニティが1より大きい相をtrueとする
    for (let phase of _solids) {
      affinity[phase.name] = true;
    }

    return affinity;
  }

  /**	Crystal.getTinySolid
   * return tinySolid:{
   * 	major:{},
   * 	atom:{}
   * }
   * 
   * To use:
   * let opx = new Solid(...), olivine = new Solid(...);
   * let liquid = new Liquid(...);
   * let tinySolid = {};
   *
   * 
   * tinySolid.opx = getTinySolid.opx(dN.opx); // equilibrium opx whose atom number is dN.opx;
   * tinySolid.olivine = getTinySolid.olivine(dN.olivine);
   */
  Phase.yieldEquilibriumCompo = function () {
    let adjasentPhase = this;

    return function (_dM) {
      let interestPhase = this;

      return interestPhase.getEquilibriumCompo(adjasentPhase);
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


  /* transFormSectionToEqualStep */
  Phase.transformSectionToEqualStep = function (sectionObj, stepSize = 0) {
    // If stepSize is default, automatically set stepSize
    if (profile.f == undefined) return sectionObj;

    return newProfile;
  }

  /* transformProfileByRadius */
  Phase.transformProfileByRadius = function (profile, positions) {
    if (positions.length < 1) return false;

    const newProfile = [];
    const keys = Object.keys(profile[0]);
    const positionNum = positions.length;
    const profileLength = profile.length;

    let k = 0;
    for (let i = 0; i < positionNum; i = (i + 1) | 0) {
      while (positions[i] > profile[k + 1].x) {
        if (k == profileLength - 2) break;
        k = (k + 1) | 0;
      }

      let factor = (positions[i] - profile[k].x) / (profile[k + 1].x - profile[k].x);

      newProfile[i] = {};
      keys.map((v) => {
        newProfile[i][v] = profile[k][v] * (1 - factor) + profile[k + 1][v] * factor;
      });

    }


    return newProfile
  }

  /* divideProfileEqualStep */
  Phase.divideProfileEqualStep = function (_profile, _divNum, _prop = 'x') {
    const divideNum = parseInt(_divNum);
    if (divideNum < 1) return _profile;
    if (!_profile[_prop]) return _profile;

    let newProfile = {};
    const keys = Object.keys(_profile);

    let l = _profile[_prop].length;
    let extent = { 'max': _profile[_prop][l - 1], 'min': _profile[_prop][0] };

    newProfile = {
      c: [],
      x: []
    };

    newProfile.x[0] = _profile.x[0];
    newProfile.c[0] = _profile.c[0];
    let dF = (extent.max - extent.min) / _divNum;
    let F = _profile[_prop][0] + dF;
    let k = 0;

    for (let i = 1; i < _divNum + 1; i = (i + 1) | 0) {
      while (F > _profile[_prop][k + 1]) {
        if (k == l - 2) break;
        k = (k + 1) | 0;
      }

      let factor = (F - _profile[_prop][k]) / (_profile[_prop][k + 1] - _profile[_prop][k]);

      newProfile.x[i] = F;
      newProfile.c[i] = _profile.c[k] * (1 - factor) + _profile.c[k + 1] * factor;

      F += dF;
    }


    return newProfile;
  }



  return {
    Phase: Phase,
    Solid: Solid,
    Liquid: Liquid
  };
}));