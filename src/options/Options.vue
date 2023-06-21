<script setup lang="ts">

const apiKey = ref("");
const prompts = ref<Array<Prompt>>([]);

const saved = ref("");
const pid = ref("");
const plabel = ref("");
const pprompt = ref("");

const pidErr = ref("")
const plabelErr = ref("")
const ppromptErr = ref("")

// const [show, toggle] = useToggle();

browser.storage.local.get("api_key").then((result) => {
  console.log({ result });
  console.log("Value currently is " + result.api_key);
  apiKey.value = result.api_key;
});


browser.storage.local.get("prompts").then((result) => {
  console.log({ result });
  console.log("prompts is " + result.prompts);
  prompts.value = JSON.parse(result.prompts);
});


function addRow() {
  if (validate()) {
    prompts.value.push({
      id: pid.value,
      label: plabel.value,
      prompt: pprompt.value
    });
    save();
  }
}

function validate(): boolean {

  let hasErr = false;
  pidErr.value = plabelErr.value = ppromptErr.value = "";
  if (pid.value.length == 0) {
    pidErr.value = "ID can't be empty";
    hasErr = true;
  }



  if (plabel.value.length == 0) {
    plabelErr.value = "Label can't be empty";
    hasErr = true;
  }



  if (pprompt.value.length == 0) {
    ppromptErr.value = "Prompt can't be empty";
    hasErr = true;

  }

  if (hasErr) {
    return false;
  }
  return true;
}


function remove(id: any) {
  if (confirm('are you sure?')) {
    const index = prompts.value.indexOf(id, 0);
    if (index > -1) {
      prompts.value.splice(index, 1);
      save();
    }
    console.log({ prompts });
  }
}

function save() {
  console.log('PR', prompts);

  browser.storage.local.set({
    "api_key": apiKey.value,
    "prompts": JSON.stringify(prompts.value)
  });

  saved.value = 'Saved';
  setTimeout(() => saved.value = "", 3000);
  browser.runtime.reload();
}

</script>

<template>
  <main class="flex  p-10 justify-center ">
    <div class="w-3/4  border p-5">
      <div class="flex text-left  border-b-1 mb-3">
        <h1 class="w-8/9 py-4  text-3xl font-black">ChatGPT-Toolbox Options {{ saved }}</h1>
        <div class="w-1/9 text-center content-center py-5">
          <button @click="save" class="btn">Save</button>
        </div>
      </div>
      <div class="mb-4">
        <label class="block  text-sm font-bold mb-2" for="api_key">
          API Key
        </label>
        <input v-model="apiKey"
          class="bg-gray-200 p-2 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="api_key" type="password" placeholder="API Key">
        <small>OpenAI's Api Key. You can get your API key from <a class="text-blue"
            href="https://platform.openai.com/account/api-keys" target="_blank">OpenAI's
            dashboard</a></small>
      </div>

      <!-- -->
      <div class="block border border-gray-400">
        <div class="flex text-xl   bg-amber  p-2">
          <div class="w-4/5 font-extrabold  text-left">
            Prompts
          </div>
          <div class="w-1/5 text-right text-blue text-base">
            <!-- <button class="btn" @click="toggle()">import/export</button> -->
          </div>
        </div>
        <div class="flex p-3--">
          <div class="w-3/9 bg-gray-100 p-3">
            <div class="flex mb-4 ">
              <div class="w-1/2 pr-2">
                <div class="text-red">{{ pidErr }}</div>
                <label class="block  text-sm font-bold mb-2  " for="pid">
                  ID
                </label>
                <input v-model="pid" required
                  class="bg-gray-200 p-2 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="pid" type="text" placeholder="ID">
                <small>Must be unique</small>
              </div>

              <div class="w-1/2 pl-2">
                <div class="text-red">{{ plabelErr }}</div>

                <label class="block  text-sm font-bold mb-2 px-2" for="label">
                  Label
                </label>
                <input v-model="plabel" required
                  class="bg-gray-200 p-2 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="label" type="text" placeholder="Label">
                <small>This value appears on the right-click menu under ChatGPT</small>
              </div>
            </div>
            <div class="flex mb-4 ">
              <div class="">
                <div class="text-red">{{ ppromptErr }}</div>
                <textarea required
                  class=" h-64 bg-gray-200 p-2 appearance-none border rounded w-full py-2  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  v-model="pprompt" placeholder="Prompt"></textarea>
                <small class="w-full"
                  v-text="'Use {{TEXT}} tag where ever your want to replace it with the selected text'"></small>
              </div>
            </div>
            <button @click="addRow()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">
              Add prompt
            </button>
          </div>
          <div class="w-6/9 p-3">
            <table class="table-auto w-full">
              <thead>
                <tr class="bg-gray-100">
                  <th class=" w-1/9 border px-4 py-2">ID</th>
                  <th class=" w-2/9 border px-4 py-2">Label</th>
                  <th class=" w-5/9 border px-4 py-2">Prompts</th>
                  <th class=" w-1/9 border px-4 py-2">Remove</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in prompts">
                  <td class="border px-4 py-2">{{ p.id }}</td>
                  <td class="border px-4 py-2">{{ p.label }}</td>
                  <td class="border px-4 py-2 ">
                    <div class="text-clip">{{ p.prompt }}</div>
                  </td>
                  <td class="border px-4 py-2 text-center">
                    <button href="#" class="i-material-symbols-delete-outline text-red" @click="remove(p)">X</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <footer class="flex  p-10-- content-center ">

<div class="w-4/4 text-center bg-gray-900 text-white content-center p-4 pt-3 h-12">

  ChatGPT - Toolbox is free and open-source. Send your feedbacks at
  <a class="text-amber"
    href="https://github.com/smoqadam/chatgpt-toolbox">https://github.com/smoqadam/chatgpt-toolbox</a>

</div>
</footer>
    </div>
  </main>

</template>
