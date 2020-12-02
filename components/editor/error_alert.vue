<template>
  <b-modal id="non-valid" title="Attenzione">
    <b-container class="mt-2" fluid>
      <h5>Sono stati trovati i seguenti errori:</h5>
      <ul>
        <li v-for="(error,index) in errors" :key="index">
          {{error}}
        </li>
        <!-- 
        <li v-if="errors.empty_title">Il titolo non può essere vuoto</li>
        <li v-if="errors.empty_time">Il tempo non può essere nullo</li>
        <li v-if="errors.empty_element">
          Una o più elementi dell'attività sono incompleti
        </li>
        <li v-if="errors.missing_special">
          Seleziona un componente tra i necessari
        </li>
        <li v-if="errors.empty_start_activity">Manca l'attività iniziale</li>
        <li v-if="errors.empty_activity">Nessuna attività aggiunta</li>
        <li v-if="errors.unvalid_component">
          Controlla di aver riempito correttamente tutti i campi
        </li>
        <li v-if="errors.empty_paths">Inserisci almeno un percorso</li>
        <li v-if="errors.empty_connection">
          Inserisci gli esiti delle attività
        </li>
        <li v-if="errors.empty_path_name">
          Inserisci un titolo ad ogni percorso
        </li>
        <li v-if="errors.invalid_story_type">
          Specifica il tipo di storia in Impostazioni Storia
        </li>
        <li v-if="errors.empty_story_missions">
          Inserisci almeno una missione in tutti i percorsi
        </li>
        <li v-if="errors.empty_first_mission">
          Specifica la missione iniziale in ogni percorso
        </li>
        <li v-if="errors.empty_story_results">
          Specifica un esito per ogni missione di ogni percorso
        </li>
        -->
      </ul>
    </b-container>
  </b-modal>
</template>


<script>
module.exports = {
  props: {
    errors: {
      type: Array,
    },
  },
};
</script>

<style>
</style>