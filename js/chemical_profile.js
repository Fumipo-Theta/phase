(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(["geochem"], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.ChemicalProfile = factory(root.GeoChem);
  }
}(this, function (_GeoChem) {
  const GeoChem = (typeof require === 'undefined' && typeof _GeoChem === 'object')
    ? _GeoChem
    : require("./geochem");


  class ChemicalProfile {
    constructor(majorList, traceList) {
      this.optional = ["F", "T", "N", "P", "x"];
      this.profile = this.reset(majorList, traceList);

    }

    reset(majorList, traceList) {
      const profile = {}

      majorList.map(e => {
        profile[e] = [];
      })
      traceList.map(e => {
        profile[e] = [];
      })
      this.optional.map(e => {
        profile[e] = [];
      })

      return profile
    }

    push(major, trace, F, T, P, N) {
      for (let e in major) {
        this.profile[e].push(major[e]);
      }
      for (let e in trace) {
        this.profile[e].push(trace[e]);
      }
      this.profile.F.push(F);
      this.profile.T.push(T);
      this.profile.P.push(P);
      this.profile.N.push(N);
      this.profile.x.push(0);
    }

    get() {
      return JSON.parse(JSON.stringify(this.profile));
    }

    transformByEqualStep(_divNum = 1, _prop) {
      const _profile = this.profile;
      const divNum = parseInt(_divNum);
      if (divNum < 1) throw new Error("divNum must positive");
      if (!_profile.hasOwnProperty(_prop)) throw new Error(`profile does not have key [${_prop}]`);

      const l = _profile[_prop].length;
      const dF = (_profile[_prop][l - 1] - _profile[_prop][0]) / divNum;
      const newProfile = {};
      const props = Object.keys(_profile);

      props.map(k => {
        newProfile[k] = [_profile[k][0]];
      })


      let F = _profile[_prop][0] + dF;
      let k = 0;
      for (let i = 1; i < divNum + 1; i++) {
        while (F > _profile[_prop][k + 1]) {
          if (k === l - 2) break;
          k++;
        }

        let f = (F - _profile[_prop][k]) / (_profile[_prop][k + 1] - _profile[_prop][k]);

        for (let prop of props) {
          newProfile[prop][i] = _profile[prop][k] * (1 - f) + _profile[prop][k + 1] * f;
        }
        F += dF;
      }

      return newProfile;
    }

    transformByRadius(_positions) {
      const profile = this.profile;
      if (_profile.length < 1) throw new Error("Length of profile is 0");
      if (_positions.length < 1) throw new Error("Length of positions is 0");

      const newProfile = {}
      const props = Object.keys(_profile[0]);
      for (let prop of props) {
        newProfile[prop] = [];
        //newProfile[prop][0] = _profile[prop][0];
      }

      profLen = _profile.length;
      posLen = _positions.length;

      let k = 0;
      for (let i = 0; i < posLen; i++) {
        while (_positions[i] > _profile[k + 1].x) {
          if (k === profLen - 2) break;
          k++;
        }
        let f = (_positions[i] - _profile[k].x) / (_profile[k + 1].x - _profile[k].x);
        for (let prop of props) {
          newProfile[prop][i] = _profile[k][prop] * (1 - f) + _profile[k + 1][prop] * f;
        }

      }
      return newProfile;
    }

    /** section Resampler */
    // profile as argument should have property c,x,f(crystallization fraction)
    /** transformSectionToEqualDivision */
    // sampled point number is divideNum + 1
    // F[0] ~ g(F[i-1], F[i]) ~ F[N]

    static transformSectionByEqualStep(section, _divideNum = 1, prop = "f") {
      const divideNum = parseInt(_divideNum);
      if (divideNum < 1) throw new Error("divideNum must be positive");
      const newProfile = [];
      const keys = Object.keys(sectionObj);

      for (key of keys) {

        if (!sectionObj[key][_prop]) {
          newProfile[key] = sectionObj[key];
          continue;
        }
        //if(sectionObj[key].f.length < 2) return sectionObj;
        let profile = sectionObj[key];
        let l = profile[_prop].length;
        let extent = { 'max': profile[_prop][l - 1], 'min': profile[_prop][0] };

        newProfile[key] = {
          'name': key,
          'f': [],
          'c': [],
          'x': []
        };

        newProfile[key].f[0] = profile.f[0];
        newProfile[key].c[0] = profile.c[0];
        let dF = (extent.max - extent.min) / divideNum;
        let F = profile[_prop][0] + dF;
        let k = 0;

        for (let i = 1; i < divideNum + 1; i = (i + 1) | 0) {
          while (F > profile[_prop][k + 1]) {
            if (k == l - 2) break;
            k = (k + 1) | 0;
          }

          let factor = (F - profile[_prop][k]) / (profile[_prop][k + 1] - profile[_prop][k]);

          newProfile[key].f[i] = F;
          newProfile[key].c[i] = profile.c[k] * (1 - factor) + profile.c[k + 1] * factor;

          F += dF;
        }
      }
      return newProfile;
    }

    static formatProfile(sectionObj) {
      const newProfile = {};
      const keys = Object.keys(sectionObj[0]);

      keys.map((key) => {
        newProfile[key] = [];
      })

      for (let i = 0, l = sectionObj.length; i < l; i++) {

        keys.map((key) => {
          newProfile[key][i] = sectionObj[i][key];
        })
      }

      return newProfile;
    }
  }

  return ChemicalProfile;
}))