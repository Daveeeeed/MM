<template>
  <div class="activity-text">{{ element.component.text }}</div>
</template>

<script>
module.exports = {
  data() {
    return {};
  },
  props: {
    element: Object,
    answer_confirmed: Boolean,
  },
  methods: {
    sendAnswer() {
      let answer;
      this.$emit("answer-done", answer);
    },
  },
  watch: {
    answer_confirmed(isConfirmed) {
      if (isConfirmed) {
        this.$emit("answer-sent", true);
        this.$emit("answer-checked");
      }
    },
  },
};
</script>

<style></style>
