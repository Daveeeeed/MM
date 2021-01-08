<template>
  <div class="d-flex flex-column align-items-center" style="width: 100%">
    <img
      class="activity-image"
      :src="element.component.url"
      :alt="element.component.description"
    />
    <div class="activity-text" style="text-align: center">
      {{ element.component.description }}
    </div>
  </div>
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
