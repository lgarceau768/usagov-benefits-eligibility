<template>
  <fieldset class="usa-fieldset">
    <input
      :id="`${uniqueId}-${criteriaKey}`"
      class="usa-checkbox__input"
      type="checkbox"
      :name="`${uniqueId}-${criteriaKey}`"
      :value="`${uniqueId}-${criteriaKey}`"
      :checked="response === true"
      @change="updateEligibilityChecked($event, criteriaKey)"
    />
    <label
      class="usa-checkbox__label"
      :class="selectedStyle"
      :for="`${uniqueId}-${criteriaKey}`"
    >
      {{ label }}
    </label>
  </fieldset>
</template>

<script>
import _ from "lodash"

export default {
  name: "CheckBox",
  props: {
    criteriaKey: {
      type: String,
      default: "no criteria key provided"
    },
    label: {
      type: String,
      default: "no label provided"
    },
    response: {
      type: [String, Object, Boolean],
      default: "No response provided"
    },
    location: {
      type: String,
      default: "benefit-card",
      validator: (value) => {
        return ["left-rail", "benefit-card"].includes(value)
      }
    }
  },
  data() {
    return {
      uniqueId: _.uniqueId("checkbox-")
    }
  },
  computed: {
    selectedStyle() {
      if (this.location === "benefit-card" && this.response === true) {
        return "text-success text-bold"
      }
      return null
    }
  },
  mounted() {
    this.uniqueId = _.uniqueId("checkbox-")
  },
  methods: {
    updateEligibilityChecked(event, key) {
      const localCriterion = {
        criteriaKey: key,
        response: event.target.checked
      }
      this.$store.dispatch("criteria/updateResponse", localCriterion)
    }
  }
}
</script>

<style lang="scss" scoped></style>
