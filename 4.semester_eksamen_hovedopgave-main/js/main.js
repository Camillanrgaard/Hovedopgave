"use strict";

// =========== Essay SPA functionality =========== //

let _essays = [];
let _selectedEssayId;

// fetch all essays from WP
async function getEssays() {
    let response = await fetch("https://blog.debelmose-rideudstyr.dk/wp-json/wp/v2/posts?_embed");
    let data = await response.json();
    console.log(data);
    _essays = data;
    appendEssays(data);
    showLoader(false);
}

getEssays();

// append essays to the DOM
function appendEssays(essays) {
    let htmlTemplate = "";
    for (let essay of essays) {
        htmlTemplate += /*html*/ `
        <article onclick="showDetailView('${essay.id}')">
            <img src="${getFeaturedImageUrl(essay)}">
            <h2 class="title-h2">${essay.title.rendered}</h2>
            <h3 class="article-date">${essay.date_gmt}</h3>
        </article>
    `;
    }
    document.querySelector('#essays-container').innerHTML = htmlTemplate;
}

// get the featured image url
function getFeaturedImageUrl(post) {
    let imageUrl = "";
    if (post._embedded['wp:featuredmedia']) {
        imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
    }
    return imageUrl;
}

function showDetailView(id) {
    const essay = _essays.find(essay => essay.id == id);
    document.querySelector("#detailView h2").innerHTML = essay.title.rendered;
    document.querySelector("#detailViewContainer").innerHTML = /*html*/`
        <article>
            <h1>${essay.title.rendered}</h1>
            <img src="${getFeaturedImageUrl(essay)}">
            <h3 class="article-date">${essay.date}</h3>
            <p>${essay.content.rendered}</p>
            <div class="related-articles-div">
            <h4 class="related-articles-heading">Læs vores andre artikler</h4>
            <iframe src="${essay.acf.trailer}" scrolling="no" style="overflow: hidden" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
           <a href="#essays"><button class="view-more-btn">Se alle...</button></a>
           </div>
            </article>
    `;
    navigateTo("detailView");
}

if (!_selectedEssayId) {
    navigateTo("essays");
}


// =========== Loader functionality =========== //

function showLoader(show = true) {
    let loader = document.querySelector('#loader');
    if (show) {
        loader.classList.remove("hide");
    } else {
        loader.classList.add("hide");
    }
}
