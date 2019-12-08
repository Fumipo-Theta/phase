
const GeoChem = require("./geochem");

const Phase = require("./phase");

const sum = (a, b) => a + b;


class Liquid extends Phase {
    constructor(name) {
        super(name);
        this.fFe2 = 1;
        this.outOfRange = false;
    }

    static isLiquid(obj) {
        return obj instanceof Liquid;
    }

    setH2O(waterContent) {
        this.major.H2O = waterContent;
        return this;
    }

    setFe2Ratio(Fe2Fraction) {
        this.fFe2 = Fe2Fraction; // Fe2 / (Fe2 + Fe3);
        return this;
    }

    compensateFe(exceptH2O = true) {
        this.compo2atom(exceptH2O, true).atom2compo();
        return this;
    }

    compo2atom(exceptH2O = true, normalize = false) {
        const molar = GeoChem.getMolarValue();
        const major = this.major;

        Object.entries(major).forEach(kv => {
            let k = kv[0], v = kv[1], m = molar[k];
            this.atom[k] = (exceptH2O === true && k === "H2O")
                ? 0
                : v / m
        })

        const totalFe = this.atom.FeO + this.atom.Fe2O3 * 2;
        this.atom.FeO = totalFe * this.fFe2;
        this.atom.Fe2O3 = totalFe * (1 - this.fFe2) * 0.5;


        if (normalize) {
            const atomSum = this.getAtomSum(exceptH2O);

            Object.keys(major).forEach(k => {
                let v = this.atom[k]
                this.atom[k] = (exceptH2O === true && k === "H2O")
                    ? 0
                    : v / atomSum
            })
        }

        return this;
    }

    /**
     *
     * @param {*} objs = [{"phase": Phase, "f":Number}]
     * @param {*} massFraction
     */
    differentiate(objs, massFraction) {
        let self = this;
        if (self.outOfRange) throw new Error("Composition out of range");
        for (let prop in this.major) {
            let component = objs.map((o) => o.phase.major[prop] * o.f)
                .reduce(sum, 0);
            let candidate = (this.major[prop] + massFraction * component) / (1 + massFraction);
            if (0 <= candidate && candidate <= 100) {
                self.major[prop] = candidate;
            } else {
                self.outOfRange === true;
            }

        };

        for (let prop in this.trace) {
            let component = objs.map((o) => o.phase.trace[prop] * o.f)
                .reduce(sum, 0);
            let candidate = (this.trace[prop] + massFraction * component) / (1 + massFraction);
            if (0 <= candidate && candidate <= 100000000) {
                self.trace[prop] = candidate;
            } else {
                self.outOfRange === true;
            }
        };
        return this;
    }

    startDifferentiate() {
        this.outOfRange = false;
        return this;
    }

    desolve(obj, massFraction) {

        return this;
    }
}

module.exports = Liquid;
