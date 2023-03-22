# CV Generator

This package will generate a CV (`.tex` and `.pdf`) for you from a `.json` input (schema specified below).

## How to run

1. Clone the package, and run `npm i` to install all dependencies.
2. Replace the filler data in `data/cv.json`
3. `node index.js`
4. Your pdf is saved in `out/`

## Options

```
--dataFile=<filename>.json		A JSON file in the data/ folder containing CV data.
--outputFile=<filename>				The filename to use for output of tex and pdf output
--texOut											Output tex as well as pdf
```

## Data Format

An example file is provided in data/template.json

The JSON file consists of a single object, containing fields `name`, `contact`, `websites`, and `sections`. These are detailed below.

```
{
  "name": "a string representing your name",
  "contact": {
    "phone": "<your phone number as a string>",
    "email": "<your email address as a string>"
  },
  "websites": ["<relevant web link 1>", ...],
  "sections": {
    "<section header>": [
      {
        "pre": "<text to appear before bullet point>",
        "post": "<text to appear before bullet point>",
				"date": "<text to appear right aligned>",
				"bullets": ["<first bullet point>", "<second bullet point>"]
      }, ...
    ]
  }
}
```

Note that within strings you should escape characters such as `&` using a `\`
