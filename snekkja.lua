#!/usr/bin/lua

--[[ snekkja (.lua)

Generate small, simple image galleries.

2019-08-15

--]]

local TEST = { entries=false }

local shell = require 'shell'
local json  = require 'dkjson'

local EXT_PATT = '%.[^.]+$'

local config = {
    ['default_caption'] = nil,
    ['pretty_json'] = true,
}

local INDEX = [[<!doctype html>
<html><head>
<meta charset="utf-8">
<title>snekkja gallery test page</title>
<script type="text/javascript" src="data.js"></script>
<link rel="stylesheet" href="snekkja.css">
<link rel="stylesheet" href="user.css">
</head><body>
<div id="header"></div><div id="main"></div>
<div id="thumbcontainer"><div id="thumbstrip"></div></div>
<div id="footer"></div>
<div id="debug_div"></div>
<script type="text/javascript" src="https://d2718.net/hosted/snekkja.js"></script>
</body></html>]]

local STYLESHEET = [[body { background-color: #333; color: #abb; }
#main { margin: 1em; text-align: center; }
#main img { max-width: 100%; max-height: 480px; }
#main figcaption { margin: 1ex; }
#thumbstrip { display: flex; justify-content: center;
align-items: center; align-content: center; }
#thumbstrip div { position: relative; display: inline-block;
overflow: hidden; height: 100px; width: 100px; 
border: 4px solid black; margin: 4px; }
#thumbstrip div img { position: absolute; }
div#thumbstrip div.thumblight { border: 4px solid gray; }
#debug_div { font-family: monospace; white-space: pre; }]]

-- Exit on error with an explanation
local function die(fmtstr, ...)
    local msg = string.format(fmtstr, args)
    io.stderr:write(msg)
    if msg:sub(#msg, #msg) ~= '\n' then io.stderr:write('\n') end
    os.exit(1)
end

-- Recognized image file extensions.
local IMAGE_EXTS = { '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp' }

local image_t = {}
for _, ext in ipairs(IMAGE_EXTS) do image_t[ext] = true end

-- Return the extension of a filename.
local function get_extension(fname)
    return string.match(fname, EXT_PATT)
end

-- Return a filename with its extension removed.
local function remove_extension(fname)
    local ext = get_extension(fname)
    if type(ext) ~= 'string' then return fname end
    return string.sub(fname, 1, #fname - #ext)
end

-- Return a list of all image files in the current directory.
local function get_file_list()
    local fnames = {}
    local p = io.popen('ls .')
    for fname in p:lines() do
        ext = get_extension(fname)
        if type(ext) == 'string' then
            if image_t[string.lower(ext)] then
                table.insert(fnames, fname)
            end
        end
    end
    p:close()
    return fnames
end

-- Generate a gallery info object for the image with the given filename.
local function make_entry_tab(fname)
    local cmd_toks = {'identify', '-ping', '-format', '%w %h', fname}
    local cmd = shell.escape(cmd_toks)
    local p = io.popen(cmd, 'r')
    local w, h = string.match(p:read('*all'), '(%d+)%s+(%d+)')
    p:close()
    if not (w and h) then
        return nil
    end
    local t = { ['u'] = fname, ['w'] = tonumber(w), ['h'] = tonumber(h) }
    local cap_fname = remove_extension(fname) .. '.html'
    local cf = io.open(cap_fname, 'r')
    if cf then
        t.c = cf:read('*all')
        cf:close()
    elseif config.default_caption then
        t.c = config.default_caption
    end
    return t
end


--
-- Testing section.
--

local TESTED = false

if TEST.entries then
    local dump = require 'dump'
    local fnamez = get_file_list()
    local entriez = {}
    for _, fname in ipairs(fnamez) do
        local e = make_entry_tab(fname)
        if e then
            table.insert(entriez, e)
        end
    end
    print('\nEntries:')
    dump.dump(entriez)
    TESTED = true
end

if TESTED then os.exit(0) end

--
-- Now do the stuff for realz.
--

local filenames = get_file_list()
local img_entries = {}
for _, fn in ipairs(filenames) do
    local e = make_entry_tab(fn)
    if e then table.insert(img_entries, e) end
end

local ok, data_string = pcall(json.encode, img_entries,
                              { indent=config['pretty_json'] })
if not ok then
    die('Error encoding JSON data: %s\n', data_string)
end

local dataf, err = io.open('data.js', 'w')
if not dataf then
    die('Error opening file "data.js" for writing: %s\n', err)
end
dataf:write('var img_data = ')
dataf:write(data_string)
dataf:write(';\n')
dataf:close()

local f, err = io.open('index.html', 'w')
if not f then
    die('Error opening file "index.html" for writing: %s\n', err)
end
f:write(INDEX)
f:close()
f, err = io.open('snekkja.css', 'w')
if not f then
    die('Error opening file "snekkja.css" for writing: %s\n', err)
end
f:write(STYLESHEET)
f:close()



