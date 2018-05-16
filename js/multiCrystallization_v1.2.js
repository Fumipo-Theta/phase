/*
	v.2 ではプロファイルの半径に対応した結晶化度を得られるようなメソッドを作成したい
	
	得られたFの範囲を指定した数に等分割する,
	または一定の刻み幅でFを取り直す
	といったメソッドがほしい
	
*/


//>> 行列インスタンスを生成するジェネレーター
Matrix=function(rowNum,columnNum){
	for (var i=0; i<rowNum; i=(i+1)|0){
		this[i]=new Array();
		for (var j=0; j<columnNum; j=(j+1)|0){
			this[i][j]=0.0;
		};
	};
	this.length=rowNum;
};

Matrix.prototype.getRowNum=function(){
	return this.length;
};

Matrix.prototype.getColumnNum=function(){
	return this[0].length;
}

//>> 行列の掛け算を行う関数
function multipleMatrix(matA,matB){
	var rowNum=matA.getRowNum();
	var columnNum=matB.getColumnNum();
	var iterNum=matA.getColumnNum();
	var resultMat=new Matrix(rowNum,columnNum);

	//>> 引数の行列サイズが不正ならエラーを返す
	if(matA.getColumnNum() != matB.getRowNum()){
		alert("multipleMatrix: Invarid matrix size !");
		return 
	}
	
	for (var i=0; i<rowNum; i=(i+1)|0){
		for (var j=0; j<columnNum; j=(j+1)|0){
			for (var k=0; k<iterNum; k=(k+1)|0){
				resultMat[i][j]=resultMat[i][j]+matA[i][k]*matB[k][j];
			}
		}
	}
	return resultMat;
};

//>> 行列の足し算を行う関数
function addMatrix(matA,matB){
	if (matA.getRowNum() != matB.getRowNum() || matA.getColumnNum() != matB.getColumnNum()){
		alert("addMatrix: Invarid matrix size !")
		return
	}

	var rowNum=matA.getRowNum();
	var columnNum=matA.getColumnNum();
	var resultMat=new Matrix(rowNum,columnNum);
	
	for (var i=0; i<rowNum; i=(i+1)|0){
		for (var j=0; j<columnNum; j=(j+1)|0){
			resultMat[i][j]=matA[i][j]+matB[i][j];
		}
	}
	
	return resultMat;
};

//>> 逆行列を返す関数
function inverseMatrix(mat){
	if (mat.getRowNum() != mat.getColumnNum()){
		alert("inverseMatrix: Invarid matrix size!")
		return
	}
	
	var rowNum=mat.getRowNum();
	var columnNum=mat.getColumnNum();
	var invMat=new Matrix(rowNum,columnNum);
	var tempMat=new Matrix(rowNum, columnNum);
	var eps=1.0e-8;
	
	//>> Initialize
	for (var i=0; i<rowNum; i=(i+1)|0){
		for (var j=0; j<columnNum; j=(j+1)|0){
			tempMat[i][j]=mat[i][j];
			if (i == j){
				invMat[i][j]=1.0;
			}else{
				invMat[i][j]=0.0;
			}
		}
	}
	
	//>> Pivot transformation
	for (var pv=0; pv<rowNum; pv=(pv+1)|0){
		var big=0.0;
		var pv_big=pv;
		
		for (var i=pv; i<rowNum; i=(i+1)|0){
			if (Math.abs(tempMat[i][pv]) > big){
				big=Math.abs(tempMat[i][pv]);
				pv_big=i;
			}
		}
		
		for (var j=0; j<columnNum; j=(j+1)|0){
			var temp=tempMat[pv][j];
			tempMat[pv][j]=tempMat[pv_big][j];
			tempMat[pv_big][j]=temp;
			
			temp=invMat[pv][j];
			invMat[pv][j]=invMat[pv_big][j];
			invMat[pv_big][j]=temp;
		}
		
		if (big <= eps){
			alert("inverseMatrix: There is no inverse matrix !");
			return
		}
		
		var amp=tempMat[pv][pv];
		
		for (var j=0; j<columnNum; j=(j+1)|0){
			tempMat[pv][j]=tempMat[pv][j]/amp;
			invMat[pv][j]=invMat[pv][j]/amp;
		}
		
		for (var i=0; i<rowNum; i=(i+1)|0){
			amp=tempMat[i][pv];
			for (var j=0; j<columnNum; j=(j+1)|0){
				if (i != pv){
					tempMat[i][j]=tempMat[i][j]-tempMat[pv][j]*amp;
					invMat[i][j]=invMat[i][j]-invMat[pv][j]*amp;
				}
			}
		}
		
	}

	return invMat;
};

