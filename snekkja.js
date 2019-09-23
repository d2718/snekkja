/* snekkja.js
 * 
 * snekkja Gallery Javascript functions
 * 
 * 2019-09-17
 */

const DEBUG = false;

function sprintfa(fmtstr, argz) {
    return fmtstr.replace(/{(\d+)}/g, function(match, n) {
        return typeof argz[n] != 'undefined' ? argz[n] : match;
    });
}

function debug(fmtstr, ...argz) {
    if (DEBUG) {
        let txt = sprintfa(fmtstr, argz);
        let ddiv = document.getElementById('debug_div');
        ddiv.innerHTML = ddiv.innerHTML + '\n' + txt;
    }
    return;
}

const preview_border = 6;
var strip_idx = 0;

function get_n_thumbs() {
    let strip = document.getElementById('thumbcontainer');
    let tot_w = strip.clientWidth;
    let prev_w = preview_size + (2 * preview_border);
    let n = Math.floor((tot_w - 50)/prev_w);
    if(n >= img_data.length) { n = img_data.length; }
    debug('get_n_thumbs() called: width: {0}, n: {1}', tot_w, n);
    return n;
}

function focus_image(img_n) {
    debug('focus_image({0}) called', img_n);
    let main_div = document.getElementById('main');
    let cap_div = document.getElementById('caption');
    let i_obj = img_data[img_n];
    main_div.innerHTML = '';
    let n_img = document.createElement('img');
    n_img.setAttribute('src', i_obj.u);
    if(i_obj.hasOwnProperty('c')) {
        cap_div.innerHTML = i_obj.c;
        cap_div.style.display = 'block';
    } else {
        cap_div.style.display = 'none';
    }
    main_div.appendChild(n_img);
    n_img.style.height = '100vh';
    var h = main_div.clientHeight;
    n_img.style.height = null;
    n_img.style.maxHeight = h + 'px';
    
    let zoom_div = document.getElementById('zoom');
    let zoom_img = document.getElementById('zoomimg');
    zoom_img.src = i_obj.u;
    zoom_img.onclick = function() { zoom_div.style.display = 'none'; }
    n_img.onclick = function() { zoom_div.style.display = 'block'; }
    
    return;
}

function set_thumb(img_obj, thumb_div) {
    //debug('set_thumb({0}, {1}) called', img_obj, thumb_div);
    thumb_div.innerHTML = '';
    let new_img = document.createElement('img');
    new_img.src = img_obj.u;
    thumb_div.appendChild(new_img);
    let img_style = new_img.style;
    
    if(img_obj.w > img_obj.h) {
        let scale_factor = preview_size / img_obj.h;
        let new_w = img_obj.w * scale_factor;
        let offset_l = (preview_size - new_w) / 2;
        img_style.width = new_w.toString() + 'px';
        img_style.height = preview_size.toString() + 'px';
        img_style.left = offset_l.toString() + 'px';
    } else {
        let scale_factor = preview_size / img_obj.w;
        let new_h = img_obj.h * scale_factor;
        let offset_t = (preview_size - new_h) / 2;
        img_style.height = new_h.toString() + 'px';
        img_style.width = preview_size.toString() + 'px';
        img_style.top = offset_t.toString() + 'px';
    }
    return new_img;
}

function populate_thumbstrip(thumb_idx) {
    debug('populate_thumbstrip({0}) called', thumb_idx);
    let n_thumbs = get_n_thumbs();
    let tstrip = document.getElementById('thumbstrip');
    let max_strip_idx = img_data.length - 1 - n_thumbs;
    
    let offset = Math.floor(n_thumbs/2);
    let strip_idx = thumb_idx - offset;
    if(strip_idx > max_strip_idx) { strip_idx = max_strip_idx; }
    if(strip_idx < 0) { strip_idx = 0; }
    
    tstrip.innerHTML = '';
    for(let n = 0; n < n_thumbs; n++) {
        let img_n = strip_idx + n;
        let new_tdiv = document.createElement('div');
        if(img_n == thumb_idx) {
            new_tdiv.className = 'thumblight';
        }
        tstrip.appendChild(new_tdiv);
        let new_img = set_thumb(img_data[img_n], new_tdiv);
        new_img.onclick = function() {
            focus_image(img_n);
            populate_thumbstrip(img_n);
        }
    }
    
    let larrow = document.getElementById('larrow');
    let rarrow = document.getElementById('rarrow');
    if(strip_idx == 0) {
        larrow.style.display = 'none';
    } else {
        larrow.style.display = 'inline-block';
    }
    if(strip_idx == max_strip_idx) {
        rarrow.style.display = 'none';
    } else {
        rarrow.style.display = 'inline-block';
    }
    
    return;
}

window.onload = function() {
    focus_image(0);
    populate_thumbstrip(0);
}