import { state, mutations, getters, actions } from "@/store/criteria"

const mockCriteria = () => [
  {
    criteriaKey: "deceased_death_circumstance",
    criteriaKeyHash: "acbca85",
    label: "One of the following circumstances apply to the deceased",
    type: "select",
    values:
      "died as a result of a service-connected disability; died while receiving or traveling to receive VA care; died while eligible, pending to receive, or receiving VA compensation or pension"
  },
  {
    criteriaKey: "applicant_relationship",
    criteriaKeyHash: "8f306c9",
    label: "Your (applicant's) relationship to the deceased is",
    type: "select",
    values:
      "spouse; child; other family member; personal or official representative"
  }
]

describe("criteria", () => {
  describe("mutations", () => {
    it("should preloaded responses", () => {
      const storeState = state()
      const criteria = mockCriteria()
      mutations.populateCriterion(storeState, {
        hash: criteria[0].criteriaKeyHash,
        criterion: criteria[0]
      })
      mutations.preloadedResponse(storeState, {
        response: true,
        criteriaKeyHash: criteria[0].criteriaKeyHash
      })
      mutations.preloadedResponse(storeState, {
        response: "spouse",
        criteriaKeyHash: criteria[1].criteriaKeyHash
      })
      mutations.populateCriterion(storeState, {
        hash: criteria[1].criteriaKeyHash,
        criterion: criteria[1]
      })
      expect(
        storeState.eligibilityCriteria[criteria[0].criteriaKey].response
      ).toBe(true)
      expect(storeState.preloadedResponses[criteria[1].criteriaKeyHash]).toBe(
        "spouse"
      )
      expect(
        storeState.eligibilityCriteria[criteria[1].criteriaKey].response
      ).toBe("spouse")
    })
    it("should populate criterion", () => {
      const storeState = state()
      const criterion = mockCriteria()[0]
      mutations.populateCriterion(storeState, {
        hash: criterion.criteriaKeyHash,
        criterion
      })
      expect(
        storeState.eligibilityCriteria[criterion.criteriaKey]
      ).toBeDefined()
      expect(storeState.hashToCriteria[criterion.criteriaKeyHash]).toBeDefined()
    })
  })
  describe("actions", () => {
    it("should populate eligibility criteria", async () => {
      const storeState = state()
      const commit = jest.fn()
      await actions.populate({ commit, state }, mockCriteria())
      expect(commit.mock.calls.length).toBe(2)
      expect(commit.mock.calls[0][0]).toBe("populateCriterion")
      expect(commit.mock.calls[0][1].hash).toBe("acbca85")
    })

    it("should update responses", async () => {
      const commit = jest.fn()
      await actions.updateResponse({ commit, state }, mockCriteria()[0])
      expect(commit.mock.calls.length).toBe(1)
      expect(commit.mock.calls[0][0]).toBe("updateResponse")
    })
  })
  describe("getters", () => {
    it("should return an error when criteriaKey doesn't exist", () => {
      const storeState = state()
      const ret = getters.getCriterionByEligibilityKey(storeState)("bad_key")
      expect(ret.key).toMatch(/error-missing-key--/)
    })
    describe("getTotalEligibleCriteria", () => {
      it("should return 0 when there are no criteria", () => {
        const storeState = state()
        const ret = getters.getTotalEligibleCriteria(storeState, getters)()
        expect(ret).toBe(0)
      })
    })
    describe("getTotalIneligibleCriteria", () => {
      it("should return 0 when there are no criteria", () => {
        const storeState = state()
        const ret = getters.getTotalIneligibleCriteria(storeState, getters)()
        expect(ret).toBe(0)
      })
    })
    describe("doesCriterionDateMatch", () => {
      it("should return false when criteria is not met", async () => {
        let storeState = state()
        const criterion = {
          criteriaKey: "applicant_senior_citizen",
          criteriaKeyHash: "9e63db02",
          type: "date",
          acceptableValues: ['<60years', '>40years'],
          response: '11-14-1900',
          TEST: true
        }
        storeState.eligibilityCriteria[criterion.criteriaKey] = criterion
        const ret = getters.doesCriterionDateMatch(storeState, getters)(criterion)
        expect(ret).toBe(false)
      })
      it("should return true when criteria is passed (dynamic years)", async () => {
        let storeState = state()
        const criterion = {
          criteriaKey: "applicant_senior_citizen",
          criteriaKeyHash: "9e63db02",
          type: "date",
          acceptableValues: ['<60years', '>40years'],
          response: '11-14-1975',
          TEST: true
        }
        storeState.eligibilityCriteria[criterion.criteriaKey] = criterion
        const ret = getters.doesCriterionDateMatch(storeState, getters)(criterion)
        expect(ret).toBe(true)
      })   
      it("should return true when criteria is passed (fixed years)", async () => {
        let storeState = state()
        const criterion = {
          criteriaKey: "applicant_senior_citizen",
          criteriaKeyHash: "9e63db02",
          type: "date",
          acceptableValues: ['<01-01-1982', '>01-01-1962'],
          response: '11-14-1975',
          TEST: true
        }
        storeState.eligibilityCriteria[criterion.criteriaKey] = criterion
        const ret = getters.doesCriterionDateMatch(storeState, getters)(criterion)
        expect(ret).toBe(true)
      }) 
      it("should return true when criteria is passed (same date)", async () => {
        let storeState = state()
        const criterion = {
          criteriaKey: "applicant_senior_citizen",
          criteriaKeyHash: "9e63db02",
          type: "date",
          acceptableValues: ['=11-14-1999'],
          response: '11-14-1999',
          TEST: true
        }
        storeState.eligibilityCriteria[criterion.criteriaKey] = criterion
        const ret = getters.doesCriterionDateMatch(storeState, getters)(criterion)
        expect(ret).toBe(true)
      })   
      it("should return true when criteria is passed (dynamic months)", async () => {
        let storeState = state()
        const criterion = {
          criteriaKey: "applicant_senior_citizen",
          criteriaKeyHash: "9e63db02",
          type: "date",
          acceptableValues: ['<6months', '>4months'],
          response: '09-14-2021',
          TEST: true
        }
        storeState.eligibilityCriteria[criterion.criteriaKey] = criterion
        const ret = getters.doesCriterionDateMatch(storeState, getters)(criterion)
        expect(ret).toBe(true)
      })
      it("should return true when criteria is passed (dynamic days)", async () => {
        let storeState = state()
        const criterion = {
          criteriaKey: "applicant_senior_citizen",
          criteriaKeyHash: "9e63db02",
          type: "date",
          acceptableValues: ['<30days', '>1days'],
          response: '02-25-2022',
          TEST: true
        }
        storeState.eligibilityCriteria[criterion.criteriaKey] = criterion
        const ret = getters.doesCriterionDateMatch(storeState, getters)(criterion)
        expect(ret).toBe(true)
      })
    })
  })
})
