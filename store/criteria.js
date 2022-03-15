import Vue from "vue"
import { toDate, isEqual, isBefore, isAfter, sub } from "date-fns"
import zipcodes from 'zipcodes'
import zipcodedata from 'zipcodes-nrviens'
import axios from "axios"
import stringToHash from "../services/stringToHash"

export const state = () => ({
  eligibilityCriteria: {},
  hashToCriteria: {},
  preloadedResponses: {}
})

export const mutations = {
  // payload must include a criteriaKey and the new response / selected value
  updateResponse(state, { criteriaKey, response }) {
    // TODO: make sure the response matches one of the available criterion values
    Vue.set(state.eligibilityCriteria[criteriaKey], "response", response)
    const hashedData = getters.getHashResponses(state)
    localStorage.setItem("responseData", JSON.stringify(hashedData))
  },

  preloadedResponses(state, { valueArray }) {
    for (const param of valueArray) {
      const criteriaKey = state.hashToCriteria[param.criteriaKeyHash]
      if (state.eligibilityCriteria[criteriaKey] != null) {
        Vue.set(state.eligibilityCriteria[criteriaKey], "response", param.response)
      }
    }

    const hashedData = getters.getHashResponses(state)
    localStorage.setItem("responseData", JSON.stringify(hashedData))
  },

  populateCriterion(state, { criterionArray }) {
    let storedData = {}

    if (process.client && localStorage.getItem("responseData")) {
      storedData = JSON.parse(localStorage.getItem("responseData"))
    }

    for (const criterion of criterionArray) {
      const criteriaKey = criterion.criteriaKey
      criterion.response = storedData[criterion.criteriaKeyHash] ? storedData[criterion.criteriaKeyHash] : null
      Vue.set(state.eligibilityCriteria, criteriaKey, criterion)
      Vue.set(state.hashToCriteria, criterion.criteriaKeyHash, criteriaKey)
    }
  },

  clearSelectedCriteria(state) {
    for (const criteriaKey in state.eligibilityCriteria) {
      Vue.set(state.eligibilityCriteria[criteriaKey], "response", null)
    }
    localStorage.setItem("responseData", JSON.stringify({}))
  },
}

