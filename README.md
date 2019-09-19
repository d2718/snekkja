# snekkja
A small, simple, HTML/JS image gallery generator.

-----

## Requirements
  * [ImageMagick](https://imagemagick.org/index.php)
  * [`dkjson`](http://dkolf.de/src/dkjson-lua.fsl/home) (Lua module)
  * `shell.lua` (included Lua module)
  * `dargs.lua` (included Lua module)
  * `dfmt.lua`  (included Lua module)

## Installation

Install the requirements in their appropriate places. (ImageMagick may already
be installed on your system; the other Lua modules of course go somewhere
in your `package.path`.) That's it. The HTML and CSS files are just for
reference (they are compactified and stuffed into `snekkja.lua`), and the JS
file is already hosted on the web.

## Use

Run `snekkja` from the directory on your web server containing your image
files. By default, `snekkja` recognizes as image files filenames ending in
`.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, and `.webp` (although this is
customizable). It will generate all the appropriate resources to display
a gallery of those images when you point your browser at that directory.

### Custom Configuration

Running `snekkja -c` will generate a default configuration (`config.lua`)
file with some configuration options to edit.

### Captions

To include a caption for the image with filename `pixor_123.jpg`, include
the text of the caption in a file named `pixor_123.html`. The contents of
this file gets inserted directly into the page, so you can include HTML tags.
Yes, you can break the layout of the page this way, so be careful.

### Custom Style

`snekkja` writes and links to a file called `snekkja.css`. If you add a
file in your image directory called `user.css`, you can use it to override
default style rules or add your own.
