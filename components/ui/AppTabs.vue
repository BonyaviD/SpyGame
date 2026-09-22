<script setup lang="ts" generic="T extends string">
export interface Tab<Id extends string = string> {
  id: Id;
  label: string;
}

const active = defineModel<T>({ required: true });

const props = defineProps<{
  tabs: Tab<T>[];
  /** Accessible name of the tab list. */
  label: string;
}>();

const baseId = useId();
const tabButtons = ref<HTMLButtonElement[]>([]);

const tabId = (id: T) => `${baseId}-tab-${id}`;
const panelId = (id: T) => `${baseId}-panel-${id}`;

const select = (index: number) => {
  const count = props.tabs.length;
  const next = (index + count) % count;
  active.value = props.tabs[next].id;
  tabButtons.value[next]?.focus();
};

// Arrow keys follow the visual order, which is mirrored in RTL.
const onKeydown = (event: KeyboardEvent, index: number) => {
  const isRtl = getComputedStyle(event.currentTarget as Element).direction === "rtl";
  const forward = isRtl ? "ArrowLeft" : "ArrowRight";
  const backward = isRtl ? "ArrowRight" : "ArrowLeft";

  if (event.key === forward) select(index + 1);
  else if (event.key === backward) select(index - 1);
  else if (event.key === "Home") select(0);
  else if (event.key === "End") select(props.tabs.length - 1);
  else return;
  event.preventDefault();
};
</script>

<template>
  <div class="tabs">
    <div class="tabs__list" role="tablist" :aria-label="label">
      <button
        v-for="(tab, index) in tabs"
        :id="tabId(tab.id)"
        :key="tab.id"
        ref="tabButtons"
        type="button"
        role="tab"
        class="tabs__tab"
        :class="{ 'tabs__tab--active': tab.id === active }"
        :aria-selected="tab.id === active"
        :aria-controls="panelId(tab.id)"
        :tabindex="tab.id === active ? 0 : -1"
        @click="active = tab.id"
        @keydown="onKeydown($event, index)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div
      :id="panelId(active)"
      class="tabs__panel"
      role="tabpanel"
      :aria-labelledby="tabId(active)"
      tabindex="0"
    >
      <slot :active="active" />
    </div>
  </div>
</template>

<style scoped>
.tabs__list {
  display: flex;
  justify-content: space-around;
  gap: var(--space-2);
}
.tabs__tab {
  min-height: var(--touch-target);
  padding: var(--space-2) var(--space-3);
  border-bottom: 2px solid transparent;
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  transition:
    color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard);
}
.tabs__tab--active {
  border-bottom-color: var(--color-primary);
  color: var(--color-text);
}
.tabs__panel {
  padding-top: var(--space-6);
}
.tabs__panel:focus-visible {
  outline-offset: 4px;
}
</style>
