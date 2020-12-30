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
      this.$emit("answer-sent", answer);
    }
  }
};
</script>

<style>
</style>