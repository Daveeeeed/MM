<template>
  <b-modal
    @hide="onHide"
    @ok="onOk"
    title="Titolo del percorso"
    ok-only
    :id="path.key"
  >
    <b-container fluid>
      <b-row>
        <b-col class="py-3">
          <b-form-input
            v-model="pathName"
            maxlength="25"
            placeholder="Nome del percorso"
          ></b-form-input>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
module.exports = {
  data() {
    return {
      pathName: null,
    };
  },
  props: {
    path: null,
  },
  methods: {
    onHide() {
      this.pathName = JSON.parse(JSON.stringify(this.path.name));
    },
    onOk() {
      this.path.name = this.pathName;
    },
  },
  mounted() {
    if (this.path) this.pathName = JSON.parse(JSON.stringify(this.path.name));
  },
};
</script>

<style>
</style>