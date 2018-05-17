(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.exchangePartitioning = factory();
  }
}(this, function () {
  const olivine = {
    Fe_Mg: {
      Beattie1993: liquid => (T, P) => 0.303
    }
  };

  const orthopyroxene = {
    Fe_Mg: liquid => (T, P) => 0.284
  }

  const spinel = {}

  return {
    olivine,
    orthopyroxene,
    spinel
  };
}))