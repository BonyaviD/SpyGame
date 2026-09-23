import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AppConfirm from "~/components/ui/AppConfirm.vue";

describe("AppConfirm", () => {
  it("emits confirm before it closes, while the parent still has its context", async () => {
    const events: string[] = [];
    const wrapper = await mountSuspended(
      {
        components: { AppConfirm },
        setup() {
          const target = ref<string | null>("علی");
          const open = computed({
            get: () => target.value !== null,
            set: (value) => {
              events.push(`open=${value}`);
              if (!value) target.value = null;
            },
          });
          const onConfirm = () => events.push(`confirm:${target.value}`);
          return { open, onConfirm };
        },
        template: `<div id="overlay-root" /><AppConfirm v-model:open="open" title="حذف؟" @confirm="onConfirm" />`,
      },
      { attachTo: document.body },
    );
    await nextTick();

    const confirmButton = [
      ...document.querySelectorAll<HTMLButtonElement>("#overlay-root button"),
    ].find((button) => button.textContent?.trim() === "تأیید");
    confirmButton?.click();

    expect(events).toEqual(["confirm:علی", "open=false"]);
    wrapper.unmount();
  });
});
