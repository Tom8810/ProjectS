<template>
  <div class="help-shadow"></div>
  <div class="app-bar">
    <div class="app-bar-leading">
      <h1 class="app-bar-title">Guess.</h1>
      <h1 class="app-bar-mode" v-if="isGuess === true">推測</h1>
      <h1 class="app-bar-mode" v-else>閲覧</h1>
      <h3>モード</h3>
    </div>
    <button @click="goDev">dev</button>
    <button @click="test_auto">自動</button>
    <div class="app-bar-end">
      <h3 class="app-bar-mode-change button" v-if="isGuess" @click="change">
        閲覧モードへ
      </h3>
      <h3 class="app-bar-mode-change button" v-else @click="change">
        推測モードへ
      </h3>
      <h3 @click="help" class="app-bar-help button">Help</h3>
    </div>
  </div>
  <div class="body">
    <aside class="side-bar">
      <div class="favorite-post">
        <div class="sidebar-title-box">
          <h4 class="sidebar-title-leading">人気の推測</h4>
          <h4 class="sidebar-title-end">Hot</h4>
        </div>
        <div class="line-arrow-in-sidebar"></div>
        <div id="favorite-post-container"></div>
      </div>
      <div class="new-post">
        <div class="sidebar-title-box">
          <h4 class="sidebar-title-leading">新着の推測</h4>
          <h4 class="sidebar-title-end">Latest</h4>
        </div>
        <div class="line-arrow-in-sidebar"></div>
        <div id="new-post-container"></div>
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
      <div class="main-row">
        <div class="guess-title main-box">
          <div class="main-title-box">
            <h3 class="main-title-leading">推測テーマ</h3>
            <h3>Theme</h3>
          </div>
          <div class="main-content-box" v-if="!isAlreadyGuess">
            <input
              type="text"
              class="main-input"
              id="main-input"
              placeholder="テーマを入力"
              v-model="title"
              @change="changeDisc()"
            />
          </div>
          <div class="main-content-box" v-else>
            <div class="main-input result-title tint">
              <h2>{{ title }}</h2>
            </div>
          </div>
        </div>
        <div class="guess-unit main-box" v-if="!isAlreadyGuess">
          <div class="main-title-box">
            <h3 class="main-title-leading">単位</h3>
            <h3>Unit</h3>
          </div>
          <!-- ここは計算結果表示時はなし  -->
          <div class="main-content-box">
            <input
              type="text"
              class="main-input"
              placeholder="単位を入力"
              v-model="unit"
            />
          </div>
        </div>
      </div>
      <div class="main-row">
        <div class="guess-data main-box">
          <div class="main-title-box" v-if="!isAlreadyGuess">
            <h3 class="main-title-leading">使用データ</h3>
            <h3>Data</h3>
            <div
              class="data-number-button button"
              id="data-number-button"
              @click="
                addData();
                changeDisc();
              "
            >
              <h4>データを増やす</h4>
            </div>
          </div>
          <div class="main-title-box" v-else>
            <h3 class="main-title-leading">計算結果</h3>
            <h3>Result</h3>
            <div class="digit-up-button button" @click="digitUp">
              <h4>ざっくり表示</h4>
            </div>
            <div class="digit-down-button button" @click="digitDown">
              <h4>きっちり表示</h4>
            </div>
          </div>
          <div class="main-content-box guess-data-area" v-if="!isAlreadyGuess">
            <div class="first-data">
              <input
                type="text"
                autocomplete="on"
                list="data1"
                id="data-input-1"
                v-model="firstData"
                placeholder="データを選択"
                @change="changeDisc()"
              />
              <datalist id="data1"> </datalist>
              <div
                class="numchange-button button"
                id="num-change-button-forf"
                @click="numChangeForF"
              >
                <h4 id="num-change-text-forf">数値を入力</h4>
              </div>
            </div>
            <div class="first-ope">
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
            </div>
            <div class="second-data">
              <input
                type="text"
                autocomplete="on"
                list="data2"
                id="data-input-2"
                v-model="secondData"
                placeholder="データを選択"
                @change="changeDisc()"
              />
              <datalist id="data2"> </datalist>
              <div
                class="numchange-button button"
                id="num-change-button-fors"
                @click="numChangeForS"
              >
                <h4 id="num-change-text-fors">数値を入力</h4>
              </div>
            </div>
            <div class="second-ope" v-if="howManyData === 3">
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
            </div>
            <div class="third-data" v-if="howManyData === 3">
              <input
                type="text"
                autocomplete="on"
                list="data3"
                id="data-input-3"
                v-model="thirdData"
                placeholder="データを選択"
                @change="changeDisc()"
                @mouseover.once="thirdStart"
              />
              <datalist id="data3"> </datalist>
              <div
                class="numchange-button button"
                id="num-change-button-fort"
                @click="numChangeForT"
              >
                <h4 id="num-change-text-fort">数値を入力</h4>
              </div>
            </div>
          </div>
          <div class="main-content-box" v-else>
            <div class="main-input result-data tint">
              <h2>
                {{ roundedResult
                }}<span class="result-data-unit">{{ unit }}</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div class="main-row">
        <div class="guess-equation main-box">
          <div class="main-title-box">
            <h3 class="main-title-leading">推測式</h3>
            <h3>Equation</h3>
          </div>
          <div class="main-content-box equation-area">
            <h2>
              {{ title }} =
              <span class="discription">{{ discription }}</span>
            </h2>
          </div>
        </div>
        <div class="guess-button-area">
          <div class="guess-button button" @click="calc" v-if="!isAlreadyGuess">
            <h3>推測</h3>
          </div>
          <div class="next-button button" @click="next" v-else>
            <h3>次へ</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- ここからデータベース -->
    <div class="main" :style="{ display: viewer }">
      <div class="main-row">
        <div class="first-leading main-box">
          <div class="main-title-box" v-if="!isAlreadyShow">
            <h3 class="main-title-leading">検索方法</h3>
            <h3>Search</h3>
          </div>
          <div class="main-title-box" v-else>
            <h3 class="main-title-leading">タイトル</h3>
            <h3>Title</h3>
          </div>
          <div class="main-content-box" v-if="!isAlreadyShow">
            <select
              class="main-input"
              placeholder="検索方法を選択"
              v-model="searchStyle"
              @change="sortInit"
            >
              <option value="input" selected>直接入力検索</option>
              <option value="sort">絞り込み検索</option>
            </select>
          </div>
          <div class="main-content-box" v-else>
            <div class="main-input result-title tint">
              <h2>{{ showingData.title }}</h2>
            </div>
          </div>
        </div>
        <div class="first-end main-box">
          <div
            class="main-title-box"
            v-if="!isAlreadyShow && searchStyle === `sort`"
          >
            <h3 class="main-title-leading">絞り込み方法</h3>
            <h3>Sort</h3>
          </div>
          <div class="main-title-box" v-if="isAlreadyShow">
            <h3 class="main-title-leading">次数</h3>
            <h3>Degree</h3>
          </div>
          <div
            class="main-content-box"
            v-if="!isAlreadyShow && searchStyle === `sort`"
          >
            <select
              class="main-input"
              placeholder="絞り込み方法を選択"
              v-model="sortStyle"
              @change="sortInit"
            >
              <option value="genre">ジャンルで絞り込み</option>
              <option value="keyword">キーワードで絞り込み</option>
            </select>
          </div>
          <div class="main-content-box" v-if="isAlreadyShow">
            <div class="main-input result-title tint">
              <h2>{{ showingData.degree }}</h2>
            </div>
          </div>
        </div>
      </div>

      <div class="main-row">
        <div class="second-leading main-box">
          <div
            class="main-title-box"
            v-if="!isAlreadyShow && sortStyle === `genre`"
          >
            <h3 class="main-title-leading">ジャンル選択</h3>
            <h3>Genre</h3>
          </div>
          <div
            class="main-title-box"
            v-if="!isAlreadyShow && sortStyle === `keyword`"
          >
            <h3 class="main-title-leading">キーワード入力</h3>
            <h3>Keywords</h3>
          </div>
          <div class="main-title-box" v-if="isAlreadyShow">
            <h3 class="main-title-leading">データ</h3>
            <h3>Result</h3>
            <div class="digit-up-button button" @click="digitUp">
              <h4>ざっくり表示</h4>
            </div>
            <div class="digit-down-button button" @click="digitDown">
              <h4>きっちり表示</h4>
            </div>
          </div>
          <div
            class="main-content-box"
            v-if="!isAlreadyShow && sortStyle === `genre`"
          >
            <select
              class="main-input genre-box"
              placeholder="ジャンルを選択"
              v-model="sortGenre"
              @change="goGenreSort"
            >
              <option value="pref">都道府県データ</option>
              <option value="population">人口データ</option>
              <option value="per">一人当たりデータ</option>
            </select>
          </div>
          <div
            class="main-content-box"
            v-if="!isAlreadyShow && sortStyle === `keyword`"
          >
            <input
              type="text"
              class="main-input keyword-box"
              placeholder="キーワード"
              v-model="sortKeyword"
            />
            <div class="keyword-add-button button" @click="goKeywordSort">
              <h4>追加</h4>
            </div>
            <div id="sort-box"></div>
          </div>
          <div class="main-content-box" v-if="isAlreadyShow">
            <div class="main-input result-data tint">
              <h2>
                {{ roundedResult
                }}<span class="result-data-unit">{{ showingData.unit }}</span>
              </h2>
            </div>
            <div
              class="review-button-area"
              id="review-button-area"
              v-if="showingData.degree > 1"
            >
              <div class="good-button button" @click="good">
                <h3>合ってそう</h3>
              </div>
              <div class="bad-button button" @click="bad">
                <h3>間違ってそう</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="main-row">
        <div class="guess-equation main-box">
          <div class="main-title-box" v-if="!isAlreadyShow">
            <h3 class="main-title-leading">データ選択</h3>
            <h3>Select</h3>
          </div>
          <div
            class="main-title-box"
            v-if="isAlreadyShow && showingData.degree === 1"
          >
            <h3 class="main-title-leading">出典</h3>
            <h3>Source</h3>
          </div>
          <div
            class="main-title-box"
            v-if="isAlreadyShow && showingData.degree > 1"
          >
            <h3 class="main-title-leading">親データ</h3>
            <h3>Parents</h3>
          </div>
          <div class="main-content-box data-select-area" v-if="!isAlreadyShow">
            <input
              type="text"
              class="main-input"
              v-model="searchText"
              autocomplete="on"
              list="search-result-box"
            />
            <datalist id="search-result-box"></datalist>
          </div>
          <div
            class="main-content-box source-area"
            v-if="isAlreadyShow && showingData.degree === 1"
          >
            <div class="link-button button" @click="goLink">
              <h3>出典先ページへ</h3>
            </div>
            <div class="copy-button button" @click="goCopy">
              <h3>出典先リンクをコピー</h3>
            </div>
          </div>
          <div
            class="main-content-box parent-data-area"
            v-if="isAlreadyShow && showingData.degree > 1"
          >
            <h2>
              {{ showingData.title }} =
              <span class="discription"
                ><span class="parent-data1 parent" @click="showParent1"></span
                >{{ showingData.parent.operator
                }}<span class="parent-data2 parent" @click="showParent2"></span
                ><span v-if="showingData.parent.parent3 !== undefined"
                  >{{ showingData.parent.operator2
                  }}<span
                    class="parent-data3 parent"
                    @click="showParent3"
                  ></span></span
              ></span>
            </h2>
          </div>
        </div>
        <div class="guess-button-area">
          <div
            class="guess-button button"
            @click="getData"
            v-if="!isAlreadyShow"
          >
            <h3>表示</h3>
          </div>
          <div class="next-button button" @click="searchStart" v-else>
            <h3>次へ</h3>
          </div>
        </div>
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
      isAlreadyGuess: false,
      isAlreadyShow: false,
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
      sortStyle: "",
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
        this.discription = this.firstData + this.operator + this.secondData;
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
          const favoritePost = document.getElementById(
            "favorite-post-container"
          );
          const favQ = query(
            this.commonLef,
            orderBy("likedCount", "desc"),
            limit(2)
          );
          const fav = await getDocs(favQ);
          fav.forEach(async (e) => {
            const favData = document.createElement("div");
            const favDataText = document.createElement("h4");
            favData.classList.add("button");
            favData.style.border = "solid 0.1vw #000000";
            favData.style.padding = "0.7vw";
            favData.style.width = "12vw";
            favData.style.height = "5vw";
            favData.style.maxHeight = "10vh";
            favData.style.display = "flex";
            favData.style.alignItems = "center";
            favData.style.justifyContent = "center";
            favDataText.style.fontSize = "1.5vw";
            favDataText.style.lineHeight = "1.5";
            if (e.data().title.toString().length >= 15) {
              favDataText.textContent = this.omit(e.data().title, 14);
            } else {
              favDataText.textContent = e.data().title;
            }
            favData.append(favDataText);
            favData.onclick = async () => {
              this.isGuess = false;
              this.guesser = "none";
              this.viewer = "block";
              this.searchText = e.data().title;
              this.getData();
            };
            favoritePost.append(favData);
          });

          // new
          const newPost = document.getElementById("new-post-container");
          const newData = document.createElement("div");
          const newDataText = document.createElement("h4");
          newData.classList.add("button");
          newData.style.border = "solid 0.1vw #000000";
          newData.style.padding = "0.7vw";
          newData.style.width = "12vw";
          newData.style.height = "5vw";
          newData.style.display = "flex";
          newData.style.alignItems = "center";
          newData.style.justifyContent = "center";
          newDataText.style.fontSize = "1.5vw";
          newDataText.style.lineHeight = "1.5";
          const newQ = query(this.commonLef, orderBy("date", "desc"), limit(1));
          const ne = await getDocs(newQ);
          ne.forEach(async (e) => {
            if (e.data().title.toString().length >= 15) {
              newDataText.textContent = this.omit(e.data().title, 14);
            } else {
              newDataText.textContent = e.data().title;
            }
            newData.append(newDataText);
            newData.onclick = async () => {
              this.isGuess = false;
              this.guesser = "none";
              this.viewer = "block";
              this.searchText = e.data().title;
              this.getData();
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
          let max3 = this.calcParent3.degree;
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
      },
      searchStart: async function () {
        this.isAlreadyShow = false;
        await this.start();
        this.dataSet();
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
      getData: async () => {
        if (this.searchText !== "") {
          const snapshot = await getDoc(doc(db, "data", `${this.searchText}`));
          this.showingData = snapshot.data();
          this.searchText = "";
          this.showData();
          this.isAlreadyShow = true;
          await this.start();
          if (this.showingData.degree > 1) {
            const parent1 = document.querySelector(".parent-data1");
            const parent2 = document.querySelector(".parent-data2");
            parent1.textContent = this.showingData.parent.parent1.data;
            parent2.textContent = this.showingData.parent.parent2.data;
            if (this.showingData.parent.parent3 !== undefined) {
              const parent3 = document.querySelector(".parent-data3");
              parent3.textContent = this.showingData.parent.parent3.data;
            }
          }
        } else {
          alert("データを選択してください");
        }
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
      omit: (e, num) => {
        // eはカットする文字列、numはその字数以下にしたい文字数
        let str = e.substr(0, num - 1);
        return str + "...";
      },
      dataSet: () => {
        if (this.isGuess) {
          const data1 = document.getElementById("data1");
          const data2 = document.getElementById("data2");
          if (data1.childElementCount === 0) {
            this.data.forEach((e) => {
              const optionFor1 = document.createElement("option");
              const optionFor2 = document.createElement("option");
              optionFor1.value = optionFor2.value = e.title;
              optionFor1.textContent = optionFor2.textContent = `(${e.degree})`;
              data1.append(optionFor1);
              data2.append(optionFor2);
            });
          }
        } else {
          const searchResultBox = document.getElementById("search-result-box");
          this.data.forEach((e) => {
            const resultCard = document.createElement("option");
            resultCard.textContent = `(${e.degree})`;
            resultCard.value = e.title;
            searchResultBox.append(resultCard);
          });
        }
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
        dataNumberButton.textContent = "データを減らす";
        dataNumberButton.style.fontSize = "10px";
      } else {
        this.howManyData = 2;
        dataNumberButton.textContent = "データを増やす";
        dataNumberButton.style.fontSize = "10px";
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
        option.textContent = `(${e.degree})`;
        data3.append(option);
      });
      this.alreadyThirdStarted = true;
    },
    numChangeForF() {
      this.firstData = "";
      const firstDataInput = document.getElementById("data-input-1");
      const numChangeTextForF = document.getElementById("num-change-text-forf");
      if (firstDataInput.type === "text") {
        const datalist = document.getElementById("data1");
        while (datalist.lastChild) {
          datalist.lastChild.remove();
        }
        firstDataInput.type = "number";
        numChangeTextForF.style.fontSize = "1.2vw";
        numChangeTextForF.textContent = "データを選択する";
      } else {
        const datalist = document.getElementById("data1");
        this.data.forEach((e) => {
          const optionFor1 = document.createElement("option");
          optionFor1.value = e.title;
          optionFor1.textContent = e.title;
          datalist.append(optionFor1);
        });
        firstDataInput.type = "text";
        numChangeTextForF.style.fontSize = "1.2vw";
        numChangeTextForF.textContent = "数値を入力する";
      }
    },
    numChangeForS() {
      this.secondData = "";
      const secondDataInput = document.getElementById("data-input-2");
      const numChangeTextForS = document.getElementById("num-change-text-fors");
      if (secondDataInput.type === "text") {
        const datalist = document.getElementById("data2");
        while (datalist.lastChild) {
          datalist.lastChild.remove();
        }
        secondDataInput.type = "number";
        numChangeTextForS.style.fontSize = "1.2vw";
        numChangeTextForS.textContent = "データを選択する";
      } else {
        const datalist = document.getElementById("data2");
        this.data.forEach((e) => {
          const optionFor2 = document.createElement("option");
          optionFor2.value = e.title;
          optionFor2.textContent = e.title;
          datalist.append(optionFor2);
        });
        secondDataInput.type = "text";
        numChangeTextForS.style.fontSize = "1.2vw";
        numChangeTextForS.textContent = "数値を入力する";
      }
    },
    numChangeForT() {
      this.thirdData = "";
      const thirdDataInput = document.getElementById("data-input-3");
      const numChangeTextForT = document.getElementById("num-change-text-fort");
      if (thirdDataInput.type === "text") {
        const datalist = document.getElementById("data3");
        while (datalist.lastChild) {
          datalist.lastChild.remove();
        }
        thirdDataInput.type = "number";
        numChangeTextForT.style.fontSize = "1.2vw";
        numChangeTextForT.textContent = "データを選択する";
      } else {
        const datalist = document.getElementById("data3");
        this.data.forEach((e) => {
          const optionFor3 = document.createElement("option");
          optionFor3.value = e.title;
          optionFor3.textContent = e.title;
          datalist.append(optionFor3);
        });
        thirdDataInput.type = "text";
        numChangeTextForT.style.fontSize = "1.2vw";
        numChangeTextForT.textContent = "数値を入力する";
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
          const guessTitle = document.querySelector(".guess-title");
          const guessData = document.querySelector(".guess-data");
          guessTitle.classList.add("after-guess");
          guessData.classList.add("after-guess");
          if (this.title !== "てすと３") {
            this.dataPost();
          }
          this.isAlreadyGuess = true;
        }
      }
    },
    digitUp() {
      if (this.roundDigit <= this.digit - 2) {
        this.roundDigit = this.roundDigit + 1;
        this.round();
      } else {
        alert("これ以上ざっくり度を上げられません。");
      }
    },
    digitDown() {
      if (
        this.roundDigit >=
        this.intResult.toString().length - this.result.toString().length
      ) {
        this.roundDigit = this.roundDigit - 1;
        this.round();
      } else {
        alert("これ以上正確度を上げられません。");
      }
    },
    async next() {
      const guessTitle = document.querySelector(".guess-title");
      const guessData = document.querySelector(".guess-data");
      guessData.classList.remove("after-guess");
      guessTitle.classList.remove("after-guess");
      this.isAlreadyGuess = false;
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
      await this.start();
      this.dataSet();
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
      container.setAttribute(
        "style",
        "display: flex;flex-direction: column;justify-content: center;align-items: center;width: 12vw;margin-left: 2vw;"
      );
      const sortNameBox = document.createElement("div");
      const sortName = document.createElement("h2");
      sortNameBox.setAttribute(
        "style",
        "display: flex;justify-content: center;align-items: center;font-weight: 700;font-size: 2vw;height: 6vw;max-height: 8vh;padding: 1vw;border-radius: 5px;border: solid #000 1.5px;box-shadow: 2px 2px 5px #3c3c3c;background: linear-gradient(to right, #cccccc, #7aaecc);width: 100%;box-sizing: border-box;"
      );
      sortName.setAttribute("style", "font-size: 2vw;display: block;");
      const sortDeleteButton = document.createElement("div");
      const sortDeleteButtonText = document.createElement("h4");
      sortName.textContent = this.sortKeyword;
      sortDeleteButtonText.textContent = "削除";
      sortDeleteButtonText.setAttribute(
        "style",
        "display: block;font-size: 1.2vw;"
      );
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
      sortDeleteButton.setAttribute(
        "style",
        "display: flex;align-items: center;justify-content: center;width: 6vw;margin-top: 2vh;height: 3vw;min-height: 15px;font-weight: 700;border: solid #000 1.5px;box-shadow: 2px 2px 5px #3c3c3c;background: linear-gradient(to right, #ffff00, #99daff);box-sizing: border-box;"
      );
      sortDeleteButton.setAttribute("class", "button");
      this.sortKeyword = "";
      sortNameBox.append(sortName);
      sortDeleteButton.append(sortDeleteButtonText);
      container.append(sortNameBox, sortDeleteButton);
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
      const searchResultBox = document.getElementById("search-result-box");
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
    async good() {
      const reviewButtonArea = document.getElementById("review-button-area");
      while (reviewButtonArea.lastChild) {
        reviewButtonArea.lastChild.remove();
      }
      const ref = doc(db, "data", `${this.showingData.title}`);
      await updateDoc(ref, {
        likedCount: increment(1),
      });
    },
    async bad() {
      const reviewButtonArea = document.getElementById("review-button-area");
      while (reviewButtonArea.lastChild) {
        reviewButtonArea.lastChild.remove();
      }
      const ref = doc(db, "data", `${this.showingData.title}`);
      await updateDoc(ref, {
        likedCount: increment(-1),
      });
    },
    goLink() {
      window.open(this.showingData.ref, "_blank");
    },
    goCopy() {
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
    },
    showParent1() {
      let bool = this.data.some((e) => {
        return e.title === this.showingData.parent.parent1.data;
      });
      if (bool) {
        this.searchText = this.showingData.parent.parent1.data;
        this.getData();
      }
    },
    showParent2() {
      let bool = this.data.some((e) => {
        return e.title === this.showingData.parent.parent2.data;
      });
      if (bool) {
        this.searchText = this.showingData.parent.parent2.data;
        this.getData();
      }
    },
    showParent3() {
      let bool = this.data.some((e) => {
        return e.title === this.showingData.parent.parent3.data;
      });
      if (bool) {
        this.searchText = this.showingData.parent.parent3.data;
        this.getData();
      }
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
      this.title = "てすと３";
      this.firstData = "ギリギリデータ";
      this.operator = "×";
      this.secondData = "小数点データ";
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
          this.isAlreadyGuess = false;
        } else {
          this.isGuess = !this.isGuess;
          this.guesser = "block";
          this.viewer = "none";
          this.isAlreadyGuess = false;
          this.dataSet();
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

<style>
/* コモン */
.tint {
  background: linear-gradient(to right, #ffffff, #99daff);
}

/* アップバー */
.app-bar {
  height: 10vh;
  background: linear-gradient(to right, #cccccc, #7aaecc);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  box-shadow: 0 3px 6px #333;
}
.app-bar-leading,
.app-bar-end {
  display: flex;
}
.app-bar-leading *,
.app-bar-end * {
  display: inline-block;
}
.app-bar-leading {
  margin-left: 25px;
}
.app-bar-leading h1 {
  font-size: 6vh;
}
.app-bar-title {
  font-style: italic;
  font-weight: 700;
  position: relative;
}
.app-bar-title::after {
  content: "";
  display: block;
  width: 0.4vh;
  height: 7vh;
  background-color: #000;
  position: absolute;
  right: -25px;
  top: -0.5vh;
}
.app-bar-mode {
  margin-left: 50px;
}
.app-bar-leading h3 {
  font-size: 3vh;
  margin-top: 3vh;
  margin-left: 5px;
}
.app-bar-end {
  margin-right: 25px;
}
.app-bar-mode-change {
  font-size: 3vh;
  margin-right: 40px;
  position: relative;
}
.app-bar-mode-change::after {
  content: "";
  display: block;
  width: 0.3vh;
  height: 4vh;
  background-color: #000;
  position: absolute;
  right: -20px;
  top: -0.5vh;
}
.app-bar-mode-change::after:hover {
  transform: scale(1);
}
.app-bar-help {
  position: relative;
  z-index: 2;
  font-size: 3vh;
  font-style: italic;
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
  min-height: 500px;
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
  line-height: 1.1;
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
  background-color: #fff;
  height: 90vh;
  width: 80vw;
}
.main-row {
  position: relative;
  display: flex;
  padding-left: 4vw;
  padding-right: 4vw;
  height: 25vh;
  margin-top: 5vh;
}
.main-row:first-child::after,
.main-row:nth-child(2)::after {
  content: "";
  display: block;
  width: 75vw;
  height: 0.15vw;
  background-color: #000;
  position: absolute;
  bottom: 0;
  left: 2vw;
}
.main-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
}
.main-title-box {
  display: flex;
}
.main-title-box * {
  display: inline-block;
  font-size: 2vw;
  font-style: italic;
}
.main-title-leading {
  margin-right: 3vw;
  position: relative;
}
.main-title-leading::after {
  content: "";
  display: block;
  width: 0.15vw;
  height: 2.5vw;
  background-color: #000;
  position: absolute;
  right: -1.5vw;
  top: -0.25vw;
}
.guess-title,
.first-leading {
  margin-right: 8vw;
  width: 32vw;
  position: relative;
}
.guess-title::after,
.first-leading::after {
  content: "";
  display: block;
  width: 0.15vw;
  height: 26vh;
  background-color: #000;
  position: absolute;
  right: -4vw;
  top: -3vh;
}
.after-guess {
  width: 50vw;
}
.after-guess::after {
  display: none;
}

.main-input {
  display: block;
  font-weight: 700;
  font-size: 2vw;
  height: 6vw;
  padding: 1vw;
  border-radius: 5px;
  border: solid #000 1.5px;
  box-shadow: 2px 2px 5px #3c3c3c;
  background: linear-gradient(to right, #cccccc, #7aaecc);
  width: 100%;
  box-sizing: border-box;
}
.result-title {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #ffffff, #99daff);
}
.main-input h2 {
  font-size: 2vw;
  display: block;
}
.main-content-box {
  height: 20vh;
  display: flex;
  align-items: center;
}
.guess-unit,
.first-end {
  width: 32vw;
}

.guess-data-area div input,
.guess-data-area div select {
  display: block;
  height: 3vw;
  min-height: 15px;
  font-weight: 700;
  margin-right: 2vw;
  border-radius: 5px;
  border: solid #000 1.5px;
  box-shadow: 2px 2px 5px #3c3c3c;
  background: linear-gradient(to right, #cccccc, #7aaecc);
  width: 100%;
  box-sizing: border-box;
}
.guess-data-area div input {
  padding: 0.5vw;
  width: 18vw;
  font-size: 1.3vw;
}
.numchange-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14vw;
  margin-left: 2vw;
  margin-top: 2vh;
  height: 3vw;
  min-height: 15px;
  font-weight: 700;
  border: solid #000 1.5px;
  box-shadow: 2px 2px 5px #3c3c3c;
  background: linear-gradient(to right, #ffff00, #99daff);
  box-sizing: border-box;
}
.numchange-button h4 {
  display: block;
  font-size: 1.2vw;
}
.data-number-button,
.digit-up-button,
.digit-down-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  margin-left: 2vw;
  height: 2vw;
  min-height: 15px;
  font-weight: 700;
  border: solid #000 1.5px;
  box-shadow: 2px 2px 5px #3c3c3c;
  background: linear-gradient(to right, #ffff00, #99daff);
  box-sizing: border-box;
}
.digit-up-button,
.digit-down-button {
  width: 90px;
}
.data-number-button h4,
.digit-up-button h4,
.digit-down-button h4 {
  display: block;
  font-size: 10px;
}
.guess-data-area div select {
  width: 5vw;
  font-size: 1.5vw;
}
.guess-data-area {
  display: flex;
}
.third-data input {
  margin-right: 0;
}
.result-data {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #ffffff, #99daff);
  width: 50vw;
}
.result-data-unit {
  margin-left: 1vw;
  font-size: 1vw;
}

.equation-area {
  width: 50vw;
  height: 6vw;
  margin-top: calc((25vh - 8.5vw) / 2);
  border: solid #000 1.5px;
  box-shadow: 2px 2px 5px #3c3c3c;
  background: linear-gradient(to right, #ffffff, #99daff);
  box-sizing: border-box;
}
.equation-area h2 {
  font-size: 1.6vw;
  margin-left: 10px;
  margin-bottom: 0.8vw;
  line-height: 2;
  text-align: left;
  display: block;
  box-sizing: border-box;
}
.guess-equation {
  width: 50vw;
  margin-right: 8vw;
}
.guess-equation::after {
  content: "";
  display: block;
  width: 0.15vw;
  height: 26vh;
  background-color: #000;
  position: absolute;
  right: -4vw;
  top: -3vh;
}
.guess-button-area {
  width: 14vw;
  height: 20vh;
  margin-bottom: 5vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.discription {
  display: block;
  width: calc(50vw - 20px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.guess-button,
.next-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12vw;
  height: 12vw;
  max-width: 20vh;
  max-height: 20vh;
  font-weight: 700;
  border: solid #000 1.5px;
  box-shadow: 2px 2px 5px #3c3c3c;
  background: linear-gradient(to right, #ffff00, #99daff);
  box-sizing: border-box;
}
.guess-button h3,
.next-button h3 {
  display: block;
  font-size: min(5vh, 3vw);
}

.second-leading {
  width: 72vw;
}
.genre-box {
  width: 32vw;
}
.keyword-box {
  width: 20vw;
}
.keyword-add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6vw;
  margin-left: 2vw;
  margin-top: 2vh;
  height: 3vw;
  min-height: 15px;
  font-weight: 700;
  border: solid #000 1.5px;
  box-shadow: 2px 2px 5px #3c3c3c;
  background: linear-gradient(to right, #ffff00, #99daff);
  box-sizing: border-box;
}
.keyword-add-button h4 {
  display: block;
  font-size: 1.2vw;
}
#sort-box {
  width: 42vw;
  height: 100%;
  margin-left: 2vw;
  display: flex;
}
.review-button-area {
  width: 20vw;
  margin-left: 2vw;
}
.good-button,
.bad-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14vw;
  margin-left: 3vw;
  margin-bottom: 2vh;
  height: 3vw;
  min-height: 20px;
  font-weight: 700;
  border: solid #000 1.5px;
  box-shadow: 2px 2px 5px #3c3c3c;
  background: linear-gradient(to right, #ffff00, #99daff);
  box-sizing: border-box;
}
.good-button h3,
.bad-button h3 {
  display: block;
  font-size: 1.5vw;
}

.source-area {
  display: flex;
  justify-content: space-evenly;
}
.link-button,
.copy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20vw;
  margin-left: 3vw;
  margin-bottom: 2vh;
  height: 3vw;
  min-height: 20px;
  font-weight: 700;
  border: solid #000 1.5px;
  box-shadow: 2px 2px 5px #3c3c3c;
  background: linear-gradient(to right, #ffff00, #99daff);
  box-sizing: border-box;
}
.link-button h3 {
  display: block;
  font-size: 1.5vw;
}
.copy-button h3 {
  display: block;
  font-size: 1.5vw;
}
.parent-data-area {
  width: 50vw;
  height: 6vw;
  margin-top: calc((25vh - 8.5vw) / 2);
  border: solid #000 1.5px;
  box-shadow: 2px 2px 5px #3c3c3c;
  background: linear-gradient(to right, #ffffff, #99daff);
  box-sizing: border-box;
}
.parent-data-area h2 {
  font-size: 1.6vw;
  margin-left: 10px;
  margin-bottom: 0.8vw;
  line-height: 2;
  text-align: left;
  display: block;
  box-sizing: border-box;
}
.parent {
  text-decoration: underline;
  color: #00a3ff;
  cursor: pointer;
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
  background: linear-gradient(#ffffff, #99daff);
  height: 90vh;
  width: 20vw;
  min-height: 500px;
}
.sidebar-title-box {
  margin-left: 2vw;
  display: flex;
  justify-content: flex-start;
  position: relative;
}
.sidebar-title-box * {
  display: inline-block;
}
.line-arrow-in-sidebar {
  top: 0;
  width: 17vw;
  height: 0.5vw;
  border-bottom: 0.1vw solid #000;
  border-right: 0.2vw solid #000;
  transform: skew(45deg);
  margin-left: 1vw;
}
.sidebar-title-leading {
  font-size: 1.5vw;
  margin-right: 2vw;
  position: relative;
  font-weight: 600;
}
.sidebar-title-leading::after {
  content: "";
  display: block;
  width: 0.1vw;
  height: 1.9vw;
  background-color: #000;
  position: absolute;
  right: -1vw;
  top: -0.2vw;
}
.sidebar-title-end {
  font-size: 1.5vw;
  font-weight: 600;
  font-style: italic;
}
#favorite-post-container,
#new-post-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#favorite-post-container {
  margin: 3vh 2.5vw;
  height: 30vh;
  justify-content: space-between;
}
#new-post-container {
  margin: 3vh 2.5vw;
  height: 15vh;
  justify-content: center;
}

.favorite-post {
  height: 40vh;
  margin-top: 15px;
  position: relative;
}
.favorite-post::after,
.new-post::after {
  content: "";
  display: block;
  width: 18vw;
  height: 0.15vw;
  background-color: #000;
  position: absolute;
  bottom: 0;
  left: 0.8vw;
}
.ad {
  height: calc(20vh - 30px);
}
.new-post {
  height: 30vh;
  margin-top: 15px;
  position: relative;
}
</style>
