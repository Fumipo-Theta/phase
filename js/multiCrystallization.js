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


  class ChemicalProfile {
    constructor(majorList, traceList) {
      this.profile = this.reset(majorList, traceList)
    }

    reset(majorList, traceList) {
      const profile = {}

      majorList.map(e => {
        profile[e] = [];
      })
      traceList.map(e => {
        profile[e] = [];
      })
      ["F", "T", "N", "P", "x"].map(e => {
        profile[e] = [];
      })

      return profile
    }

    push(major, trace, F, T, P, N) {
      for (let e in major) {
        this.profile[e].push(major[e]);
      }
      for (let e in trace) {
        this.profile[e].push(trace[e]);
      }
      this.profile.F.push(F);
      this.profile.T.push(T);
      this.profile.P.push(P);
      this.profile.N.push(N);
      this.profile.x.push(0);
    }

    get() {
      return JSON.parse(JSON.stringify(this.profile));
    }

    transformByEqualStep(_divNum = 1, _prop) {
      const _profile = this.profile;
      const divNum = parseInt(_divNum);
      if (divNum < 1) throw new Error("divNum must positive");
      if (!_profile.hasOwnProperty(_prop)) throw new Error(`profile does not have key [${_prop}]`);

      const l = _profile[_prop].length;
      const dF = (_profile[_prop][l - 1] - _profile[_prop][0]) / divNum;
      const newProfile = {};
      const props = Object.keys(_profile);

      props.map(k => {
        newProfile[k] = [_profile[k][0]];
      })


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
    }

    transformByRadius(_positions) {
      const profile = this.profile;
      if (_profile.length < 1) throw new Error("Length of profile is 0");
      if (_positions.length < 1) throw new Error("Length of positions is 0");

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
      }).reduce(a, b => a + b);
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
      }).reduce(a, b => a + b);
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
      }).reduce(a, b => a + b);

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

      const atomSum = Object.entries(major).map(k => {
        let m = molar[k];
        return (exceptH2O === true && k === "H2O")
          ? 0
          : major[k] / m;
      }).reduce(a, b => a + b);

      Object.keys(this.major).map(k => {
        let v = this.atom[k]
        this.atom[k] = (!normalize)
          ? v
          : (exceptH2O === true && k === "H2O")
            ? v
            : v / atomSum
      })
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
      }).reduce(a, b => a + b);

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
        }).reduce(a, b => a + b);
    }

    getComposition() {
      return { major: this.getMajor, trace: this.getTrace };
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



  /** Create mixture new phase
   * 
   */

  Phase.getMixture = function () {

  }






  /*
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
    */

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