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
      let current_answers = current.split(",");
      current_answers.forEach((ans, index) => {
        current_answers[index] = ans.replace(" ", "");
      });
      let nr = this.element.component.nr_answer_required;

      for (let i = 0; i < current_answers.length; i++) {
        for (let j = 0; j < correct.length; j++) {
          if (current_answers[i] == correct[j]) {
            nr--;
            correct.splice(j, 1);
          }
          if (nr == 0) this.$emit("answer-sent", true);
        }
      }
      this.$emit("answer-sent", false);
    },
  },
  watch: {
    answer_confirmed(isConfirmed) {
      if (isConfirmed) {
        let complete = this.is_answer_done;
        this.answer = null;
        if (complete) this.sendAnswer();
        this.$emit("answer-checked", complete);
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
