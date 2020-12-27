<template>
  <video class="activity-image" :src="element.component.url" controls></video>
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
