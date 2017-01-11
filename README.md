# Cisco Spark for React _(react-ciscospark)_

> The Cisco Spark for React library allows developers to easily incorporate Spark functionality into an application.

## Table of Contents
- [Background](#background)
- [Widgets](#widgets)
  - [Install](#install)
    - [CDN](#cdn)
    - [Build from Source](#build-from-source)
  -   [Usage](#usage)
      -   [Quick Start](#quick-start)
      -   [HTML](#html)
      -   [JSX](#jsx)
- [Components](#components)
  - [Install](#install)
-   [Browser Support](#browser-support)

## Background

This library allows React developers to quickly and easily create a Cisco Spark experience within their apps. Here we provide basic components (e.g. buttons, text fields, icons) that reflect the styles and aesthetics of Spark, along with more complex, complete widgets, such as the Spark Message and Meet Widget.

The basic components are just presentational React <https://github.com/facebook/react> components, while our widgets leverage Redux <https://github.com/reactjs/redux> and the Spark Javascript SDK <https://github.com/ciscospark/spark-js-sdk>.

## Widgets

### Install

#### CDN
#### Build From Source

### Usage

## Components

### Install


### Development

#### Setup Environment Variables

Setup your `.env` file with the following values:

```
CISCOSPARK_ACCESS_TOKEN=
```

## Limitations
### Development

* `stylelint` currently ignores all `node_modules` directories, and will not lint our packages. Discussion: <https://github.com/stylelint/stylelint/issues/2236>
