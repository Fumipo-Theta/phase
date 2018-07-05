(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([

    ], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.MagmaSystem = factory(
      root.Solid,
      root.Liquid
    );
  }
}(this, function (_Solid, _Liquid, ) {

  const Solid = (typeof require === 'undefined' && (typeof _Solid === 'object' || typeof _Solid === 'function'))
    ? _Solid
    : require("./solid");

  const Liquid = (typeof require === 'undefined' && (typeof _Liquid === 'object' || typeof _Liquid === 'function'))
    ? _Liquid
    : require("./liquid");


  class Magma {
    constructor(parameters) {
      this.phase = {};
      this.model = (parameters, magma) => null;
      this.diffusionProfiles = {};
      this.thermometer = {};
      this.barometer = {};
      this.oxybarometer = {};

      this.actionFuncList = [(magma, opt) => null];
      this.finalAction = (magma, opt) => null;
      this.thermodynamicProperties = {};
    }


    filterPhase(func) {
      const obj = {}
      Object.entries(this.phase)
        .filter(kv => func(kv[1]))
        .map(kv => {
          obj[kv[0]] = kv[1]
        })
      return obj
    }

    liquids() {
      return this.filterPhase(p => p instanceof Liquid);
    }

    solids() {
      return this.filterPhase(p => p instanceof Solid)
    }

    /** 
     * 予めセットアップしたPhaseや温度圧力計を登録する.
     * Phaseはclass内部で, {phase.name:Phase}という辞書として保存される
     * 
     * @param {Object} obj
     */
    setThermodynamicAgent(obj) {
      Object.entries(obj).map(kv => {
        let k = kv[0], v = kv[1];
        switch (k) {
          case "phase":
            v.map(phase => {
              this.phase[phase.name] = phase;
              this.diffusionProfiles[phase.name] = {};
            });
            break;

          case "thermometer":
            this.thermometer = v;
            break;

          case "barometer":
            this.barometer = v;
            break;
          default:
            break;
        }
      })
      return this;
    }

    setThermodynamicHandler(func) {
      this.thermodynamicHandler = func;
      return this;
    }

    getThermodynamicProperty(opt) {
      return this.thermodynamicHandler(this, opt);
    }


    setDiffusionProfile(diffusion, phaseName, component) {
      this.diffusionProfiles[phaseName][component] = diffusion;
      return this;
    }

    getDiffusionProfile(phaseName) {
      return this.diffusionProfiles[phaseName];
    }

    setAction(actionFuncList) {
      this.action = actionFuncList;
      return this;
    }

    setFinalAction(actionFunc) {
      this.finalAction = actionFunc;
      return this;
    }

    execAction(opt) {
      let result = {}
      this.action.map((act, i) => {
        result = act(this, opt[i], result);
      })
      return this.finalAction(this, opt[opt.length - 1], result);
    }


  }



  function executeDiffusion(magma, arg) {
    const profile = magma.phase[targetPhase].getProfile(pathName);
    const l = profile.F.length;
    const A = (Math.pow(radiusMax, 3) - Math.pow(previousR, 3)) / (profile.F[l - 1]);

    // 結晶化度(質量%を元に)半径を算出: 密度変化なしとする 
    profile.x = profile.F.map(f => Math.pow(A * f + Math.pow(previousR, 3), 0.333333))
    /*
    for (let j = 0; j < l; j = (j + 1) | 0) {
      profile.x[j] = Math.pow(A * profile.F[j] + Math.pow(previousR, 3), 0.333333);
    };
    */
    previousR = profile.x[l - 1];


    Object.entries(this.diffusionProfiles[targetPhase]).map((e, d => {
      d.appendSection(profile)
        .divideSpaceEqually((parseInt(j) + 1) * 10)
      if (candidateSectionInfo[i].logCompressedTime) {

        d.setMaxCompressedTime(candidateSectionInfo[j].logCompressedTime)

      } else {
        d.calcMaxCompressedTime()

      }

      d.nondimensionalize()
        .implicitCN()
        .redimensionalize()

    }))

  }





  /**
   * 複数回の結晶成長とプロファイル取得を分離
   * @param {*} ope 
   * @param {*} sectionInfo 
   */
  function multipleGrowthDiffusion(magma, ope, parameters) {
    var previousR = 0;

    parameters.map(parameter => {
      const targetPhase = ope.targetPhase,
        radiusMax = parameter.sectionRadius

      // 出発メルトから結晶化初期のメルト組成を求める
      const pathName = (initialMgN > finalMgN)
        ? "descend"
        : "ascend";

      this.growCrystals(info, ope, pathName);
      this.executeDiffusion();

    })
  }

  //
  // Diffusion objectを統合 */
  //
  /* integrateDiffusedProfiles */
  // not yet
  function integrateDiffusedProfiles(diffusionObjArray, diffused = true) {
    let _modelProfile = new Array();
    let keys = Object.keys(diffusionObjArray)

    let profile = (diffused === true) ? "profile" : "notDiffusedProfile";

    const l = diffusionObjArray[keys[0]][profile].c.length;

    for (let i = 0; i < l; i++) {
      _modelProfile[i] = {};
      for (let key in diffusionObjArray) {
        _modelProfile[i][diffusionObjArray[key].element] = diffusionObjArray[key][profile].c[i];
      }
      _modelProfile[i].x = diffusionObjArray[keys[0]][profile].x[i];
    }

    return _modelProfile;
  }


  function operateDiffusion(iter, arg) {
    //const graphId = arg.graphId;
    const sectionOperand = arg.sectionOperand

    let ope = arg.operand.operand;
    const analyzedCsvObj = arg.operand.analyzedCsvObj;
    const errorCsvObj = arg.operand.errorCsvObj;
    const iterMax = arg.iterMax;
    const sectionLength = ope.sectionInfo.length;
    const acceptedInfo = arg.acceptedInfo;
    const rand = arg.rand;
    const paramNames = Object.keys(ope.sectionInfo[0]);
    const invT = (arg.hasOwnProperty("invT")) ? arg.invT : 1;
    const islandNum = (arg.hasOwnProperty("islandNum")) ? arg.islandNum : 0;

    let lnProb = acceptedInfo.lnProbability;

    let updateOrder = []
    let updateKeys = Object.keys(ope.randomVector);
    for (let i = 0, l = sectionLength * updateKeys.length; i < l; i = (i + 1) | 0) {
      updateOrder[i] = [i, this.rand.next()];
    }

    updateOrder = updateOrder.sort((a, b) => a[1] - b[1]).map((v) => v[0]);

    for (let i = 0, l = updateOrder.length; i < l; i = (i + 1) | 0) {
      let sectionNum = parseInt(updateOrder[i] / updateKeys.length);
      let updateKey = updateKeys[updateOrder[i] - sectionNum * updateKeys.length];
      /* Construct Diffusion obj for each element */

      let diffusers = [];
      //let graphs=new Array();

      // 元素数だけDiffusionオブジェクトを生成
      for (let key in ope.elementList) {
        let elem = ope.elementList[key];
        diffusers[elem] = new Diffusion(elem, ope.diffusionCoefficient[elem]);
        //graphs[elem]=new Graph(graphId+" ."+elem,600,300,diffusers[elem].profile,analyzedCsvObj,"Radius",elem);
      };




      /* update parameter set */
      let candidateSectionInfo = [];
      if (arg.updateFlag) {

        // あるセクションだけ更新
        for (let key of ope.sectionInfo.keys()) {

          if (key === sectionNum) {

            //candidateSectionInfo[key]=this.updateParamSet(ope.sectionInfo[key],ope.randomVector,islandNum*0.1); //islandNum*0.1
            candidateSectionInfo[key] = this.updateParam(ope.sectionInfo[key], updateKey, ope.randomVector, islandNum * 0.1);
            //console.log(sectionNum+1,"th parameter set updated")
          } else {

            candidateSectionInfo[key] = ope.sectionInfo[key];

          };


        };

        // セクション半径を更新
        if (ope.deltaRadius) {
          if (sectionNum == 0 && this.rand.next() < 0.05) {
            let oldRadius = ope.sectionInfo.map((o) => o.sectionRadius);
            let maxRadius = analyzedCsvObj[analyzedCsvObj.length - 1].value.x * 1;
            let newRadius = this.getRandomRadius(oldRadius, ope.deltaRadius, maxRadius)
            newRadius.map((v, i) => {
              candidateSectionInfo[i].sectionRadius = v;
            });
          }
        }
      } else {
        candidateSectionInfo = ope.sectionInfo;
      };
      //console.log("candidate: ",candidateSectionInfo);
      //console.log("pre info: ",sectionInfo);


      /* Create crystal section */
      let profiles = this.getCrystalProfiles(ope, candidateSectionInfo);

      /* diffusion simulation */
      // Elementごとに1ステップずつ進める <= 元素ごとに並列化可能
      // 各ステップは直列実行
      let temperatureInfo = [];

      for (let j in profiles) {
        for (let key in diffusers) {

          if (candidateSectionInfo[j].logCompressedTime) {
            // セクションを追加して全体を無次元化
            // 拡散計算と無次元化解除
            diffusers[key].appendSection(profiles[j]).divideSpaceEqually((parseInt(j) + 1) * 10)
              .setMaxCompressedTime(candidateSectionInfo[j].logCompressedTime)
              .nondimensionalize()
              .implicitCN()
              .redimensionalize();
          } else {
            diffusers[key].appendSection(profiles[j]).divideSpaceEqually((parseInt(j) + 1) * 10)
              .calcMaxCompressedTime()
              .nondimensionalize()
              .implicitCN()
              .redimensionalize();
          }
        };//.calcDiffusionAll()

        //temperatureInfo.push(profiles[j].temperature);

      };

      //acceptedInfo.temperature = temperatureInfo;

      /* get modeled Profile */
      let modelProfile = this.integrateDiffusedProfiles(diffusers, true);
      let notDiffusedModelProfile = this.integrateDiffusedProfiles(diffusers, false);
      //console.log(modelProfile)
      acceptedInfo.model = Phase.formatProfile(modelProfile);
      /* 実測データに合わせて モデルデータ点を変換 */
      let measuredPosition = analyzedCsvObj.map((v) => v.value.x);

      //modelProfile=this.cst.divideProfileEqualStep(modelProfile,60,'x')
      modelProfile = Phase.transformProfile.byRadius(modelProfile, measuredPosition);//console.log(modelProfile,analyzedCsvObj);
      /* モデルプロファイル */
      //notDiffusedModelProfile=this.cst.transformProfileByRadius(notDiffusedModelProfile,measuredPosition);

      acceptedInfo.notDiffusedModel = notDiffusedModelProfile;


      /* evaluate probabiity */
      let lnProbCand = this.getAllLnProbabilityByPoint(analyzedCsvObj, modelProfile, errorCsvObj);
      lnProbCand = (isFinite(lnProbCand)) ? lnProbCand : -100000;
      //console.log("lnProbCand: ",lnProbCand)


      /* calculate transition probability */
      let ratio;
      if (iter === 0) {
        //var ratio=1;
        ratio = Math.exp(invT * (lnProbCand - lnProb));
      } else {
        ratio = Math.exp(invT * (lnProbCand - lnProb));
      };


      /* accept/reject candidate parameters */
      if (ratio >= 1) {
        ope.sectionInfo = candidateSectionInfo;
        acceptedInfo.lnProbability = lnProbCand;
        acceptedInfo.acceptedTime++;
        acceptedInfo.sectionInfo = candidateSectionInfo;
        //console.log("accepted")
      } else {
        if (ratio > this.rand.next()) {
          ope.sectionInfo = candidateSectionInfo;
          acceptedInfo.lnProbability = lnProbCand;
          acceptedInfo.acceptedTime++;
          acceptedInfo.sectionInfo = candidateSectionInfo;
          //console.log("accepted")
        } else {
          acceptedInfo.sectionInfo = ope.sectionInfo;
          //console.log("rejected")
        };
      };




    }; // update parameter set loop

    let csvStr = this.section2Csv(ope.sectionInfo, this.recParams);



    acceptedInfo.csvStr = csvStr;

    if (iter == iterMax) {
      //console.log('MCMCOperation: acceptedInfo',acceptedInfo)
      // 最終的にコールバック関数に与えられるオブジェクト
      return { flag: false, result: acceptedInfo }
    };
    //};
    // iterMaxでなければループを回す
    return { flag: true };

  }



  return Magma;
}))

