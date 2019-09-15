# snekkja
A small, simple, HTML/JS image gallery generator.

-----

## Requirements
  * `shell.lua` (included)
  * [`dkjson`](http://dkolf.de/src/dkjson-lua.fsl/home)

## Installation

The Lua script goes somewhere in your path; the two required Lua modules
go somewhere in your Lua `package.path`. That's it. The HTML and CSS files
are just for reference (they are compactified and stuffed into `snekkja.lua`),
and the JS file is already hosted on the web.

## Use

Run `snekkja` from the directory on your web server containing your image
files. `snekkja` recognizes as image files filenames ending in `.jpg`, `.jpeg`,
`.png`, `.gif`, `.bmp`, and `.webp`.

### Captions

To include a caption for the image with filename `pixor_123.jpg`, include
the text of the caption in a file named `pixor_123.html`.

### Custom Style

`snekkja` writes and links to a file called `snekkja.css`. If you add a
file in your image directory called `user.css`, you can use it to override
default style rules or add your own.
