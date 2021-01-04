<template>
  <div class="d-flex flex-column">
    <div class="activity-text" id="question">
      {{ element.component.question }}
    </div>
    <b-form-group>
      <b-form-radio
        v-for="(radio_answer, index) in element.component.answers"
        :key="index"
        v-model="answer"
        :value="index"
        name="answers"
        class="my-1"
        >{{ radio_answer }}
      </b-form-radio>
    </b-form-group>
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
      let is_correct =
        parseInt(this.element.component.correct_answer) == this.answer;
      this.$emit("answer-sent", is_correct);
    },
  },
  watch: {
    answer_confirmed(isConfirmed) {
      if (isConfirmed) {
        let complete = this.is_answer_done;
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
