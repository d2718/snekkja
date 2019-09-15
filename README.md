# snekkja
A small, simple, HTML/JS image gallery generator.

-----

## Requirements
  * `shell.lua` (included)
  * [`dkjson`](http://dkolf.de/src/dkjson-lua.fsl/home)

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
