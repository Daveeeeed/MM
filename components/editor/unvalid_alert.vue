<template>
  <b-modal id="non-valid" title="Attenzione">
    <b-container class="mt-2" fluid>
      <h5>Sono stati trovati i seguenti errori:</h5>
      <ul>
        <li v-if="empty_title">Il titolo non può essere vuoto</li>
        <li v-if="empty_time">Il tempo non può essere nullo</li>
        <li v-if="empty_element">
          Una o più elementi dell'attività sono incompleti
        </li>
        <li v-if="missing_special">Seleziona un componente tra i necessari</li>
        <li v-if="empty_start_activity">Manca l'attività iniziale</li>
        <li v-if="empty_activity">Nessuna attività aggiunta</li>
        <li v-if="unvalid_component">
          Controlla di aver riempito correttamente tutti i campi
        </li>
        <li v-if="empty_paths">Inserisci almeno un percorso</li>
        <li v-if="empty_connection">Inserisci gli esiti delle attività</li>
        <li v-if="empty_path_name">Inserisci un titolo ad ogni percorso</li>
        <li v-if="invalid_story_type">
          Specifica il tipo di storia in Impostazioni Storia
        </li>
        <li v-if="empty_story_missions">
          Inserisci almeno una missione in tutti i percorsi
        </li>
        <li v-if="empty_first_mission">
          Specifica la missione iniziale in ogni percorso
        </li>
        <li v-if="empty_story_results">
          Specifica un esito per ogni missione di ogni percorso
        </li>
      </ul>
    </b-container>
  </b-modal>
</template>


<script>
module.exports = {
  props: {
    empty_title: {
      type: Boolean,
      default: false,
    },
    empty_time: {
      type: Boolean,
      default: false,
    },
    empty_element: {
      type: Boolean,
      default: false,
    },
    missing_special: {
      type: Boolean,
      default: false,
    },
    empty_start_activity: {
      type: Boolean,
      default: false,
    },
    empty_activity: {
      type: Boolean,
      default: false,
    },
    unvalid_component: {
      type: Boolean,
      default: false,
    },
    empty_paths: {
      type: Boolean,
      default: false,
    },
    empty_connection: {
      type: Boolean,
      default: false,
    },
    empty_path_name: {
      type: Boolean,
      defaul: false,
    },
    invalid_story_type: {
      type: Boolean,
      defaul: false,
    },
    empty_story_missions: {
      type: Boolean,
      defaul: false,
    },
    empty_first_mission: {
      type: Boolean,
      defaul: false,
    },
    empty_story_results: {
      type: Boolean,
      defaul: false,
    },
    empty_path_title: {
      type: Boolean,
      defaul: false,
    },
  },
};
</script>

<style>
</style>