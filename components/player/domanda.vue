<template>
  <div class="d-flex flex-column">
    <div id="question">{{ element.component.question }}</div>
    <b-input id="answer" class="mt-4" v-model="answer"></b-input>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      answer: null,
    };
  },
  props: {
    element: Object,
    answer_confirmed: Boolean,
  },
  methods: {
    sendAnswer() {
      let current = this.answer.toLowerCase();
      let correct = this.element.component.answers;
      let is_correct = false;
      for (let i = 0; i < correct.length; i++) {
        is_correct = is_correct || correct[i].toLowerCase() == current;
      }
      this.$emit("answer-sent", is_correct);
    },
  },
  watch: {
    answer_confirmed(isConfirmed) {
      if (isConfirmed) {
        this.sendAnswer();
        this.$emit("answer-checked");
      }
    },
  },
};
</script>

<style>
#question {
  font-size: 1.5em;
  text-align: center;
}

#answer {
  height: 2em;
}
</style>