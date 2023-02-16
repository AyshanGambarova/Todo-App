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
</template>
<script lang="ts">
import script from "./main";
import "./style.css";
export default script;
</script>
