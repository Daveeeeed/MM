<template>
  <div></div>
</template>

<script>
module.exports = {
  data() {
    return {};
  },
  props: {
    element: Object,
  },
  methods: {
    sendAnswer(){
      let answer;
      this.$emit("answer-done", answer);
    }
  }
};
</script>

<style>
</style>