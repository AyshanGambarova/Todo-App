import type { TTodo } from "@/types/Todo";
import { defineComponent, onMounted, ref, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";
export default defineComponent({
  name: "AddTodo",
  setup() {
    //#region States
    let creatingTodo = ref<TTodo>({
      subject: "",
      tags: [],
      completed: false,
    });
    const todos = ref<any>([]);
    const editedItemIndex = ref<any>(null);
    const showAddAlert = ref<boolean>(false);
    const showEditAlert = ref<boolean>(false);

    if (localStorage.getItem("todos") == null) {
      localStorage.setItem("todos", JSON.stringify([]));
    } else {
      todos.value = JSON.parse(localStorage.getItem("todos") as string);
    }
    //#endregion

    //#region Form validation
    const rules = {
      subject: { required }, // Matches creatingTodo.value.subject
    };
    const validate: any = useVuelidate(rules, creatingTodo.value);
    const handleBlur = (key: any) => {
      validate.value[key].$dirty = true;
    };
    //#endregion

    //#region Methods
    const addTag = (event: any) => {
      event.preventDefault();
      let val = event.target.value.trim();
      if (val.length > 0) {
        if (creatingTodo.value.tags.length >= 1) {
          for (let i = 0; i < creatingTodo.value.tags.length; i++) {
            if (creatingTodo.value.tags[i] === val) {
              return false;
            }
          }
        }
        creatingTodo.value.tags.push(val);
        event.target.value = "";
      }
    };

    const removeTag = (index: number) => {
      creatingTodo.value.tags.splice(index, 1);
    };
    const removeLastTag = (event: any) => {
      if (event.target.value.length === 0) {
        removeTag(creatingTodo.value.tags.length - 1);
      }
    };
    async function addTodo() {
      validate.value.$dirty = true;
      if (!validate.value.$error) {
        try {
          if (editedItemIndex.value !== null) {
            await todos.value.splice(
              editedItemIndex.value,
              1,
              creatingTodo.value
            );
            showEditAlert.value = true;
            setTimeout(function () {
              showEditAlert.value = false;
            }, 2000);
            editedItemIndex.value = null;
          } else {
            await todos.value.push(creatingTodo.value);
            showAddAlert.value = true;
            setTimeout(function () {
              showAddAlert.value = false;
            }, 2000);
          }
          localStorage.setItem("tasks", JSON.stringify(todos));
          creatingTodo.value = {
            subject: "",
            tags: [],
            completed: false,
          };
        } catch (error) {
          console.log(error);
        }
      }
    }
    const removeTodo = (index: number) => {
      todos.value.splice(index, 1);
      localStorage.setItem("todos", JSON.stringify(todos));
    };
    const editTodo = (index: number, editedTodo: TTodo) => {
      creatingTodo.value.subject = editedTodo.subject;
      creatingTodo.value.tags = editedTodo.tags.map((tag) => tag);
      editedItemIndex.value = index;
      console.log("edited index click edit", editedItemIndex.value);

      localStorage.setItem("tasks", JSON.stringify(todos));
    };
    const changeStatus = (todoItem: TTodo) => {
      creatingTodo.value.completed = todoItem.completed;
      localStorage.setItem("tasks", JSON.stringify(todos));
    };

    //#endregion

    //#region Hooks
    onMounted(() => {
      todos.value = JSON.parse(localStorage.getItem("todos") as string) || [];
      console.log("edited index on mounted", editedItemIndex.value);
    });
    watch(
      todos,
      (newVal) => {
        localStorage.setItem("todos", JSON.stringify(newVal));
      },
      { deep: true }
    );

    //#endregion

    return {
      creatingTodo,
      addTag,
      removeTag,
      removeLastTag,
      addTodo,
      validate,
      handleBlur,
      todos,
      showAddAlert,
      showEditAlert,
      removeTodo,
      editTodo,
      changeStatus,
      editedItemIndex
    };
  },
});
