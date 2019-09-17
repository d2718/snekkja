--[[
    dfmt.lua
    
    a library for formatting strings
    
    2018-02-19
]]

local dfmt = {}

local function pfmt_aux(m, tab)
    local key = m:sub(3, -2)
    local r = tab[key]
    if r then return r else return m end
end

-- Perl-style string formatting.
-- Substitutes patterns of the form ${key} with the keyed values from tab:
--      {   ['key1'] = 'val1',
--          ['key2'] = 'val2', ... }
function dfmt.pfmt(s, tab)
    return s:gsub('($%b{})', function (m) return pfmt_aux(m, tab) end)
end

-- Iterate over the lines of path, formatting each with pfmt.
function dfmt.pfmt_file(path, tab)
    local co = coroutine.create(function()
        for line in io.lines(path) do
            coroutine.yield(dfmt.pfmt(line, tab))
        end end)
    local f = function()
        local x, line = coroutine.resume(co)
        if x then return line else return nil end
    end
    return f
end

-- Copy the contents of src to dest, applying pfmt to each line.
function dfmt.pfmt_copy(src, dest, tab)
    local tgt = io.open(dest, 'w')
    for line in dfmt.pfmt_file(src, tab) do
        tgt:write(line)
        tgt:write('\n')
    end
    tgt:close()
end

local function encode_aux(ch)
    return string.format("\\a%02x", string.byte(ch))
end

-- Encode the ASCII characters in chars as escaped sequences in src.
function dfmt.encode(src, chars)
    local chz = chars
    if not string.find(chz, '\\') then
        chz = '[\\' .. chz .. ']'
    else
        chz = '[' .. chz .. ']'
    end
    
    return src:gsub(chz, encode_aux)
end

local function decode_aux(txt)
    return string.char(tonumber('0x' .. txt))
end

-- Decode a string encoded with dfmt.encode().
function dfmt.decode(src)
    return src:gsub('\\a([0-9a-f][0-9a-f])', decode_aux)
end

function dfmt.trim(txt) return txt:match('^%s*(.-)%s*$') end

return dfmt
