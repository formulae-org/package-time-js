# package-time-js

Time package for the [Fōrmulæ](https://formulae.org) programming language.

Fōrmulæ is also a software framework for visualization, edition and manipulation of complex expressions, from many fields. The code for an specific field —i.e. arithmetics— is encapsulated in a single unit called a Fōrmulæ **package**.

This repository contains the source code for the **time package**. It is intended to the computation of expression related to time management under the gregorian calendar.

The GitHub organization [formulae-org](https://github.com/formulae-org) encompasses the source code for the rest of packages, as well as the [web application](https://github.com/formulae-org/formulae-js).

<!--
Take a look at this [tutorial](https://formulae.org/?script=tutorials/Complex) to know the capabilities of the Fōrmulæ arithmetic package.
-->

### Capabilities ###

* Time expressions with precision of a millisecond
* Friendly visualization of a time
* Interactive creation of time expressions including the time zone
* Programatic creation of time (in current or given time zone)
* Both interactive and programmatic creation of a time expression works in lenient mode
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
