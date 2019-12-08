
const olivine = {
    Fe_Mg: {
        Beattie1993: liquid => (T, P) => 0.303
    }
};

const orthopyroxene = {
    Fe_Mg: {
        Beattie1993: liquid => (T, P) => 0.284
    }
}

const spinel = {}

module.exports = {
    olivine,
    orthopyroxene,
    spinel
};
