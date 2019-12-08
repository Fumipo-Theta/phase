const olivine = {
    Al2O3: {
        myCompile: liquid => (T, P = 0) => 0,
        dummy: liquid => (T, P) => 0
    },
    CaO: {
        myCompile: liquid => (T, P = 0) => 0,
        dummy: liquid => (T, P) => 0
    },
    TiO2: {
        dummy: liquid => (T, P) => 0
    },
    Cr2O3: {
        FreiS2009: liquid => (T, P) => 1.2
    },
    NiO: {
        NormanS2005: liquid => (T, P) => 10
    }
};

const orthopyroxene = {
    Al2O3: {
        myCompile: liquid => (T, P = 0) => (-0.0043 * P - 0.0052) * liquid.major.MgO + (0.1669 * P + 0.1407),
        dummy: liquid => (T, P) => 0
    },
    CaO: {
        myCompile: liquid => (T, P = 0) => (0.0083 * P - 0.0189) * liquid.major.MgO + (-0.0451 * P + 0.3185),
        dummy: liquid => (T, P) => 0
    },
    TiO2: {
        dummy: liquid => (T, P) => 0
    },
    Cr2O3: {
        FreiS2009: liquid => (T, P) => 4
    },
    NiO: {
        NormanS2005: liquid => (T, P) => 5
    }
};

const spinel = {
    Cr2O3: {
        LieS2008: liquid => (T, P) => 130
    },
    NiO: {
        LieS2008: liquid => (T, P) => 2
    }
};

module.exports = {
    olivine,
    orthopyroxene,
    spinel
};
