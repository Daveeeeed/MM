<template>
  <div id="memory-grid">
    <div
      v-for="(card, index) in card_array"
      :key="index"
      :class="cardClass(card)"
      class="memory-card"
    ></div>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      card_array: [],
    };
  },
  props: {
    element: Object,
  },
  methods: {
    cardClass(card) {
      return {
        flipped: card.flipped,
        coupled: card.coupled,
      };
    },
    sendAnswer() {
      let answer;
      this.$emit("answer-done", answer);
    },
    updateCardsHeight(first = false) {
      if (first) console.log("cao")
      else $(".memory-card").height($(".memory-card").width());
    },
  },
  mounted: function () {
    this.element.component.images.forEach((image) => {
      let obj = {
        name: image.url,
        "flipped-card": false,
        "coupled-card": false,
      };
      this.card_array.push(obj);
      this.card_array.push(obj);
    });
    this.card_array.sort(() => 0.5 - Math.random());

    this.updateCardsHeight();

    let that = this;
    $(window).resize(function () {
      that.updateCardsHeight();
    });
  },
};
</script>

<style></style>
