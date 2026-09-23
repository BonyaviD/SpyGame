<script setup lang="ts">
const model = defineModel<string>({ required: true });

withDefaults(
  defineProps<{
    label: string;
    /** Hides the label visually but keeps it for screen readers. */
    hideLabel?: boolean;
    placeholder?: string;
    error?: string;
    maxlength?: number;
  }>(),
  { hideLabel: false, placeholder: undefined, error: undefined, maxlength: undefined },
);

const id = useId();
const input = ref<HTMLInputElement>();

defineExpose({ focus: () => input.value?.focus() });
</script>

<template>
  <div class="app-input" :class="{ 'app-input--invalid': error }">
    <label :for="id" class="app-input__label" :class="{ 'visually-hidden': hideLabel }">
      {{ label }}
    </label>
    <input
      :id="id"
      ref="input"
      v-model="model"
      class="app-input__field"
      type="text"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${id}-error` : undefined"
      autocomplete="off"
    />
    <p v-if="error" :id="`${id}-error`" class="app-input__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.app-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
}
.app-input__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.app-input__field {
  width: 100%;
  min-height: var(--touch-target);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background-color: transparent;
  color: var(--color-text);
  font-size: var(--font-size-md);
}
.app-input__field::placeholder {
  color: var(--color-text-muted);
}
.app-input__field:focus-visible {
  outline: none;
  border-color: var(--color-focus);
  box-shadow: 0 0 0 1px var(--color-focus);
}
.app-input--invalid .app-input__field {
  border-color: var(--color-danger-text);
}
.app-input__error {
  font-size: var(--font-size-sm);
  color: var(--color-danger-text);
}
</style>
