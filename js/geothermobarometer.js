(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.geothermobarometer = factory();
  }
}(this, function () {
  const geothermobarometer = {
    thermometer: {
      Sugawara2000: liquid => {
        if (!Liquid.isLiquid(liquid)) throw TypeError("not instance of Liquid");
        return pressure => {
          const atom = liquid.atom;
          const atomSum = liquid.getAtomSum(true, false) * 0.01;
          const T = 1446 + (-1.44 * atom.SiO2 - 0.5 * atom.FeO + 12.32 * atom.MgO - 3.899 * atom.CaO) / atomSum;
          return T + 0.0043 * pressure;
        }
      },


    }
  };

  return geothermobarometer;
}))