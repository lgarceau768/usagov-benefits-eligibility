<template>
  <div>
    <template v-for="criteriaGroup in lifeEventCriteria">
      <div
        :id="`criteriaGroup-${criteriaGroup.criteriaGroupKey}-${_uid}`"
        :key="criteriaGroup.criteriaGroupKey"
        class="margin-bottom-4 border-bottom border-gray-30 border-width-2px break-inside-avoid"
      >
        <h2
          :class="{
            'font-heading-lg': true,
            'font-family-sans': true,
            'text-bold': true,
            'margin-top-0': true,
            'criteria-group-empty': hasNoResponses(
              getCriteriaMap(criteriaGroup.criteriaKeys)
            )
          }"
        >
          {{ criteriaGroup.label }}
        </h2>
        <p class="line-height-sans-4 font-sans-sm">
          {{ criteriaGroup.description }}
        </p>
        <div
          :id="'criteriaGroup-' + criteriaGroup.criteriaGroupKey"
          class="margin-y-3"
        >
          <template
            v-for="criterion in getCriteriaMap(criteriaGroup.criteriaKeys)"
          >
            <CriteriaChild
              :key="criterion.criteriaKey"
              :criteria-key="criterion.criteriaKey"
              :label="criterion.label"
              :values="criterion.values.split('; ')"
              :type="criterion.type"
              :criteria-group-key="criteriaGroup.criteriaGroupKey"
              :response="criterion.response"
              class="margin-y-2"
            />
          </template>
        </div>
        <p
          class="display-none text-bold"
          :class="{
            'criteria-group-empty': hasNoResponses(
              getCriteriaMap(criteriaGroup.criteriaKeys)
            )
          }"
        >
          No eligibility criteria selected
        </p>
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters } from "vuex"

export default {
  props: {
    lifeEventCriteria: {
      type: Array,
      default: /* istanbul ignore next */ () => []
    }
  },
  computed: {
    ...mapGetters({
      getCriterionByEligibilityKey: "criteria/getCriterionByEligibilityKey"
    })
  },
  methods: {
    getCriteriaMap(criteriaKeys) {
      return criteriaKeys.map((criterionKey) => {
        return this.getCriterionByEligibilityKey(criterionKey)
      })
    },
    hasNoResponses(criteria) {
      return !criteria.map((c) => !!c.response).some((response) => response)
    }
  }
}
</script>
<style type="scss" scoped>
@media print {
  .criteria-group-empty {
    display: block;
  }
}
</style>
