<template>
  <div id="memory">
    <div class="activity-text">
      Risolvi il memory per proseguire nella storia
    </div>
    <div
      id="memory-grid"
      :style="'background-image: url(' + element.component.background.url + ')'"
    >
      <div
        v-for="(card, index) in cards_array"
        :key="index"
        class="memory-card"
        @click="!card.coupled ? flipCard(card) : ''"
        :id="'memory-card' + card.id"
        :style="'background-image: url(' + card.name + ')'"
      ></div>
    </div>
    <div v-if="is_answer_done" class="activity-text">
      Complimenti! Hai teminato il memory.
    </div>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      cards_array: [],
      cards_chosen: [],
      cards_won: [],
      cards_to_check: [],
    };
  },
  props: {
    element: Object,
    answer_confirmed: Boolean,
  },
  computed: {
    is_answer_done: function () {
      return this.cards_won.length == this.cards_array.length;
    },
  },
  methods: {
    updateCardsHeight() {
      let width = $(".memory-card").width();
      $(".memory-card").css("height", width + "px");
    },
    flipCard(card) {
      this.cards_chosen.push(card);
      $("#memory-card" + card.id).css("filter", "brightness(1)");
      if (this.cards_chosen.length == 2) {
        this.cards_to_check = this.cards_chosen;
        this.cards_chosen = [];
        setTimeout(this.checkForMatch, 300);
      }
    },
    checkForMatch() {
      let first = this.cards_to_check[0];
      let second = this.cards_to_check[1];
      if (first.id == second.id) {
        this.resetCard(first);
      } else if (first.name == second.name) {
        this.clearCard(first);
        this.clearCard(second);
        this.cards_won.push(first);
        this.cards_won.push(second);
      } else {
        this.resetCard(first);
        this.resetCard(second);
      }
      this.cards_to_check = [];
    },
    resetCard(card) {
      let el = $("#memory-card" + card.id);
      el.css("filter", "brightness(0)");
    },
    clearCard(card) {
      this.resetCard(card);
      let el = $("#memory-card" + card.id);
      el.css("background-image", "");
      el.css("border", "none");
      el.css("filter", "");
      card.coupled = true;
    },
    sendAnswer() {
      this.$emit("answer-sent", true);
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
  mounted: function () {
    // Array setup
    this.element.component.images.forEach((image) => {
      this.cards_array.push({
        name: image.url,
        id: this.cards_array.length,
        coupled: false,
      });
      this.cards_array.push({
        name: image.url,
        id: this.cards_array.length,
        coupled: false,
      });
    });
    this.cards_array.sort(() => 0.5 - Math.random());
    // Styling adjust
    let that = this;
    setTimeout(() => {
      that.updateCardsHeight();
    }, 2);

    $(window).resize(function () {
      that.updateCardsHeight();
    });
  },
};
</script>

<style></style>
