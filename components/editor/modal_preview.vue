<template>
  <div>
    <b-modal size="lg" id="modal-preview" hide-header centered>
      <template #default>
        <div class="p-5">
          <div v-if="!(activity || activity.elements)">
            L'attività non ha nessun componente
          </div>
          <div v-else id="activity-content">
            <component
              v-for="(element, index) in activity.elements"
              :key="index"
              :is="element.component.type"
              :element="element"
            >
            </component>
          </div>
        </div>
      </template>

      <template #modal-footer="{ hide }">
        <div d-flex justify-content-end>
          <b-button class="mx-1" @click="hide()"> Indietro </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {};
  },
  props: {
    activity: Object,
  },
  methods: {},
  components: {
    Collega: httpVueLoader("comp/player/collega.vue"),
    Descrizione: httpVueLoader("comp/player/descrizione.vue"),
    Domanda: httpVueLoader("comp/player/domanda.vue"),
    Foto: httpVueLoader("comp/player/foto.vue"),
    Immagine: httpVueLoader("comp/player/immagine.vue"),
    Memory: httpVueLoader("comp/player/memory.vue"),
    "Scelta Multipla": httpVueLoader("comp/player/scelta_multipla.vue"),
    Testo: httpVueLoader("comp/player/testo.vue"),
    Video: httpVueLoader("comp/player/video.vue"),
  },
};
</script>

<style>
#activity-content {
  height: auto;
  align-items: center;
  display: flex;
  flex-direction: column;
}

.btn {
  background-color: var(--form-color);
  border: none;
  color: var(--text-color);
  cursor: pointer;
  border-radius: 10px;
}

.btn:hover {
  background-color: var(--hover-color);
  border: none;
}

.form-control {
  background-color: var(--form-color);
  color: var(--text-color);
  border: none;
  border-radius: 10px;
}

.form-control:focus {
  background-color: var(--form-color);
  color: var(--text-color);
  border: none;
  box-shadow: none;
}

.activity-image {
  height: auto;
  max-width: 90%;
  border-style: solid;
  border-width: 2px;
  border-color: var(--text-color);
  margin-bottom: 20px;
}

.activity-webcam {
  height: auto;
  max-width: 90%;
  border-style: solid;
  border-width: 5px;
  border-color: var(--form-color);
}

.activity-text {
  margin-bottom: 20px;
  width: 100%;
}
</style>
