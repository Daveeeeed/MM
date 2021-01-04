<template>
  <div class="d-flex flex-wrap">
    <div class="d-flex flex-column align-items-center">
      <h2>Prime parti</h2>
      <div v-for="(part, index) in first_parts" :key="index">
        {{ part.phrase }}
      </div>
    </div>
    <div class="d-flex flex-column align-items-center">
      <h2>Seconde parti</h2>
      <div class="d-flex flex-wrap mission-group-item justify-content-center">
        <b-button
          v-for="(part, index) in second_parts"
          :key="index"
          class="m-2 list-group-item"
          @click="selectPart(part)"
          :disabled="disablePart(part)"
          :class="checkSelected(part)"
          style="height: 75px; width: 130px"
        >
          {{ part.phrase }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      first_parts: [],
      second_parts: [],
      selected_part: null,
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
    disablePart(part) {
      return false;
    },
    // Component selection
    selectPart(part) {
      if (this.selected_part) {
        if (this.selected_part == part) {
          this.selected_part = null;
        } else {
          this.selected_part = part;
        }
      } else {
        this.selected_part = part;
      }
    },
    checkSelected(part) {
      return {
        unavailable: part != this.selected_part,
      };
    },
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

<style>
.list-group-item {
  background-color: var(--object-color);
  color: var(--text-color);
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 2px 0 var(--active-color);
  overflow: hidden;
  outline: 0;
}

.list-group-item:hover {
  background-color: var(--hover-color);
}

.list-group-item:focus {
  background-color: var(--hover-color);
}

.list-group-item.unavailable {
  color: var(--disabled-color);
  box-shadow: 0 2px 0 var(--disabled-color);
}
</style>
