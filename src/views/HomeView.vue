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
  getDocs,
  setDoc,
  doc,
  updateDoc,
  increment,
} from "@firebase/firestore";
import { db } from "@/firebase.js";
import appBarVue from "@/components/AppBar.vue";

export default {
  data() {
    return {
      isGuess: true,
      num1: "",
      num2: "",
      operator: "",
      result: "",
      roundedResult: "",
      isAlreadyStarted: false,
      index1: 0,
      isNumFor1: false,
      index2: 0,
      isNumFor2: false,
      data: [],
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
      goodGuess: [],
      badGuess: [],
      showingData: "",
      databaseBox: [],
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
          const snapshot = await getDocs(collection(db, "data"));
          snapshot.forEach((e) => {
            this.data.push(e.data());
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
        const lef = collection(db, "data");
        let max1 = this.data[this.index1].degree;
        let max2 = this.data[this.index2].degree;
        let parentData1 = this.data[this.index1].title;
        let parentparent1 = this.data[this.index1].parent;
        let parentData2 = this.data[this.index2].title;
        let parentparent2 = this.data[this.index2].parent;
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
        if (
          this.data.some((e) => {
            return e.title !== postData.title;
          })
        ) {
          this.appendData.push(postData);
        }
        if (!this.isNumFor1) {
          if (
            this.data[this.index1].title.includes("一人当たり") &&
            this.data[this.index1].degree === 1
          ) {
            let autoCalc = this.data.filter((e) => {
              return (
                e.title.includes("一人当たり") &&
                e.degree === 1 &&
                e.title !== this.data[this.index1].title
              );
            });
            autoCalc.forEach((e) => {
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
              const autoData = {
                degree: 2,
                title: newTitle,
                kana: newKana,
                latest: autoResult,
                unit: e.unit,
                parent: {
                  parent1: {
                    data: e.title,
                    parent: "",
                  },
                  parent2: {
                    data: parentData2,
                    parent: "",
                  },
                  operator: postData.parent.operator,
                },
                likedCount: 0,
                date: Date.now(),
              };
              console.log(autoData);
              this.appendData.push(autoData);
            });
          }
        }
        if (!this.isNumFor2) {
          if (
            this.data[this.index2].title.includes("一人当たり") &&
            this.data[this.index2].degree === 1
          ) {
            let autoCalc = this.data.filter((e) => {
              return (
                e.title.includes("一人当たり") &&
                e.degree === 1 &&
                e.title !== this.data[this.index2].title
              );
            });
            autoCalc.forEach((e) => {
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
              if (
                this.data.some((e) => {
                  return e.title !== newTitle;
                })
              ) {
                this.appendData.push(autoData);
              }
            });
          }
        }
        this.appendData.forEach(async (e) => {
          await setDoc(doc(lef, `${e.title}`), e);
        });
        this.appendData = [];
      },
      initialize: function () {
        this.num1 = "";
        this.num2 = "";
        this.operator = "";
        this.result = "";
        this.roundedResult = "";
        this.isAlreadyStarted = false;
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
            this.goodGuess.push(this.showingData);
            judge.style.display = "none";
            const ref = doc(db, "data", `${this.showingData.title}`);
            await updateDoc(ref, {
              likedCount: increment(1),
            });
          };
          badButton.onclick = async () => {
            this.badGuess.push(this.showingData);
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
          parentData1.onclick = () => {
            let i = this.data.findIndex((ele) => {
              return ele.title === parent1Title;
            });
            this.showingData = this.data[i];
            this.goData();
          };
          parentData2.onclick = () => {
            let i = this.data.findIndex((ele) => {
              return ele.title === parent2Title;
            });
            this.showingData = this.data[i];
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
      showGuess: function () {
        // favorite
        const favoritePost = document.getElementById("favorite-post");
        const favData = document.createElement("div");
        let maxFav = 0;
        this.data.forEach((e) => {
          if (e.likedCount > maxFav) {
            maxFav = e.likedCount;
          }
        });
        let indexFav = this.data.findIndex((e) => {
          return e.likedCount === maxFav;
        });
        favData.textContent = this.data[indexFav].title;
        favData.onclick = async () => {
          this.isGuess = false;
          this.showingData = this.data[indexFav];
          await this.start();
          await this.goData();
        };
        favoritePost.append(favData);

        // new
        const newPost = document.getElementById("new-post");
        const newData = document.createElement("div");
        let maxNew = 0;
        this.data.forEach((e) => {
          if (e.date > maxNew) {
            maxNew = e.date;
          }
        });
        let indexNew = this.data.findIndex((e) => {
          return e.date === maxNew;
        });
        newData.textContent = this.data[indexNew].title;
        newData.onclick = async () => {
          this.isGuess = false;
          this.showingData = this.data[indexNew];
          await this.start();
          await this.goData();
        };
        newPost.append(newData);
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
          this.index1 = this.data.findIndex((e) => {
            return e.title == this.firstData;
          });
          this.num1 = this.data[this.index1].latest;
        } else if (firstDataInput.type === "number") {
          this.num1 = Number(this.firstData);
          this.isNumFor1 = true;
        } else {
          alert("type1error");
        }
        if (secondDataInput.type === "text") {
          this.index2 = this.data.findIndex((e) => {
            return e.title == this.secondData;
          });
          this.num2 = this.data[this.index2].latest;
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
        let checkIndex = this.data.findIndex((e) => {
          return e.latest === this.result;
        });
        if (
          checkIndex !== -1 &&
          this.operator === this.data[checkIndex].parent.operator
        ) {
          let checkArr1 = [this.firstData, this.secondData];
          let checkArr2 = [
            this.data[checkIndex].parent.parent1.data,
            this.data[checkIndex].parent.parent2.data,
          ];
          checkArr1 = checkArr1.filter((e) => {
            return !checkArr2.some((ele) => {
              return ele === e;
            });
          });
          console.log(checkArr1);
          if (checkArr1.length === 0) {
            this.showingData = this.data[checkIndex];
            this.isGuess = false;
            await this.start();
            this.goData();
            alert("既にデータがあります。");
          }
        } else {
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
    showData() {
      if (this.searchText !== "") {
        let index = 0;
        index = this.data.findIndex((e) => {
          return e.title == this.searchText;
        });
        this.searchText = "";
        this.showingData = this.data[index];
        this.goData();
      } else {
        alert("データを選択してください");
      }
    },
    textDelete() {
      this.searchText = "";
    },
    test_auto() {
      this.title = "秋田県の醬油消費量";
      this.kana = "あきたけんのしょうゆしょうひりょう";
      this.firstData = "秋田県の人口データ";
      this.operator = "×";
      this.secondData = "一人当たり醬油消費量";
      this.unit = "リットル";
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
