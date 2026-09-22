import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import AppButton from "~/components/ui/AppButton.vue";
import AppCounter from "~/components/ui/AppCounter.vue";
import AppTabs from "~/components/ui/AppTabs.vue";

describe("AppButton", () => {
  it("renders a link when `to` is set", async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: { to: "/setup" },
      slots: { default: () => "شروع" },
    });

    expect(wrapper.element.tagName).toBe("A");
    expect(wrapper.attributes("href")).toBe("/setup");
  });

  it("renders a disabled button instead of a link when disabled", async () => {
    const wrapper = await mountSuspended(AppButton, {
      props: { to: "/setup", disabled: true },
    });

    expect(wrapper.element.tagName).toBe("BUTTON");
    expect(wrapper.attributes("disabled")).toBeDefined();
  });

  it("emits click", async () => {
    const wrapper = await mountSuspended(AppButton);
    await wrapper.trigger("click");

    expect(wrapper.emitted("click")).toHaveLength(1);
  });
});

describe("AppCounter", () => {
  it("disables the buttons at the limits and emits clamped values", async () => {
    const wrapper = await mountSuspended(AppCounter, {
      props: { label: "تعداد", min: 1, max: 2, modelValue: 2 },
    });
    const [increase, decrease] = wrapper.findAll("button");

    expect(increase.attributes("disabled")).toBeDefined();
    expect(decrease.attributes("disabled")).toBeUndefined();

    await decrease.trigger("click");
    expect(wrapper.emitted("update:modelValue")).toEqual([[1]]);
  });
});

describe("AppTabs", () => {
  it("marks the active tab and emits the clicked tab", async () => {
    const wrapper = await mountSuspended(AppTabs, {
      props: {
        label: "راهنما",
        tabs: [
          { id: "a", label: "الف" },
          { id: "b", label: "ب" },
        ],
        modelValue: "a",
      },
    });
    const tabs = wrapper.findAll('[role="tab"]');

    expect(tabs[0].attributes("aria-selected")).toBe("true");
    expect(tabs[1].attributes("tabindex")).toBe("-1");

    await tabs[1].trigger("click");
    expect(wrapper.emitted("update:modelValue")).toEqual([["b"]]);
  });
});
