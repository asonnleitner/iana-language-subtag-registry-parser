[![codecov](https://codecov.io/gh/asonnleitner/iana-language-subtag-registry-parser/branch/master/graph/badge.svg?token=ZL0QGAMV62)](https://codecov.io/gh/asonnleitner/iana-language-subtag-registry-parser)
[![CI](https://github.com/asonnleitner/iana-language-subtag-registry-parser/actions/workflows/ci.yaml/badge.svg)](https://github.com/asonnleitner/iana-language-subtag-registry-parser/actions/workflows/ci.yaml)

# IANA Language Subtag Registry Parser

> The IANA Language Subtag Registry is a long text file  that contains a list of all the language subtags that are used in the IETF BCP 47 standard.

This parser parses the IANA Language Subtag Registry and generates JSON objects that can be used for further processing.

## Getting Started

- [Installation](#installation)
    - [Requirements](#requirements)
    - [Usage](#usage)
- [Example](#example)

## Installation

### Requirements:

- [`node`](https://nodejs.org/) >=16.13.1
- [`pnpm`](https://pnpm.io/) >=6.23.6

### Usage:

```shell
$ pnpm install #to install dependencies

$ pnpm start #to start the script

$ pnpm start:stdout #to write the output to stdout
```

## Example
Input:
```text
File-Date: 2021-08-06
%%
Type: language
Subtag: aa
Description: Afar
Added: 2005-10-16
%%
Type: language
Subtag: ab
Description: Abkhazian
Added: 2005-10-16
Suppress-Script: Cyrl
```

Output:
```JSON
[
  {
    "fileDate": "2021-08-06"
  },
  {
    "type": "language",
    "subtag": "aa",
    "description": "Afar",
    "added": "2005-10-16"
  },
  {
    "type": "language",
    "subtag": "ab",
    "description": "Abkhazian",
    "added": "2005-10-16",
    "suppressScript": "Cyrl"
  }
]
```
