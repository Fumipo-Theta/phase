## Release note

### 2017.11.15: ver. 3.0

- 固相のdesolutionのシミュレート機能を開発開始

### 2017.10.24: ver. 2.0

- trace elementのリストはPhase.setTracList([String]) メソッドで設定することになった．
- trace element の結晶分別をシミュレートできるようになった．
- 分配係数について，温度・圧力の関数としてあらわすことにした．

### 2017.8.9: ver. 2.0

	- setAtomメソッドをPhaseに追加
		- 固相組成をストイキオメトリーにもとづいて指定できるようにした
	- 組成
	- プロファイル
			- -> section object と同じデータ構造にする

#### 2017.7.18: ver. 2.0

	- 各phaseを個別のオブジェクトとして管理
		- インターフェースを統一

	- クラス: Phase, Solid (extends Phase), Liquid (extends Phase) の実装
	- phase依存関数 (温度計，分配係数) のbindを実装

	- 分配係数
			- 関数として外部から与えられるようにし，phaseをbindするようにした

	- 複数成分の分別を一般化できるようにした
		- mass ベースの連立方程式を解く
		- SOR法による解法を実装した
			- olivineは加速緩和係数を0.9と，Gauss Seidel法より収束を遅くする必要あり
			- opx の加速緩和係数は1
		- melt-solid間でなくとも対応可能

	- Phaseごとに平衡組成を独立に計算し，全ての相の組成が計算された後に分別して液相組成を再計算可能に
		- 質量保存則をstoichiometryをもとに成立させた

### ver. 1.4

	- olivine，opx，spinelのみ
	- Major elements はSiO2,FeO,MgOのみ
	- 分配係数は固定値


## Bags & fix