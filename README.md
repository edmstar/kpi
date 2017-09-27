# KPI

KPI Service


## List of features

* Basic backend functionality
    * (.) Expose functions through RESTful API with token authentication
    * (.) Create, update and delete KPIs and its values
    * (.) Retrieve KPI values and consolidate KPIs based on values, frequency and period
    * ( ) Allow dependencies between KPIs (manually or through formula)
    * (.) Generate consolidated and granular output for report generation
    * ( ) Allow grouping KPIs
    * (X) Allow the following frequencies: second, minute, hour, day, week, month, semester, year
    * ( ) Generate consolidated output for dashboards
    * (.) Allow specifying consolidation method for multiple values within a frequency type
    * (.) Allow the following consolidation types: sum, mean, weighted mean, min, max, formula
    * (.) Unit testing of all functionality with dynamically generated/populated database
    * ( ) Smart engine to evaluate if consolidation can be processed through SQL queries

* Future backend work
    * ( ) System KPIs (readonly)
    * ( ) Allow credentials to be retrieved from LDAP and other systems (to be evaluated)
    * ( ) Create, update and delete credentials
    * ( ) Create, update and delete companies/user groups (to be evaluated)
    * ( ) Limit read/write/configure access to singular KPIs based on credentials
    * ( ) Configure access to KPI groups
    * ( ) Log API activity
    * ( ) Allow hooks

* Frontend functionality
    * TBD