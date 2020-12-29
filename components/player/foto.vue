<template>
  <div class="d-flex flex-column align-items-center">
    <div class="activity-text" id="question">
      {{ element.component.question }}
    </div>
    <video
      class="activity-image mb-4"
      id="webcam"
      autoplay
      playsinline
    ></video>
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
  methods: {},
  mounted: function () {
    let webcamElement = document.getElementById("webcam");
    let webcam = new Webcam(webcamElement, "user");
    console.log(webcamElement);
    console.log(webcam);
    webcam
      .start()
      .then((result) => {
        console.log("webcam started");
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style></style>
