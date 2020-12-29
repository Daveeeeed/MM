<template>
  <div id="browse">
    <a href="/">
      <img
        class="mt-3"
        src="http://localhost:8000/public/images/logo2.png"
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
      <h3 class="my-2 story-name">
        {{ story.title }}
      </h3>
      <b-button
        :href="'/play?key=' + story.key"
        class="my-2 play-button"
        @click="play(story)"
        size="lg"
        >Gioca</b-button
      >
    </div>
  </div>
</template>

<script>
module.exports = {
  data() {
    return {
      stories: [],
    };
  },
  methods: {
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
}

.story-name {
  text-shadow: 0px 0px 20px black, 0px 0px 8px black;
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
</style>
