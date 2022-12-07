<template>
  <appBarVue />
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
      <button @click.once="start" :style="{ disabled: isAlreadyStarted }">
        データを推測する
      </button>
      <button @click="goDB">データを閲覧する</button>
    </div>
    <div class="main" v-if="isGuess">
      <button @click="test_auto">自動</button>
      <div class="title-area">
        <h3>推測テーマ</h3>
        <input
          type="text"
          name="title"
          v-model="title"
          @change="changeDisc()"
        />
        <h3>テーマのよみがな(平仮名)</h3>
        <input type="text" v-model="kana" @keyup="isKana" />
      </div>
      <div class="calc-area">
        <h3>使用データ</h3>
        <input
          type="text"
          autocomplete="on"
          list="data1"
          id="first-data-input"
          v-model="firstData"
          @change="changeDisc()"
        />
        <datalist id="data1"> </datalist>
        <button id="num-change-button-forf" @click="numChangeForF">
          数値を入力する
        </button>
        <select name="post-particle" v-model="operator" @change="changeDisc()">
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="×">×</option>
          <option value="÷">÷</option>
        </select>
        <input
          type="text"
          autocomplete="on"
          list="data2"
          id="second-data-input"
          v-model="secondData"
          @change="changeDisc()"
        />
        <datalist id="data2"> </datalist>
        <button id="num-change-button-fors" @click="numChangeForS">
          数値を入力する
        </button>
        <h4>単位</h4>
        <input type="text" v-model="unit" />
      </div>
      <div class="discription-area">
        <h3>推測の根拠</h3>
        <h3>{{ title }}は{{ discription }}であると考えられる。</h3>
      </div>
      <div>
        <button @click="calc">計算</button>
      </div>
      <div class="result-area" id="result-box">
        <h3>推測結果</h3>
      </div>
      <button @click="next">次へ</button>
    </div>
    <div class="main" v-else>
      <div class="search" id="search">
        <h2>データベース</h2>
        <h3>検索</h3>
        <input
          type="text"
          v-model="searchText"
          autocomplete="on"
          list="search-result-box"
        />
        <datalist id="search-result-box"></datalist>
        <button @click="textDelete">削除</button>
        <button @click="showData">表示</button>
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
        <button @click="goSearch">戻る</button>
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
import appBarVue from "@/components/AppBar.vue";

