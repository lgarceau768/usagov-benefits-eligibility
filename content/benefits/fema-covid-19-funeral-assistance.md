---
title: "COVID-19 Funeral Assistance"
headline: "COVID-19 Funeral Assistance"
tags: 
- "burial and funeral assistance"
lifeEvents: 
- death-and-burial
- national-emergency-and-disaster
source:
  name: "FEMA"
  link: https://www.fema.gov/disasters/coronavirus/economic/funeral-assistance

summary: "Financial assistance may be available to help with the burial and funeral costs for people who died of COVID-19."

eligibility:
# In the order you want the criteria to display, list criteriaKeys from the csv here, each followed by a comma-separated list of which values indicate eligibility for that criteria. Wrap individual values in quotes if they have inner commas.
- criteriaKey: deceased_died_of_COVID
  acceptableValues: [true]
- criteriaKey: deceased_death_location_is_US
  acceptableValues: [true]
- criteriaKey: deceased_date_of_funeral
  label: "The deceased's funeral/burial was after January 20, 2020."
  acceptableValues: [true]
- criteriaKey: applicant_citizen_status
  acceptableValues: [true]
- criteriaKey: applicant_paid_funeral_expenses
  acceptableValues: [true]


---
