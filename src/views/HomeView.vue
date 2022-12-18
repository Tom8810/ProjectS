<template>
  <div class="help-shadow"></div>
  <div class="app-bar">
    <h1>アップバー</h1>
    <button @click="goDev">dev</button>
    <button v-if="isGuess && isAlreadyStarted" @click="change">
      データベースへ
    </button>
    <button v-if="!isGuess && isAlreadyStarted" @click="change">推測へ</button>
    <button @click="help" class="help-button">ヘルプ</button>
  </div>
  <div class="body">
    <aside class="side-bar">
      <div class="favorite-post" id="favorite-post">
        <h4>評価の高い推測</h4>
      </div>
      <div class="new-post" id="new-post">
        <h4>新着の推測</h4>
      </div>
      <div class="ad">
        <h4>その他</h4>
      </div>
    </aside>
    <div class="start" id="start">
      <div class="start-background-text">
        <h1>DATA</h1>
      </div>
      <div class="start-front-content">
        <div class="start-foreground-text">
          <h1>Guess.</h1>
          <div class="lineArrow"></div>
        </div>
        <div class="start-button-area">
          <div
            class="start-button-box button"
            @click.once="start"
            :style="{ disabled: isAlreadyStarted }"
          >
            <h1>推測する</h1>
            <div class="line-arrow-in-box"></div>
            <h3>Guess Data</h3>
          </div>
          <div class="start-button-box button" @click="moveToDB">
            <h1>閲覧する</h1>
            <div class="line-arrow-in-box"></div>
            <h3>View Data</h3>
          </div>
        </div>
      </div>
    </div>
    <!-- ここから推測 -->
    <div class="main" :style="{ display: guesser }">
      <button @click="test_auto">自動</button>
      <div id="guess-box">
        <div class="title-area">
          <h3>推測テーマ</h3>
          <div class="help-box">
            <input
              type="text"
              name="name"
              id="name"
              v-model="title"
              @change="changeDisc()"
            />
            <div class="help">
              <p>
                ここは推測のタイトルを入力する場所です。これから推測することを入力しましょう。
              </p>
              <button @click="helpOpe">例を自動入力</button>
              <button @click="nextHelp">次へ</button>
            </div>
          </div>
        </div>
        <div class="calc-area">
          <div id="calc-data-area">
            <h3>使用データ</h3>
            <div class="help-box">
              <button
                id="data-number-button"
                @click="
                  addData();
                  changeDisc();
                "
              >
                データの数を増やす
              </button>
              <div class="help">
                <p>
                  このボタンは推測に使うデータの数を3つにしたい場合に押します。
                </p>
                <button @click="nextHelp">次へ</button>
                <button @click="prevHelp">前へ戻る</button>
              </div>
            </div>
            <div class="help-box">
              <input
                type="text"
                autocomplete="on"
                list="data1"
                id="data-input-1"
                v-model="firstData"
                @change="changeDisc()"
              />
              <datalist id="data1"> </datalist>
              <button id="num-change-button-forf" @click="numChangeForF">
                数値を入力する
              </button>
              <div class="help">
                <p>
                  ここは推測に使う一つ目のデータを選択する場所です。キーワードを入力すると絞り込みができます。数値を入力したい場合は「数値を入力する」ボタンを押してください。
                </p>
                <button @click="helpOpe">例を自動入力</button>
                <button @click="nextHelp">次へ</button>
                <button @click="prevHelp">前へ戻る</button>
              </div>
            </div>
            <div>
              <div class="help-box">
                <select
                  name="post-particle"
                  v-model="operator"
                  @change="changeDisc()"
                >
                  <option value="+">+</option>
                  <option value="-">-</option>
                  <option value="×">×</option>
                  <option value="÷">÷</option>
                </select>
                <div class="help">
                  <p>ここは記号を選択する場所です。</p>
                  <button @click="helpOpe">例を自動入力</button>
                  <button @click="nextHelp">次へ</button>
                  <button @click="prevHelp">前へ戻る</button>
                </div>
              </div>
              <div class="help-box">
                <input
                  type="text"
                  autocomplete="on"
                  list="data2"
                  id="data-input-2"
                  v-model="secondData"
                  @change="changeDisc()"
                />
                <datalist id="data2"> </datalist>
                <button id="num-change-button-fors" @click="numChangeForS">
                  数値を入力する
                </button>
                <div class="help">
                  <p>
                    ここは推測に使う二つ目のデータを選択する場所です。キーワードを入力すると絞り込みができます。数値を入力したい場合は「数値を入力する」ボタンを押してください。
                  </p>
                  <button @click="helpOpe">例を自動入力</button>
                  <button @click="nextHelp">次へ</button>
                  <button @click="prevHelp">前へ戻る</button>
                </div>
              </div>
            </div>
            <div v-if="howManyData === 3">
              <select
                name="post-particle"
                v-model="operator2"
                @change="changeDisc()"
              >
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="×">×</option>
                <option value="÷">÷</option>
              </select>
              <input
                type="text"
                autocomplete="on"
                list="data3"
                id="data-input-3"
                v-model="thirdData"
                @change="changeDisc()"
                @mouseover.once="thirdStart"
              />
              <datalist id="data3"> </datalist>
              <button id="num-change-button-fort" @click="numChangeForT">
                数値を入力する
              </button>
            </div>
          </div>
          <div class="help-box">
            <h4>単位</h4>
            <input type="text" v-model="unit" />
            <div class="help">
              <p>こちらは推測するデータの単位を入力する場所です。</p>
              <button @click="helpOpe">例を自動入力</button>
              <button @click="nextHelp">次へ</button>
              <button @click="prevHelp">前へ戻る</button>
            </div>
          </div>
        </div>
        <div class="discription-area help-box">
          <h3>推測の根拠</h3>
          <h3>{{ discription }}</h3>
          <div class="help">
            <p>こちらは推測する式が表示される場所です。</p>
            <button @click="nextHelp">次へ</button>
            <button @click="prevHelp">前へ戻る</button>
          </div>
        </div>
        <div class="help-box">
          <button @click="calc">計算</button>
          <div class="help">
            <p>空欄がないことを確認して、このボタンを押して推測しましょう。</p>
            <button @click="help">終了</button>
            <button @click="prevHelp">前へ戻る</button>
          </div>
        </div>
      </div>
      <div id="result-area">
        <div class="result-box" id="result-box">
          <h3>推測結果</h3>
          <h3>{{ discription }}</h3>
        </div>
        <button @click="next">次へ</button>
      </div>
    </div>

    <!-- ここからデータベース -->
    <div class="main" :style="{ display: viewer }">
      <div class="search" id="search">
        <h2>データベース</h2>
        <h3>検索</h3>
        <h3>検索方法</h3>
        <div class="help-box">
          <select v-model="searchStyle" @change="sortInit">
            <option value="input" selected>直接入力検索</option>
            <option value="sort">絞り込み検索</option>
          </select>
          <div class="help">
            <p>
              まずここで検索方法を指定します。直接入力して検索するか、条件を指定して絞り込み検索をします。
            </p>
            <button
              @click="
                helpOpe();
                nextHelp();
              "
            >
              次へ
            </button>
          </div>
        </div>
        <div v-if="searchStyle === `sort`" class="help-box">
          <select v-model="sortStyle" @change="sortInit">
            <option value="genre">ジャンルで絞り込み</option>
            <option value="keyword">キーワードで絞り込み</option>
          </select>
          <div v-if="sortStyle === `genre`">
            <select v-model="sortGenre" @change="goGenreSort">
              <option value="pref">都道府県データ</option>
              <option value="population">人口データ</option>
              <option value="per">一人当たりデータ</option>
            </select>
          </div>
          <div v-else>
            <input type="text" v-model="sortKeyword" />
            <button @click="goKeywordSort">絞り込み条件を追加</button>
          </div>
        </div>
        <div class="sort-box" id="sort-box"></div>
        <div class="help-box">
          <input
            type="text"
            v-model="searchText"
            autocomplete="on"
            list="search-result-box"
          />
          <datalist id="search-result-box"></datalist>
          <button @click="textDelete">削除</button>
          <button @click="getData">表示</button>
          <div class="help">
            <p>
              検索方法の指定や絞り込みが終わったら、ここから見たいデータを選択して表示ボタンを押します。
            </p>
            <button @click="prevHelp">前へ戻る</button>
            <button @click="help()">終了</button>
          </div>
        </div>
      </div>
      <div class="data-area" id="data-area">
        <div>
          <h2>タイトル</h2>
          <h3 class="data-title" id="data-title">a</h3>
        </div>
        <div>
          <h2>データ</h2>
          <h4 class="data-num" id="data-num">0</h4>
          <div id="data-box"></div>
        </div>
        <div>
          <h2>データの次数</h2>
          <h3 class="data-degree" id="data-degree">0</h3>
        </div>
        <div id="for-primary"></div>
        <div id="judge-area">
          <h2>この推測を評価する</h2>
          <div id="judge"></div>
        </div>
        <div>
          <h2>親データ</h2>
          <div id="parent-data-box"></div>
        </div>
        <button @click="searchStart">戻る</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  doc,
  query,
  orderBy,
  limit,
  where,
  updateDoc,
  arrayUnion,
  increment,
} from "@firebase/firestore";
import { db } from "@/firebase.js";