/* _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ */

/* Object Crystal */
	/* Constructor */
Crystal=function(melt0,solidParam,elements,radius,datom=0.005){
	this.compo0={melt0:melt0.compo};
	this.compo=new Object();
	this.water={
		water0:melt0.H2O,
		before:melt0.H2O,
		after:melt0.H2O,
	};
	
	this.atom=new Object();
	this.atom.melt=new Object();

	this.elements=elements;
	this.traceList=new Array();

	this.profile={ascend:[],descend:[]};
	this.temperature=new Array();
	this.radius=null;
	
	this.solidParam=solidParam;
	
	
	this.D=new Object();
	
	this.datom=datom;
	this.molarValue={
		SiO2:60.06,
		TiO2:79.90,
		Al2O3:101.94,
		FeO:71.84,
		MgO:40.32,
		Fe2O3:159.69,
		CaO:56.08,
		Na2O:61.99,
		K2O:94.20,
		P2O5:141.94,
	};
	this._initialization();
};
	
	/* Initializeation */
Crystal.prototype._initialization=function(){
	this.compo.melt=new Object
	for (key in this.compo0.melt0){
		this.compo.melt[key]=this.compo0.melt0[key];
		if ( ! this.molarValue[key]) this.traceList.push(key);
	};
	
	this.compo.solid=new Object();
	this.atom.solid=new Object();
	this.D.solid=new Object();
	for (key in this.solidParam){
		this.compo[key]=new Object();
		this.atom[key]=new Object();
		this.D[key]=this.solidParam[key].D;
	}
	
	this._compo2atom();
	this.getBulkD();
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
		return this.getFeMgRatio("melt");
	};
};

	/* get Mg# */
Crystal.prototype.getMgnumber=function(phase){
	return 100/(1+this.getFeMgRatio(phase));
};

	/* get bulkD */