export const getters = {
  doesCriterionMatchSelection: (state, getters) => (criterion) => {
    if (!getters.isCriterionSelected(criterion) || !criterion.acceptableValues) {
      return null
    }
    return !!criterion.acceptableValues.find(
      (val) => val === getters.getCriterionByEligibilityKey(criterion.criteriaKey).response
    )
  },
  getCriterionByEligibilityKey: (state) => (criteriaKey) => {
    return (
      state.eligibilityCriteria[criteriaKey] || {
        key: `error-missing-key--${criteriaKey}`,
        label: `Key named "${criteriaKey}" not found`,
        values: "",
        type: "missing",
      }
    )
  },
  getResponseByEligibilityKey: (state) => (criteriaKey) => {
    return (
      state.eligibilityCriteria[criteriaKey].response || {
        key: `error-missing-key--${criteriaKey}`,
        label: `Key named "${criteriaKey}" not found`,
        values: "",
        type: "missing",
      }
    )
  },
  getHashResponses: (state) => {
    const responses = {}
    for (const criteriaKey in state.eligibilityCriteria) {
      const criteria = state.eligibilityCriteria[criteriaKey]
      if (criteria && criteria.response) {
        responses[criteria.criteriaKeyHash] = criteria.response
      }
      // checking to see if the date from the content file is valid
      if (isNaN(acceptanceDate)) {
        checkResult = null
      } 
      // checking to see if the inputted date is valid / complete
      if (!isNaN(userInputDate)) {
        userInputDate = toDate(userInputDate)
        switch (operator) {
          case "=":
            checkResult = isEqual(userInputDate, acceptanceDate)
            break
          case ">":
            // handling the use case of a user being <60Y & >40Y also being reflected as a range
            // >01-01-1962, <01-01-1982
            checkResult = DETERMINERS.includes(determiner) ?
              isAfter(acceptanceDate, userInputDate) :
              isAfter(userInputDate, acceptanceDate)
            break
          case "<":
            checkResult = DETERMINERS.includes(determiner) ? 
              isBefore(acceptanceDate, userInputDate) : 
              isBefore(userInputDate, acceptanceDate)
            break     
          default:
            checkResult = null
            break
        }
        if (checkResult === false) {
          break
        }
      }      
    }
    return checkResult    
  },
  /**
   * Will validate if the inputted location is either equal to or in a given distance to
   * the specified zip codes in the acceptance criteria
   * Use Cases
   * [00000]
   * [00000, 00000, 00000]
   * [00000, 00miles] (radius)
   * none - dynamic get county and state and check fema
   * @param {currentState} state 
   * @param {storeGetters} getters 
   * @returns null / true / false [ empty, pass, fail ]
   */
  validateCriterionLocation: (state, getters) => (criterion) => {
    if (!getters.isCriterionSelected(criterion)) {
      return null
    }
    const response = getters.getResponseByEligibilityKey(criterion.criteriaKey)
    // check if acceptance criteria
    if (criterion.acceptableValues) {
      switch (criterion.acceptableValues.length) {
        case 1: 
          return criterion.acceptableValues[0] === response
        case 2: {
          // need to pull zip code and radius
          let radius = criterion.acceptableValues[0].includes('mi') ? criterion.acceptableValues[0]: criterion.acceptableValues[1]
          const startingZip = criterion.acceptableValues[0].includes('mi') ? criterion.acceptableValues[1]: criterion.acceptableValues[0]
          radius = radius.split('mi')[0]
          return zipcodes.distance(parseInt(response), parseInt(startingZip)) < radius
        }
        default:
          return !!criterion.acceptableValues.find(
            (val) => 
              val === response
          )
      }
    } else {
      const zipCodeInfo = zipcodedata.lookup(parseInt(response))
      const { state, county } = zipCodeInfo
      const requestUrl = `https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?$filter(state eq '${state}' and declaredCountyArea eq '${county} (County)') and incidentEndDate eq ''}`
      axios.get(requestUrl)
        .then((response) => {
          const disasters = response.data.DisasterDeclarationsSummaries
          return disasters.length > 1
        })
        .catch((err) => {
          console.error(err)
        })
    }
    return null
  },
  doesCriterionMatchSelection: (state, getters) => (criterion) => {
    if (
      !getters.isCriterionSelected(criterion)
    ) {
      return null
    }

    if(getters.getCriterionByEligibilityKey(criterion.criteriaKey).type === 'date') {
      return getters.doesCriterionDateMatch(criterion.criteriaKey)
    } else if (getters.getCriterionByEligibilityKey(criterion.criteriaKey).type === 'location') {
      return getters.validateCriterionLocation(criterion)
    } else {
      if(!criterion.acceptableValues) {
        return null
      }
      return !!criterion.acceptableValues.find(
        (val) =>
          val ===
          getters.getCriterionByEligibilityKey(criterion.criteriaKey).response
      )
    }    
  },
  getCriterionByEligibilityKey: (state) => (criteriaKey) => {
    return (
      state.eligibilityCriteria[criteriaKey] || {
        key: `error-missing-key--${criteriaKey}`,
        label: `Key named "${criteriaKey}" not found`,
        values: "",
        type: "missing"
      }
    )
  },
  getResponseByEligibilityKey: (state) => (criteriaKey) => {
    return (
      state.eligibilityCriteria[criteriaKey].response || {
        key: `error-missing-key--${criteriaKey}`,
        label: `Key named "${criteriaKey}" not found`,
        values: "",
        type: "missing"
      }
    )
  },
  getHashResponses: (state) => {
    const responses = {}
    for (const criteriaKey in state.eligibilityCriteria) {
      const criteria = state.eligibilityCriteria[criteriaKey]
      if (criteria && criteria.response) {
        responses[criteria.criteriaKeyHash] = criteria.response
      }
    }
    return responses
  },
  getTotalEligibleCriteria:
    (state, getters) =>
    (benefitEligibilityCriteria = []) => {
      if (benefitEligibilityCriteria && benefitEligibilityCriteria.length < 1) {
        return 0
      } else {
        const matchingCriteria = benefitEligibilityCriteria.filter((criterion) =>
          getters.doesCriterionMatchSelection(criterion)
        )
        return matchingCriteria.length
      }
    },
  getTotalIneligibleCriteria:
    (state, getters) =>
    (benefitEligibilityCriteria = []) => {
      if (benefitEligibilityCriteria && benefitEligibilityCriteria.length < 1) {
        return 0
      } else {
        const matchingCriteria = benefitEligibilityCriteria.filter(
          (criterion) => getters.doesCriterionMatchSelection(criterion) === false
        )
        return matchingCriteria.length
      }
    },
  isCriterionSelected: (state, getters) => (criterion) => {
    return !!getters.getCriterionByEligibilityKey(criterion.criteriaKey).response
  },
}

export const actions = {
  async populate({ commit, state }, criteriaArray = []) {
    for (const criterion of criteriaArray) {
      const criteriaKey = criterion.criteriaKey
      criterion.criteriaKeyHash = await stringToHash(criteriaKey)
    }
    commit("populateCriterion", { criterionArray: criteriaArray })
  },

  clear({ commit, state }, criteriaArray = []) {
    commit("clearSelectedCriteria", {})
  },

  updateResponse({ commit }, { criteriaKey, response }) {
    commit("updateResponse", { criteriaKey, response })
  },
}
