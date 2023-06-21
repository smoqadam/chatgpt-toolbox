export let defaultPrompts = [
  {
    "label": "Use as a prompt",
    "id": "prompt",
    "prompt": "{{TEXT}}"
  },
  {
    "label": "Explain this",
    "id": "explain",
    "prompt": "Explain this text: \"{{TEXT}}\""
  },
  {
    "label": "ELI5",
    "id": "elif",
    "prompt": "Explaing this text like I'm 5 years old: \"{{TEXT}}\""
  },
  {
    "label": "English Translator and Improver",
    "id": "english_tr",
    "prompt": "I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. The text is \"{{TEXT}}\""
  },
  {
    "label": "Proofreader",
    "id": "proofreader",
    "prompt": "I want you act as a proofreader. I will provide you texts and I would like you to review them for any spelling, grammar, or punctuation errors. Once you have finished reviewing the text, provide me with any necessary corrections or suggestions for improve the text. The text is: \"{{TEXT}}\""
  }
]