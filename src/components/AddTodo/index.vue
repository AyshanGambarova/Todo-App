<template>
  <div
    v-if="showAddAlert"
    class="text-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
    role="alert"
  >
    <span class="font-medium">Your Todo Added!</span>
  </div>
  <div
    v-if="showEditAlert"
    class="text-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
    role="alert"
  >
    <span class="font-medium">Your Todo Edited!</span>
  </div>
  <div
    v-if="showDeleteAlert"
    class="text-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-800 dark:text-red-400"
    role="alert"
  >
    <span class="font-medium">Your Todo Deleted!</span>
  </div>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div
                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                  >
                    <ExclamationTriangleIcon
                      class="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      class="text-lg font-medium leading-6 text-gray-900"
                      >Delete Todo</DialogTitle
                    >
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to delete your todo? All of your
                        data will be permanently removed. This action cannot be
                        undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
              >
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="removeTodo()"
                >
                  Delete
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="open = false"
                  ref="cancelButtonRef"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <div class="flex mt-6 w-full justify-center">
    <div class="-space-y-px">
      <div>
        <input
          v-model="creatingTodo.subject"
          type="text"
          id="default-input"
          class="focus:ring-0 pl-5 relative block outline-none border border-gray-300 text-gray-900 text-sm rounded-sm block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
          placeholder="Add a subject"
          autocomplete="off"
          @blur="handleBlur('subject')"
        />
      </div>
      <div v-if="validate.subject.$errors">
        <p
          v-for="$error in validate.subject.$errors"
          :key="$error.$property"
          class="text-center mt-1 pl-1 text-xs text-red-600 tracking-wide"
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
          class="tag-input__text focus:ring-0"
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
        class="text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        :class="[
          validate.$invalid
            ? 'bg-indigo-200 cursor-not-allowed'
            : 'bg-indigo-500',
        ]"
      >
        <span v-if="editedItemIndex == null">Add todo</span>
        <span v-else>Edit todo</span>
      </button>
    </div>
  </div>
  <div
    v-if="todos.length"
    class="relative overflow-x-auto shadow-md sm:rounded-lg m-10"
  >
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
            <div v-else>There is not any tag.</div>
          </td>
          <td class="px-6 py-4">
            <input
              class="accent-indigo-600 cursor-pointer focus:ring-0"
              type="checkbox"
              v-model="todo.completed"
              @change="changeStatus(todo)"
            />
          </td>
          <td class="px-6 py-4 flex items-center justify-center">
            <div
              @click="editTodo(index, todo)"
              class="w-4 mr-2 cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-100 duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path
                  d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
                />
              </svg>
            </div>
            <div
              @click="removingTodo(index)"
              class="w-3 cursor-pointer cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-100 duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                <path
                  d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                />
              </svg>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="w-full text-center mt-10">You don't have any Todo.</div>
</template>
<script lang="ts">
import script from "./main";
import "./style.css";
export default script;
</script>
