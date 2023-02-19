import type { TTodo } from "@/types/Todo";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
export default defineComponent({
  name: "AddTodo",
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    ExclamationTriangleIcon,
  },
  setup() {
    //#region States
    let creatingTodo = ref<TTodo>({
      subject: "",
      tags: [],
      completed: false,
    });
    const todos = ref<any>([]);
    const allTags = ref<any>([]);
    const searchingTag = ref<string>("");
    const selectedTag = ref<string>("");
    const editedItemIndex = ref<any>(null);
    const deletedItemIndex = ref<any>(null);
    const showAddAlert = ref<boolean>(false);
    const showEditAlert = ref<boolean>(false);
    const showDeleteAlert = ref<boolean>(false);
    const open = ref<boolean>(false);

    if (localStorage.getItem("todos") == null) {
      localStorage.setItem("todos", JSON.stringify([]));
    } else {
      todos.value = JSON.parse(localStorage.getItem("todos") as string);
    }

    let tags = todos.value
      .map((todo: any) => todo.tags)
      .filter((item: any) => {
        return Object.keys(item).length > 0;
      });
    let flattenedTags = tags.reduce(
      (acc: any, curr: any) => acc.concat(curr),
      []
    );
    let uniqueTags: any = Array.from(new Set(flattenedTags));
    localStorage.setItem("allTags", JSON.stringify(uniqueTags));
    allTags.value = JSON.parse(localStorage.getItem("allTags") as string);
    console.log(allTags);
    // if (localStorage.getItem("allTags") == null) {
    //   localStorage.setItem("allTags", JSON.stringify([]));
    // } else {
    //   allTags.value = JSON.parse(localStorage.getItem("allTags") as string);
    // }

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
      //  validate.value.$invalid=true;
    }
    const removingTodo = (index: number) => {
      deletedItemIndex.value = index;
      open.value = true;
    };
    const removeTodo = (index: number) => {
      open.value = false;
      todos.value.splice(index, 1);
      localStorage.setItem("todos", JSON.stringify(todos));
      localStorage.setItem("allTags", JSON.stringify(allTags));
      showDeleteAlert.value = true;
      setTimeout(function () {
        showDeleteAlert.value = false;
      }, 2000);
    };
    const editTodo = (index: number, editedTodo: TTodo) => {
      creatingTodo.value.subject = editedTodo.subject;
      creatingTodo.value.tags = editedTodo.tags.map((tag) => tag);
      editedItemIndex.value = index;
      localStorage.setItem("tasks", JSON.stringify(todos));
    };
    const changeStatus = (todoItem: TTodo) => {
      creatingTodo.value.completed = todoItem.completed;
      localStorage.setItem("tasks", JSON.stringify(todos));
    };
    const selectSearchingTag = (tag: any) => {
      selectedTag.value = tag;
      if (creatingTodo.value.tags.length >= 1) {
        for (let i = 0; i < creatingTodo.value.tags.length; i++) {
          if (creatingTodo.value.tags[i] === selectedTag.value) {
            return false;
          }
        }
      }
      creatingTodo.value.tags.push(selectedTag.value);
      searchingTag.value = "";
    };
    const searchTags = computed(() => {
      if (searchingTag.value === "") {
        return [];
      }
      let matches = 0;
      return allTags.value.filter((tag: any) => {
        if (
          tag.toLowerCase().startsWith(searchingTag.value.toLowerCase()) &&
          matches < 10
        ) {
          matches++;
          return tag;
        }
      });
    });
    //#endregion

    //#region Hooks
    onMounted(() => {
      todos.value = JSON.parse(localStorage.getItem("todos") as string) || [];
      allTags.value =
        JSON.parse(localStorage.getItem("allTags") as string) || [];
      // validate.value.$invalid=true
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
      showDeleteAlert,
      removeTodo,
      removingTodo,
      editTodo,
      changeStatus,
      editedItemIndex,
      open,
      searchingTag,
      searchTags,
      allTags,
      selectSearchingTag,
    };
  },
});
