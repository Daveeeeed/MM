<template>
  <div>
    <h2>Prime parti</h2>
    <div v-for="(part, index) in first_parts" :key="index">
      {{part.phrase}}
    </div>
    <h2>Seconde parti</h2>
    <div v-for="(part, index) in second_parts" :key="index">
      {{part.phrase}}
    </div>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      first_parts: [],
      second_parts: [],
    };
  },
  props: {
    element: Object,
    answer_confirmed: Boolean,
  },
  computed: {
    is_answer_done: function () {
      return false;
    },
  },
  methods: {
    sendAnswer() {
      let is_correct = false;
      this.$emit("answer-sent", is_correct);
    },
  },
  watch: {
    answer_confirmed(isConfirmed) {
      if (isConfirmed) {
        if (this.is_answer_done) this.sendAnswer();
        this.$emit("answer-checked");
      }
    },
  },
  mounted: function () {
    // Array setup
    this.element.component.answers.forEach((answer, index) => {
      this.first_parts.push({
        index: index,
        phrase: answer.first,
      });
      this.second_parts.push({
        index: index,
        phrase: answer.second,
      });
    });
    this.first_parts.sort(() => 0.5 - Math.random());
    this.second_parts.sort(() => 0.5 - Math.random());
  },
};
</script>

<style></style>
