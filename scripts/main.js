let file = null;

const postModal = document.querySelector('.add-post-modal');
const buttonAddPost = document.querySelector('#add-photo');
const buttonFirstPost = document.querySelector('#add-first-post');
const fileUpload = document.querySelector('#file-upload');
const image = document.querySelector('#uploaded-photo');
const postModalStep1 = document.querySelector('.add-post-modal__step-1');
const postModalStep2 = document.querySelector('.add-post-modal__step-2');
const modalFooter = document.querySelector('.modal__footer');
const buttonPublish = document.querySelector('#post-publish');
const postText = document.querySelector('#post-text');
const tags = document.querySelector('#post-hashtags');
const alertSuccessTemplate = document.querySelector('#alert-success');
const alertFailTemplate = document.querySelector('#alert-fail');
const alertSuccessContainer = document.querySelector('.alert--success');
const alertFailContainer = document.querySelector('.alert--error');

buttonAddPost.addEventListener('click', function() {
    postModal.classList.add('active');
});

buttonFirstPost.addEventListener('click', function() {
    postModal.classList.add('active');
});

fileUpload.accept = "image/*";

fileUpload.addEventListener('change', function() {
    file = fileUpload.files[0];
    image.src = URL.createObjectURL(file);
    postModalStep1.classList.add('hidden');
    postModalStep2.classList.remove('hidden');
    modalFooter.classList.remove('hidden');
})

buttonPublish.addEventListener('click', function() {
    const params = new FormData();
    params.set('text', postText.value);
    params.set('image', file);
    params.set('tags', tags.value);
    fetch("https://c-gallery.polinashneider.space/api/v1/posts/", {
        method: "POST",
        body: params,
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc2MjIwMDM3LCJpYXQiOjE2NzEzODE2MzcsImp0aSI6ImYwOTk2YjhmODczZTQyY2Q5MmJkZjI5YjFiMzJjZWQ0IiwidXNlcl9pZCI6Mjl9.uh6GUASE8pgM2riPoO83Qqigs4Vjg15P8X5hN2cAsUs",
        },
    }).then(() => {
        const successAlert = alertSuccessTemplate.content.cloneNode(true);
        successAlert.querySelector('h4').textContent = 'ура!';
        successAlert.querySelector('p').textContent = 'ура!';
        alertSuccessContainer.append(successAlert);
        successAlert.classList.remove('hidden');
        setTimeout(() => {
            successAlert.classList.add('hidden');
        }, 2000);
    }).catch((error) => {
        const failAlert = alertFailTemplate.content.cloneNode(true);
        failAlert.querySelector('h4').textContent = 'ошибка';
        failAlert.querySelector('p').textContent = 'ошибка';
        alertFailContainer.append(failAlert);
        failAlert.classList.remove('hidden');
        setTimeout(() => {
            failAlert.classList.add('hidden');
        }, 2000);
    }).finally(() => {
        postModal.classList.remove('active');
        postModalStep1.classList.remove('hidden');
        postModalStep2.classList.add('hidden');
        modalFooter.classList.add('hidden');
        fileUpload.value = '';
        postText.value = '';
        tags.value = '';
        image.src = '';
    })
})