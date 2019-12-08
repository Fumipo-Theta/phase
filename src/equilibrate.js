
const GeoChem = require("./geochem");

const Matrix = require('./matrix');

class Equilibrate {
    constructor() { }

    /**
     *
     * @param {Liquid} melt
     * @param {Solid} opx
     */
    static opx_melt(melt, method = "solve") {
        const mv = GeoChem.getMolarValue();
        return opx => (T, P) => {
            let A = [];
            A[0] = [1, 1, 1, 1, 1, 1, 1, 1];
            A[1] = [0, -1, opx.KD.Fe_Mg(T, P) * melt.major.FeO / melt.major.MgO, 0, 0, 0, 0, 0];
            A[2] = [1 / mv.SiO2, -1 / mv.FeO, -1 / mv.MgO, 0, 0, 0, 0, 0];
            A[3] = [0, 0, 0, 1, 0, 0, 0, 0];
            A[4] = [0, 0, 0, 0, 1, 0, 0, 0];
            A[5] = [0, 0, 0, 0, 0, 1, 0, 0];
            A[6] = [0, 0, 0, 0, 0, 0, 1, 0];
            A[7] = [0, 0, 0, 0, 0, 0, 0, 1];

            let v = [100,
                0,
                0,
                (opx.D.hasOwnProperty("TiO2")) ? melt.major.TiO2 * opx.D.TiO2(T, P) : 0,
                (opx.D.hasOwnProperty("Al2O3")) ? melt.major.Al2O3 * opx.D.Al2O3(T, P) : 0,
                (opx.D.hasOwnProperty("CaO")) ? melt.major.CaO * opx.D.CaO(T, P) : 0,
                (opx.D.hasOwnProperty("Cr2O3")) ? melt.major.Cr2O3 * opx.D.Cr2O3(T, P) : 0,
                (opx.D.hasOwnProperty("NiO")) ? melt.major.NiO * opx.D.NiO(T, P) : 0
            ];

            let x = Equilibrate[method](A, v);

            const trace = {};
            for (let e in melt.trace) {
                trace[e] = (opx.D.hasOwnProperty(e)) ? melt.trace[e] * opx.D[e](T, P) : 0;
            }

            return {
                major: {
                    SiO2: x[0],
                    FeO: x[1],
                    MgO: x[2],
                    TiO2: x[3],
                    Al2O3: x[4],
                    CaO: x[5],
                    Cr2O3: x[6],
                    NiO: x[7],
                    Fe2O3: 0,
                    Na2O: 0,
                    K2O: 0,
                    P2O5: 0,
                    MnO: 0,
                    H2O: 0
                },
                trace: trace
            }

        }
    }

    static olivine_melt(melt, method = "solve") {
        const mv = GeoChem.getMolarValue()
        return olivine => (T, P) => {
            let A = [];
            A[0] = [1, 1, 1, 1, 1, 1, 1, 1];
            A[1] = [-melt.major.FeO / melt.major.MgO, 1 / olivine.KD.Fe_Mg(T, P), 0, 0, 0, 0, 0, 0];
            A[2] = [-1 / mv.MgO, -1 / mv.FeO, 2. / mv.SiO2, 0, 0, 0, 0, 0];
            A[3] = [0, 0, 0, 1, 0, 0, 0, 0];
            A[4] = [0, 0, 0, 0, 1, 0, 0, 0];
            A[5] = [0, 0, 0, 0, 0, 1, 0, 0];
            A[6] = [0, 0, 0, 0, 0, 0, 1, 0];
            A[7] = [0, 0, 0, 0, 0, 0, 0, 1];

            let v = [100,
                0,
                0,
                (olivine.D.hasOwnProperty("TiO2")) ? melt.major.TiO2 * olivine.D.TiO2(T, P) : 0,
                (olivine.D.hasOwnProperty("Al2O3")) ? melt.major.Al2O3 * olivine.D.Al2O3(T, P) : 0,
                (olivine.D.hasOwnProperty("CaO")) ? melt.major.CaO * olivine.D.CaO(T, P) : 0,
                (olivine.D.hasOwnProperty("Cr2O3")) ? melt.major.Cr2O3 * olivine.D.Cr2O3(T, P) : 0,
                (olivine.D.hasOwnProperty("NiO")) ? melt.major.NiO * olivine.D.NiO(T, P) : 0
            ];

            let x = Equilibrate[method](A, v, 1e-6, 0.9);

            const trace = {};
            for (let e in melt.trace) {
                trace[e] = (olivine.D.hasOwnProperty(e)) ? melt.trace[e] * olivine.D[e](T, P) : 0;
            }


            return {
                major: {
                    SiO2: x[2],
                    FeO: x[1],
                    MgO: x[0],
                    TiO2: x[3],
                    Al2O3: x[4],
                    CaO: x[5],
                    Cr2O3: x[6],
                    NiO: x[7],
                    Fe2O3: 0,
                    Na2O: 0,
                    K2O: 0,
                    P2O5: 0,
                    MnO: 0,
                    H2O: 0
                },
                trace: trace
            }
        }
    }

    static spinel_melt(melt, method = "solve") {
        const mv = GeoChem.getMolarValue();
        return spinel => (T, P) => {
            const trace = {};
            for (let e in melt.trace) {
                trace[e] = (spinel.D.hasOwnProperty(e)) ? melt.trace[e] * spinel.D[e](T, P) : 0;
            }


            return {
                major: {
                    SiO2: 0,
                    FeO: 0,
                    MgO: 0,
                    TiO2: 0,
                    Al2O3: 0,
                    CaO: 0,
                    Cr2O3: spinel.D.Cr2O3(T, P) * melt.major.Cr2O3,
                    NiO: spinel.D.NiO(T, P) * melt.major.NiO,
                    Fe2O3: 0,
                    Na2O: 0,
                    K2O: 0,
                    P2O5: 0,
                    MnO: 0,
                    H2O: 0
                },
                trace: trace
            }


        }
    }

    static solve(_A, _v, _eps = 1.0e-6, _w) {
        let A = new Matrix(_A)
        let v = new Matrix(_v.map((a) => [a]));

        let invA = Matrix.inverse(A, _eps);
        let x = Matrix.multiple(invA, v);

        return x.m.map((a) => a[0]);
    }

    static SOR(A, v, eps = 1e-6, w = 1.) {
        let dX = 1;
        let absX = 1;
        let raw = A.length;
        let col = A[0].length;
        let x = v.map((v) => 0);
        let k = 0;
        while (dX / absX > eps) {
            dX = 0;
            absX = 0;
            for (let i = 0; i < raw; i++) {
                let sum = 0;
                for (let j = 0; j < col; j++) {
                    if (i !== j) {
                        sum += A[i][j] * x[j];
                    }
                }

                let newX = 1. / A[i][i] * (v[i] - sum);
                dX += Math.abs(newX - x[i]);
                absX += Math.abs(newX);
                x[i] += w * (newX - x[i]);
                k++
            }
        }
        //console.log(k++)
        return x;
    }

}

module.exports = Equilibrate;
