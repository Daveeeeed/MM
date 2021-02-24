<template>
  <div id="browse">
    <a href="/">
      <img
        class="mt-3"
        src="https://site181982.tw.cs.unibo.it/public/images/logo2.png"
        alt="Logo"
        height="100"
      />
    </a>
    <h1 class="mt-2">Storie disponbili</h1>
    <div
      v-for="(story, index) in stories"
      :key="index"
      class="story-card"
      :style="'background-image: url(' + story.settings.background + ')'"
    >
      <h2 class="my-2 story-name">
        {{ story.title }}
        <sup
          ><b-icon
            icon="info-circle"
            @click="showStoryInfoModal(story)"
          ></b-icon
        ></sup>
      </h2>
      <b-button
        :href="'/play?key=' + story.key"
        class="my-2 play-button"
        @click="play(story)"
        size="lg"
        >Gioca</b-button
      >
    </div>

    <b-modal id="story-info-modal" title="Informazioni" ok-only>
      <div v-if="story_info" class="px-3 py-2 d-flex flex-column">
        <div>Tipo di giocatore</div>
        <ul>
          <li>Singolo: {{ story_info.settings.player.single ? "✓" : "✗" }}</li>
          <li>Gruppo: {{ story_info.settings.player.group ? "✓" : "✗" }}</li>
          <li>Classe: {{ story_info.settings.player.class ? "✓" : "✗" }}</li>
        </ul>
        <div>Età consigliata</div>
        <ul v-if="story_info">
          <li>7-10: {{ story_info.settings.player.sette ? "✓" : "✗" }}</li>
          <li>11-14: {{ story_info.settings.player.undici ? "✓" : "✗" }}</li>
          <li>15-18: {{ story_info.settings.player.quindici ? "✓" : "✗" }}</li>
        </ul>
        <div>Accessibile: {{ story_info.settings.accessible ? "✓" : "✗" }}</div>
      </div>
    </b-modal>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      stories: [],
      story_info: null,
    };
  },
  methods: {
    showStoryInfoModal(story) {
      this.$bvModal.show("story-info-modal");
      this.story_info = story;
    },
    fetchStories() {
      fetch("/api/stories")
        .then((response) => response.json())
        .then((data) => {
          let a = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].settings.published) a.push(data[i]);
          }
          this.stories = a;
        });
    },
  },
  mounted: function () {
    this.fetchStories();
  },
};
</script>

<style>
body {
  background-color: var(--primary-color);
  color: var(--text-color);
}

#browse {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.story-card {
  width: calc(100vw - 100px);
  height: 200px;
  background: var(--object-color);
  border-radius: 20px;
  border: none;
  margin-top: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 3px 0px var(--active-color), 3px 3px 8px black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.story-name {
  text-shadow: 0px 0px 20px black, 0px 0px 8px black;
}

/* BOTTONE */
.btn {
  background-color: var(--form-color);
  border: none;
  border-radius: 10px;
}

.btn:hover {
  background-color: var(--hover-color);
  border: none;
  border-radius: 10px;
}

.play-button {
  background: var(--form-color);
  color: var(--text-color);
  border: none;
}

.play-button:hover {
  background: var(--hover-color);
}

.play-button:focus {
  background: var(--hover-color);
}

.modal-header {
  background-color: var(--secondary-color);
  border: 0px;
}

.modal-footer {
  background-color: var(--secondary-color);
  border: 0px;
}

.modal-content {
  background-color: var(--primary-color);
  color: var(--text-color);
}

.modal-body {
  padding: 0px;
}
</style>
