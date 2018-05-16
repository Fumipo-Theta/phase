/*
	v.2 ではプロファイルの半径に対応した結晶化度を得られるようなメソッドを作成したい
	
	
	上手くMatrixモジュールをWebWorkerから呼び出せるようにする必要あり
	
*/

/* _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ */

/* Object Crystal */
	/* Constructor */

	
var Crystal=function(_melt0,_solidParam,_elements,_datom=0.005){

	this.compo0={melt0:_melt0.compo};
	this.compo={};
	this.water={
		water0:_melt0.H2O,
		before:_melt0.H2O,
		after:_melt0.H2O,
	};
	
	this.atom={};
	this.atom.melt={};

	this.elements=_elements;
	this.traceList=[];

	this.profile={ascend:[],descend:[]};
	this.temperature=[];
	this.radius=null;
	
	this.solidParam=_solidParam;
	
	this.phase=['melt','solid'];
	
	this.D={};
	
	this.datom=_datom;

	this._initialization();
};


Crystal.setup=function(_matrixFunc){
	Crystal.Matrix=_matrixFunc;
	return Crystal;
}


	/* molarValue */
Crystal.molarValue=function(){
	return {
		SiO2:60.06,
		TiO2:79.90,
		Al2O3:101.94,
		FeO:71.84,
		MgO:40.32,
		Fe2O3:159.69,
		CaO:56.08,
		Na2O:61.99,
		K2O:94.20,
		P2O5:141.94
	};
}
	
	/* Initializeation */
Crystal.prototype._initialization=function(){
	let molar=Crystal.molarValue();

	this.compo.melt={};
	for (let elem in this.compo0.melt0){
		this.compo.melt[elem]=this.compo0.melt0[elem];
		if ( ! molar[elem]) this.traceList.push(elem);
	};
	
	this.compo.solid={};
	this.atom.solid={};
	this.D.solid={};
	for (let phase in this.solidParam){
		this.phase.push(phase)
		this.compo[phase]={};
		this.atom[phase]={};
		this.D[phase]=this.solidParam[phase].D;
	}
	
	this.atom.melt=Crystal.compo2atom(this.compo.melt);
	
	this._getBulkD();
};

	/* Get Fe/Mg */
Crystal.prototype.getFeMgRatio=function(phase){
	var atom=this.atom;
	return atom[phase].FeO/atom[phase].MgO;
};

	/* get equilibrium Mg# with melt */
Crystal.prototype.getEquiMgnumber=function(phase){
	if (phase != "melt"){
		return 100/(1+this.getFeMgRatio("melt")*this.D[phase].Fe_Mg);
	}else{
		return this.getMgnumber("melt");
	};
};

	/* get Mg# */
Crystal.prototype.getMgnumber=function(phase){
	return 100/(1+this.getFeMgRatio(phase));
};

	/* get bulkD */
Crystal.prototype._getBulkD=function(){
	let solidParam=this.solidParam
			/* hard coding */
	for (let elem in solidParam.orthopyroxene.D){
		let _D=0;
		for (let phase in solidParam){
			_D += solidParam[phase].D[elem]*solidParam[phase].init;
		};
		this.D.solid[elem]=_D;
	};
};

	/* _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ */
	//
	/* remelting */
	  /* ！ To be fixed ！ */
	// target Mg#が大きいと無限ループに近い回数
	// 固相を足さなければならない.
	// 規定回数以上ループが回るとエラーを返すようにする必要あり
	//
	// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ */
	
