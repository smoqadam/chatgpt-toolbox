import { useStorageLocal } from '~/composables/useStorageLocal'

export const openaiApiKey = useStorageLocal('openai-apikey', '')
export const prompts = useStorageLocal('prompts', [])

