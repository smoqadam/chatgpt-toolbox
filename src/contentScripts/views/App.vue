<script setup lang="ts">
import { useToggle } from '@vueuse/core'
// import browser from "webextension-polyfill";
 
import 'uno.css'

const [show, toggle] = useToggle(false)
const loading = ref(false);
// const [prompt, setPrompt] = 
const prompt = ref("");
const response = ref("");

function openOptionsPage() {
  browser.runtime.sendMessage({type: "openOption"});
}

browser.runtime.onMessage.addListener(function (req) {
    console.log({ req });
    if (req.msg == 'clicked') {
        prompt.value = req.data.prompt;
        loading.value = true;
        toggle(true);
    } else if (req.msg == 'missing_api_key') {
        response.value = '<div style="padding: 5px; border:1px solid #ff8686; color: #ff8686;">'+req.data.response+'</div>';
        loading.value = false;
    } else if (req.msg == 'response') {
        response.value = req.data.response;
        loading.value = false;
    }
});

</script>
<template>

<div id="chatgpt-toolbox__container" 
:class="show ? 'flex' : 'hidden'">
        <div id="chatgpt-toolbox__header">
          <div id="chatgpt-toolbox__header-content"
           class="bg-dark">
            <h3>ChatGPT Toolbox</h3>
            <span id="chatgpt-toolbox__settings"
             class="i-material-symbols-settings" title="Settings"
             @click="openOptionsPage()"
             ></span>
            <span id="chatgpt-toolbox__close" class="i-ic-outline-close w-5"
            @click="toggle()"
            title="close "></span>
          </div>
        </div>
        <div id="chatgpt-toolbox__box">
          <div id="chatgpt-toolbox__box-content">
            <div id="chatgpt-toolbox__title">
              Prompt
            </div>
            <div id="chatgpt-toolbox__box-text-prompt">
              {{ prompt }}
            </div>
          </div>
        </div>
        <div id="chatgpt-toolbox__box chatgpt-toolbox__box-response">
          <div id="chatgpt-toolbox__box-content">
            <div id="chatgpt-toolbox__title">
              ChatGPT
            </div>
            <div id="chatgpt-toolbox__box-text-response">
              <div v-show="loading" class="content-center">
                <span  class="i-line-md-loading-twotone-loop w-5 h-5 inline-block">Loading</span>
              </div>
              <span v-html="response">
              </span>
            </div>
          </div>
        </div>
      </div>

  </template>