Crystal.prototype.remelting=function(finMgN,targetPhase,flag){
	if (finMgN > 100 || finMgN < 0) throw new RangeError();
	
	let Matrix=Crystal.Matrix;

	let recordFlag=flag;
	let _finMgN=finMgN;
	let compo=this.compo;
	let compo0=this.compo0;
	let atom=this.atom;
	let D=this.D;
	let solidParam=this.solidParam;
	let datom=this.datom;
	let matA=new Matrix(3,3);
	let invMatA=new Matrix(3,3);
	let vecB=new Matrix(3,1);
	let vecC=new Matrix(3,1);
	
		/* hard coding */
	let xOpx=solidParam.orthopyroxene.init // 固相の分子数のうちorthopyroxeneの占める比率
	
		/* Bulk solid atomを計算する行列の定数要素を定義 */
	matA[1]=[1,1,1];
	matA[2]=[1,1,xOpx-2];
	vecB[0][0]=0;
	vecB[1][0]=0;
	vecB[2][0]=0;
	vecC[0][0]=0;
	vecC[1][0]=datom;
	vecC[2][0]=0;
	
	let dF=0;
	let F=0;
	
	compo.solid={};
	
	atom.solid={
		SiO2:0,
		FeO:0,
		MgO:0,
	};
	
	let targetMgN=0;
	let trace=this.traceList;
	
	
		/* MgO, FeO, SiO2の計算 */
	while (targetMgN < _finMgN && targetMgN>=0){
	//for (let i=0; i<1; i++){
			/* 微量の固相組成 */
		matA[0]=[D.solid.Fe_Mg/atom.melt.MgO,-1/atom.melt.FeO,0];
		invMatA=Matrix.inverse(matA);
		vecB=Matrix.multiple(invMatA,vecC);
		atom.solid.MgO=vecB[0][0];
		atom.solid.FeO=vecB[1][0];
		atom.solid.SiO2=vecB[2][0];
		
		atom.melt.MgO=atom.melt.MgO+atom.solid.MgO;
		atom.melt.FeO=atom.melt.FeO+atom.solid.FeO;
		atom.melt.SiO2=atom.melt.SiO2+atom.solid.SiO2;
		
		let FM=this.getFeMgRatio("melt");
		
		atom.olivine.SiO2=2*(1-xOpx)/(2+xOpx)*atom.solid.SiO2;
		atom.olivine.MgO=2*atom.olivine.SiO2/(1+D.olivine.Fe_Mg*FM);
		atom.olivine.FeO=atom.olivine.MgO*D.olivine.Fe_Mg*FM;
		
		atom.orthopyroxene.SiO2=3*xOpx/(2+xOpx)*atom.solid.SiO2;
		atom.orthopyroxene.MgO=atom.orthopyroxene.SiO2/(1+D.orthopyroxene.Fe_Mg*FM);
		atom.orthopyroxene.FeO=atom.orthopyroxene.MgO*D.orthopyroxene.Fe_Mg*FM;
		
		
				
		let solidWeight=Crystal.getWeight(atom.solid);
		dF=dF+solidWeight;
		
		// 原子数は決まったステップで定義されているが, 結晶化度(質量%)は不規則に変化する
		F=dF/(dF+Crystal.getWeight(atom.melt)); //結晶化度
		
		targetMgN=this.getMgnumber(targetPhase);
		//console.log(targetMgN)
				
		// atom to compo
		let exception=true;
		for (let phase of this.phase){
			compo[phase]=Crystal.atom2compo(atom[phase]);

			if (! compo[phase]) exception = false;
		}	
		
		if (! exception) break;

			/* 微量元素の計算(Rayleigh fractionation) */
		for (let elem of trace){
			compo.melt[elem]=compo0.melt0[elem]*(Math.pow((1+F),(D.solid[elem])-1));
			compo.solid[elem]=compo.melt[elem]*D.solid[elem];
			compo.olivine[elem]=compo.melt[elem]*D.olivine[elem];
			compo.orthopyroxene[elem]=compo.melt[elem]*D.orthopyroxene[elem];
		};
		
		for (let phase in compo){
			compo[phase].Fe_Mg=this.getFeMgRatio(phase);
			compo[phase]["Mg#"]=this.getMgnumber(phase);
		};
		
		if(recordFlag){
			let compoObj=JSON.stringify(this.compo);
			compoObj=JSON.parse(compoObj);
			this.profile.ascend.push({fraction:F,compo:compoObj});
		};
	};
		
	this.water.before=parseFloat(this.water.after);
	this.water.after=parseFloat(this.water.after/(1+F));
	
	if (recordFlag){
		this.temperature[0]=Crystal.getAnhydrousTemperature(Crystal.compo2atom(compo0.melt0));
		this.temperature[1]=Crystal.getAnhydrousTemperature(Crystal.compo2atom(compo.melt));
	}
	
	let meltCompo0=JSON.stringify(compo.melt);
	meltCompo0=JSON.parse(meltCompo0);
	compo0.melt0=meltCompo0;

};

	/* _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ 
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

Crystal.prototype.fractionate=function(finMgN,targetPhase,record){	
	if (finMgN > 100 || finMgN < 0) throw new RangeError();
	let Matrix=Crystal.Matrix;
	let recordFlag=record;
	let _finMgN=finMgN;
	let compo=this.compo;
	let compo0=this.compo0;
	let atom=this.atom;
	let D=this.D;
	let solidParam=this.solidParam;
	let datom=this.datom;
	let matA=new Matrix(3,3);
	let invMatA=new Matrix(3,3);
	let vecB=new Matrix(3,1);
	let vecC=new Matrix(3,1);
	
	let xOpx=solidParam.orthopyroxene.init // 固相の分子数のうちorthopyroxeneの占める比率
	
		/* Bulk solid atomを計算する行列の定数要素を定義 */
	matA[1]=[1,1,1];
	matA[2]=[1,1,xOpx-2];
	vecB[0][0]=0;
	vecB[1][0]=0;
	vecB[2][0]=0;
	vecC[0][0]=0;

	vecC[2][0]=0;
	
	let dF=0;
	let F=0;
	
	compo.solid={};
	
	atom.solid={
		SiO2:0,
		FeO:0,
		MgO:0,
	};
	
	let targetMgN=100;
	let trace=this.traceList;
	//let counter=1;
	
		/* MgO, FeO, SiO2の計算 */
	while (targetMgN > _finMgN && targetMgN>=0 ){	//diff
		vecC[1][0]=datom//*counter*counter*counter;
	//for (let i=0; i<1; i++){
			// 微量の固相組成 
		matA[0]=[D.solid.Fe_Mg/atom.melt.MgO,-1/atom.melt.FeO,0];
		invMatA=Matrix.inverse(matA);
		vecB=Matrix.multiple(invMatA,vecC);
		atom.solid.MgO=vecB[0][0];
		atom.solid.FeO=vecB[1][0];
		atom.solid.SiO2=vecB[2][0];
			
			// 液相
		atom.melt.MgO=atom.melt.MgO-atom.solid.MgO;	//diff
		atom.melt.FeO=atom.melt.FeO-atom.solid.FeO;	//diff
		atom.melt.SiO2=atom.melt.SiO2-atom.solid.SiO2;	//diff
		
		let FM=this.getFeMgRatio("melt");
			// olivine
		atom.olivine.SiO2=2*(1-xOpx)/(2+xOpx)*atom.solid.SiO2;
		atom.olivine.MgO=2*atom.olivine.SiO2/(1+D.olivine.Fe_Mg*FM);
		atom.olivine.FeO=atom.olivine.MgO*D.olivine.Fe_Mg*FM;
			// orthopyroxene
		atom.orthopyroxene.SiO2=3*xOpx/(2+xOpx)*atom.solid.SiO2;
		atom.orthopyroxene.MgO=atom.orthopyroxene.SiO2/(1+D.orthopyroxene.Fe_Mg*FM);
		atom.orthopyroxene.FeO=atom.orthopyroxene.MgO*D.orthopyroxene.Fe_Mg*FM;
		

			// 固相質量
		let solidWeight=Crystal.getWeight(atom.solid);
		dF=dF+solidWeight;
		F=dF/(dF+Crystal.getWeight(atom.melt)); //結晶化度
		//console.log(F)
		targetMgN=this.getMgnumber(targetPhase);
		

		// atom to compo
		let exception=true;
		for (let phase of this.phase){
			compo[phase]=Crystal.atom2compo(atom[phase]);

			if (! compo[phase]) exception = false;
		}	

		if (! exception) break;
				/* 微量元素の計算(Rayleigh fractionation) */
		for (let key in trace){
			elem=trace[key];
			compo.melt[elem]=compo0.melt0[elem]*(Math.pow((1-F),(D.solid[elem])-1));	//diff
			compo.solid[elem]=compo.melt[elem]*D.solid[elem];
			compo.olivine[elem]=compo.melt[elem]*D.olivine[elem];
			compo.orthopyroxene[elem]=compo.melt[elem]*D.orthopyroxene[elem];
		};
		
		for (let phase in compo){
				compo[phase].Fe_Mg=this.getFeMgRatio(phase);
				compo[phase]["Mg#"]=this.getMgnumber(phase);
		};
		
		/* プロファイルに追加 */
		if( recordFlag ) {
			let compoObj=JSON.stringify(this.compo);
			compoObj=JSON.parse(compoObj);
		
			this.profile.descend.push({fraction:F,compo:compoObj});

		};
		
		//counter=counter+0.1;
	};
	
	this.water.before=parseFloat(this.water.after);
	this.water.after=parseFloat(this.water.after/(1-F));
	
	if (recordFlag){
		this.temperature[0]=Crystal.getAnhydrousTemperature(Crystal.compo2atom(compo0.melt0));
		this.temperature[1]=Crystal.getAnhydrousTemperature(Crystal.compo2atom(compo.melt));
	}
	
	let meltCompo0=JSON.stringify(compo.melt);
	meltCompo0=JSON.parse(meltCompo0);
	compo0.melt0=meltCompo0;
	
};


	//
	/* Get Molar ratio composition */
	//
	
