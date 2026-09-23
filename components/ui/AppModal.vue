<script setup lang="ts">
const open = defineModel<boolean>("open", { required: true });

withDefaults(
  defineProps<{
    title: string;
    /** Allows closing by Escape or a backdrop click. */
    dismissible?: boolean;
  }>(),
  { dismissible: true },
);

const emit = defineEmits<{
  /** Dismissed by the user (Escape or backdrop). */
  close: [];
  /** The closing animation has finished and the dialog is gone from the page. */
  closed: [];
}>();

const titleId = useId();
const dialog = ref<HTMLElement>();
let previouslyFocused: HTMLElement | null = null;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const focusableElements = () =>
  Array.from(dialog.value?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);

const close = () => {
  open.value = false;
  emit("close");
};

const onKeydown = (event: KeyboardEvent, dismissible: boolean) => {
  if (event.key === "Escape" && dismissible) {
    event.stopPropagation();
    close();
    return;
  }
  if (event.key !== "Tab") return;

  // Keep keyboard focus inside the dialog.
  const elements = focusableElements();
  if (!elements.length) return;
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

watch(
  open,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocused = document.activeElement as HTMLElement | null;
      await nextTick();
      (focusableElements()[0] ?? dialog.value)?.focus();
    } else {
      previouslyFocused?.focus();
    }
  },
  { immediate: true },
);
</script>

<template>
  <!-- defer: the target is rendered by the layout in the same mount cycle. -->
  <Teleport defer to="#overlay-root">
    <Transition name="modal" @after-leave="emit('closed')">
      <div
        v-if="open"
        class="modal"
        @click.self="dismissible && close()"
        @keydown="onKeydown($event, dismissible)"
      >
        <div
          ref="dialog"
          class="modal__dialog"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
        >
          <h2 :id="titleId" class="modal__title">{{ title }}</h2>
          <div class="modal__body">
            <slot />
          </div>
          <div v-if="$slots.actions" class="modal__actions">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  background-color: var(--color-backdrop);
  backdrop-filter: blur(4px);
}
.modal__dialog {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  width: 100%;
  max-width: 22rem;
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-lg);
}
.modal__dialog:focus {
  outline: none;
}
.modal__title {
  font-size: var(--font-size-xl);
  font-weight: normal;
  text-align: center;
}
.modal__body {
  line-height: var(--line-height-body);
}
.modal__actions {
  display: flex;
  gap: var(--space-3);
}
.modal__actions > :deep(*) {
  flex: 1;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--duration-normal) var(--ease-standard);
}
.modal-enter-active .modal__dialog,
.modal-leave-active .modal__dialog {
  transition: transform var(--duration-normal) var(--ease-standard);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal__dialog,
.modal-leave-to .modal__dialog {
  transform: scale(0.95);
}
</style>
