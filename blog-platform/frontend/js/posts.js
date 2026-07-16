async function loadPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        document.getElementById('posts').innerHTML = '<p>Error loading posts</p>';
    }
}

function displayPosts(posts) {
    const container = document.getElementById('posts');
    
    if (!posts || posts.length === 0) {
        container.innerHTML = '<p>No posts yet. Be the first to write!</p>';
        return;
    }
    
    container.innerHTML = posts.map(post => `
        <div class="post-card" onclick="viewPost('${post._id}')">
            <h3>${post.title}</h3>
            <div class="meta">By ${post.author?.username || 'Unknown'} • ${new Date(post.createdAt).toLocaleDateString()}</div>
            <div class="content-preview">${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}</div>
            ${currentUser && post.author?._id === currentUser.id ? `
                <div class="post-actions">
                    <button class="edit-btn" onclick="event.stopPropagation(); showEditPost('${post._id}')">Edit</button>
                    <button class="delete-btn" onclick="event.stopPropagation(); deletePost('${post._id}')">Delete</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

async function viewPost(postId) {
    try {
        const response = await fetch(`${API_URL}/posts/${postId}`);
        const post = await response.json();
        
        document.getElementById('posts-list').style.display = 'none';
        document.getElementById('post-view').style.display = 'block';
        
        document.getElementById('single-post').innerHTML = `
            <h2>${post.title}</h2>
            <div class="meta">By ${post.author?.username || 'Unknown'} • ${new Date(post.createdAt).toLocaleDateString()}</div>
            <div class="content">${post.content}</div>
            ${currentUser && post.author?._id === currentUser.id ? `
                <div class="post-actions">
                    <button class="edit-btn" onclick="showEditPost('${post._id}')">Edit</button>
                    <button class="delete-btn" onclick="deletePost('${post._id}')">Delete</button>
                </div>
            ` : ''}
        `;
        
        loadComments(postId);
    } catch (error) {
        alert('Error loading post');
    }
}

function showCreatePost() {
    document.getElementById('posts-list').style.display = 'none';
    document.getElementById('post-view').style.display = 'none';
    document.getElementById('create-post').style.display = 'block';
    document.getElementById('edit-post').style.display = 'none';
}

function cancelCreatePost() {
    document.getElementById('create-post').style.display = 'none';
    document.getElementById('posts-list').style.display = 'block';
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
}

async function createPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    
    if (!title || !content) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        });
        
        if (response.ok) {
            cancelCreatePost();
            loadPosts();
        } else {
            alert('Failed to create post');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function showEditPost(postId) {
    document.getElementById('posts-list').style.display = 'none';
    document.getElementById('post-view').style.display = 'none';
    document.getElementById('create-post').style.display = 'none';
    document.getElementById('edit-post').style.display = 'block';
    
    // Load post data
    fetch(`${API_URL}/posts/${postId}`)
        .then(res => res.json())
        .then(post => {
            document.getElementById('edit-post-title').value = post.title;
            document.getElementById('edit-post-content').value = post.content;
            document.getElementById('edit-post').dataset.postId = postId;
        });
}

function cancelEditPost() {
    document.getElementById('edit-post').style.display = 'none';
    document.getElementById('posts-list').style.display = 'block';
    document.getElementById('edit-post-title').value = '';
    document.getElementById('edit-post-content').value = '';
}

async function updatePost() {
    const postId = document.getElementById('edit-post').dataset.postId;
    const title = document.getElementById('edit-post-title').value;
    const content = document.getElementById('edit-post-content').value;
    
    try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        });
        
        if (response.ok) {
            cancelEditPost();
            loadPosts();
        } else {
            alert('Failed to update post');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            loadPosts();
            document.getElementById('post-view').style.display = 'none';
        } else {
            alert('Failed to delete post');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}