Crystal.compo2atom=function(_compoOfPhase){
	let compo=_compoOfPhase;
	let molar=Crystal.molarValue();
	
	let atom={};
		for (let elem in molar){
			if (! compo[elem]) continue; 
			if (compo[elem] < 0) return false;
			atom[elem]=compo[elem]/molar[elem];
			//atomSum=atomSum+this.atom[phase][key];
		};
	/*
		for (var key in molar){
			if (! compo[phase][key]) continue; 
			this.atom[phase][key]=this.atom[phase][key]/atomSum;
		};
	*/
	return atom;
};

	/* get atom sum */
Crystal.getAtomSum=function(_atomOfPhase){
	let molar=Crystal.molarValue();
	
	let atomSum=0;
		for (let elem in molar){
			if(! _atomOfPhase[elem]) continue;
			atomSum=atomSum+_atomOfPhase[elem];
		};
	return atomSum;
};

	/* Atom to Composition */
Crystal.atom2compo=function(_atomOfPhase){
	let atom=_atomOfPhase;
	let molar=Crystal.molarValue();

	let compo={};
	
	let weight=0;
	for (let elem in molar){
		if (! atom[elem]) continue; 
		if ( atom[elem] < 0) return false;
		compo[elem]=atom[elem]*molar[elem];
		weight += compo[elem];
	};
	
	for (let elem in molar){
		compo[elem] = compo[elem]/weight*100;
	};
	
	return compo;
}

	/* get melt weight */
