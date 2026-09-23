<script setup lang="ts">
const open = defineModel<boolean>("open", { required: true });

withDefaults(
  defineProps<{
    title: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    /** Use for destructive actions. */
    danger?: boolean;
  }>(),
  { message: undefined, confirmText: "تأیید", cancelText: "انصراف", danger: false },
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  /**
   * The dialog has finished closing. Navigate here rather than on `confirm`: starting a page
   * transition while the dialog is still animating out can leave the old page on screen.
   */
  closed: [];
}>();

// Emit before closing: parents often clear the dialog's context when it closes.
const confirm = () => {
  emit("confirm");
  open.value = false;
};

const cancel = () => {
  emit("cancel");
  open.value = false;
};
</script>

<template>
  <AppModal v-model:open="open" :title="title" @close="emit('cancel')" @closed="emit('closed')">
    <p v-if="message" class="confirm__message">{{ message }}</p>
    <template #actions>
      <AppButton variant="outline" size="md" @click="cancel">{{ cancelText }}</AppButton>
      <AppButton :variant="danger ? 'danger' : 'primary'" size="md" @click="confirm">
        {{ confirmText }}
      </AppButton>
    </template>
  </AppModal>
</template>

<style scoped>
.confirm__message {
  text-align: center;
  color: var(--color-text-muted);
}
</style>
