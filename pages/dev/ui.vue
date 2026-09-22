<script setup lang="ts">
// Design-system playground. Removed from production builds (see nuxt.config.ts).
const colors = [
  "bg",
  "scene",
  "surface",
  "surface-raised",
  "primary",
  "accent",
  "danger",
  "success",
  "text",
  "text-muted",
  "border-strong",
];
const fontSizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"];

const name = ref("");
const count = ref(1);
const tab = ref<"one" | "two">("one");
const flipped = ref(false);
const isModalOpen = ref(false);
const isConfirmOpen = ref(false);
const lastAction = ref("—");
</script>

<template>
  <ScreenLayout back="/" title="سیستم دیزاین">
    <div class="playground">
      <section>
        <h2>رنگ‌ها</h2>
        <div class="swatches">
          <div v-for="color in colors" :key="color" class="swatch">
            <span class="swatch__color" :style="{ background: `var(--color-${color})` }" />
            <code>{{ color }}</code>
          </div>
        </div>
      </section>

      <section>
        <h2>تایپوگرافی</h2>
        <p v-for="size in fontSizes" :key="size" :style="{ fontSize: `var(--font-size-${size})` }">
          {{ size }} — جاسوس کیه؟
        </p>
      </section>

      <section class="stack">
        <h2>دکمه‌ها</h2>
        <AppButton block>Primary</AppButton>
        <AppButton variant="outline" block>Outline</AppButton>
        <AppButton variant="danger" block>Danger</AppButton>
        <AppButton variant="ghost" size="md">Ghost md</AppButton>
        <AppButton disabled block>Disabled</AppButton>
        <div class="row">
          <AppIconButton icon="back" label="بازگشت" />
          <AppIconButton icon="plus" label="افزودن" />
          <AppIconButton icon="close" label="بستن" variant="solid" size="1rem" />
        </div>
      </section>

      <section class="stack">
        <h2>فرم</h2>
        <AppInput v-model="name" label="نام بازیکن" placeholder="مثلاً سارا" />
        <AppInput v-model="name" label="با خطا" error="این نام قبلاً ثبت شده است" />
        <AppCounter v-model="count" label="تعداد جاسوس" :min="1" :max="3" />
      </section>

      <section>
        <h2>تب‌ها</h2>
        <AppTabs
          v-model="tab"
          label="نمونه"
          :tabs="[
            { id: 'one', label: 'اول' },
            { id: 'two', label: 'دوم' },
          ]"
        >
          <p>محتوای تب {{ tab }}</p>
        </AppTabs>
      </section>

      <section class="stack">
        <h2>کارت‌ها</h2>
        <div class="row">
          <PlayerCard name="علی" removable />
          <PlayerCard name="نام خیلی خیلی طولانی" role="شهروند" />
          <PlayerCard name="سارا" role="جاسوس" highlighted />
        </div>
        <FlipCard class="flip" :flipped="flipped" label="کارت نمونه" @click="flipped = !flipped">
          <template #front><CardBack /></template>
          <template #back><span class="flip__back">هتل</span></template>
        </FlipCard>
      </section>

      <section class="stack">
        <h2>دیالوگ‌ها</h2>
        <AppButton variant="outline" size="md" @click="isModalOpen = true">Modal</AppButton>
        <AppButton variant="outline" size="md" @click="isConfirmOpen = true">Confirm</AppButton>
        <p>آخرین اقدام: {{ lastAction }}</p>
        <AppModal v-model:open="isModalOpen" title="عنوان مودال">
          <p>متن داخل مودال.</p>
        </AppModal>
        <AppConfirm
          v-model:open="isConfirmOpen"
          title="بازی لغو شود؟"
          message="کارت‌های این دور از بین می‌روند."
          confirm-text="لغو بازی"
          danger
          @confirm="lastAction = 'تأیید'"
          @cancel="lastAction = 'انصراف'"
        />
      </section>

      <AppCredit />
    </div>
  </ScreenLayout>
</template>

<style scoped>
.playground {
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
  padding-bottom: var(--space-10);
}
h2 {
  margin-bottom: var(--space-3);
  font-size: var(--font-size-xl);
  font-weight: normal;
  color: var(--color-accent);
}
.stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
}
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-4);
}
.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
  gap: var(--space-3);
}
.swatch {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--font-size-xs);
}
.swatch__color {
  height: 2.5rem;
  border: 1px solid var(--color-surface-raised);
  border-radius: var(--radius-sm);
}
.flip {
  width: 8rem;
}
.flip__back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--color-surface);
  font-size: var(--font-size-xl);
}
</style>
