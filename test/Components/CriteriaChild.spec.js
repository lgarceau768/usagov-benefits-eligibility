import { shallowMount } from '@vue/test-utils'
import CriteriaChild from '@/components/CriteriaChild.vue'
import Vuex from 'vuex';
import beforeAllTests from '@/test/beforeAllTests';
import { state as criteriaState, mutations, getters, actions } from '~/store/criteria';

const MOCK_CRITERIA = [
  {
    criteriaKey: "criteriaKey1",
    label: "Benefit criteria label 1.",
    type: "boolean",
    values: [true],
    criteriaGroupKey: "group1"
  },
  {
    criteriaKey: "criteriaKey2",
    label: "Benefit criteria label 2.",
    type: "select",
    values: ["one", "two", "three", "four", "five", "six", "seven", "eight"],
    criteriaGroupKey: "group2"
  }
]

describe('CriteriaChild', () => {
  let store;

  beforeAll(async () => {
    await beforeAllTests();
  });

  beforeEach(() => {
    criteriaState.namespaced = true;
    store = new Vuex.Store({
      modules: {
        criteria: {
          namespaced: true,
          state: criteriaState,
          actions,
          mutations,
          getters,
        },
      },
    });
  })
  test('is a Vue instance', () => {
    const wrapper = shallowMount(CriteriaChild, {
      propsData: {},
      store
    });
    expect(wrapper.vm).toBeTruthy();
  });

  test('displays nothing when there are no criteria passed in', () => {
    const wrapper = shallowMount(CriteriaChild, {
      store
    });
    expect(wrapper.find(".eligibility-criterion").text()).toBeFalsy();

  });

  test('displays eligibilityCriteria when one is passed in', () => {
    const wrapper = shallowMount(CriteriaChild, {
      propsData: { ...MOCK_CRITERIA[0] },
      store
    });
    expect(wrapper.find(".usa-checkbox").text()).toBe("Benefit criteria label 1.");

  });

  test('updates when a checkbox criteria response changes', async () => {
    const wrapper = shallowMount(CriteriaChild, {
      propsData: { ...MOCK_CRITERIA[0] },
      store,
    });
    await store.dispatch("criteria/populate", [...MOCK_CRITERIA]);
    await wrapper.vm.$nextTick();
    await wrapper.find(".usa-checkbox__input").setChecked();
    expect(wrapper.find(".usa-checkbox__input").element.checked).toBeTruthy();

  });
  test('updates when a select criteria response changes', async () => {
    const wrapper = shallowMount(CriteriaChild, {
      propsData: { ...MOCK_CRITERIA[1] },
      store,
    });

    await store.dispatch("criteria/populate", [...MOCK_CRITERIA]);
    await wrapper.vm.$nextTick();
    const choices = wrapper.find("select").findAll("option");
    await choices.at(2).setSelected();
    expect(wrapper.find("option:checked").element.value).toBe("two");
  });

});
