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
    constructor(propList) {
      this.profile = this.reset(propList);
    }

    reset(propList) {
      const profile = {}

      propList.map(propNames => {
        if (Array.isArray(propName)) {
          propName.map(p => {
            profile[p] = [];
          })
        } else {
          profile[propName] = [];
        }

      })

      return profile
    }

    push(objs) {
      const objectArray = (Array.isArray(objs))
        ? objs
        : [objs]

      objectArray.map(obj => {
        Object.entries(obj).map(kv => {
          let k = kv[0], v = kv[1];
          this.profile[k].push(v)
        })
      })

    }

    pop() {
      const obj = {}
      Object.entries(this.profile).map(kv => {
        let k = kv[0], v = kv[1];
        obj[k] = v.pop();
      })
      return obj;
    }

    get(keys = []) {
      const obj = {}

      if (keys.length === 0) {
        obj = JSON.parse(JSON.stringify(this.profile))
      } else {
        keys.map(k => {
          obj[k] = JSON.parse(JSON.stringify(this.profile[k]))
        })
      }
      return obj
    }

    set(opt) {
      Object.entries(opt).map(kv => {
        let k = kv[0], array = kv[1];
        this.profile[k] = array;
      })
    }

    pick(k, i) {
      return this.profile[k][i];
    }

    direct(k, i, v) {
      this.profile[k][i] = v;
    }

    getLength(k) {
      return this.profile[k].length;
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

      this.profile = newProfile;
    }

    transformByRadius(_positions, x = "x") {
      const profile = this.profile;
      if (_profile.length < 1) throw new Error("Length of profile is 0");
      if (_positions.length < 1) throw new Error("Length of positions is 0");

      const newProfile = {}
      const props = Object.keys(_profile);
      for (let prop of props) {
        newProfile[prop] = [];
        //newProfile[prop][0] = _profile[prop][0];
      }

      profLen = _profile[props[0]].length;
      posLen = _positions.length;

      let k = 0;
      for (let i = 0; i < posLen; i++) {
        while (_positions[i] > _profile[x][k + 1]) {
          if (k === profLen - 2) break;
          k++;
        }
        let f = (_positions[i] - _profile[x][k]) / (_profile[x][k + 1] - _profile[x][k]);
        for (let prop of props) {
          newProfile[prop][i] = _profile[prop][k] * (1 - f) + _profile[prop][k + 1] * f;
        }

      }
      this.profile = newProfile;
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