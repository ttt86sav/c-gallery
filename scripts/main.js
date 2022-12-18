"use strict";

const postModal = document.querySelector('.add-post-modal');
const buttonPost = document.querySelector('#add-photo');
const buttonFirstPost = document.querySelector('#add-first-post');
const buttonAddPhoto = document.querySelector('.add-post-modal__upload-photo')
const image = document.querySelector('input#file-upload');
const imageContainer = document.querySelector('.add-post-modal__img');
const postModalStep1 = document.querySelector('.add-post-modal__step-1');
const postModalStep2 = document.querySelector('.add-post-modal__step-2');
const buttonPostPublish = document.querySelector('#post-publish');
const postText = document.querySelector('#post-text');
const modalFooter = document.querySelector('.modal__footer');
const tags = document.querySelector('#post-hashtags');
const alertSuccess = document.querySelector('#alert-success');
const alertFail = document.querySelector('#alert-fail');

function openPostModal() {
    postModal.classList.add('active');
}

buttonPost.addEventListener('click', function() {
    openPostModal();
});

buttonFirstPost.addEventListener('click', function() {
    openPostModal();
});

new Promise(function(resolve, reject) {
    if (image.src) {
        resolve('Фото добавлено');
        imageContainer.src = image.src;
    } else {
        reject('Ошибка');
    }
}).then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
})

postModalStep1.classList.add('hidden');
postModalStep2.classList.remove('hidden');
modalFooter.classList.remove('hidden');

const params = new FormData();
params.set('text', postText.value);
params.set('image', image.src);
params.set('tags', tags.value.split(' #'));

buttonPostPublish.addEventListener('click', function() {
    fetch("https://c-gallery.polinashneider.space/api/v1/posts/", {
        method: "POST",
        body: params,
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc2MjIwMDM3LCJpYXQiOjE2NzEzODE2MzcsImp0aSI6ImYwOTk2YjhmODczZTQyY2Q5MmJkZjI5YjFiMzJjZWQ0IiwidXNlcl9pZCI6Mjl9.uh6GUASE8pgM2riPoO83Qqigs4Vjg15P8X5hN2cAsUs",
        },
    }).then((result) => {
        alertSuccess.content.cloneNode(true);
        setTimeout(() => {
            alertSuccess.innerHTML = "";
        }, 2000);
    }).catch((error) => {
        alertFail.content.cloneNode(true);
        setTimeout(() => {
            alertFail.innerHTML = "";
        }, 2000);
    })
})

postModalStep2.classList.add('hidden');
modalFooter.classList.add('hidden');
postText.value = '';
tags.value = '';