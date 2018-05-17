(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.GeoChem = factory();
  }
}(this, function () {

  /* _/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/ */
  /** class GeoChem
   * Provide calculation method for composition.
   */
  class GeoChem {
    constructor() {

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
  }

  return GeoChem;
}))