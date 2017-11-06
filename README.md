# KPI

[![Build Status](https://travis-ci.org/eduardostarling/kpi.svg?branch=master)](https://travis-ci.org/eduardostarling/kpi)

## List of features

* Basic backend functionality
    * (X) Expose functions through RESTful API with token authentication
    * (.) Create, update and delete KPIs and its values
    * (X) Retrieve KPI values and consolidate KPIs based on values, frequency and period
    * ( ) Allow dependencies between KPIs (manually or through formula)
    * ( ) Generate consolidated and granular output for report generation
    * ( ) Allow grouping KPIs, in which each KPI can belong to multiple groups
    * (X) Allow the following frequencies: second, minute, hour, day, week, month, semester, year
    * ( ) Generate consolidated output for dashboards
    * (X) Allow specifying consolidation method for multiple values within a frequency type
    * (-) Allow the following consolidation types: sum, mean, weighted mean, min, max, formula
    * (.) Unit testing of all functionality with dynamically generated/populated database
    * ( ) Smart engine to evaluate if consolidation can be processed through SQL queries
    * ( ) Allow KPI/KPIValue metadata to be stored on the database
    * ( ) Allow KPIs to have ranged targets either by specifying constant values, pointing to other KPIs or specifying constant percentage (margins only)
    
* Future backend work
    * ( ) System KPIs (readonly)
    * ( ) Allow credentials to be retrieved from LDAP and other systems (to be evaluated)
    * ( ) Create, update and delete credentials
    * ( ) Create, update and delete user groups
    * ( ) Limit read/write/configure access to singular KPIs based on credentials
    * ( ) Configure access to KPI groups
    * ( ) Log API activity
    * ( ) Allow hooks
    * ( ) Allow multiple consolidation for weighted KPIs

* Frontend functionality
    * TBD
