let page = 0;
const commentBox = document.getElementById('commentBox');
const loading = document.getElementById('loading'); // pastikan ada elemen ini di HTML

function loadComments() {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    const start = page * 5;
    const end = start + 5;
    const nextComments = comments.slice(start, end);

    nextComments.forEach(function(comment) {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        const ratingStars = '⭐'.repeat(comment.rating);

        commentDiv.innerHTML = `
            <p><strong>${comment.username}</strong></p>
            <p>Rating: ${ratingStars}</p>
            <p>Comment: ${comment.comment}</p>
        `;
        commentBox.appendChild(commentDiv);
    });

    if (nextComments.length < 5) {
        window.removeEventListener('scroll', handleScroll);
        loading.textContent = 'No more comments to load';
    } else {
        page++;
    }
}

function handleScroll() {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        loadComments();
    }
}

window.onload = function() {
    loadComments();
    window.addEventListener('scroll', handleScroll);
};