Crystal.prototype.getBulkD=function(){
	var solidParam=this.solidParam
			/* hard coding */
	for (var elem in solidParam.orthopyroxene.D){
		var _D=0;
		for (var phase in solidParam){
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
	var recordFlag=flag;
	var _finMgN=finMgN;
	var compo=this.compo;
	var compo0=this.compo0;
	var atom=this.atom;
	var D=this.D;
	var solidParam=this.solidParam;
	var datom=this.datom;
	var matA=new Matrix(3,3);
	var invMatA=new Matrix(3,3);
	var vecB=new Matrix(3,1);
	var vecC=new Matrix(3,1);
	
		/* hard coding */
	var xOpx=solidParam.orthopyroxene.init // 固相の分子数のうちorthopyroxeneの占める比率
	
		/* Bulk solid atomを計算する行列の定数要素を定義 */
	matA[1]=[1,1,1];
	matA[2]=[1,1,xOpx-2];
	vecB[0][0]=0;
	vecB[1][0]=0;
	vecB[2][0]=0;
	vecC[0][0]=0;
	vecC[1][0]=datom;
	vecC[2][0]=0;
	
	var dF=0;
	var F=0;
	
	compo.solid=new Object();
	
	atom.solid={
		SiO2:0,
		FeO:0,
		MgO:0,
	};
	
	var targetMgN=0;
	var trace=this.traceList;
	var exception;
	
	
		/* MgO, FeO, SiO2の計算 */
	while (targetMgN < _finMgN && targetMgN>=0){
	//for (var i=0; i<1; i++){
			/* 微量の固相組成 */
		matA[0]=[D.solid.Fe_Mg/atom.melt.MgO,-1/atom.melt.FeO,0];
		invMatA=inverseMatrix(matA);
		vecB=multipleMatrix(invMatA,vecC);
		atom.solid.MgO=vecB[0][0];
		atom.solid.FeO=vecB[1][0];
		atom.solid.SiO2=vecB[2][0];
		
		atom.melt.MgO=atom.melt.MgO+atom.solid.MgO;
		atom.melt.FeO=atom.melt.FeO+atom.solid.FeO;
		atom.melt.SiO2=atom.melt.SiO2+atom.solid.SiO2;
		
		var FM=this.getFeMgRatio("melt");
		
		atom.olivine.SiO2=2*(1-xOpx)/(2+xOpx)*atom.solid.SiO2;
		atom.olivine.MgO=2*atom.olivine.SiO2/(1+D.olivine.Fe_Mg*FM);
		atom.olivine.FeO=atom.olivine.MgO*D.olivine.Fe_Mg*FM;
		
		atom.orthopyroxene.SiO2=3*xOpx/(2+xOpx)*atom.solid.SiO2;
		atom.orthopyroxene.MgO=atom.orthopyroxene.SiO2/(1+D.orthopyroxene.Fe_Mg*FM);
		atom.orthopyroxene.FeO=atom.orthopyroxene.MgO*D.orthopyroxene.Fe_Mg*FM;
		
		var solidWeight=this.getWeight("solid");
		dF=dF+solidWeight;
		
		// 原子数は決まったステップで定義されているが, 結晶化度(質量%)は不規則に変化する
		F=dF/(dF+this.getWeight("melt")); //結晶化度
		
		targetMgN=this.getMgnumber(targetPhase);
		//console.log(targetMgN)
		
		exception= this._atom2compo() ? (true) : (false) ;

		if (! exception) break;

			/* 微量元素の計算(Rayleigh fractionation) */
		for (var key in trace){
			elem=trace[key];
			compo.melt[elem]=compo0.melt0[elem]*(Math.pow((1+F),(D.solid[elem])-1));
			compo.solid[elem]=compo.melt[elem]*D.solid[elem];
			compo.olivine[elem]=compo.melt[elem]*D.olivine[elem];
			compo.orthopyroxene[elem]=compo.melt[elem]*D.orthopyroxene[elem];
		};
		
		for (var phase in compo){
			compo[phase].Fe_Mg=this.getFeMgRatio(phase);
			compo[phase]["Mg#"]=this.getMgnumber(phase);
		};
		
		if(recordFlag){
			var compoObj=JSON.stringify(this.compo);
			compoObj=JSON.parse(compoObj);
			this.profile.ascend.push({fraction:F,compo:compoObj});
		};
	};
	
	var meltCompo0=JSON.stringify(compo.melt);
	meltCompo0=JSON.parse(meltCompo0);
	compo0.melt0=meltCompo0;
	
	this.water.before=parseFloat(this.water.after);
	this.water.after=parseFloat(this.water.after/(1+F));
};


	/* _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ */
	//
	/* fractionate */
		/* ！ To be fixed ! */
		// ターゲットMg#が小さいと全体の質量が負になり
		// 無限ループに陥る
		// 負の質量を検知してエラーを返す必要あり
	//
	// _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

Crystal.prototype.fractionate=function(finMgN,targetPhase,record){	
	var recordFlag=record;
	var _finMgN=finMgN;
	var compo=this.compo;
	var compo0=this.compo0;
	var atom=this.atom;
	var D=this.D;
	var solidParam=this.solidParam;
	var datom=this.datom;
	var matA=new Matrix(3,3);
	var invMatA=new Matrix(3,3);
	var vecB=new Matrix(3,1);
	var vecC=new Matrix(3,1);
	
	var xOpx=solidParam.orthopyroxene.init // 固相の分子数のうちorthopyroxeneの占める比率
	
		/* Bulk solid atomを計算する行列の定数要素を定義 */
	matA[1]=[1,1,1];
	matA[2]=[1,1,xOpx-2];
	vecB[0][0]=0;
	vecB[1][0]=0;
	vecB[2][0]=0;
	vecC[0][0]=0;

	vecC[2][0]=0;
	
	var dF=0;
	var F=0;
	
	compo.solid=new Object();
	
	atom.solid={
		SiO2:0,
		FeO:0,
		MgO:0,
	};
	
	var targetMgN=100;
	var trace=this.traceList;
	//var counter=1;
	var exception;
	
		/* MgO, FeO, SiO2の計算 */
	while (targetMgN > _finMgN && targetMgN>=0 ){	//diff
		vecC[1][0]=datom//*counter*counter*counter;
	//for (var i=0; i<1; i++){
			// 微量の固相組成 
		matA[0]=[D.solid.Fe_Mg/atom.melt.MgO,-1/atom.melt.FeO,0];
		invMatA=inverseMatrix(matA);
		vecB=multipleMatrix(invMatA,vecC);
		atom.solid.MgO=vecB[0][0];
		atom.solid.FeO=vecB[1][0];
		atom.solid.SiO2=vecB[2][0];
			
			// 液相
		atom.melt.MgO=atom.melt.MgO-atom.solid.MgO;	//diff
		atom.melt.FeO=atom.melt.FeO-atom.solid.FeO;	//diff
		atom.melt.SiO2=atom.melt.SiO2-atom.solid.SiO2;	//diff
		
		var FM=this.getFeMgRatio("melt");
			// olivine
		atom.olivine.SiO2=2*(1-xOpx)/(2+xOpx)*atom.solid.SiO2;
		atom.olivine.MgO=2*atom.olivine.SiO2/(1+D.olivine.Fe_Mg*FM);
		atom.olivine.FeO=atom.olivine.MgO*D.olivine.Fe_Mg*FM;
			// orthopyroxene
		atom.orthopyroxene.SiO2=3*xOpx/(2+xOpx)*atom.solid.SiO2;
		atom.orthopyroxene.MgO=atom.orthopyroxene.SiO2/(1+D.orthopyroxene.Fe_Mg*FM);
		atom.orthopyroxene.FeO=atom.orthopyroxene.MgO*D.orthopyroxene.Fe_Mg*FM;
			// 固相質量
		var solidWeight=this.getWeight("solid");
		dF=dF+solidWeight;
		F=dF/(dF+this.getWeight("melt")); //結晶化度
		
		targetMgN=this.getMgnumber(targetPhase);

		//console.log(F)
		
		exception= this._atom2compo() ? (true) : (false) ;

		if (! exception) break;

				/* 微量元素の計算(Rayleigh fractionation) */
		for (var key in trace){
			elem=trace[key];
			compo.melt[elem]=compo0.melt0[elem]*(Math.pow((1-F),(D.solid[elem])-1));	//diff
			compo.solid[elem]=compo.melt[elem]*D.solid[elem];
			compo.olivine[elem]=compo.melt[elem]*D.olivine[elem];
			compo.orthopyroxene[elem]=compo.melt[elem]*D.orthopyroxene[elem];
		};
		
		for (var phase in compo){
				compo[phase].Fe_Mg=this.getFeMgRatio(phase);
				compo[phase]["Mg#"]=this.getMgnumber(phase);
		};
		
		/* プロファイルに追加 */
		if( recordFlag ) {
			var compoObj=JSON.stringify(this.compo);
			compoObj=JSON.parse(compoObj);
		
			this.profile.descend.push({fraction:F,compo:compoObj});

		};
		
		//counter=counter+0.1;
	};
	
	var meltCompo0=JSON.stringify(compo.melt);
	meltCompo0=JSON.parse(meltCompo0);
	compo0.melt0=meltCompo0;
	this.water.before=parseFloat(this.water.after);
	this.water.after=parseFloat(this.water.after/(1-F));
};


	//
	/* Get Molar ratio composition */
	//
	
Crystal.prototype._compo2atom=function(){
	var compo=this.compo;
	var molar=this.molarValue;
	
	for (var phase in compo){
		var atomSum=0;
		for (var key in molar){
			if (! compo[phase][key]) continue; 
			if (compo[phase][key] < 0) return false;
			this.atom[phase][key]=compo[phase][key]/molar[key];
			atomSum=atomSum+this.atom[phase][key];
		};
	/*
		for (var key in molar){
			if (! compo[phase][key]) continue; 
			this.atom[phase][key]=this.atom[phase][key]/atomSum;
		};
	*/
	};
	return true;
};

	/* get atom sum */
Crystal.prototype.getAtomSum=function(phase){
	var compo=this.compo;
	var molar=this.molarValue;
	
	var atomSum=0;
		for (var key in molar){
			if (! compo[phase][key]) continue; 
			if ( compo[phase][key] < 0 ) return false; 
			atomSum=atomSum+this.atom[phase][key];
		};
	return atomSum;
};

	/* Atom to Composition */
Crystal.prototype._atom2compo=function(){
	var atom=this.atom;
	var molar=this.molarValue;
	
	for (var phase in atom){
		
		var compoSum=this.getWeight(phase);

		for (var key in molar){
			if (! atom[phase][key]) continue; 
			if ( atom[phase][key] < 0) return false;
			this.compo[phase][key]=this.compo[phase][key]/compoSum*100;
		};
	};
	return true;
};

	/* get melt weight */
Crystal.prototype.getWeight=function(phase){
	var atom=this.atom;
	var molar=this.molarValue;
	
	var compoSum=0;
	for (var key in molar){
			if (! atom[phase][key]) continue; 
			this.compo[phase][key]=atom[phase][key]*molar[key];
			compoSum=compoSum+this.compo[phase][key];
	};
	return compoSum;
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
Crystal.prototype.getSection=function(phase,elemList,coolingTime,pressure,path){
	var _phase=phase;
	var _elemList=elemList;
	var _coolingTime=coolingTime;
	var _pressure=pressure;
	
	var profile=this.profile;
	
	var sectionObj={
		temperature:[
			this.getTemperature(this.water.before,pressure),
			this.getTemperature(this.water.after,pressure)
		],
		time:_coolingTime,
	};
	
	for (key in _elemList){
		elem=_elemList[key];
		sectionObj[elem]={};
		sectionObj[elem].name=elem;
		sectionObj[elem].f=[];
		sectionObj[elem].c=[];
		sectionObj[elem].x=[];
		
		for (var i=0; i<profile[path].length; i=(i+1)|0){
			sectionObj[elem].f.push(profile[path][i].fraction);
			sectionObj[elem].c.push(profile[path][i].compo[_phase][elem]);
		};
	};
	//console.log(sectionObj)
	return sectionObj;
};

	/** Geothermometer 
		take water content & pressure as arguments
		return melt temperature which is equilibrium with olivine
	*/
Crystal.prototype.getTemperature=function(water,pressure){
	var atom=this.atom.melt;
	var _water=water;
	var p=pressure;
	
	var atomSum=this.getAtomSum("melt")*0.01;
	// Sugawara (2000)
	var t=1446-1.44*atom.SiO2/atomSum-0.5*atom.FeO/atomSum+12.32*atom.MgO/atomSum-3.899*atom.CaO/atomSum+0.0043*p;
	
	// Medard & Grove(2008)
	var dt=40.4*_water-2.97*_water*_water+0.0761*_water*_water*_water;
	
	return t-dt-273.15;
};


/* Resampler */
	// profile as argument should have property c,x,f(crystallization fraction)


	/* transformSectionToEqualDivision */
	// sampled point number is divideNum + 1
	// F[0] ~ g(F[i-1], F[i]) ~ F[N]
	
Crystal.transformSectionToEqualDivision=function(sectionObj,_divideNum=1){
	const divideNum=parseInt(_divideNum);
	if (divideNum < 1) return sectionObj;
	
	
	const newProfile=[];
	const keys=Object.keys(sectionObj);

	for (key of keys){
		
		if (! sectionObj[key].f){
			newProfile[key]=sectionObj[key];
			continue;
		}
		//if(sectionObj[key].f.length < 2) return sectionObj;
		let profile=sectionObj[key];
		let l=profile.f.length;
		let extent={'max':profile.f[l-1],'min':profile.f[0]};
		
		newProfile[key]={
			'name':key,
			'f':[],
			'c':[],
			'x':[]
		};
		
		newProfile[key].f[0]=profile.f[0];
		newProfile[key].c[0]=profile.c[0];
		let dF=(extent.max-extent.min)/divideNum;
		let F=profile.f[0] + dF;
		let k=0;
		
		for (let i=1; i < divideNum+1; i=(i+1)|0){
			while( F > profile.f[k+1] ){
				if (k == l-2) break;
				k=(k+1)|0;
			}
			
			let factor=(F - profile.f[k])/(profile.f[k+1] - profile.f[k]);
			
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