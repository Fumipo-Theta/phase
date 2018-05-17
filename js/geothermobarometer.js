(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.geothermobarometer = factory();
  }
}(this, function () {




  const thermometer = {
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
    * 
    * @param liquid[Liquid]: instance of Liquid
    * @param P[Number]: pressure [GPa]
    * @return [Number]: temperature [K]
    */
    Sugawara2000: liquid => P => {
      const atom = liquid.atom;
      const atomSum = liquid.getAtomSum(true, false) * 0.01;
      const T = 1446 + (-1.44 * atom.SiO2 - 0.5 * atom.FeO + 12.32 * atom.MgO - 3.899 * atom.CaO) / atomSum;
      return T + 0.0043 * P;
    },

    /** Mederd & Grove(2008) Liquidus drop by water (wt %)
     * @param liquid[Liquid]: instance of Liquid
     * @param H2O[Number]: water content [wt%]
     * @return [Number]:temperature
     */
    liquidusDropMG2008: liquid => H2O => {
      const water = (H2O === undefined)
        ? liquid.major.H2O
        : H2O;
      return water * (40.4 - water * (2.97 - water * 0.0761));
    },

    /** olivineSpinel thermometer
    * @param olivine[Solid]: instance of Solid
    * @param spinel[Solid]: instance of Solid
    * @param P[Number]: pressure [GPa]
    * @return [Number]: temperature [K]
    */
    olivineSpinelBs1991: (olivine, spinel) => P => {
      let R = spinel.atom.Fe2O3 + spinel.atom.Al2O3 + spinel.atom.Cr2O3;

      return ((13530 + 388 * P) * (1 - 2 * olivine.atom.FeO / (olivine.atom.FeO + olivine.atom.MgO))
        - 1960 * (spinel.atom.MgO - spinel.atom.FeO) / (spinel.atom.FeO + spinel.atom.MgO)
        + 16150 * spinel.atom.Cr2O3 / R
        + 25150 * (spinel.atom.Fe2O3 / R)) / (8.3145 * Math.log((olivine.atom.MgO * spinel.atom.FeO) / (olivine.atom.FeO * spinel.atom.MgO)) + 4.705);
    }

  }

  const barometer = {};
  const oxybarometer = {
    /** olivineSpinel oxygen fugacity
    * Ballhaus et al. (1991)
    * @param olivine[Solid]: instance of Solid
    * @param spinel[Solid]: instance of Solid
    * @param P[Number] : pressure [GPa]
    * @param T[Number] : temperature [K]
    * @return [Number]: divergence of logfO2 from FMQ buffer
    */
    olivineSpinelBs1991: (olivine, spinel) => (T, P) => {
      let R = spinel.atom.Fe2O3 + spinel.atom.Al2O3 + spinel.atom.Cr2O3;

      return 0.27 + 2505 / T
        - 400 * P / T
        - 6. * Math.log(olivine.atom.FeO)
        - 3200. * (1. - olivine.atom.FeO) * (1. - olivine.atom.FeO) / T
        + 2. * Math.log(spinel.atom.FeO)
        + 4. * Math.log(spinel.atom.Fe2O3 / R)
        + 2630. * (spinel.atom.Al2O3 * spinel.atom.Al2O3) / (R * R * T);
    }
  };

  return {
    thermometer,
    barometer,
    oxybarometer
  };
}))