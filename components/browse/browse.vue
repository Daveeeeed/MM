<template>
  <div id="browse">
    <a href="/">
      <img
        class="mt-3"
        src="../public/images/logo2.png"
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
      <h3 class="my-2 story-name">{{ story.title }}</h3>
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
  background-color: #121421;
  color: white;
}

#browse {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.story-card {
  width: calc(100vw - 100px);
  height: 200px;
  background: #171926;
  border-radius: 20px;
  border: none;
  margin-top: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 3px 0px #00bd58;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-position: center;
}

.play-button {
  background: #232538;
  color: white;
  border: none;
}

.play-button:hover {
  background: #28293d;
}
</style>