export default {
  data() {
    return {
      isGuess: true,
      commonLef: collection(db, "data"),
      num1: "",
      num2: "",
      calcParent1: "",
      calcParent2: "",
      operator: "",
      result: "",
      roundedResult: "",
      isAlreadyStarted: false,
      index1: 0,
      isNumFor1: false,
      index2: 0,
      isNumFor2: false,
      data: [],
      alreadyAutoCalc: [],
      autoCalc: [],
      perPersonData: [],
      prefData: [],
      appendData: [],
      title: "",
      kana: "",
      unit: "",
      firstData: "",
      secondData: "",
      discription: "",
      intResult: 0,
      digit: 0,
      roundDigit: 0,
      digitUnitCoeff: 0,
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
      prefecturesKana: [
        "ほっかいどう",
        "あおもり",
        "いわて",
        "みやぎ",
        "あきた",
        "やまがた",
        "ふくしま",
        "いばらき",
        "とちぎ",
        "ぐんま",
        "さいたま",
        "ちば",
        "とうきょう",
        "かながわ",
        "にいがた",
        "とやま",
        "いしかわ",
        "ふくい",
        "やまなし",
        "ながの",
        "ぎふ",
        "しずおか",
        "あいち",
        "みえ",
        "しが",
        "きょうと",
        "おおさか",
        "ひょうご",
        "なら",
        "わかやま",
        "とっとり",
        "しまね",
        "おかやま",
        "ひろしま",
        "やまぐち",
        "とくしま",
        "かがわ",
        "えひめ",
        "こうち",
        "ふくおか",
        "さが",
        "ながさき",
        "くまもと",
        "おおいた",
        "みやざき",
        "かごしま",
        "おきなわ",
      ],
      alreadyGoSearch: false,
      changeDisc: function () {
        switch (this.operator) {
          case "+":
            this.discription =
              this.firstData + "に" + this.secondData + "を足したもの";
            break;
          case "-":
            this.discription =
              this.firstData + "から" + this.secondData + "を引いたもの";
            break;
          case "×":
            this.discription =
              this.firstData + "に" + this.secondData + "をかけたもの";
            break;
          case "÷":
            this.discription =
              this.firstData + "を" + this.secondData + "で割ったもの";
            break;
          default:
            this.discription = "";
        }
      },
      async start() {
        if (this.data.length === 0) {
          const start = document.getElementById("start");
          start.classList.add("hidden");
          this.isAlreadyStarted = true;
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
              optionFor1.textContent = optionFor2.textContent = e.title;
              data1.append(optionFor1);
              data2.append(optionFor2);
            });
          }
          this.showGuess();
        }
      },
      round: function () {
        if (this.intResult >= 100) {
          this.roundedResult =
            Math.round(this.intResult / 10 ** this.roundDigit) *
            10 ** this.roundDigit;
        } else {
          if (this.result.toString().length >= 5) {
            this.roundedResult =
              Math.round(this.result / 10 ** this.roundDigit) *
              10 ** this.roundDigit;
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
          kana: this.kana,
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
        let prefIndexKana = (e) => {
          return this.prefecturesKana.findIndex((ele) => {
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
              if (e.dat === this.calcParent2.title && e.ope === this.operator) {
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
              let kanaFromAuto = e.kana.slice(6);
              let kanaIndex = this.data.findIndex((e) => {
                return e.title === postData.parent.parent1.data;
              });
              let removeKanaStr = this.data[kanaIndex].kana.slice(6);
              let newKana =
                postData.kana.replace(removeKanaStr, "") + kanaFromAuto;
              if (
                this.data.some((e) => {
                  return e.title !== newTitle;
                })
              ) {
                const autoData = {
                  degree: 2,
                  title: newTitle,
                  kana: newKana,
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
              if (e.dat === this.calcParent2.title && e.ope === this.operator) {
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
              let autoPrefKana = this.prefecturesKana[prefIndexKana(e.kana)];
              let postPref = this.prefectures[prefIndex(postData.title)];
              let postPrefKana =
                this.prefecturesKana[prefIndexKana(postData.kana)];
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
              let newKana;
              if (postData.title.includes("県")) {
                if (autoPref === "東京") {
                  newTitle = postData.title
                    .replace(postPref + "県", autoPref + "都")
                    .replace(postPref, autoPref);
                  newKana = postData.kana
                    .replace(postPrefKana + "けん", autoPrefKana + "都")
                    .replace(postPrefKana, autoPrefKana);
                } else if (autoPref === "大阪" || autoPref === "京都") {
                  newTitle = postData.title
                    .replace(postPref + "県", autoPref + "府")
                    .replace(postPref, autoPref);
                  newKana = postData.kana
                    .replace(postPrefKana + "けん", autoPrefKana + "ふ")
                    .replace(postPrefKana, autoPrefKana);
                } else {
                  newTitle = postData.title.replace(postPref, autoPref);
                  newKana = postData.kana.replace(postPrefKana, autoPrefKana);
                }
              } else if (postData.title.includes("府")) {
                if (autoPref === "東京") {
                  newTitle = postData.title
                    .replace(postPref + "府", autoPref + "都")
                    .replace(postPref, autoPref);
                  newKana = postData.kana
                    .replace(postPrefKana + "ふ", autoPrefKana + "と")
                    .replace(postPrefKana, autoPrefKana);
                } else if (autoPref === "大阪" || autoPref === "京都") {
                  newTitle = postData.title.replace(postPref, autoPref);
                  newKana = postData.kana.replace(postPrefKana, autoPrefKana);
                } else {
                  newTitle = postData.title
                    .replace(postPref + "府", autoPref + "県")
                    .replace(postPref, autoPref);
                  newKana = postData.kana
                    .replace(postPrefKana + "ふ", autoPrefKana + "けん")
                    .replace(postPrefKana, autoPrefKana);
                }
              } else if (postData.title.includes("都")) {
                if (autoPref === "東京") {
                  newTitle = postData.title.replace(postPref, autoPref);
                  newKana = postData.kana.replace(postPrefKana, autoPrefKana);
                } else if (autoPref === "大阪" || autoPref === "京都") {
                  newTitle = postData.title
                    .replace(postPref + "都", autoPref + "府")
                    .replace(postPref, autoPref);
                  newKana = postData.kana
                    .replace(postPrefKana + "と", autoPrefKana + "ふ")
                    .replace(postPrefKana, autoPrefKana);
                } else {
                  newTitle = postData.title
                    .replace(postPref + "都", autoPref + "けん")
                    .replace(postPref, autoPref);
                  newKana = postData.kana
                    .replace(postPrefKana + "と", autoPrefKana + "けん")
                    .replace(postPrefKana, autoPrefKana);
                }
              } else {
                newTitle = postData.title.replace(postPref, autoPref);
                newKana = postData.kana.replace(postPrefKana, autoPrefKana);
              }
              if (
                this.data.some((ele) => {
                  return ele.title !== newTitle;
                })
              ) {
                const autoData = {
                  degree: 2,
                  title: newTitle,
                  kana: newKana,
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
              if (e.dat === this.calcParent1.title && e.ope === this.operator) {
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
              let kanaFromAuto = e.kana.slice(6);
              let kanaIndex = this.data.findIndex((e) => {
                return e.title === postData.parent.parent2.data;
              });
              let removeKanaStr = this.data[kanaIndex].kana.slice(6);
              let newKana =
                postData.kana.replace(removeKanaStr, "") + kanaFromAuto;
              if (
                this.data.some((e) => {
                  return e.title !== newTitle;
                })
              ) {
                const autoData = {
                  degree: 2,
                  title: newTitle,
                  kana: newKana,
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
              if (e.dat === this.calcParent1.title && e.ope === this.operator) {
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
              let autoPrefKana = this.prefecturesKana[prefIndexKana(e.kana)];
              let postPref = this.prefectures[prefIndex(postData.title)];
              let postPrefKana =
                this.prefecturesKana[prefIndexKana(postData.kana)];
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
              let newKana;
              if (postData.title.includes("県")) {
                if (autoPref === "東京") {
                  newTitle = postData.title
                    .replace(postPref + "県", autoPref + "都")
                    .replace(postPref, autoPref);
                  newKana = postData.kana
                    .replace(postPrefKana + "けん", autoPrefKana + "都")
                    .replace(postPrefKana, autoPrefKana);
                } else if (autoPref === "大阪" || autoPref === "京都") {
                  newTitle = postData.title
                    .replace(postPref + "県", autoPref + "府")
                    .replace(postPref, autoPref);
                  newKana = postData.kana
                    .replace(postPrefKana + "けん", autoPrefKana + "ふ")
                    .replace(postPrefKana, autoPrefKana);
                } else {
                  newTitle = postData.title.replace(postPref, autoPref);
                  newKana = postData.kana.replace(postPrefKana, autoPrefKana);
                }
              } else if (postData.title.includes("府")) {
                if (autoPref === "東京") {
                  newTitle = postData.title
                    .replace(postPref + "府", autoPref + "都")
                    .replace(postPref, autoPref);
                  newKana = postData.kana
                    .replace(postPrefKana + "ふ", autoPrefKana + "と")
                    .replace(postPrefKana, autoPrefKana);
                } else if (autoPref === "大阪" || autoPref === "京都") {
                  newTitle = postData.title.replace(postPref, autoPref);
                  newKana = postData.kana.replace(postPrefKana, autoPrefKana);
                } else {
                  newTitle = postData.title
                    .replace(postPref + "府", autoPref + "県")
                    .replace(postPref, autoPref);
                  newKana = postData.kana
                    .replace(postPrefKana + "ふ", autoPrefKana + "けん")
                    .replace(postPrefKana, autoPrefKana);
                }
              } else if (postData.title.includes("都")) {
                if (autoPref === "東京") {
                  newTitle = postData.title.replace(postPref, autoPref);
                  newKana = postData.kana.replace(postPrefKana, autoPrefKana);
                } else if (autoPref === "大阪" || autoPref === "京都") {
                  newTitle = postData.title
                    .replace(postPref + "都", autoPref + "府")
                    .replace(postPref, autoPref);
                  newKana = postData.kana
                    .replace(postPrefKana + "と", autoPrefKana + "ふ")
                    .replace(postPrefKana, autoPrefKana);
                } else {
                  newTitle = postData.title
                    .replace(postPref + "都", autoPref + "けん")
                    .replace(postPref, autoPref);
                  newKana = postData.kana
                    .replace(postPrefKana + "と", autoPrefKana + "けん")
                    .replace(postPrefKana, autoPrefKana);
                }
              } else {
                newTitle = postData.title.replace(postPref, autoPref);
                newKana = postData.kana.replace(postPrefKana, autoPrefKana);
              }
              if (
                this.data.some((ele) => {
                  return ele.title !== newTitle;
                })
              ) {
                const autoData = {
                  degree: 2,
                  title: newTitle,
                  kana: newKana,
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
          } else {
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
              kana: e.kana,
            }),
          });
        });
        this.appendData = [];
      },
      initialize: function () {
        this.num1 = "";
        this.num2 = "";
        this.calcParent1 = "";
        this.calcParent2 = "";
        this.operator = "";
        this.result = "";
        this.roundedResult = "";
        this.index1 = 0;
        this.isNumFor1 = false;
        this.index2 = 0;
        this.isNumFor2 = false;
        this.title = "";
        this.kana = "";
        this.unit = "";
        this.firstData = "";
        this.secondData = "";
        this.discription = "";
        this.intResult = 0;
        this.digit = 0;
        this.roundDigit = 0;
        this.digitUnitCoeff = 0;
        this.searchText = "";
      },
      goData: function () {
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
        if (this.digit <= 4) {
          this.roundDigit = this.digit - 3;
          this.round();
        } else {
          this.roundDigit = this.digit - 2;
          while (this.digitUnitCoeff < this.digit - 4) {
            // Coeff = "係数"
            this.digitUnitCoeff = this.digitUnitCoeff + 4;
          }
          this.round();
        }
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
          if (this.roundDigit >= 1) {
            this.roundDigit = this.roundDigit - 1;
            this.round();
            resultJa.textContent = this.roundedResult + this.showingData.unit;
          } else {
            alert("これ以上正確度を上げられません。");
          }
        };
        resultJa.textContent = this.roundedResult + this.showingData.unit;
        dataTitle.textContent = this.showingData.title;
        dataNum.textContent = this.showingData.latest;
        dataDegree.textContent = this.showingData.degree;
        dataBox.append(resultJa, digitUpButton, digitDownButton);
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
            this.goData();
          };
          parentData2.onclick = async () => {
            const snapshot = await getDoc(doc(db, "data", `${parent2Title}`));
            this.showingData = snapshot.data();
            this.goData();
          };
          parentDataBox.append(parentData1, parentOperator, parentData2);
        }
      },
      goSearch: function () {
        const search = document.getElementById("search");
        const dataArea = document.getElementById("data-area");
        search.style.display = "block";
        dataArea.style.display = "none";
        if (!this.alreadyGoSearch) {
          const searchResultBox = document.getElementById("search-result-box");
          this.data.forEach((e) => {
            const resultCard = document.createElement("option");
            resultCard.textContent = e.title;
            resultCard.value = e.title;
            searchResultBox.append(resultCard);
          });
        }
      }.bind(this),
      showGuess: async () => {
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
            const showingFavorite = await getDoc(
              doc(db, "data", `${e.data().title}`)
            );
            this.showingData = showingFavorite.data();
            await this.start();
            await this.goData();
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
            const showingNew = await getDoc(
              doc(db, "data", `${e.data().title}`)
            );
            this.showingData = showingNew.data();
            await this.start();
            await this.goData();
          };
          newPost.append(newData);
        });
      },
      goDB: async function () {
        this.isGuess = false;
        await this.start();
        this.goSearch();
        this.alreadyGoSearch = true;
      },
    };
  },
  methods: {
    isKana() {
      let tmp = [];

      this.kana.split("").forEach(function (char) {
        if (char.match(/^[\u3040-\u309f]+$/)) {
          tmp.push(char);
        }
      });

      if (tmp.length > 0) {
        this.kana = tmp.join("");
      } else {
        this.kana = "";
      }
    },
    numChangeForF() {
      this.firstData = "";
      const firstDataInput = document.getElementById("first-data-input");
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
        const data1 = document.getElementById("data1");
        this.data.forEach((e) => {
          const optionFor1 = document.createElement("option");
          optionFor1.value = e.title;
          optionFor1.textContent = e.title;
          data1.append(optionFor1);
        });
        firstDataInput.type = "text";
        numChangeButtonForF.textContent = "数値を入力する";
      }
    },
    numChangeForS() {
      this.secondData = "";
      const secondDataInput = document.getElementById("second-data-input");
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
        const data2 = document.getElementById("data2");
        this.data.forEach((e) => {
          const optionFor2 = document.createElement("option");
          optionFor2.value = e.title;
          optionFor2.textContent = e.title;
          data2.append(optionFor2);
        });
        secondDataInput.type = "text";
        numChangeButtonForS.textContent = "数値を入力する";
      }
    },
    async calc() {
      if (
        this.title == "" ||
        this.kana == "" ||
        this.firstData == "-" ||
        this.firstData == "" ||
        this.operator == "" ||
        this.secondData == "-" ||
        this.secondData == "" ||
        this.unit == ""
      ) {
        alert("未入力の部分があります");
      } else {
        const firstDataInput = document.getElementById("first-data-input");
        const secondDataInput = document.getElementById("second-data-input");
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
        let isChecked = false;
        const checkQ = query(
          this.commonLef,
          where("latest", "==", this.result)
        );
        const checkD = await getDocs(checkQ);
        checkD.forEach(async (e) => {
          if (
            (e.data().parent.parent1.data === this.firstData &&
              e.data().parent.parent2.data === this.secondData) ||
            (e.data().parent.parent2.data === this.firstData &&
              e.data().parent.parent1.data === this.secondData)
          ) {
            this.showingData = e.data();
            this.isGuess = false;
            isChecked = true;
            await this.start();
            this.goData();
            alert("既にデータがあります。");
          }
        });
        if (!isChecked) {
          this.intResult = Math.round(this.result);
          this.digit = this.intResult.toString().length;
          if (this.digit <= 4) {
            this.roundDigit = this.digit - 3;
            this.round();
          } else {
            this.roundDigit = this.digit - 2;
            while (this.digitUnitCoeff < this.digit - 4) {
              this.digitUnitCoeff = this.digitUnitCoeff + 4;
            }
            this.round();
          }
          const resultBox = document.getElementById("result-box");
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
            if (this.roundDigit >= 1) {
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
      while (resultBox.lastChild) {
        resultBox.removeChild(resultBox.lastChild);
      }
      this.initialize();
    },
    async showData() {
      if (this.searchText !== "") {
        const snapshot = await getDoc(doc(db, "data", `${this.searchText}`));
        this.showingData = snapshot.data();
        this.searchText = "";
        this.goData();
      } else {
        alert("データを選択してください");
      }
    },
    textDelete() {
      this.searchText = "";
    },
    test_auto() {
      this.title = "秋田県の二酸化炭素排出量";
      this.kana = "あきたけんのにさんかたんそはいしゅつりょう";
      this.firstData = "秋田県の人口データ";
      this.operator = "×";
      this.secondData = "一人当たり二酸化炭素排出量";
      this.unit = "キログラム";
    },
  },
  components: { appBarVue },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* アップバー */
.app-bar {
  height: 15vh;
  background-color: #aeaeae;
}

/* ボディ */
.body {
  display: flex;
}

/* スタート */
.start {
  position: fixed;
  top: 15vh;
  height: 85vh;
  width: 100vw;
  z-index: 10;
  background-color: white;
}
.start.hidden {
  z-index: -1;
}

/* メイン */
.main {
  background-color: #cecece;
  height: 85vh;
  width: 80vw;
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
