import { mount, shallowMount } from "@vue/test-utils"
import { Store } from "vuex"
import CheckBox from "@/components/CheckBox.vue"
import beforeAllTests from "@/test/beforeAllTests"
import {
  state as criteriaState,
  mutations,
  getters,
  actions
} from "~/store/criteria"

const MOCK_CRITERIA = {
  criteriaKey: "deceased_served_in_active_military",
  label:
    "The deceased served in the active military, naval, or air service and",
  type: "boolean",
  response: true
}

describe("CheckBox", () => {
  let store

  beforeAll(async () => {
    await beforeAllTests()
  })

  beforeEach(() => {
    criteriaState.namespaced = true
    store = new Store({
      modules: {
        criteria: {
          namespaced: true,
          state: criteriaState,
          actions,
          mutations,
          getters
        }
      }
    })
  })

  test("is a Vue instance", () => {
    const wrapper = mount(CheckBox, {
      propsData: {
        criteriaKey: MOCK_CRITERIA.criteriaKey,
        label: MOCK_CRITERIA.label,
        response: MOCK_CRITERIA.response
      }
    })
    expect(wrapper.vm).toBeTruthy()
  })

  test("displays eligibilityCriteria when one is passed in", () => {
    const wrapper = shallowMount(CheckBox, {
      propsData: { ...MOCK_CRITERIA },
      store
    })
    expect(wrapper.find("label").text()).toBe(
      "The deceased served in the active military, naval, or air service and"
    )
  })

  test("updates when a checkbox criteria response changes", async () => {
    const wrapper = shallowMount(CheckBox, {
      propsData: { ...MOCK_CRITERIA },
      store
    })
    const localCriterion = [
      {
        criteriaKey: MOCK_CRITERIA.criteriaKey,
        response: MOCK_CRITERIA.response
      }
    ]
    await store.dispatch("criteria/populate", localCriterion)
    await wrapper.find(".usa-checkbox__input").setChecked()
    await wrapper.vm.$nextTick()
    expect(wrapper.find(".usa-checkbox__input").element.checked).toBeTruthy()
  })
})
