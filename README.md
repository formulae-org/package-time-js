# package-time-js

Time package for [Fōrmulæ](https://formulae.org) — the visual environment for **computing**, **composing**, and **conversing** with tree-structured expressions.

This repository contains the source code for the **time package**. It is intended to the computation of expression related to time management under the gregorian calendar.

> Part of the [formulae-org](https://github.com/formulae-org) organization: the [web application](https://github.com/formulae-org/formulae-js) plus one repository per package.

▶ **[Showcase](https://formulae.org/?script=showcases/Time)** — worked examples of this package.

### Capabilities ###

* Time expressions with precision of a millisecond
* Friendly visualization of a time
* Interactive creation of time expressions including the time zone
* Programatic creation of time (in current or given time zone)
* Both interactive and programmatic creation of a time expression work in lenient parsing
* Retrieving a component of a time (in current or given time zone)
   * Year (BC as negatives)
   * Month as a symbol
   * Month as a number
   * Day of the month
   * Weekday
   * Hour of the day, in 24-hour format
   * Minute
   * Second
   * Millisecond
   * Time zone offset, in minutes. It always retrieves 0 if the current or given time zone does not observe dayling saving time
   * Whether or not the time is in daylight saving time. It always retrieves false if the current or given time zone does not observe dayling saving time
* Formatting a time expression (as a string)
    * In the current or given locale
    * In the current or given time zone
* Conversion from/to an integer number (the epoch)
