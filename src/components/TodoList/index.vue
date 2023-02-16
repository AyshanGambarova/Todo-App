<template>
  <ul v-for="(todo, index) in todosFromStorage" :key="index">
    <li>{{ todo.subject }}</li>
  </ul>
</template>
<script lang="ts">
import script from "./main";
export default script;
</script>
