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


const GeoChem = require("./geochem");

const ChemicalProfile = require("./chemical_profile");


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
        this.optionalProperty = ["F", "T", "N", "P", "x"];
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
                [
                    this.majorList,
                    this.traceList,
                    this.optionalProperty
                ]
            ),
            "descend": new ChemicalProfile(
                [
                    this.majorList,
                    this.traceList,
                    this.optionalProperty
                ]
            )
        }
        this.isInitialized = true;
        return this;
    }

    static initComposition(elementList) {
        const obj = {};
        elementList.forEach(e => {
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

    resetAtom() {
        this.atom = this.initMajor();
        return this;
    }

    setProperty(attrs, prop) {
        attrs.forEach(attr => {
            Object.entries(prop).forEach(([k, v]) => {
                if (attr.hasOwnProperty(k)) {
                    attr[k] = v * 1.;
                }
            })
        })
        return this;
    }

    setComposition(_compo) {
        this.major = this.initMajor();
        this.major0 = this.initMajor();
        this.trace = this.initTrace();
        this.resetAtom();

        this.setProperty([
            this.major,
            this.major0,
            this.trace
        ], _compo);
        return this;
    }

    updateComposition(_compo) {
        this.setProperty([
            this.major,
            this.major0,
            this.trace
        ], _compo);
        return this;
    }

    setMolar(_molar) {
        this.major = this.initMajor();
        this.major0 = this.initMajor();
        this.trace = this.initTrace();
        this.resetAtom();

        this.setProperty([
            this.atom
        ], _compo)
        return this;
    }

    updateMoler(_compo) {
        this.setProperty([
            this.atom
        ], _compo);
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

        return Object.entries(molar).map(([k, v]) => {
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

        elements.forEach(e => {
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

        Object.entries(major).forEach(([k, v]) => {
            let m = molar[k];
            this.atom[k] = (exceptH2O === true && k === "H2O")
                ? 0
                : v / m
        })

        if (normalize) {
            const atomSum = this.getAtomSum(exceptH2O);

            Object.keys(major).forEach(k => {
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

        Object.entries(atom).forEach(kv => {
            let k = kv[0], v = kv[1], m = molar[k];
            this.major[k] = (exceptH2O === true && k === "H2O")
                ? this.major[k]
                : v * m / w * 100;
        })


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
            [
                this.major,
                this.trace,
                {
                    F: F,
                    T: T,
                    P: P,
                    N: this.getAtomSum(),
                    x: 0
                }
            ]
        )
        return this;
    }

    popProfile(path) {
        return this.profile[path].pop();
    }

    getProfile(path) {
        return this.profile[path].get();
    }

    resetProfile(_path = ["ascend", "descend"]) {
        const path = (Array.isArray(_path))
            ? _path
            : [_path]

        path.map(p => {
            this.profile[p].reset([this.majorList, this.traceList, this.optionalProperty]);
        })
        this.major0 = {};
        return this;
    }

    profileToCsv(path, separator = ",") {
        let str = ""
        let profile = this.getProfile(path);
        const keys = Object.keys(profile);

        end = new RegExp(separator + "$");

        keys.forEach((v) => {
            str += '"' + v.toString().replace('"', '') + '"' + separator;
        })
        str = str.replace(end, '');
        str += "\n";

        for (let i = 0, l = profile[keys[0]].length; i < l; i++) {
            keys.forEach((k) => {
                str += '"' + profile[k][i].toString().replace('"', '') + '"' + separator;
            })
            str = str.replace(end, '\n');
        }
        return str;
    }
}

module.exports = Phase;
