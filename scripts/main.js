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
const textCounter = document.querySelector('.text-counter');
const bodyOverlay = document.querySelector('.body-overlay');
const body = document.querySelector('body');
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc2MjIwMDM3LCJpYXQiOjE2NzEzODE2MzcsImp0aSI6ImYwOTk2YjhmODczZTQyY2Q5MmJkZjI5YjFiMzJjZWQ0IiwidXNlcl9pZCI6Mjl9.uh6GUASE8pgM2riPoO83Qqigs4Vjg15P8X5hN2cAsUs";

buttonAddPost.addEventListener('click', function() {
    postModal.classList.add('active');
    body.classList.add('with-overlay');
    bodyOverlay.classList.add('active');
});

buttonFirstPost.addEventListener('click', function() {
    postModal.classList.add('active');
    body.classList.add('with-overlay');
    bodyOverlay.classList.add('active');
});

bodyOverlay.addEventListener('click', () => {
    body.classList.remove('with-overlay');
    bodyOverlay.classList.remove('active');
    postModal.classList.remove('active');
    postModal.classList.remove('active');
    postModalStep1.classList.remove('hidden');
    postModalStep2.classList.add('hidden');
    modalFooter.classList.add('hidden');
    fileUpload.value = '';
    postText.value = '';
    tags.value = '';
    image.src = '';
})

fileUpload.accept = "image/*";

fileUpload.addEventListener('change', function() {
    file = fileUpload.files[0];
    image.src = URL.createObjectURL(file);
    postModalStep1.classList.add('hidden');
    postModalStep2.classList.remove('hidden');
    modalFooter.classList.remove('hidden');
})

postText.addEventListener('input', function() {
    textCounter.textContent = postText.value.length + "/2000";

    if (postText.value.length > 2000) {
        postText.classList.add('textarea--error');
        buttonPublish.classList.add('edit-bio-modal__button-save--inactive');
        textCounter.classList.add('alert--error');
    } else {
        buttonPublish.classList.remove('edit-bio-modal__button-save--inactive');
        postText.classList.remove('textarea--error');
        textCounter.classList.remove('alert--error');
    }
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
            Authorization: token,
        },
    }).then(() => {
        const successAlert = alertSuccessTemplate.content.cloneNode(true);
        successAlert.querySelector('h4').textContent = "Успешно";
        successAlert.querySelector('p').textContent = "Публикация добавлена!";

        //body.append(successAlert);
        /*setTimeout(() => {
            successAlert.remove();
        }, 2000);*/

        fetch("https://c-gallery.polinashneider.space/api/v1/users/me/posts", {
            headers: {
                Authorization: token
            },
        }).then((result) => {
            return result.json();
        }).then((data) => {
            console.log(data);
            const posts = data;

            const photoCount = document.querySelector('#photo-count');
            photoCount.textContent = posts.length;

            photosContent.classList.remove('hidden');
            emptyContent.classList.add('hidden');

            const fragment = new DocumentFragment();
            photosContent.innerHTML = '';
            for (let i = 0; i <= posts.length - 1; i++) {
                const postCard = createPostThumbnail(data[i].image);
                fragment.prepend(postCard);
            }

            photosContent.append(fragment);

        }).catch((error) => {
            const failAlert = alertFailTemplate.content.cloneNode(true);
            failAlert.querySelector('h4').textContent = 'Ошибка';
            failAlert.querySelector('p').textContent = 'Публикация не опубликована';
            /*body.append(failAlert);
            setTimeout(() => {
                failAlert.remove();
            }, 2000);*/
        }).finally(() => {
            postModal.classList.remove('active');
            postModalStep1.classList.remove('hidden');
            postModalStep2.classList.add('hidden');
            modalFooter.classList.add('hidden');
            body.classList.remove('with-overlay');
            bodyOverlay.classList.remove('active');
            fileUpload.value = '';
            postText.value = '';
            tags.value = '';
            image.src = '';
        })
    })
})

const emptyContent = document.querySelector('.empty-content');
const photosContent = document.querySelector('.photos__content');
const postTemplate = document.querySelector('#post-template');
const previewPostModal = document.querySelector('.preview-post-modal');

function createPostThumbnail(imgSrc) {
    const postThumbnail = postTemplate.content.cloneNode(true);
    postThumbnail.querySelector('img').src = imgSrc;

    return postThumbnail;
}

fetch("https://c-gallery.polinashneider.space/api/v1/users/me/posts", {
    headers: {
        Authorization: token
    },
}).then((result) => {
    return result.json();
}).then((data) => {
    console.log(data);
    const posts = data;

    const photoCount = document.querySelector('#photo-count');
    photoCount.textContent = posts.length;

    if (posts.length == 0) {
        photosContent.classList.add('hidden');
        emptyContent.classList.remove('hidden');
    } else {
        const fragment = new DocumentFragment();
        photosContent.innerHTML = '';
        for (let i = 0; i <= posts.length - 1; i++) {
            const postCard = createPostThumbnail(data[i].image);
            fragment.prepend(postCard);
        }
        photosContent.append(fragment);

        // postCard.addEventListener('click', function() {
        //     previewPostModal.classList.add('active');
        // })
    }
});