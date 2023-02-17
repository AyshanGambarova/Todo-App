<template>
  <div
    v-if="showAlert"
    class="text-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
    role="alert"
  >
    <span class="font-medium">Your todo added successfully!</span>
  </div>
  <div class="flex mt-6 w-full justify-center">
    <div class="-space-y-px">
      <div>
        <input
          v-model="creatingTodo.subject"
          type="text"
          id="default-input"
          class="relative block outline-none border border-gray-300 text-gray-900 text-sm rounded-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
          placeholder="Add a subject"
          required
          @blur="handleBlur('subject')"
        />
      </div>
      <div v-if="validate.subject.$errors">
        <p
          v-for="$error in validate.subject.$errors"
          :key="$error.$property"
          class="text-letf mt-1 pl-1 text-xs text-red-600 tracking-wide"
        >
          {{ $error.$message }}
        </p>
      </div>
    </div>
    <div class="ml-4">
      <div class="tag-input">
        <div
          v-for="(tag, index) in creatingTodo.tags"
          :key="tag"
          class="tag-input__tag"
        >
          {{ tag }}
          <span @click="removeTag(index)">x</span>
        </div>
        <input
          type="text"
          placeholder="Click the Enter add a tag"
          class="tag-input__text"
          @keydown.enter="addTag"
          @keydown.delete="removeLastTag"
        />
      </div>
    </div>
    <div class="ml-4">
      <button
        @click="addTodo"
        :disabled="validate.$invalid"
        type="button"
        class="text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        :class="[
          validate.$invalid
            ? 'bg-indigo-200 cursor-not-allowed'
            : 'bg-indigo-500',
        ]"
      >
        Add todo
      </button>
    </div>
  </div>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg m-10">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead
        class="text-xs text-center text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Subject</th>
          <th scope="col" class="px-6 py-3">Tags</th>
          <th scope="col" class="px-6 py-3">Status</th>
          <th scope="col" class="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody class="text-center">
        <tr
          v-for="(todo, index) in todos"
          :key="index"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            :class="[todo.completed ? 'line-through decoration-red-700' : '']"
          >
            {{ todo.subject }}
          </th>
          <td class="px-6 py-4">
            <div v-if="todo.tags.length">
              <span v-for="(tag, index) in todo.tags" :key="index">{{
                (index ? ", " : "") + tag
              }}</span>
            </div>
            <div v-else>There isn't any tag</div>
          </td>
          <td class="px-6 py-4">
            <input
              class="accent-indigo-600"
              type="checkbox"
              v-model="todo.completed"
              @change="changeStatus(todo)"
            />
          </td>
          <td class="px-6 py-4">
            <span
              @click="editTodo(index, todo)"
              class="font-medium text-indigo-600 dark:text-indigo-500 hover:underline cursor-pointer"
              >Edit</span
            >
            <span
              @click="removeTodo(index)"
              class="font-medium ml-2 text-indigo-600 dark:text-indigo-500 hover:underline cursor-pointer"
              >Delete</span
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import script from "./main";
import "./style.css";
export default script;
</script>
