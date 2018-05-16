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

/* _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ */

/** class Phase
 *
 * @param {*} _type 
 * @param {*} _phaseName 
 * @param {*} _elementList 
 */
var Phase = function (_type, _phaseName) {
	var phase = Object.create(Phase.prototype);
	phase.type = _type;
	phase.name = _phaseName;
	phase.elements = {
		"SiO2": 0,
		"TiO2": 0,
		"Al2O3": 0,
		"FeO": 0,
		"Fe2O3": 0,
		"MgO": 0,
		"CaO": 0,
		"Na2O": 0,
		"K2O": 0,
		"P2O5": 0,
		"Cr2O3": 0,
		"NiO": 0,
		"H2O": 0
	};
	phase.compo = {};
	phase.compo0 = {};
	phase.atom = {};
	phase.profile = { ascend: {}, descend: {} };

	phase.initializeProfile();

	return phase;
}


Phase.isPhase = function (obj, type) {
	if (!Phase.prototype.isPrototypeOf(obj)) {
		return false;
	}
	return type ? obj.type === type : true;
}


Phase.prototype = {
	getMolarValue() {
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
			Cr2O3: 151.99,
			NiO: 74.69,
			H2O: 18
		}
	},

	initializeProfile() {
		for (let path of ["ascend", "descend"]) {
			for (let e in this.elements) {
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

		for (let prop in this.elements) {
			if (_compo.hasOwnProperty(prop)) {
				this.compo[prop] = _compo[prop];
				this.compo0[prop] = _compo[prop];
			} else {
				this.compo[prop] = 0;
				this.compo0[prop] = 0;
			}
		}
		return this;
	},

	setMolar(_molar) {
		for (let prop in this.elements) {
			if (_molar.hasOwnProperty(prop)) {
				this.atom[prop] = _molar[prop];
			} else {
				this.atom[prop] = 0;
			}
		}
		return this;
	},

	updateComposition(_compo) {
		for (let prop in _compo) {
			if (this.elements.hasOwnProperty(prop)) {
				this.compo[prop] = _compo[prop];
			}
		}
		return this;
	},

	normalizeComposition(hydrous = false) {
		let w = 0;
		for (let prop in this.elements) {
			if (prop === "H2O") {
				w += (hydrous) ? this.compo.H2O : 0;
			} else {
				w += this.compo[prop];
			}
		}

		for (let prop in this.elements) {
			if (prop === "H2O") {
				this.compo.H2O = (hydrous) ? this.compo.H2O * 100 / w : this.compo.H2O;
			} else {
				this.compo[prop] = this.compo[prop] * 100 / w;
			}
		};
		return this;
	},

	differentiate(objs, massFraction) {
		let self = this;
		for (let prop in this.elements) {
			let compo = objs.reduce((o1, o2) => o1.phase.compo[prop] * o1.f + o2.phase.compo[prop] * o2.f);
			self.compo[prop] = (this.compo[prop] + massFraction * compo) / (1 + massFraction);
		};
		return this;
	},

	getComposition() {
		return this.compo;
	},

	getMolarNumber() {
		return this.atom;
	},

	compo2atom(hydrous = false, normalize = false) {
		let molar = this.getMolarValue();
		let compo = this.compo;

		let atom = {};
		let atomSum = 0
		for (let elem in molar) {
			if (hydrous === false && elem === "H2O") continue;
			if (!compo[elem]) atom[elem] = 0;
			if (compo[elem] < 0) return false;
			atom[elem] = compo[elem] / molar[elem];
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
		let molar = this.getMolarValue();

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
		let molar = this.getMolarValue();

		let compo = {};

		let weight = 0;
		for (let elem in molar) {
			if (hydrous === false && elem === "H2O") continue;
			if (!atom[elem]) compo[elem] = 0;
			if (atom[elem] < 0) return false;
			compo[elem] = atom[elem] * molar[elem];
			weight += compo[elem];
		};

		for (let elem in molar) {
			compo[elem] = compo[elem] / weight * 100;
		};

		this.compo = compo;
		return this;
	},

	getWeight(hydrous = false) {
		let molar = this.getMolarValue();
		let weight = 0;
		for (let elem in molar) {
			if (hydrous === false && elem === "H2O") continue;
			if (!this.atom[elem]) continue;
			weight += this.atom[elem] * molar[elem];
		};
		return weight;
	},

	getFeMgRatio() {
		return this.compo.FeO / this.compo.MgO * 40.32 / 71.84;
	},

	getMgNumber() {
		return 100 / (1 + this.getFeMgRatio());
	},

	pushProfile(_F, _T, _P, _path) {
		for (let e in this.element) {
			this.profile[_path][e].push(this.compo[e]);
		}
		this.profile[_path].F.push(_F);
		this.profile[_path].T.push(_T);
		this.profile[_path].P.push(_P);
		this.profile[_path].N.push(this.getAtomSum());
		return this;
	},

	getProfile(_path) {
		return this.profile[_path]; //温度や圧力は別の形で与える．
	},

	resetProfile() {
		this.profile = { ascend: [], descend: [] };
		this.compo0 = {};
		return this;
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

Phase.thermometer.liquidusDropMG2008 = function () {
	if (!Liquid.isLiquid(this)) return false;
	let water = this.compo.H2O
	return water * (40.4 - water * (2.97 - water * 0.0761));
}

/** partitioning coefficients
 * 
 */
Phase.partitioningCoefficient = {
	olivine: {
		Al2O3: {
			myCompile(P = 0) {
				// P [GPa]
				let melt = this;
				return 0;
			}
		},
		CaO: {
			myCompile(P = 0) {
				let melt = this;
				return 0;
			}
		},
		TiO2: {
			dummy() {
				return 0;
			}
		},
		Cr2O3: {
			FreiS2009() {
				return 1.2
			}
		},
		NiO: {
			NormanS2005() {
				return 10
			}
		}
	},

	orthopyroxene: {
		Al2O3: {
			myCompile(P = 0) {
				// P [GPa]
				let melt = this;
				return (-0.0043 * P - 0.0052) * melt.compo.MgO + (0.1669 * P + 0.1407);
			}
		},
		CaO: {
			myCompile(P = 0) {
				let melt = this;
				return (0.0083 * P - 0.0189) * melt.compo.MgO + (-0.0451 * P + 0.3185);
			}
		},
		TiO2: {
			dummy() {
				return 0;
			}
		},

		Cr2O3: {
			FreiS2009() {
				return 4
			}
		},
		NiO: {
			NormanS2005() {
				return 5
			}
		}
	},

	spinel: {
		Cr2O3: {
			LieS2008() {
				return 130
			}
		},
		NiO: {
			LieS2008() {
				return 2
			}
		}
	}
};


Phase.exchangePartitioningCoefficient = {
	olivine: {
		Fe_Mg: {
			Beattie1993() {
				return 0.303;
			}
		}
	},

	orthopyroxene: {
		Fe_Mg: {
			Beattie1993() {
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
		const props = Obect.keys(_profile);

		for (let prop of props) {
			newProfile[prop] = [];
			newProfile[prop][0] = _profile[prop][0];
		}

		let F = _profile[_prop][0] + dF;
		let k = 0;
		for (let i = 1; i < divNum + 1; i++) {
			while (f > _profile[_prop][k + 1]) {
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
		if (_profile.x.length < 1) return false;
		if (_positions.length < 1) return false;

		const newProfile = {}
		const props = Object.keys(_profile);
		for (let prop of props) {
			newProfile[prop] = [];
			//newProfile[prop][0] = _profile[prop][0];
		}

		profLen = _profile.x.length;
		posLen = _positions.length;

		let k = 0;
		for (let i = 0; i < posLen; i++) {
			while (_positions[i] > _profile.x[k + 1]) {
				if (k === profLen - 2) break;
				k++;
			}
			let f = (_positions[i] - _profile.x[k]) / (_profile.x[k + 1] - _profile.x[k]);
			for (let prop of props) {
				newProfile[prop][i] = _profile[plop][k] * (1 - f) + _profile[prop][k + 1] * f;
			}

		}
		return newProfile;
	}

}

Phase.Orthopyroxene = function () {
	let obj = new Solid("orthopyroxene")
}

Phase.solver = {
	opx_melt() {
		let melt = this;
		let mv = melt.getMolarValue();
		return function (T, P) {
			let opx = this;
			let A = [];
			A[0] = [1, 1, 1, 1, 1, 1, 1, 1];
			A[1] = [0, -1, opx.KD.Fe_Mg() * melt.compo.FeO / melt.compo.MgO, 0, 0, 0, 0, 0];
			A[2] = [1 / mv.SiO2, -1 / mv.FeO, -1 / mv.MgO, 0, 0, 0, 0, 0];
			A[3] = [0, 0, 0, 1, 0, 0, 0, 0];
			A[4] = [0, 0, 0, 0, 1, 0, 0, 0];
			A[5] = [0, 0, 0, 0, 0, 1, 0, 0];
			A[6] = [0, 0, 0, 0, 0, 0, 1, 0];
			A[7] = [0, 0, 0, 0, 0, 0, 0, 1];

			let v = [100,
				0,
				0,
				melt.compo.TiO2 * opx.D.TiO2(),
				melt.compo.Al2O3 * opx.D.Al2O3(P),
				melt.compo.CaO * opx.D.CaO(P),
				melt.compo.Cr2O3 * opx.D.Cr2O3(T, P),
				melt.compo.NiO * opx.D.NiO(T, P)
			];

			let x = Phase.SOR(A, v);

			return {
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
				H2O: 0
			}

		}
	},

	olivine_melt() {
		let melt = this;
		let mv = melt.getMolarValue();
		return function (T, P) {
			let olivine = this;
			let A = [];
			A[0] = [1, 1, 1, 1, 1, 1, 1, 1];
			A[1] = [-melt.compo.FeO / melt.compo.MgO, 1 / olivine.KD.Fe_Mg(), 0, 0, 0, 0, 0, 0];
			A[2] = [-1 / mv.MgO, -1 / mv.FeO, 2. / mv.SiO2, 0, 0, 0, 0, 0];
			A[3] = [0, 0, 0, 1, 0, 0, 0, 0];
			A[4] = [0, 0, 0, 0, 1, 0, 0, 0];
			A[5] = [0, 0, 0, 0, 0, 1, 0, 0];
			A[6] = [0, 0, 0, 0, 0, 0, 1, 0];
			A[7] = [0, 0, 0, 0, 0, 0, 0, 1];

			let v = [100,
				0,
				0,
				melt.compo.TiO2 * olivine.D.TiO2(),
				melt.compo.Al2O3 * olivine.D.Al2O3(P),
				melt.compo.CaO * olivine.D.CaO(P),
				melt.compo.Cr2O3 * olivine.D.Cr2O3(T, P),
				melt.compo.NiO * olivine.D.NiO(T, P)
			];

			let x = Phase.SOR(A, v, 1e-6, 0.9);

			return {
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
				H2O: 0
			}

		}
	},

	spinel_melt() {
		let melt = this;
		let mv = melt.getMolarValue();
		return function (T, P) {
			let spinel = this;

			return {
				SiO2: 0,
				FeO: 0,
				MgO: 0,
				TiO2: 0,
				Al2O3: 0,
				CaO: 0,
				Cr2O3: spinel.D.Cr2O3() * melt.compo.Cr2O3,
				NiO: spinel.D.NiO() * melt.compo.NiO,
				Fe2O3: 0,
				Na2O: 0,
				K2O: 0,
				P2O5: 0,
				H2O: 0
			}

		}
	}
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
	console.log(k++)
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

	getEquilibriumCompo(_adjacentPhaseName, _T, _P) {
		this.compo = this.solver[_adjacentPhaseName](_T, _P);
		return this.compo;
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
	liquid.fFe2 = 1.;
	return liquid;
}

Liquid.isLiquid = function (obj) {
	return Phase.isPhase(obj, "liquid");
}

Liquid.prototype = {
	setH2O(_waterContent) {
		this.compo.H2O = _waterContent;
		return this;
	},

	setFe2Ratio(Fe2Fraction) {
		this.fFe2 = Fe2fraction; // Fe2 / (Fe2 + Fe3);
		return this;
	},

	compensateFe() {
		this.compo2atom().atom2compo();
		return this;
	},

	compo2atom(hydrous = false, normalize = false) {
		let molar = this.getMolarValue();
		let compo = this.compo;

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

};
Object.setPrototypeOf(Liquid.prototype, Phase.prototype);



/*
Phase.prototype.transformSectionToEqualDivision = function (_divideNum = 1, _prop = "f") {

}
*/


/* Object Crystal */
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
 * 	compo:{},
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








/** append compo to profile */


/* differentiate
//
fractionate 

Structure: 
sp: (Mg,Fe2,Ni)(Fe3,Cr,Al)2O4
ol: (Mg,Fe,Ni)2SiO4
op: (Mg,Fe,Ni)SiO3

D = D0(C,T,P)
KD = KD0(C,T,P) 

MgO + FeO + SiO2 + Al2O3 + Cr2O3 + NiO = datom

MgO_sp + FeO_sp = datom_sp
SiO2_sp = 0
Al_sp/Cr_sp = KD_Al_Cr_sp * Al/Cr

MgO_ol + FeO_ol = 2SiO2_ol
Fe_ol/Mg_ol = KD_Fe_Mg_ol * Fe/Mg
Al2O3_ol = 0
NiO_ol = D_Ni_ol * NiO !! Rayleigh の式使う? その場合分子数はどう変わる?
Cr2O3_ol = D_Cr_ol * Cr2O3 !!

MgO_op + FeO_op = SiO2_op
Fe_op/Mg_op = KD_Fe_Mg_op * Fe/Mg
Al2O3_op = 0
NiO_op = D_Ni_op * NiO !!
Cr2O3_op = D_Cr_op * Cr2O3 !!

// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ */

// differentiateの終了条件は外部で判定する

Crystal.differentiate = function () {
	let delta

	// affinityから結晶化相をフィルタリング
	let solids = this.phaseName.map((v, i) => {
		if (_affinity[v] === true) return v;
	});

	for (let p of solids) {

		// 固相の平衡組成を計算
		// 分配係数の計算

		// 各固相の質量保存の係数行列を作成

		let invA = A.invSOR();

		// 連立方程式を解く

		p.compo = invA.multipleTo();

		// 固相プロファイルをappend
	}
	// 液相組成を再計算

}





/* Resampler */
// profile as argument should have property c,x,f(crystallization fraction)


/* transformSectionToEqualDivision */
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

/* transFormSectionToEqualStep */
Phase.transformSectionToEqualStep = function (sectionObj, stepSize = 0) {
	// If stepSize is default, automatically set stepSize
	if (profile.f == undefined) return sectionObj;

	return newProfile;
}

/* transformProfileByRadius */
Phase.transformProfileByRadius = function (profile, positions) {
	if (positions.length < 1) return sectionObj;

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
console.log("export")
module.exports = { Phase: Phase, Solid: Solid, Liquid: Liquid };
//if (module) module.exports=Crystal;
