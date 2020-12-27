<template>
  <img class="activity-image" :src="element.component.url" :alt="element.component.description" />
</template>

<script>
module.exports = {
  data() {
    return {};
  },
  props: {
    element: Object,
  },
};
</script>

<style></style>
