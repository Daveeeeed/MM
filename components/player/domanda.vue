<template>
  <div class="d-flex flex-column">
    <label for="question-input" class="activity-text" id="question">
      {{ element.component.question }}
    </label>
    <b-input
      id="question-input"
      class="mb-4"
      v-model="answer"
      placeholder="Inserisci la risposta..."
    ></b-input>
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
  computed: {
    is_answer_done: function () {
      return this.answer != null;
    },
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
        if (this.is_answer_done) this.sendAnswer();
        this.$emit("answer-checked");
      }
    },
  },
};
</script>

<style>
#question {
  text-align: center;
}
</style>
