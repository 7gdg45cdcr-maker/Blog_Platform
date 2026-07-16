let currentPostId = null;

async function loadComments(postId) {
    currentPostId = postId;
    try {
        const response = await fetch(`${API_URL}/comments/post/${postId}`);
        const comments = await response.json();
        displayComments(comments);
    } catch (error) {
        document.getElementById('comments').innerHTML = '<p>Error loading comments</p>';
    }
}

function displayComments(comments) {
    const container = document.getElementById('comments');
    
    if (!comments || comments.length === 0) {
        container.innerHTML = '<p>No comments yet. Be the first!</p>';
        return;
    }
    
    container.innerHTML = comments.map(comment => `
        <div class="comment">
            <div>
                <span class="author">${comment.author?.username || 'Unknown'}</span>
                <span class="date">${new Date(comment.createdAt).toLocaleDateString()}</span>
                ${currentUser && comment.author?._id === currentUser.id ? `
                    <button class="delete-comment" onclick="deleteComment('${comment._id}')">Delete</button>
                ` : ''}
            </div>
            <div class="content">${comment.content}</div>
        </div>
    `).join('');
}

async function addComment() {
    if (!token) {
        alert('Please login first');
        return;
    }
    
    const content = document.getElementById('comment-content').value;
    
    if (!content) {
        alert('Please write a comment');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content, postId: currentPostId })
        });
        
        if (response.ok) {
            document.getElementById('comment-content').value = '';
            loadComments(currentPostId);
        } else {
            alert('Failed to add comment');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function deleteComment(commentId) {
    if (!confirm('Delete this comment?')) return;
    
    try {
        const response = await fetch(`${API_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            loadComments(currentPostId);
        } else {
            alert('Failed to delete comment');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}