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
        <select
          name="data1"
          id="data1"
          v-model="firstData"
          @change="changeDisc()"
        >
          <option value="-" selected>-</option>
        </select>
        <select name="post-particle" v-model="operator" @change="changeDisc()">
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="×">×</option>
          <option value="÷">÷</option>
        </select>
        <select
          name="data2"
          id="data2"
          v-model="secondData"
          @change="changeDisc()"
        >
          <option value="-" selected>-</option>
        </select>
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
      <div class="search">
        <h2>データベース</h2>
        <h3>検索</h3>
        <input type="text" v-model="searchText" @input="search" />
        <h3>データ一覧</h3>
        <div id="search-result-box"></div>
      </div>
      <div class="data">
        <div>
          <h2>タイトル</h2>
          <h3 class="data-title" id="data-title">a</h3>
        </div>
        <div>
          <h2>データ</h2>
          <h3 class="data-num" id="data-num">0</h3>
        </div>
        <div>
          <h2>データの次数</h2>
          <h3 class="data-degree" id="data-degree">0</h3>
        </div>
        <div id="judge-area">
          <h2>この推測を評価する</h2>
          <div id="judge"></div>
        </div>
        <div>
          <h2>親データ</h2>
          <div id="parent-data-box"></div>
        </div>
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
      index2: 0,
      data: [],
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
      databaseBox: [],
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
        const start = document.getElementById("start");
        start.classList.add("hidden");
        this.isAlreadyStarted = true;
        const snapshot = await getDocs(collection(db, "data"));
        snapshot.forEach((e) => {
          this.data.push(e.data());
        });
        const data1 = document.getElementById("data1");
        const data2 = document.getElementById("data2");
        if (this.isGuess) {
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
      },
      round: function () {
        this.roundedResult =
          Math.round(this.intResult / 10 ** this.roundDigit) *
          10 ** this.roundDigit;
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
      dataPost: async function () {
        const lef = collection(db, "data");
        const postData = {
          degree:
            Math.max(
              this.data[this.index1].degree,
              this.data[this.index2].degree
            ) + 1,
          title: this.title,
          kana: this.kana,
          latest: this.result,
          unit: this.unit,
          parent: {
            parent1: {
              data: this.data[this.index1].title,
              parent: this.data[this.index1].parent,
            },
            parent2: {
              data: this.data[this.index2].title,
              parent: this.data[this.index2].parent,
            },
            operator: this.operator,
          },
          likedCount: 0,
        };
        await setDoc(doc(lef, `${this.title}`), postData);
      },
      initialize: function () {
        this.num1 = "";
        this.num2 = "";
        this.operator = "";
        this.result = "";
        this.roundedResult = "";
        this.isAlreadyStarted = false;
        this.index1 = 0;
        this.index2 = 0;
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
      showResult: function () {
        const searchResultBox = document.getElementById("search-result-box");
        while (searchResultBox.lastChild) {
          searchResultBox.lastChild.remove();
        }
        let arr = this.data;
        this.databaseBox.forEach((e) => {
          const resultCard = document.createElement("div");
          const judge = document.getElementById("judge");
          resultCard.textContent = e.title;
          let element = e;
          resultCard.onclick = function goResult() {
            const parentDataBox = document.getElementById("parent-data-box");
            while (parentDataBox.lastChild) {
              parentDataBox.lastChild.remove();
            }
            judge.style.display = "block";
            while (judge.lastChild) {
              judge.lastChild.remove();
            }
            const dataTitle = document.getElementById("data-title");
            const dataNum = document.getElementById("data-num");
            const dataDegree = document.getElementById("data-degree");
            dataTitle.textContent = element.title;
            dataNum.textContent = element.latest + element.unit;
            dataDegree.textContent = element.degree;
            if (element.degree > 1) {
              const goodButton = document.createElement("div");
              goodButton.textContent = "正しいと思う";
              const badButton = document.createElement("div");
              badButton.textContent = "正しくないと思う";
              goodButton.onclick = async () => {
                this.goodGuess.push(element);
                judge.style.display = "none";
                const ref = doc(db, "data", `${element.title}`);
                await updateDoc(ref, {
                  likedCount: increment(1),
                });
              };
              badButton.onclick = async () => {
                this.badGuess.push(element);
                judge.style.display = "none";
                const ref = doc(db, "data", `${element.title}`);
                await updateDoc(ref, {
                  likedCount: increment(-1),
                });
              };
              judge.append(goodButton, badButton);
            }
            if ("parent1" in element.parent) {
              let parent1Title = element.parent.parent1.data;
              let parent2Title = element.parent.parent2.data;
              let parentOpe = element.parent.operator;
              const parentData1 = document.createElement("h3");
              const parentOperator = document.createElement("h3");
              const parentData2 = document.createElement("h3");
              parentData1.textContent = parent1Title;
              parentOperator.textContent = parentOpe;
              parentData2.textContent = parent2Title;
              parentData1.onclick = () => {
                let i = arr.findIndex((ele) => {
                  return ele.title === parent1Title;
                });
                element = arr[i];
                goResult();
              };
              parentData2.onclick = () => {
                let i = arr.findIndex((ele) => {
                  return ele.title === parent2Title;
                });
                element = arr[i];
                goResult();
              };
              parentDataBox.append(parentData1, parentOperator, parentData2);
            }
          }.bind(this);
          searchResultBox.append(resultCard);
        });
      },
      showGuess: function () {
        const favoritePost = document.getElementById("favorite-post");
        const favData = document.createElement("div");
        let max = 0;
        this.data.forEach((e) => {
          if (e.likedCount > max) {
            max = e.likedCount;
          }
        });
        let index = this.data.findIndex((e) => {
          return e.likedCount === max;
        });
        favData.textContent = this.data[index].title;
        favData.onclick = () => {
          this.isGuess = false;
          this.databaseBox = this.data.slice(0, 3);
          console.log("favoData clicked!");
          this.showResult();
        };
        favoritePost.append(favData);
      },
    };
  },
  methods: {
    async goDB() {
      this.isGuess = false;
      await this.start();
      this.databaseBox = this.data.slice(0, 3);
      this.showResult();
    },
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
    calc() {
      if (
        this.title == "" ||
        this.kana == "" ||
        this.firstData == "-" ||
        this.operator == "" ||
        this.secondData == "-" ||
        this.unit == ""
      ) {
        alert("未入力の部分があります");
      } else {
        this.index1 = this.data.findIndex((e) => {
          return e.title == this.firstData;
        });
        this.num1 = this.data[this.index1].latest;
        this.index2 = this.data.findIndex((e) => {
          return e.title == this.secondData;
        });
        this.num2 = this.data[this.index2].latest;
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
            alert("error");
        }
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
            alert("これ以上正確度を下げられません。");
          }
        };
        resultJa.textContent = this.roundedResult + this.unit;
        resultNum.textContent = this.result;
        resultBox.append(resultJa, resultNum, digitUpButton, digitDownButton);
        this.dataPost();
      }
    },
    next() {
      const resultBox = document.getElementById("result-box");
      while (resultBox.lastChild) {
        resultBox.removeChild(resultBox.lastChild);
      }
      this.initialize();
    },
    search() {
      this.databaseBox = this.data.filter((e) => {
        return (
          e.title.includes(this.searchText) || e.kana.includes(this.searchText)
        );
      });
      this.showResult();
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

*,
::after,
::before {
  margin: 0;
  padding: 0;
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
