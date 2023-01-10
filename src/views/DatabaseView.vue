<template>
  <div class="app-bar">
    <h1>アップバー</h1>
    <button @click="goDev">dev</button>
    <button @click="change"></button>
  </div>
  <input type="text" list="data" autocomplete="on" />
  <datalist id="data">
    <option value="あいう" class="option">あいう</option>
    <option value="かきく">かきく</option>
  </datalist>
  <div>
    <button @click="back">戻る</button>
    <button @click="test">テスト</button>
    <button @click="test2">テスト2</button>
    <div>
      <h4>F9キーか登録ボタンを押すとデータが登録できます。</h4>
    </div>
    <div>
      <label for="name">タイトル</label>
      <input name="name" id="name" v-model="name" />
    </div>
    <h2>データ</h2>
    <input type="text" v-model="data" />
    <h2>単位</h2>
    <input type="text" v-model="unit" />
    <h2>年</h2>
    <input type="text" v-model="year" />
    <h2>参照</h2>
    <input type="url" v-model="ref" />
    <button @click="postData">登録</button>
  </div>
</template>

<script>
import {
  collection,
  setDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "@firebase/firestore";
import { db } from "@/firebase.js";
export default {
  data() {
    return {
      data: "",
      unit: "",
      year: "",
      ref: "",
      name: "",
      dataBox: {
        first: "1",
      },
      prefectures: [
        "北海道",
        "青森県",
        "岩手県",
        "宮城県",
        "秋田県",
        "山形県",
        "福島県",
        "茨城県",
        "栃木県",
        "群馬県",
        "埼玉県",
        "千葉県",
        "東京都",
        "神奈川県",
        "新潟県",
        "富山県",
        "石川県",
        "福井県",
        "山梨県",
        "長野県",
        "岐阜県",
        "静岡県",
        "愛知県",
        "三重県",
        "滋賀県",
        "京都府",
        "大阪府",
        "兵庫県",
        "奈良県",
        "和歌山県",
        "鳥取県",
        "島根県",
        "岡山県",
        "広島県",
        "山口県",
        "徳島県",
        "香川県",
        "愛媛県",
        "高知県",
        "福岡県",
        "佐賀県",
        "長崎県",
        "熊本県",
        "大分県",
        "宮崎県",
        "鹿児島県",
        "沖縄県",
      ],
      postData: async () => {
        const colref = collection(db, "data");
        const postData = {
          degree: 1,
          title: this.name,
          latest: Number(this.data),
          year: Number(this.year),
          ref: this.ref,
          unit: this.unit,
          parent: {},
        };
        await setDoc(doc(colref, `${this.name}`), postData);
        const ref = doc(db, "data", "overView");
        await updateDoc(ref, {
          index: arrayUnion({
            title: `${this.name}`,
            degree: postData.degree,
          }),
        });
        if (this.name.includes("一人当たり")) {
          await updateDoc(ref, {
            perPerson: arrayUnion(`${this.name}`),
          });
        }
        let isPref = this.prefectures.some((e) => {
          return this.name.includes(e);
        });
        if (isPref) {
          await updateDoc(ref, {
            pref: arrayUnion(`${this.name}`),
          });
        }
        this.data = "";
        this.unit = "";
        this.year = "";
        this.ref = "";
        this.name = "";
      },
    };
  },
  methods: {
    back() {
      this.$router.push("/");
    },
    test() {
      this.second = "";
      console.log(this.second);
    },
    test2() {
      this.second = 3;
      console.log(this.second);
    },
    goDev() {
      this.$router.push("/database");
    },
  },
  mounted() {
    window.onload = function () {
      document.getElementById("name").focus();
    };
    document.onkeydown = (e) => {
      if (e.key === "F9") {
        this.postData();
      }
    };
  },
};
</script>

<style scoped>
.app-bar {
  height: 15vh;
  background-color: #aeaeae;
}

.option {
  background-color: aqua;
}
</style>
