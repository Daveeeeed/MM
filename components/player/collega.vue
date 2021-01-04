<template>
  <div class="d-flex flex-column" style="width: 100%">
    <p class="align-self-center" style="text-align: center">
      Completa le frasi...
    </p>
    <div class="align-self-start d-flex flex-column">
      <b-button
        v-for="(part, index) in first_parts"
        :key="index"
        class="m-2 connect-item"
        @click="completePhrase(part)"
      >
        {{ part.phrase
        }}{{ part.matched_part ? " " + part.matched_part.phrase : "..." }}
      </b-button>
    </div>
    <p class="align-self-center" style="text-align: center">
      ...scegliendo tra queste parti
    </p>
    <div class="d-flex flex-wrap justify-content-center">
      <b-button
        v-for="(part, index) in second_parts"
        :key="index"
        class="m-2 connect-item shadowed"
        @click="selectPart(part)"
        :class="checkSelected(part)"
      >
        {{ part.phrase }}
      </b-button>
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
      this.first_parts.forEach((part) => {
        if (!part.matched_part) return false;
      });
      return true;
    },
  },
  methods: {
    completePhrase(part) {
      if (this.selected_part) {
        this.first_parts.forEach((first_part) => {
          if (first_part.matched_part == part.matched_part) {
            first_part.matched_part = null;
            console.log("resettato uno");
            this.$forceUpdate();
          }
        });
        part.matched_part = this.selected_part;
        this.selected_part = null;
      }
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
      let is_correct = true;
      this.first_parts.forEach((part) => {
        if (part.index != part.matched_part.index) is_correct = false;
      });
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
        matched_part: null,
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
.shadowed {
  box-shadow: 0 2px 0 var(--active-color);
}

.connect-item {
  background-color: var(--object-color);
  color: var(--text-color);
  text-align: center;
  border-radius: 10px;
  overflow: hidden;
  outline: 0;
  width: fit-content;
  text-align: start;
}

.connect-item:hover {
  background-color: var(--hover-color);
}

.connect-item:focus {
  background-color: var(--hover-color);
}

.connect-item.unavailable {
  color: var(--disabled-color);
  box-shadow: 0 2px 0 var(--disabled-color);
}
</style>
