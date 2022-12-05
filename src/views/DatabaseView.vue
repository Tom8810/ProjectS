<template>
  <appBarVue />
  <div>
    <button @click="back">戻る</button>
    <button @click="test">テスト</button>
    <div>
      <h4>F9キーか登録ボタンを押すとデータが登録できます。</h4>
      <label for="furigana">ふりがな</label>
      <input name="furigana" id="furigana" v-model="furigana" />
    </div>
    <div>
      <label for="name">タイトル</label>
      <input name="name" id="name" v-model="name" @input="handleNameInput" />
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
import * as AutoKana from "vanilla-autokana";
let autokana;
import appBarVue from "@/components/AppBar.vue";
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
      furigana: "",
      postData: async () => {
        const colref = collection(db, "data");
        const postData = {
          degree: 1,
          title: this.name,
          kana: this.furigana,
          latest: Number(this.data),
          year: Number(this.year),
          ref: this.ref,
          unit: this.unit,
          parent: {},
        };
        await setDoc(doc(colref, `${this.name}`), postData);
        if (this.name.includes("一人当たり")) {
          const ref = doc(db, "data", "overView");
          await updateDoc(ref, {
            perPerson: arrayUnion(`${this.name}`),
          });
        }
        this.data = "";
        this.unit = "";
        this.year = "";
        this.ref = "";
        this.name = "";
        this.furigana = "";
      },
    };
  },
  methods: {
    isKana() {
      let tmp = [];

      this.title.split("").forEach(function (char) {
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
    back() {
      this.$router.push("/");
    },
    handleNameInput() {
      this.furigana = autokana.getFurigana();
    },
    test() {
      let str = "あいうえお";
      console.log(str.replace("あい", ""));
    },
  },
  mounted() {
    autokana = AutoKana.bind("#name", "#furigana");
    window.onload = function () {
      document.getElementById("name").focus();
    };
    document.onkeydown = (e) => {
      if (e.key === "F9") {
        this.postData();
      }
    };
  },
  components: { appBarVue },
};
</script>

<style scoped></style>