Crystal.getWeight=function(_atomOfPhase){
	let molar=Crystal.molarValue();
	let weight=0;
	for (let elem in molar){
			if (! _atomOfPhase[elem]) continue; 
			weight += _atomOfPhase[elem]*molar[elem];
	};
	return weight;
};


	/** create section object 
		Create section object using in diffusion simulation
		return::
		section
			\-Fe_Mg
				\-name
				\-temperature[2]
				\-time
				\-x:[]
				\-c:[]
				\-f:[]
			\-Cr2O3
				\-name
				\-temperature[2]
				\-time
				\-x:[]
				\-c:[]
				\-f:[]
	*/
	/* getSection */
Crystal.prototype.getSection=function(phase,elemList,coolingTime,coolingRate,pressureIni,pressureFin,path){
	let _phase=phase;
	let _elemList=elemList;
	let _coolingTime=coolingTime;
	let _coolingRate=coolingRate
	
	let profile=this.profile;
	
	let sectionObj={
		temperature:[
			this.temperature[0](pressureIni)-Crystal.getLiquidusDrop(this.water.before),
			this.temperature[1](pressureFin)-Crystal.getLiquidusDrop(this.water.after)
		],
		pressure:[pressureIni,pressureFin],
		time:_coolingTime,
		rate:_coolingRate
	};
	
	for (let elem of _elemList){
		sectionObj[elem]={};
		sectionObj[elem].name=elem;
		sectionObj[elem].f=[];
		sectionObj[elem].c=[];
		sectionObj[elem].x=[];
		
		for (let i=0,l=profile[path].length; i<l; i=(i+1)|0){
			sectionObj[elem].f.push(profile[path][i].fraction);
			sectionObj[elem].c.push(profile[path][i].compo[_phase][elem]);
		};
	};
	//console.log(sectionObj)
	return sectionObj;
};

	/** getAnhydrousTemperature(atom)(p<bar>)
		take water content & pressure as arguments
		return melt temperature which is equilibrium with olivine
	*/
Crystal.getAnhydrousTemperature=function(_atomOfMelt){
	let atom=_atomOfMelt;
	let atomSum=Crystal.getAtomSum(atom)*0.01;
	
	// Sugawara (2000) unit: K
	let t=1446+(-1.44*atom.SiO2-0.5*atom.FeO+12.32*atom.MgO-3.899*atom.CaO)/atomSum
	return function(_pressure=1){
		return t=t+0.0043*_pressure;
	}
}

	/* getLiquidusDrop(water<wt%>) */
