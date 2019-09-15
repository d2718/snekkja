/* snekkja.js
 * 
 * snekkja Gallery Javascript functions
 * 
 * 2019-09-15
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

const preview_size = 100;
const preview_border = 6;

var thumbs = Array();
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
    let i_obj = img_data[img_n];
    main_div.innerHTML = '';
    let fig = document.createElement('figure');
    let n_img = document.createElement('img');
    n_img.setAttribute('src', i_obj.u);
    fig.appendChild(n_img);
    if(i_obj.hasOwnProperty('c')) {
        let cap = document.createElement('figcaption');
        cap.innerHTML = i_obj.c;
        fig.appendChild(cap);
    }
    main_div.appendChild(fig);
    
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
    
    return;
}

window.onload = function() {
    focus_image(0);
    populate_thumbstrip(0);
}