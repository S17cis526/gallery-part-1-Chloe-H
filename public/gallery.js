// JavaScript for the gallery page

var title = document.getElementById('gallery-title');
title.onclick = function (e) {
    e.preventDefault(); // e is an event, and this prevents the browser from doing the standard action for it ("yo, browser, we got this")
    var form = document.getElementById('gallery-title-edit');
    form.style.display = 'block';
}
