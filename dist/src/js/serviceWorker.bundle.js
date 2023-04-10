(()=>{"use strict";let e=[{label:"Use as a prompt",id:"prompt",prompt:"{{TEXT}}"},{label:"Summarize this page",id:"summarize",prompt:'summerize this: "{{TEXT}}". Your repsonse must not have the url and any additional text.'},{label:"Explain this",id:"explain",prompt:'Explain this text: "{{TEXT}}"'},{label:"ELI5",id:"elif",prompt:'Explaing this text like I\'m 5 years old: "{{TEXT}}"'},{label:"English Translator and Improver",id:"english_tr",prompt:'I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. The text is "{{TEXT}}"'},{label:"Travel Guide",id:"travel",prompt:'I want you to act as a travel guide. I will write you my location and you will suggest a place to visit near my location. In some cases, I will also give you the type of places I will visit. You will also suggest me places of similar type that are close to my first location. My first suggestion request is "{{TEXT}}"'},{label:"Fallacy Finder",id:"fallacy",prompt:'I want you to act as a fallacy finder. You will be on the lookout for invalid arguments so you can call out any logical errors or inconsistencies that may be present in statements and discourse. Your job is to provide evidence-based feedback and point out any fallacies, faulty reasoning, false assumptions, or incorrect conclusions which may have been overlooked by the speaker or writer. My request is "{{TEXT}}"'},{label:"Proofreader",id:"proofreader",prompt:'I want you act as a proofreader. I will provide you texts and I would like you to review them for any spelling, grammar, or punctuation errors. Once you have finished reviewing the text, provide me with any necessary corrections or suggestions for improve the text. The text is: "{{TEXT}}"'}];chrome.contextMenus.create({id:"parent",title:"ChatGPT",contexts:["page","selection"]}),e.forEach((e=>{"summarize"!==e.id?chrome.contextMenus.create({title:e.label,id:e.id,parentId:"parent",contexts:["selection"]}):chrome.contextMenus.create({title:e.label,id:e.id,parentId:"parent",contexts:["page"]})})),chrome.runtime.onMessage.addListener((e=>{"openOption"==e.type&&chrome.tabs.create({url:"chrome-extension://"+chrome.runtime.id+"/src/options.html"})})),chrome.contextMenus.onClicked.addListener((async function(e,o){let a=t(e.menuItemId),n=null;n="summarize"===e.menuItemId?a.prompt.replace("{{TEXT}}",o.url):a.prompt.replace("{{TEXT}}",e.selectionText);let i=await chrome.storage.local.get("api_key");await chrome.tabs.sendMessage(o.id,{msg:"clicked",data:{prompt:n}}),function(e,t){return fetch("https://api.openai.com/v1/completions",{method:"POST",headers:{Authorization:"Bearer "+t,"Content-Type":"application/json"},body:JSON.stringify({model:"text-davinci-003",prompt:e,max_tokens:3e3,temperature:1})}).then((e=>e.json()))}(n,i.api_key).then((e=>{console.log({response:e}),chrome.tabs.sendMessage(o.id,{msg:"response",data:{prompt:n,response:e.choices[0].text}})})).catch((e=>{console.log({e}),chrome.tabs.sendMessage(o.id,{msg:"missing_api_key",data:{prompt:n,response:"Yout API key is missing. Please open the settings and enter your OpenAI's API key."}})}))}));const t=t=>{let o=null;return e.forEach((e=>{e.id!=t||(o=e)})),o}})();