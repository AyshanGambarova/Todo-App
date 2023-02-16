import { defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  name: "TodoList",
  setup() {
    // #region States
    const todosFromStorage = ref<any>([]);

    //#endregion

    //#region Hooks
    onMounted(() => {
      todosFromStorage.value =
        JSON.parse(localStorage.getItem("todos") as string) || [];
    });
    //#endregion
    return {
      todosFromStorage,
    };
  },
});