export default {
  data() {
    return {
      isGuess: true,
      ishelp: false,
      helpIndex: 0,
      helpDeleteIndex: -1,
      guesser: "block",
      viewer: "none",
      commonLef: collection(db, "data"),
      num1: "",
      num2: "",
      num3: "",
      calcParent1: "",
      calcParent2: "",
      calcParent3: "",
      howManyData: 2,
      operator: "",
      operator2: "",
      result: "",
      roundedResult: "",
      isAlreadyStarted: false,
      isNumFor1: false,
      isNumFor2: false,
      isNumFor3: false,
      data: [],
      sortData: [],
      alreadyAutoCalc: [],
      autoCalc: [],
      perPersonData: [],
      prefData: [],
      appendData: [],
      title: "",
      unit: "",
      firstData: "",
      secondData: "",
      thirdData: "",
      discription: "",
      intResult: 0,
      digit: 0,
      roundDigit: 0,
      digitUnitCoeff: 0,
      searchStyle: "input",
      sortStyle: "genre",
      sortGenre: "",
      sortKeyword: "",
      sortCondition: [],
      searchText: "",
      showingData: "",
      prefectures: [
        "北海道",
        "青森",
        "岩手",
        "宮城",
        "秋田",
        "山形",
        "福島",
        "茨城",
        "栃木",
        "群馬",
        "埼玉",
        "千葉",
        "東京",
        "神奈川",
        "新潟",
        "富山",
        "石川",
        "福井",
        "山梨",
        "長野",
        "岐阜",
        "静岡",
        "愛知",
        "三重",
        "滋賀",
        "京都",
        "大阪",
        "兵庫",
        "奈良",
        "和歌山",
        "鳥取",
        "島根",
        "岡山",
        "広島",
        "山口",
        "徳島",
        "香川",
        "愛媛",
        "高知",
        "福岡",
        "佐賀",
        "長崎",
        "熊本",
        "大分",
        "宮崎",
        "鹿児島",
        "沖縄",
      ],
      alreadySearchStart: false,
      changeDisc: function () {
        this.discription =
          this.title + "=" + this.firstData + this.operator + this.secondData;
        if (this.howManyData === 3) {
          this.discription = this.discription + this.operator2 + this.thirdData;
        }
      },
      async start() {
        if (this.data.length === 0) {
          const start = document.getElementById("start");
          start.classList.add("hidden");
          this.isAlreadyStarted = true;
          if (this.isGuess) {
            this.guesser = "block";
            this.viewer = "none";
          }
          const snapshot = await getDoc(doc(db, "data", "overView"));
          snapshot.data().index.forEach((e) => {
            this.data.push(e);
          });
          snapshot.data().autoCalc.forEach((e) => {
            this.alreadyAutoCalc.push(e);
          });
          snapshot.data().perPerson.forEach((e) => {
            this.perPersonData.push(e);
          });
          snapshot.data().pref.forEach((e) => {
            this.prefData.push(e);
          });
          if (this.isGuess) {
            const data1 = document.getElementById("data1");
            const data2 = document.getElementById("data2");
            this.data.forEach((e) => {
              const optionFor1 = document.createElement("option");
              const optionFor2 = document.createElement("option");
              optionFor1.value = optionFor2.value = e.title;
              optionFor1.textContent = optionFor2.textContent = `(${e.degree})`;
              data1.append(optionFor1);
              data2.append(optionFor2);
            });
          }
          // favorite
          const favoritePost = document.getElementById("favorite-post");
          const favData = document.createElement("div");
          const favQ = query(
            this.commonLef,
            orderBy("likedCount", "desc"),
            limit(1)
          );
          const fav = await getDocs(favQ);
          fav.forEach(async (e) => {
            favData.textContent = e.data().title;
            favData.onclick = async () => {
              this.isGuess = false;
              this.guesser = "none";
              this.viewer = "block";
              const showingFavorite = await getDoc(
                doc(db, "data", `${e.data().title}`)
              );
              this.showingData = showingFavorite.data();
              await this.start();
              this.showData();
            };
            favoritePost.append(favData);
          });

          // new
          const newPost = document.getElementById("new-post");
          const newData = document.createElement("div");
          const newQ = query(this.commonLef, orderBy("date", "desc"), limit(1));
          const ne = await getDocs(newQ);
          ne.forEach(async (e) => {
            newData.textContent = e.data().title;
            newData.onclick = async () => {
              this.isGuess = false;
              this.guesser = "none";
              this.viewer = "block";
              const showingNew = await getDoc(
                doc(db, "data", `${e.data().title}`)
              );
              this.showingData = showingNew.data();
              await this.start();
              this.showData();
            };
            newPost.append(newData);
          });
        }
      },
      round: function () {
        if (this.result >= 1000) {
          this.roundedResult =
            Math.round(this.intResult / 10 ** this.roundDigit) *
            10 ** this.roundDigit;
        } else {
          if (this.result.toString().length >= 5) {
            this.roundedResult =
              Math.round(this.result * 10 ** (-1 * this.roundDigit)) /
              10 ** (-1 * this.roundDigit);
          } else {
            this.roundedResult = this.result;
          }
        }
        if (this.digit >= 5) {
          if (this.digitUnitCoeff <= this.roundDigit) {
            switch (this.digitUnitCoeff) {
              case 4:
                this.roundedResult = this.roundedResult / 10 ** 4 + "万";
                break;
              case 8:
                this.roundedResult = this.roundedResult / 10 ** 8 + "億";
                break;
              case 12:
                this.roundedResult = this.roundedResult / 10 ** 12 + "兆";
                break;
              case 16:
                this.roundedResult = this.roundedResult / 10 ** 16 + "京";
                break;
              default:
                this.roundedResult = this.roundedResult / 10 ** 20 + "垓";
            }
          }
        }
      },
      dataPost: async () => {
        if (this.howManyData === 3) {
          let max1 = this.calcParent1.degree;
          let max2 = this.calcParent2.degree;
          let max3 = this.calcParent2.degree;
          let parentData1 = this.calcParent1.title;
          let parentparent1 = this.calcParent1.parent;
          let parentData2 = this.calcParent2.title;
          let parentparent2 = this.calcParent2.parent;
          let parentData3 = this.calcParent3.title;
          let parentparent3 = this.calcParent3.parent;
          if (this.isNumFor1) {
            max1 = 0;
            parentData1 = this.num1;
            parentparent1 = "";
          }
          if (this.isNumFor2) {
            max2 = 0;
            parentData2 = this.num2;
            parentparent2 = "";
          }
          if (this.isNumFor3) {
            max3 = 0;
            parentData3 = this.num3;
            parentparent3 = "";
          }
          const postData = {
            degree: Math.max(max1, max2, max3) + 1,
            title: this.title,
            latest: this.result,
            unit: this.unit,
            parent: {
              parent1: {
                data: parentData1,
                parent: parentparent1,
              },
              parent2: {
                data: parentData2,
                parent: parentparent2,
              },
              parent3: {
                data: parentData3,
                parent: parentparent3,
              },
              operator: this.operator,
              operator2: this.operator2,
            },
            likedCount: 0,
            date: Date.now(),
          };
          this.appendData.push(postData);
          const ref = doc(db, "data", "overView");
          this.appendData.forEach(async (e) => {
            await setDoc(doc(this.commonLef, `${e.title}`), e);
            await updateDoc(ref, {
              index: arrayUnion({
                title: e.title,
                degree: e.degree,
              }),
            });
          });
        } else {
          let max1 = this.calcParent1.degree;
          let max2 = this.calcParent2.degree;
          let parentData1 = this.calcParent1.title;
          let parentparent1 = this.calcParent1.parent;
          let parentData2 = this.calcParent2.title;
          let parentparent2 = this.calcParent2.parent;
          if (this.isNumFor1) {
            max1 = 0;
            parentData1 = this.num1;
            parentparent1 = "";
          }
          if (this.isNumFor2) {
            max2 = 0;
            parentData2 = this.num2;
            parentparent2 = "";
          }
          const postData = {
            degree: Math.max(max1, max2) + 1,
            title: this.title,
            latest: this.result,
            unit: this.unit,
            parent: {
              parent1: {
                data: parentData1,
                parent: parentparent1,
              },
              parent2: {
                data: parentData2,
                parent: parentparent2,
              },
              operator: this.operator,
            },
            likedCount: 0,
            date: Date.now(),
          };
          this.appendData.push(postData);

          let prefBool = (e) => {
            return this.prefectures.some((ele) => {
              return e.includes(ele);
            });
          };
          let prefIndex = (e) => {
            return this.prefectures.findIndex((ele) => {
              return e.includes(ele);
            });
          };

          if (!this.isNumFor1) {
            if (
              this.calcParent1.title.includes("一人当たり") &&
              this.calcParent1.degree === 1
            ) {
              const checkArr = [];
              this.alreadyAutoCalc.forEach((e) => {
                if (
                  e.dat === this.calcParent2.title &&
                  e.ope === this.operator
                ) {
                  checkArr.push(e.key);
                }
              });
              const getArr = this.perPersonData.filter((e) => {
                return e !== this.calcParent1.title && !checkArr.includes(e);
              });
              const auto = async () => {
                let p = Promise.resolve();
                getArr.forEach(async (e) => {
                  p = p
                    .then(() => {
                      const snapshot = getDoc(doc(db, "data", `${e}`));
                      return snapshot;
                    })
                    .then((snapshot) => {
                      this.autoCalc.push(snapshot.data());
                    });
                });
                await p;
              };
              await auto();
              this.autoCalc.forEach((e) => {
                let autoResult = 0;
                switch (postData.parent.operator) {
                  case "+":
                    autoResult = e.latest + this.num2;
                    break;
                  case "-":
                    autoResult = e.latest - this.num2;
                    break;
                  case "×":
                    autoResult = e.latest * this.num2;
                    break;
                  case "÷":
                    autoResult = e.latest / this.num2;
                    break;
                  default:
                    alert("calcerror");
                }
                let titleFromAuto = e.title.slice(5);
                let removeTitleStr = postData.parent.parent1.data.slice(5);
                let newTitle =
                  postData.title.replace(removeTitleStr, "") + titleFromAuto;
                if (
                  this.data.some((e) => {
                    return e.title !== newTitle;
                  })
                ) {
                  const autoData = {
                    degree: 2,
                    title: newTitle,
                    latest: autoResult,
                    unit: e.unit,
                    parent: {
                      parent1: {
                        data: parentData2,
                        parent: "",
                      },
                      parent2: {
                        data: e.title,
                        parent: "",
                      },
                      operator: postData.parent.operator,
                    },
                    likedCount: 0,
                    date: Date.now(),
                  };
                  this.appendData.push(autoData);
                }
              });
              this.autoCalc = [];
            } else if (
              prefBool(this.calcParent1.title) &&
              prefBool(this.title) &&
              this.calcParent1.degree === 1
            ) {
              const checkArr = [];
              this.alreadyAutoCalc.forEach((e) => {
                if (
                  e.dat === this.calcParent2.title &&
                  e.ope === this.operator
                ) {
                  checkArr.push(e.key);
                }
              });
              let checkChar = this.calcParent1.title.slice(
                this.calcParent1.title.indexOf("の") + 1
              );
              const getArr = this.prefData.filter((e) => {
                return (
                  e !== this.calcParent1.title &&
                  !checkArr.includes(e) &&
                  e.includes(checkChar)
                );
              });
              const auto = async () => {
                let p = Promise.resolve();
                getArr.forEach(async (e) => {
                  p = p
                    .then(() => {
                      const snapshot = getDoc(doc(db, "data", `${e}`));
                      return snapshot;
                    })
                    .then((snapshot) => {
                      this.autoCalc.push(snapshot.data());
                    });
                });
                await p;
              };
              await auto();
              this.autoCalc.forEach((e) => {
                let autoResult = 0;
                // 今回自動計算する県がautoPref、postDataで計算されている県がpostPref
                let autoPref = this.prefectures[prefIndex(e.title)];
                let postPref = this.prefectures[prefIndex(postData.title)];
                switch (postData.parent.operator) {
                  case "+":
                    autoResult = e.latest + this.num2;
                    break;
                  case "-":
                    autoResult = e.latest - this.num2;
                    break;
                  case "×":
                    autoResult = e.latest * this.num2;
                    break;
                  case "÷":
                    autoResult = e.latest / this.num2;
                    break;
                  default:
                    alert("calcerror");
                }
                let newTitle;
                if (postData.title.includes("県")) {
                  if (autoPref === "東京") {
                    newTitle = postData.title
                      .replace(postPref + "県", autoPref + "都")
                      .replace(postPref, autoPref);
                  } else if (autoPref === "大阪" || autoPref === "京都") {
                    newTitle = postData.title
                      .replace(postPref + "県", autoPref + "府")
                      .replace(postPref, autoPref);
                  } else {
                    newTitle = postData.title.replace(postPref, autoPref);
                  }
                } else if (postData.title.includes("府")) {
                  if (autoPref === "東京") {
                    newTitle = postData.title
                      .replace(postPref + "府", autoPref + "都")
                      .replace(postPref, autoPref);
                  } else if (autoPref === "大阪" || autoPref === "京都") {
                    newTitle = postData.title.replace(postPref, autoPref);
                  } else {
                    newTitle = postData.title
                      .replace(postPref + "府", autoPref + "県")
                      .replace(postPref, autoPref);
                  }
                } else if (postData.title.includes("都")) {
                  if (autoPref === "東京") {
                    newTitle = postData.title.replace(postPref, autoPref);
                  } else if (autoPref === "大阪" || autoPref === "京都") {
                    newTitle = postData.title
                      .replace(postPref + "都", autoPref + "府")
                      .replace(postPref, autoPref);
                  } else {
                    newTitle = postData.title
                      .replace(postPref + "都", autoPref + "けん")
                      .replace(postPref, autoPref);
                  }
                } else {
                  newTitle = postData.title.replace(postPref, autoPref);
                }
                if (
                  this.data.some((ele) => {
                    return ele.title !== newTitle;
                  })
                ) {
                  const autoData = {
                    degree: 2,
                    title: newTitle,
                    latest: autoResult,
                    unit: postData.unit,
                    parent: {
                      parent1: {
                        data: parentData2,
                        parent: "",
                      },
                      parent2: {
                        data: e.title,
                        parent: "",
                      },
                      operator: postData.parent.operator,
                    },
                    likedCount: 0,
                    date: Date.now(),
                  };
                  this.appendData.push(autoData);
                }
              });
              this.autoCalc = [];
            }
          }
          if (!this.isNumFor2) {
            if (
              this.calcParent2.title.includes("一人当たり") &&
              this.calcParent2.degree === 1
            ) {
              const checkArr = [];
              this.alreadyAutoCalc.forEach((e) => {
                if (
                  e.dat === this.calcParent1.title &&
                  e.ope === this.operator
                ) {
                  checkArr.push(e.key);
                }
              });
              const getArr = this.perPersonData.filter((e) => {
                return e !== this.calcParent2.title && !checkArr.includes(e);
              });
              const auto = async () => {
                let p = Promise.resolve();
                getArr.forEach(async (e) => {
                  p = p
                    .then(() => {
                      const snapshot = getDoc(doc(db, "data", `${e}`));
                      return snapshot;
                    })
                    .then((snapshot) => {
                      this.autoCalc.push(snapshot.data());
                    });
                });
                await p;
              };
              await auto();
              this.autoCalc.forEach((e) => {
                let autoResult = 0;
                switch (postData.parent.operator) {
                  case "+":
                    autoResult = this.num1 + e.latest;
                    break;
                  case "-":
                    autoResult = this.num1 - e.latest;
                    break;
                  case "×":
                    autoResult = this.num1 * e.latest;
                    break;
                  case "÷":
                    autoResult = this.num1 / e.latest;
                    break;
                  default:
                    alert("calcerror");
                }
                let titleFromAuto = e.title.slice(5);
                let removeTitleStr = postData.parent.parent2.data.slice(5);
                let newTitle =
                  postData.title.replace(removeTitleStr, "") + titleFromAuto;
                if (
                  this.data.some((e) => {
                    return e.title !== newTitle;
                  })
                ) {
                  const autoData = {
                    degree: 2,
                    title: newTitle,
                    latest: autoResult,
                    unit: e.unit,
                    parent: {
                      parent1: {
                        data: parentData1,
                        parent: "",
                      },
                      parent2: {
                        data: e.title,
                        parent: "",
                      },
                      operator: postData.parent.operator,
                    },
                    likedCount: 0,
                    date: Date.now(),
                  };
                  this.appendData.push(autoData);
                }
              });
              this.autoCalc = [];
            } else if (
              prefBool(this.calcParent2.title) &&
              prefBool(this.title) &&
              this.calcParent2.degree === 1
            ) {
              const checkArr = [];
              this.alreadyAutoCalc.forEach((e) => {
                if (
                  e.dat === this.calcParent1.title &&
                  e.ope === this.operator
                ) {
                  checkArr.push(e.key);
                }
              });
              let checkChar = this.calcParent1.title.slice(
                this.calcParent2.title.indexOf("の") + 1
              );
              const getArr = this.prefData.filter((e) => {
                return (
                  e !== this.calcParent2.title &&
                  !checkArr.includes(e) &&
                  e.includes(checkChar)
                );
              });
              const auto = async () => {
                let p = Promise.resolve();
                getArr.forEach(async (e) => {
                  p = p
                    .then(() => {
                      const snapshot = getDoc(doc(db, "data", `${e}`));
                      return snapshot;
                    })
                    .then((snapshot) => {
                      this.autoCalc.push(snapshot.data());
                    });
                });
                await p;
              };
              await auto();
              this.autoCalc.forEach((e) => {
                let autoResult = 0;
                // 今回自動計算する県がautoPref、postDataで計算されている県がpostPref
                let autoPref = this.prefectures[prefIndex(e.title)];
                let postPref = this.prefectures[prefIndex(postData.title)];
                switch (postData.parent.operator) {
                  case "+":
                    autoResult = this.num1 + e.latest;
                    break;
                  case "-":
                    autoResult = this.num1 - e.latest;
                    break;
                  case "×":
                    autoResult = this.num1 * e.latest;
                    break;
                  case "÷":
                    autoResult = this.num1 / e.latest;
                    break;
                  default:
                    alert("calcerror");
                }
                let newTitle;
                if (postData.title.includes("県")) {
                  if (autoPref === "東京") {
                    newTitle = postData.title
                      .replace(postPref + "県", autoPref + "都")
                      .replace(postPref, autoPref);
                  } else if (autoPref === "大阪" || autoPref === "京都") {
                    newTitle = postData.title
                      .replace(postPref + "県", autoPref + "府")
                      .replace(postPref, autoPref);
                  } else {
                    newTitle = postData.title.replace(postPref, autoPref);
                  }
                } else if (postData.title.includes("府")) {
                  if (autoPref === "東京") {
                    newTitle = postData.title
                      .replace(postPref + "府", autoPref + "都")
                      .replace(postPref, autoPref);
                  } else if (autoPref === "大阪" || autoPref === "京都") {
                    newTitle = postData.title.replace(postPref, autoPref);
                  } else {
                    newTitle = postData.title
                      .replace(postPref + "府", autoPref + "県")
                      .replace(postPref, autoPref);
                  }
                } else if (postData.title.includes("都")) {
                  if (autoPref === "東京") {
                    newTitle = postData.title.replace(postPref, autoPref);
                  } else if (autoPref === "大阪" || autoPref === "京都") {
                    newTitle = postData.title
                      .replace(postPref + "都", autoPref + "府")
                      .replace(postPref, autoPref);
                  } else {
                    newTitle = postData.title
                      .replace(postPref + "都", autoPref + "けん")
                      .replace(postPref, autoPref);
                  }
                } else {
                  newTitle = postData.title.replace(postPref, autoPref);
                }
                if (
                  this.data.some((ele) => {
                    return ele.title !== newTitle;
                  })
                ) {
                  const autoData = {
                    degree: 2,
                    title: newTitle,
                    latest: autoResult,
                    unit: postData.unit,
                    parent: {
                      parent1: {
                        data: parentData1,
                        parent: "",
                      },
                      parent2: {
                        data: e.title,
                        parent: "",
                      },
                      operator: postData.parent.operator,
                    },
                    likedCount: 0,
                    date: Date.now(),
                  };
                  this.appendData.push(autoData);
                }
              });
              this.autoCalc = [];
            }
          }
          const ref = doc(db, "data", "overView");
          this.appendData.forEach(async (e) => {
            await setDoc(doc(this.commonLef, `${e.title}`), e);
            if (e.parent.parent1.data.includes("一人当たり")) {
              await updateDoc(ref, {
                autoCalc: arrayUnion({
                  dat: `${e.parent.parent2.data}`,
                  ope: `${e.parent.operator}`,
                  key: `${e.parent.parent1.data}`,
                }),
              });
            } else if (e.parent.parent2.data.includes("一人当たり")) {
              await updateDoc(ref, {
                autoCalc: arrayUnion({
                  dat: `${e.parent.parent1.data}`,
                  ope: `${e.parent.operator}`,
                  key: `${e.parent.parent2.data}`,
                }),
              });
            }
            if (prefBool(e.parent.parent1.data)) {
              await updateDoc(ref, {
                autoCalc: arrayUnion({
                  dat: `${e.parent.parent2.data}`,
                  ope: `${e.parent.operator}`,
                  key: `${e.parent.parent1.data}`,
                }),
              });
            } else if (prefBool(e.parent.parent2.data)) {
              await updateDoc(ref, {
                autoCalc: arrayUnion({
                  dat: `${e.parent.parent1.data}`,
                  ope: `${e.parent.operator}`,
                  key: `${e.parent.parent2.data}`,
                }),
              });
            }
            await updateDoc(ref, {
              index: arrayUnion({
                title: e.title,
                degree: e.degree,
              }),
            });
          });
        }
        this.appendData = [];
      },
      showData: function () {
        const search = document.getElementById("search");
        const dataArea = document.getElementById("data-area");
        search.style.display = "none";
        dataArea.style.display = "block";
        const judge = document.getElementById("judge");
        const parentDataBox = document.getElementById("parent-data-box");
        const dataTitle = document.getElementById("data-title");
        const dataNum = document.getElementById("data-num");
        const dataDegree = document.getElementById("data-degree");
        const forPrimary = document.getElementById("for-primary");
        const dataBox = document.getElementById("data-box");
        while (parentDataBox.lastChild) {
          parentDataBox.lastChild.remove();
        }
        judge.style.display = "block";
        while (judge.lastChild) {
          judge.lastChild.remove();
        }
        while (forPrimary.lastChild) {
          forPrimary.lastChild.remove();
        }
        while (dataBox.lastChild) {
          dataBox.lastChild.remove();
        }
        const resultJa = document.createElement("h1");
        this.result = this.showingData.latest;
        this.intResult = Math.round(this.showingData.latest);
        this.digit = this.intResult.toString().length;
        this.digitUnitCoeff = 0;
        if (this.result >= 1000) {
          this.roundDigit = this.digit - 2;
          while (this.digitUnitCoeff < this.digit - 4) {
            this.digitUnitCoeff = this.digitUnitCoeff + 4;
          }
        } else {
          this.roundDigit = this.digit - 3;
        }

        this.round();
        const digitUpButton = document.createElement("button");
        digitUpButton.textContent = "ざっくり度アップ";
        const digitDownButton = document.createElement("button");
        digitDownButton.textContent = "正確度アップ";
        digitUpButton.onclick = () => {
          if (this.roundDigit <= this.digit - 2) {
            this.roundDigit = this.roundDigit + 1;
            this.round();
            resultJa.textContent = this.roundedResult + this.showingData.unit;
          } else {
            alert("これ以上ざっくり度を上げられません。");
          }
        };
        digitDownButton.onclick = () => {
          if (this.result >= 1000) {
            if (this.roundDigit >= 1) {
              this.roundDigit = this.roundDigit - 1;
              this.round();
              resultJa.textContent = this.roundedResult + this.showingData.unit;
            } else {
              alert("これ以上正確度を上げられません。");
            }
          } else {
            if (
              this.roundDigit >
              this.intResult.toString().length -
                this.result.toString().length +
                1
            ) {
              this.roundDigit = this.roundDigit - 1;
              this.round();
              resultJa.textContent = this.roundedResult + this.showingData.unit;
            } else {
              alert("これ以上正確度を上げられません。");
            }
          }
        };
        resultJa.textContent = this.roundedResult + this.showingData.unit;
        dataTitle.textContent = this.showingData.title;
        dataNum.textContent = this.showingData.latest;
        dataDegree.textContent = this.showingData.degree;

        if (
          (this.result < 100 &&
            this.result.toString().split(".")[1].length === 1) ||
          (this.result < 10 && this.result.toString().split(".")[1].length < 3)
        ) {
          dataBox.append(resultJa);
        } else {
          dataBox.append(resultJa, digitUpButton, digitDownButton);
        }
        if (this.showingData.degree > 1) {
          const goodButton = document.createElement("div");
          goodButton.textContent = "正しいと思う";
          const badButton = document.createElement("div");
          badButton.textContent = "正しくないと思う";
          goodButton.onclick = async () => {
            judge.style.display = "none";
            const ref = doc(db, "data", `${this.showingData.title}`);
            await updateDoc(ref, {
              likedCount: increment(1),
            });
          };
          badButton.onclick = async () => {
            judge.style.display = "none";
            const ref = doc(db, "data", `${this.showingData.title}`);
            await updateDoc(ref, {
              likedCount: increment(-1),
            });
          };
          judge.append(goodButton, badButton);
        }
        if (this.showingData.degree === 1) {
          const title = document.createElement("h2");
          title.textContent = "データの年次：" + this.showingData.year + "年";
          const refLink = document.createElement("a");
          refLink.innerText = "出典はこちら";
          refLink.href = `${this.showingData.ref}`;
          refLink.target = "_blank";
          const copyButton = document.createElement("button");
          copyButton.textContent = "出典先のリンクをコピー";
          copyButton.onclick = () => {
            if (!navigator.clipboard) {
              alert("申し訳ありませんがこのブラウザでは対応していません");
            } else {
              navigator.clipboard.writeText(this.showingData.ref).then(
                () => {
                  alert("出典先のリンクをコピーしました。");
                },
                () => {
                  alert("コピーに失敗しました。");
                }
              );
            }
          };
          forPrimary.append(title, refLink, copyButton);
        }
        if ("parent1" in this.showingData.parent) {
          if ("parent3" in this.showingData.parent) {
            let parent1Title = this.showingData.parent.parent1.data;
            let parent2Title = this.showingData.parent.parent2.data;
            let parent3Title = this.showingData.parent.parent3.data;
            let parentOpe = this.showingData.parent.operator;
            let parentOpe2 = this.showingData.parent.operator2;
            const parentData1 = document.createElement("h3");
            const parentOperator = document.createElement("h3");
            const parentData2 = document.createElement("h3");
            const parentOperator2 = document.createElement("h3");
            const parentData3 = document.createElement("h3");
            parentData1.textContent = parent1Title;
            parentOperator.textContent = parentOpe;
            parentData2.textContent = parent2Title;
            parentOperator2.textContent = parentOpe2;
            parentData3.textContent = parent3Title;
            parentData1.onclick = async () => {
              const snapshot = await getDoc(doc(db, "data", `${parent1Title}`));
              this.showingData = snapshot.data();
              this.showData();
            };
            parentData2.onclick = async () => {
              const snapshot = await getDoc(doc(db, "data", `${parent2Title}`));
              this.showingData = snapshot.data();
              this.showData();
            };
            parentData3.onclick = async () => {
              const snapshot = await getDoc(doc(db, "data", `${parent3Title}`));
              this.showingData = snapshot.data();
              this.showData();
            };
            parentDataBox.append(
              parentData1,
              parentOperator,
              parentData2,
              parentOperator2,
              parentData3
            );
          } else {
            let parent1Title = this.showingData.parent.parent1.data;
            let parent2Title = this.showingData.parent.parent2.data;
            let parentOpe = this.showingData.parent.operator;
            const parentData1 = document.createElement("h3");
            const parentOperator = document.createElement("h3");
            const parentData2 = document.createElement("h3");
            parentData1.textContent = parent1Title;
            parentOperator.textContent = parentOpe;
            parentData2.textContent = parent2Title;
            parentData1.onclick = async () => {
              const snapshot = await getDoc(doc(db, "data", `${parent1Title}`));
              this.showingData = snapshot.data();
              this.showData();
            };
            parentData2.onclick = async () => {
              const snapshot = await getDoc(doc(db, "data", `${parent2Title}`));
              this.showingData = snapshot.data();
              this.showData();
            };
            parentDataBox.append(parentData1, parentOperator, parentData2);
          }
        }
      },
      searchStart: function () {
        const search = document.getElementById("search");
        const dataArea = document.getElementById("data-area");
        search.style.display = "block";
        dataArea.style.display = "none";
        if (!this.alreadySearchStart) {
          const searchResultBox = document.getElementById("search-result-box");
          this.data.forEach((e) => {
            const resultCard = document.createElement("option");
            resultCard.textContent = `(${e.degree})`;
            resultCard.value = e.title;
            searchResultBox.append(resultCard);
          });
        }
      }.bind(this),
      moveToDB: async function () {
        this.isGuess = false;
        this.guesser = "none";
        this.viewer = "block";
        await this.start();
        this.searchStart();
        this.alreadySearchStart = true;
      },
      goSort: () => {
        const searchResultBox = document.getElementById("search-result-box");
        while (searchResultBox.lastChild) {
          searchResultBox.lastChild.remove();
        }
        this.sortData.forEach((e) => {
          const resultCard = document.createElement("option");
          resultCard.textContent = `(${e.degree})`;
          resultCard.value = e.title;
          searchResultBox.append(resultCard);
        });
      },
      goHelp: () => {
        const helpBoxes = document.querySelectorAll(".help-box");
        const helps = document.querySelectorAll(".help");
        if (helps[this.helpDeleteIndex] && helpBoxes[this.helpDeleteIndex]) {
          const changeBox = helpBoxes[this.helpDeleteIndex];
          const deleteCard = helps[this.helpDeleteIndex];
          deleteCard.style.display = "none";
          deleteCard.style.opacity = 0;
          deleteCard.style.zIndex = -1;
          changeBox.style.zIndex = 0;
        }
        const changebox = helpBoxes[this.helpIndex];
        const card = helps[this.helpIndex];
        card.style.display = "block";
        card.style.opacity = 1;
        card.style.zIndex = 2;
        changebox.style.zIndex = 2;
      },
    };
  },
  methods: {
    addData() {
      const dataNumberButton = document.getElementById("data-number-button");
      if (this.howManyData === 2) {
        this.thirdData = "";
        this.operator2 = "";
        this.howManyData = 3;
        dataNumberButton.textContent = "データの数を減らす";
      } else {
        this.howManyData = 2;
        dataNumberButton.textContent = "データの数を増やす";
      }

      //複数データ追加の場合↓
      // this.howManyData = this.howManyData + 1;
      // const calcDataArea = document.getElementById("calc-data-area");
      // const box = document.createElement("div");
      // const newSelect = document.createElement("select");
      // newSelect.name = "post-particle";
      // newSelect.id = `operator${this.howManyData}`;
      // newSelect.onchange = this.changeDisc();
      // let opeArr = ["+", "-", "-", "÷"];
      // opeArr.forEach((e) => {
      //   const ope = document.createElement("option");
      //   ope.textContent = e;
      //   ope.value = e;
      //   newSelect.append(ope);
      // });
      // const newDataList = document.createElement("datalist");
      // newDataList.id = `data${this.howManyData}`;
      // this.data.forEach((e) => {
      //   const option = document.createElement("option");
      //   option.value = e.title;
      //   option.textContent = e.title;
      //   newDataList.append(option);
      // });
      // const newInput = document.createElement("input");
      // newInput.type = "text";
      // newInput.autocomplete = "on";
      // newInput.setAttribute("list", `data${this.howManyData}`);
      // newInput.id = `data-input-${this.howManyData}`;
      // newInput.onchange = this.changeDisc();
      // const newButton = document.createElement("button");
      // newButton.textContent = "数値を入力する";
      // newButton.onclick = () => {
      //   newInput.value = "";
      //   if (newInput.type === "text") {
      //     while (newDataList.lastChild) {
      //       newDataList.lastChild.remove();
      //     }
      //     newInput.type = "number";
      //     newButton.textContent = "データを選択する";
      //   } else {
      //     this.data.forEach((e) => {
      //       const option = document.createElement("option");
      //       option.value = e.title;
      //       option.textContent = e.title;
      //       newDataList.append(option);
      //     });
      //     newInput.type = "text";
      //     newButton.textContent = "数値を入力する";
      //   }
      // };
      // box.append(newSelect, newInput, newDataList, newButton);
      // calcDataArea.appendChild(box);
      // const dataDecrease = document.createElement("button");
      // dataDecrease.id = "decrease-button";
      // dataDecrease.textContent = "データの数を減らす";
      // dataDecrease.onclick = () => {
      //   if (calcDataArea.childElementCount >= 5) {
      //     this.howManyData = this.howManyData - 1;
      //     calcDataArea.lastChild.remove();
      //     if (calcDataArea.childElementCount === 4) {
      //       const buttonArea = document.getElementById("button-area");
      //       buttonArea.lastChild.remove();
      //     }
      //   }
      // };
      // if (document.getElementById("decrease-button") == null) {
      //   const buttonArea = document.getElementById("button-area");
      //   buttonArea.appendChild(dataDecrease);
      // }
    },
    thirdStart() {
      const data3 = document.getElementById("data3");
      this.data.forEach((e) => {
        const option = document.createElement("option");
        option.value = e.title;
        option.textContent = e.title;
        data3.append(option);
      });
      this.alreadyThirdStarted = true;
    },
    numChangeForF() {
      this.firstData = "";
      const firstDataInput = document.getElementById("data-input-1");
      const numChangeButtonForF = document.getElementById(
        "num-change-button-forf"
      );
      if (firstDataInput.type === "text") {
        const datalist = document.getElementById("data1");
        while (datalist.lastChild) {
          datalist.lastChild.remove();
        }
        firstDataInput.type = "number";
        numChangeButtonForF.textContent = "データを選択する";
      } else {
        const datalist = document.getElementById("data1");
        this.data.forEach((e) => {
          const optionFor1 = document.createElement("option");
          optionFor1.value = e.title;
          optionFor1.textContent = e.title;
          datalist.append(optionFor1);
        });
        firstDataInput.type = "text";
        numChangeButtonForF.textContent = "数値を入力する";
      }
    },
    numChangeForS() {
      this.secondData = "";
      const secondDataInput = document.getElementById("data-input-2");
      const numChangeButtonForS = document.getElementById(
        "num-change-button-fors"
      );
      if (secondDataInput.type === "text") {
        const datalist = document.getElementById("data2");
        while (datalist.lastChild) {
          datalist.lastChild.remove();
        }
        secondDataInput.type = "number";
        numChangeButtonForS.textContent = "データを選択する";
      } else {
        const datalist = document.getElementById("data2");
        this.data.forEach((e) => {
          const optionFor2 = document.createElement("option");
          optionFor2.value = e.title;
          optionFor2.textContent = e.title;
          datalist.append(optionFor2);
        });
        secondDataInput.type = "text";
        numChangeButtonForS.textContent = "数値を入力する";
      }
    },
    numChangeForT() {
      this.thirdData = "";
      const thirdDataInput = document.getElementById("data-input-3");
      const numChangeButtonForT = document.getElementById(
        "num-change-button-fort"
      );
      if (thirdDataInput.type === "text") {
        const datalist = document.getElementById("data3");
        while (datalist.lastChild) {
          datalist.lastChild.remove();
        }
        thirdDataInput.type = "number";
        numChangeButtonForT.textContent = "データを選択する";
      } else {
        const datalist = document.getElementById("data3");
        this.data.forEach((e) => {
          const optionFor3 = document.createElement("option");
          optionFor3.value = e.title;
          optionFor3.textContent = e.title;
          datalist.append(optionFor3);
        });
        thirdDataInput.type = "text";
        numChangeButtonForT.textContent = "数値を入力する";
      }
    },
    async calc() {
      let additionalData = () => {
        if (this.howManyData >= 3) {
          return this.thirdData === "" && this.operator2 === "";
        } else {
          return false;
        }
      };
      if (
        this.title == "" ||
        this.firstData == "-" ||
        this.firstData == "" ||
        this.operator == "" ||
        additionalData() ||
        this.secondData == "-" ||
        this.secondData == "" ||
        this.unit == ""
      ) {
        alert("未入力の部分があります");
      } else {
        const firstDataInput = document.getElementById("data-input-1");
        const secondDataInput = document.getElementById("data-input-2");
        if (firstDataInput.type === "text") {
          const d1 = await getDoc(doc(db, "data", `${this.firstData}`));
          this.calcParent1 = d1.data();
          this.num1 = this.calcParent1.latest;
        } else if (firstDataInput.type === "number") {
          this.num1 = Number(this.firstData);
          this.isNumFor1 = true;
        } else {
          alert("type1error");
        }
        if (secondDataInput.type === "text") {
          const d2 = await getDoc(doc(db, "data", `${this.secondData}`));
          this.calcParent2 = d2.data();
          this.num2 = this.calcParent2.latest;
        } else if (secondDataInput.type === "number") {
          this.num2 = Number(this.secondData);
          this.isNumFor2 = true;
        } else {
          alert("type2error");
        }
        switch (this.operator) {
          case "+":
            this.result = this.num1 + this.num2;
            break;
          case "-":
            this.result = this.num1 - this.num2;
            break;
          case "×":
            this.result = this.num1 * this.num2;
            break;
          case "÷":
            this.result = this.num1 / this.num2;
            break;
          default:
            alert("calcerror");
        }
        if (this.howManyData === 3) {
          const thirdDataInput = document.getElementById("data-input-3");
          if (thirdDataInput.type === "text") {
            const d3 = await getDoc(doc(db, "data", `${this.thirdData}`));
            this.calcParent3 = d3.data();
            this.num3 = this.calcParent3.latest;
          } else if (thirdDataInput.type === "number") {
            this.num3 = Number(this.thirdData);
            this.isNumFor3 = true;
          } else {
            alert("type3error");
          }
          switch (this.operator) {
            case "+":
              this.result = this.result + this.num2;
              break;
            case "-":
              this.result = this.result - this.num2;
              break;
            case "×":
              this.result = this.result * this.num2;
              break;
            case "÷":
              this.result = this.result / this.num2;
              break;
            default:
              alert("calcerror");
          }
        }
        let isChecked = false;
        const checkQ = query(
          this.commonLef,
          where("latest", "==", this.result)
        );
        const checkD = await getDocs(checkQ);
        if (this.howManyData === 2) {
          checkD.forEach(async (e) => {
            if (
              (e.data().parent.parent1.data === this.firstData &&
                e.data().parent.parent2.data === this.secondData) ||
              (e.data().parent.parent2.data === this.firstData &&
                e.data().parent.parent1.data === this.secondData)
            ) {
              this.showingData = e.data();
              this.isGuess = false;
              this.guesser = "none";
              this.viewer = "block";
              isChecked = true;
              await this.start();
              this.showData();
              alert("既にデータがあります。");
            }
          });
        } else {
          checkD.forEach(async (e) => {
            if (e.data().parent.parent3.data !== undefined) {
              let checkParentArr = [
                e.data().parent.parent1.data,
                e.data().parent.parent2.data,
                e.data().parent.parent3.data,
              ];
              let thisParentArr = [
                this.calcParent1,
                this.calcParent2,
                this.calcParent3,
              ];
              thisParentArr = thisParentArr.filter((e) => {
                return checkParentArr.some((ele) => {
                  return ele !== e;
                });
              });
              if (thisParentArr === []) {
                this.showingData = e.data();
                this.isGuess = false;
                this.guesser = "none";
                this.viewer = "block";
                isChecked = true;
                await this.start();
                this.showData();
                alert("既にデータがあります。");
              }
            }
          });
        }
        if (!isChecked) {
          this.intResult = Math.round(this.result);
          this.digit = this.intResult.toString().length;
          if (this.result >= 1000) {
            this.roundDigit = this.digit - 2;
            while (this.digitUnitCoeff < this.digit - 4) {
              this.digitUnitCoeff = this.digitUnitCoeff + 4;
            }
          } else {
            this.roundDigit = this.digit - 3;
          }

          this.round();
          const resultBox = document.getElementById("result-box");
          const resultArea = document.getElementById("result-area");
          const guessBox = document.getElementById("guess-box");
          resultArea.style.display = "block";
          guessBox.style.display = "none";
          const resultJa = document.createElement("h1");
          const resultNum = document.createElement("h5");
          const digitUpButton = document.createElement("button");
          digitUpButton.textContent = "ざっくり度アップ";
          const digitDownButton = document.createElement("button");
          digitDownButton.textContent = "正確度アップ";
          digitUpButton.onclick = () => {
            if (this.roundDigit <= this.digit - 2) {
              this.roundDigit = this.roundDigit + 1;
              this.round();
              resultJa.textContent = this.roundedResult + this.unit;
            } else {
              alert("これ以上ざっくり度を上げられません。");
            }
          };
          digitDownButton.onclick = () => {
            if (
              this.roundDigit >=
              this.intResult.toString().length - this.result.toString().length
            ) {
              this.roundDigit = this.roundDigit - 1;
              this.round();
              resultJa.textContent = this.roundedResult + this.unit;
            } else {
              alert("これ以上正確度を上げられません。");
            }
          };
          resultJa.textContent = this.roundedResult + this.unit;
          resultNum.textContent = this.result;
          resultBox.append(resultJa, resultNum, digitUpButton, digitDownButton);
          this.dataPost();
        }
      }
    },
    next() {
      const resultBox = document.getElementById("result-box");
      const resultArea = document.getElementById("result-area");
      const guessBox = document.getElementById("guess-box");
      resultArea.style.display = "none";
      guessBox.style.display = "block";
      while (resultBox.lastChild) {
        resultBox.removeChild(resultBox.lastChild);
      }
      this.num1 = "";
      this.num2 = "";
      this.num3 = "";
      this.calcParent1 = "";
      this.calcParent2 = "";
      this.calcParent3 = "";
      this.operator = "";
      this.operator2 = "";
      this.howManyData = 2;
      this.result = "";
      this.roundedResult = "";
      this.isNumFor1 = false;
      this.isNumFor2 = false;
      this.isNumFor3 = false;
      this.title = "";
      this.unit = "";
      this.firstData = "";
      this.secondData = "";
      this.thirdData = "";
      this.discription = "";
      this.intResult = 0;
      this.digit = 0;
      this.roundDigit = 0;
      this.digitUnitCoeff = 0;
      this.searchText = "";
    },
    async getData() {
      if (this.searchText !== "") {
        const snapshot = await getDoc(doc(db, "data", `${this.searchText}`));
        this.showingData = snapshot.data();
        this.searchText = "";
        this.showData();
      } else {
        alert("データを選択してください");
      }
    },
    textDelete() {
      this.searchText = "";
    },
    goKeywordSort() {
      const sortBox = document.getElementById("sort-box");
      this.sortCondition.push(this.sortKeyword);
      this.sortData = this.data;
      this.sortCondition.forEach((e) => {
        this.sortData = this.sortData.filter((ele) => {
          return ele.title.includes(e);
        });
      });
      this.goSort();
      const container = document.createElement("div");
      const sortName = document.createElement("h3");
      const sortDeleteButton = document.createElement("button");
      sortName.textContent = this.sortKeyword;
      sortDeleteButton.textContent = "絞り込みを解除";
      sortDeleteButton.onclick = () => {
        let deleteEle = sortName.textContent;
        this.sortCondition = this.sortCondition.filter((e) => {
          return e !== deleteEle;
        });
        this.sortData = this.data;
        this.sortCondition.forEach((e) => {
          this.sortData = this.sortData.filter((ele) => {
            return ele.title.includes(e);
          });
        });
        this.goSort();
        while (container.lastChild) {
          container.lastChild.remove();
        }
      };
      this.sortKeyword = "";
      container.append(sortName, sortDeleteButton);
      sortBox.appendChild(container);
    },
    goGenreSort() {
      let prefBool = (e) => {
        return this.prefectures.some((ele) => {
          return e.includes(ele);
        });
      };
      switch (this.sortGenre) {
        case "pref":
          this.sortData = this.data.filter((e) => {
            return prefBool(e.title);
          });
          this.goSort();
          break;

        case "population":
          this.sortData = this.data.filter((e) => {
            return e.title.includes("人口データ");
          });
          this.goSort();
          break;

        case "per":
          this.sortData = this.data.filter((e) => {
            return e.title.includes("一人当たり");
          });
          this.goSort();
          break;

        default:
          alert("error");
      }
    },
    sortInit() {
      const sortBox = document.getElementById("sort-box");
      const searchResultBox = document.getElementById("search-result-box");
      while (sortBox.lastChild) {
        sortBox.lastChild.remove();
      }
      while (searchResultBox.lastChild) {
        searchResultBox.lastChild.remove();
      }
      this.searchText = "";
      this.data.forEach((e) => {
        const resultCard = document.createElement("option");
        resultCard.textContent = `(${e.degree})`;
        resultCard.value = e.title;
        searchResultBox.append(resultCard);
      });
    },
    helpOpe() {
      if (this.isGuess) {
        switch (this.helpIndex) {
          case 0:
            this.title = "秋田県の二酸化炭素排出量";
            break;
          case 2:
            this.firstData = "秋田県の人口データ";
            break;
          case 3:
            this.operator = "×";
            break;
          case 4:
            this.secondData = "一人当たり二酸化炭素排出量";
            break;
          case 5:
            this.unit = "キログラム";
            break;
        }
      }
    },
    test_auto() {
      this.title = "秋田県の二酸化炭素排出量";
      this.firstData = "秋田県の人口データ";
      this.operator = "×";
      this.secondData = "一人当たり二酸化炭素排出量";
      this.unit = "キログラム";
    },
    goDev() {
      this.$router.push("/database");
    },
    change() {
      if (this.isGuess) {
        if (!this.alreadySearchStart) {
          this.moveToDB();
        } else {
          this.isGuess = !this.isGuess;
          this.guesser = "none";
          this.viewer = "block";
        }
      } else {
        if (!this.isAlreadyStarted) {
          this.start();
        } else {
          this.isGuess = !this.isGuess;
          this.guesser = "block";
          this.viewer = "none";
        }
      }
    },
    help() {
      const helpShadow = document.querySelector(".help-shadow");
      if (!this.ishelp) {
        helpShadow.style.zIndex = 1;
        helpShadow.style.opacity = 0.7;
        this.ishelp = !this.ishelp;
        if (!this.isGuess) {
          this.helpIndex = 8;
        } else {
          this.helpIndex = 0;
        }
        this.goHelp();
      } else {
        helpShadow.style.zIndex = -1;
        helpShadow.style.opacity = 0;
        let helpBoxes = document.querySelectorAll(".help-box");
        let helps = document.querySelectorAll(".help");
        let changeBox = helpBoxes[this.helpIndex];
        let deleteCard = helps[this.helpIndex];
        changeBox.style.zIndex = 0;
        deleteCard.style.display = "none";
        deleteCard.style.opacity = 0;
        deleteCard.style.zIndex = -1;
        this.helpIndex = 0;
        this.helpDeleteIndex = -1;
        this.ishelp = !this.ishelp;
      }
    },
    nextHelp() {
      this.helpDeleteIndex = this.helpIndex;
      this.helpIndex = this.helpIndex + 1;
      this.goHelp();
    },
    prevHelp() {
      this.helpDeleteIndex = this.helpIndex;
      this.helpIndex = this.helpIndex - 1;
      this.goHelp();
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@200;700&display=swap");

/* アップバー */
.app-bar {
  height: 15vh;
  background-color: #aeaeae;
}
.help-button {
  position: relative;
  z-index: 2;
}

/* ボディ */
.body {
  display: flex;
}

/* スタート */
.start {
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  z-index: 10;
  background-color: white;
}
.start.hidden {
  z-index: -1;
}
.start-background-text {
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #cccccc, #7aaecc);
}
.start-background-text h1 {
  display: inline-block;
  font-weight: 700;
  font-size: 35vw;
  color: #ffff00;
}
.start-front-content {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.start-foreground-text {
  width: 100vw;
  height: 45vh;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.start-foreground-text h1 {
  letter-spacing: 1vw;
  font-weight: 700;
  font-size: 15vw;
  position: absolute;
  left: 50px;
  bottom: 0px;
  font-style: italic;
  color: #000;
}
.lineArrow {
  position: fixed;
  top: calc(45vh - 2vw);
  left: 50px;
  width: 65vw;
  height: 2vw;
  border-bottom: 1vw solid #000;
  border-right: 1.4vw solid #000;
  /*傾きを調節*/
  transform: skew(45deg);
  margin: -10px 0 0 -25px;
}
.start-button-box {
  width: 30vw;
  height: 14vw;
  border: 5px solid;
  line-height: 1;
  box-shadow: 0.5vw 0.5vw 1vw #333;
}
.start-button-box h1 {
  font-size: 5vw;
  margin-top: 2vw;
  margin-left: 3vw;
  text-align: left;
}
.start-button-box h3 {
  font-size: 3vw;
  font-style: italic;
  margin-bottom: 1vw;
  margin-top: 2vw;
  margin-right: 2vw;
  text-align: right;
}
.start-button-area {
  width: 100vw;
  height: 45vh;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.line-arrow-in-box {
  top: 0;
  width: 26vw;
  height: 1vw;
  border-bottom: 0.5vw solid #000;
  border-right: 0.8vw solid #000;
  /*傾きを調節*/
  transform: skew(45deg);
  margin-left: 1.5vw;
}

/* メイン */
.main {
  background-color: #cecece;
  height: 85vh;
  width: 80vw;
}

#result-area {
  display: none;
}

/* ヘルプ関連 */
.help-shadow {
  background-color: #333333;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  transition-duration: 1s;
}
.help-box {
  position: relative;
  z-index: 0;
}
.help {
  display: none;
  position: relative;
  background-color: #dddddd;
  opacity: 0;
  z-index: -1;
  transition-duration: 1s;
}

.data-area {
  display: none;
}

/* サイド */
.side-bar {
  background-color: #bebebe;
  height: 85vh;
  width: 20vw;
}
.favorite-post {
  background-color: #bebeff;
  height: 40vh;
}
.ad {
  background-color: #beffbe;
  height: 15vh;
}
.new-post {
  background-color: #ffbebe;
  height: 30vh;
}
</style>
