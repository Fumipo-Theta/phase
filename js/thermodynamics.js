/**
 * thermodynamic model to get equilibrium phase and their composition
 * 
 * Model Interface
 * SET:
 * 	setCalibratedModel(calibrateParameters) => this;
 * 	setSystemComposition(composition) => this;
 * 	
 * GET:
 * 	getEquilibriumPhase() => [Phase name] @[String];
 * 	getPhaseComposition(phaseName) => {component : wt%} @{String : Float};
 * 	
 * 
 * calibration model:
 * 	Compatible for machine learning.
 *
 * 
 */

model={};

/**
 * model.Gibbs
 * 
 * thermodynamic model using Gibbs method 
 * Minimise Gibbs free energy under a given system (bulk composition, temperature, pressure, oxide fugacity)
 */

model.Gibbs=new function(){
	this.system={
		dH=0,
		dCp=0,
		dS=0,
		dV=0
	};
	this.bulkCompo={};
	return this;
}


/**
 * @method setSystemComposition
 * 
 * @param _compo={
 * 	SiO2 : Float,
 * 	Al2O3 : Float,
 * 	...,
 * 	H2O : Float
 * }
 * 
 * @return this
 */

model.Gibbs.prototype.setSystemComposition=function(_compo){
	this.bulkCompo=_compo;
	return this;
}

model.Gibbs.prototype.getEquilibriumPhase=function(){

}

model.Gibbs.prototype._getAffinity_=function(_phaseName){

}

model.Gibbs.prototype._getdG_=function(){

}

module.export=model;