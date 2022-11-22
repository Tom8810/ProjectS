<template>
  <div class="app-bar">
    <h1>アップバー</h1>
    <button @click="test_auto">自動</button>
  </div>
  <div class="body">
    <aside class="side-bar">
      <div class="favorite">
        <h4>評価の高い推測</h4>
      </div>
      <div class="new">
        <h4>新着の推測</h4>
      </div>
      <div class="ad">
        <h4>その他</h4>
      </div>
    </aside>
    <div class="start" id="start">
      <button @click="start" :style="{ disabled: isAlreadyStarted }">
        始める
      </button>
    </div>
    <div class="main">
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
        <select name="unit" id="unit" v-model="unit" @focus="appendUnit()">
          <option value="リットル">リットル</option>
        </select>
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
    <div></div>
  </div>
</template>

<script>
import { collection, getDocs, setDoc, doc } from "@firebase/firestore";
import { db } from "./firebase";
export default {
  data() {
    return {
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
      appendUnit: function () {
        const unit = document.getElementById("unit");
        if (this.firstData == "" || this.secondData == "") {
          alert("データを選択してください");
          unit.blur();
        } else {
          this.index1 = this.data.findIndex((e) => {
            return e.title == this.firstData;
          });
          const optionForUnit1 = document.createElement("option");
          optionForUnit1.value = optionForUnit1.textContent =
            this.data[this.index1].unit;
          unit.append(optionForUnit1);
          this.index2 = this.data.findIndex((e) => {
            return e.title == this.secondData;
          });
          const optionForUnit2 = document.createElement("option");
          optionForUnit2.value = optionForUnit2.textContent =
            this.data[this.index2].unit;
          unit.append(optionForUnit2);
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
        this.data.forEach((e) => {
          const optionFor1 = document.createElement("option");
          const optionFor2 = document.createElement("option");
          optionFor1.value = optionFor2.value = e.title;
          optionFor1.textContent = optionFor2.textContent = e.title;
          data1.append(optionFor1);
          data2.append(optionFor2);
        });
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
        };
        await setDoc(doc(lef, `${this.title}`), postData);
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
      this.num1 = "";
      this.num2 = "";
      this.operator = "";
      console.log(this.data);
    },
    test_auto() {
      this.start();
      this.title = "秋田県の醬油消費量";
      this.kana = "あきたけんのしょうゆしょうひりょう";
      this.firstData = "秋田県の人口データ";
      this.operator = "×";
      this.secondData = "一人当たり醬油消費量";
      this.unit = "リットル";
    },
  },
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
  left: 20vw;
  height: 85vh;
  width: 80vw;
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
.favorite {
  background-color: #bebeff;
  height: 40vh;
}
.ad {
  background-color: #beffbe;
  height: 15vh;
}
.new {
  background-color: #ffbebe;
  height: 30vh;
}
</style>
