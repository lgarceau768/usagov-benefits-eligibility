---
# yaml front matter here
title: "Disability"
summary: "Whether you are newly disabled or have a lifelong challenge, assistance may be available, including financial help."
lede: ""
secondaryHeadline: "Disability benefits"

eligibilityCriteriaDescription: "Please check the boxes and select the options that best describe your situation. Answer as many questions as possible for the most accurate results."

eligibilityCriteria:
  - label: "About you (the person applying for benefits)"
    description: ""
    criteriaGroupKey: applicant
    criteriaKeys:
      - applicant_disability
      - applicant_ability_to_work
      - applicant_paid_into_SS
      - applicant_income
      - applicant_marital_status
      - applicant_served_in_active_military
      - applicant_citizen_status

  - label: "Did you recently lose a family member?"
    description: ""
    criteriaGroupKey: deceased
    criteriaKeys:
      - applicant_relationship
      - deceased_paid_into_SS

---
