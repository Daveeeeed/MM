<template>
  <div class="d-flex flex-column align-items-center">
    <div class="activity-text" id="question">
      {{ element.component.question }}
    </div>
    <div v-show="!webcam">
      <div>
        Per visualizzare correttamente la pagina è richiesto l'accesso alla
        webcam.<br />
        Ricarica la pagina e consenti l'accesso alla webcam.
      </div>
      <b-button @click="activateWebcam"
        ><b-icon-camera-fill></b-icon-camera-fill
      ></b-button>
    </div>
    <div v-show="webcam">
      <div style="width: 100%" class="d-flex flex-column align-items-center">
        <canvas id="canvas" style="display: none"></canvas>
        <img
          v-show="shooted_photo"
          class="activity-webcam"
          :src="shooted_photo"
          id="shoot"
        />
        <video
          v-show="!shooted_photo"
          class="activity-webcam"
          id="webcam"
          autoplay
          playsinline
        ></video>
        <div class="d-flex" style="width: 90%">
          <b-button
            v-show="shooted_photo"
            class="webcam-button left-button"
            @click="retryPhoto"
            >Riprova</b-button
          >
          <b-button
            v-show="!shooted_photo"
            class="webcam-button left-button"
            @click="takePhoto"
            ><b-icon-camera-fill></b-icon-camera-fill
          ></b-button>
          <b-button
            v-show="!shooted_photo"
            class="webcam-button rigth-button"
            @click="swapCam"
            ><b-icon-arrow-repeat></b-icon-arrow-repeat
          ></b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      webcam: null,
      shooted_photo: null,
    };
  },
  props: {
    element: Object,
    answer_confirmed: Boolean,
    answer_verified: Boolean,
  },
  computed: {
    is_answer_done: function(){
      return this.shooted_photo != null;
    }
  },
  methods: {
    swapCam() {
      this.webcam.flip();
    },
    takePhoto() {
      this.shooted_photo = this.webcam.snap();
      let image = document.getElementById("shoot");
      let webcamElement = document.getElementById("webcam");
      image.style.width = webcamElement.width.toString() + "px";
      this.webcam.stop();
    },
    activateWebcam() {
      let webcamElement = document.getElementById("webcam");
      let canvas = document.getElementById("canvas");
      this.webcam = new Webcam(webcamElement, "user", canvas);
      this.webcam.start().catch((err) => {
        this.webcam = null;
      });
    },
    retryPhoto() {
      this.shooted_photo = null;
      this.activateWebcam();
    },
    sendAnswer() {
      this.$emit(
        "verify-answer",
        this.shooted_photo,
        this.element.component.question
      );
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
    this.activateWebcam();
  },
  beforeDestroy: function () {
    this.webcam.stop();
  },
};
</script>

<style>
.webcam-button {
  width: 100%;
  border-radius: 0px;
}

.webcam-button:hover {
  width: 100%;
  border-radius: 0px;
}

.webcam-button:focus {
  width: 100%;
  border-radius: 0px;
}

.webcam-button.left-button {
  border-bottom-left-radius: 10px;
}

.webcam-button.right-button {
  border-bottom-right-radius: 10px;
}
</style>