Crystal.getLiquidusDrop=function(_water){
	// Medard & Grove(2008)
	return _water*(40.4-_water*(2.97+_water*0.0761));
}

/* Resampler */
	// profile as argument should have property c,x,f(crystallization fraction)


	/* transformSectionToEqualDivision */
	// sampled point number is divideNum + 1
	// F[0] ~ g(F[i-1], F[i]) ~ F[N]
	
Crystal.transformSectionToEqualDivision=function(sectionObj,_divideNum=1,_prop='f'){
	const divideNum=parseInt(_divideNum);
	if (divideNum < 1) return sectionObj;
	
	
	const newProfile=[];
	const keys=Object.keys(sectionObj);

	for (key of keys){
		
		if (! sectionObj[key][_prop]){
			newProfile[key]=sectionObj[key];
			continue;
		}
		//if(sectionObj[key].f.length < 2) return sectionObj;
		let profile=sectionObj[key];
		let l=profile[_prop].length;
		let extent={'max':profile[_prop][l-1],'min':profile[_prop][0]};
		
		newProfile[key]={
			'name':key,
			'f':[],
			'c':[],
			'x':[]
		};
		
		newProfile[key].f[0]=profile.f[0];
		newProfile[key].c[0]=profile.c[0];
		let dF=(extent.max-extent.min)/divideNum;
		let F=profile[_prop][0] + dF;
		let k=0;
		
		for (let i=1; i < divideNum+1; i=(i+1)|0){
			while( F > profile[_prop][k+1] ){
				if (k == l-2) break;
				k=(k+1)|0;
			}
			
			let factor=(F - profile[_prop][k])/(profile[_prop][k+1] - profile[_prop][k]);
			
			newProfile[key].f[i]=F;
			newProfile[key].c[i]=profile.c[k]*(1-factor)+profile.c[k+1]*factor;
						
			F += dF;
		}
		
	}
	
	return newProfile;
}
	
	/* transFormSectionToEqualStep */
Crystal.transformSectionToEqualStep=function(sectionObj,stepSize=0){
	// If stepSize is default, automatically set stepSize
	if (profile.f == undefined) return sectionObj;
	
	return newProfile;
}

	/* transformProfileByRadius */
Crystal.transformProfileByRadius=function(profile,positions){
	if (positions.length < 1) return sectionObj;
	
	const newProfile=[];
	const keys=Object.keys(profile[0]);
	const positionNum=positions.length;
	const profileLength=profile.length;
	
	let k=0;
	for (let i=0; i < positionNum; i=(i+1)|0){
		while (positions[i] > profile[k+1].x){
			if (k == profileLength-2) break;
			k=(k+1)|0;
		}
		
		let factor=(positions[i]-profile[k].x)/(profile[k+1].x-profile[k].x);
		
		newProfile[i]={};
		keys.map((v)=>{
			newProfile[i][v]=profile[k][v]*(1-factor)+profile[k+1][v]*factor;
		});
	
	}
	
	
	return newProfile
}

	/* divideProfileEqualStep */
Crystal.divideProfileEqualStep=function(_profile,_divNum,_prop='x'){
	const divideNum=parseInt(_divNum);
	if (divideNum < 1) return _profile;
	if (! _profile[_prop]) return _profile;
	
	let newProfile={};
	const keys=Object.keys(_profile);

		let l=_profile[_prop].length;
		let extent={'max':_profile[_prop][l-1],'min':_profile[_prop][0]};
		
		newProfile={
			c:[],
			x:[]
		};
		
		newProfile.x[0]=_profile.x[0];
		newProfile.c[0]=_profile.c[0];
		let dF=(extent.max-extent.min)/_divNum;
		let F=_profile[_prop][0] + dF;
		let k=0;
		
		for (let i=1; i < _divNum+1; i=(i+1)|0){
			while( F > _profile[_prop][k+1] ){
				if (k == l-2) break;
				k=(k+1)|0;
			}
			
			let factor=(F - _profile[_prop][k])/(_profile[_prop][k+1] - _profile[_prop][k]);
			
			newProfile.x[i]=F;
			newProfile.c[i]=_profile.c[k]*(1-factor)+_profile.c[k+1]*factor;
						
			F += dF;
		}
		
	
	return newProfile;
}

if (module) module.exports=Crystal;
