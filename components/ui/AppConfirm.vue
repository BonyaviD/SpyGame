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

const emit = defineEmits<{ confirm: []; cancel: [] }>();

const confirm = () => {
  open.value = false;
  emit("confirm");
};

const cancel = () => {
  open.value = false;
  emit("cancel");
};
</script>

<template>
  <AppModal v-model:open="open" :title="title" @close="emit('cancel')">
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
