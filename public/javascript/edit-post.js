async function editFormHandler(event) {
    event.preventDefault();

    let title = document.querySelector('input[name="post-title"]').value.trim();
    let post_content = document.querySelector('input[name="post-content"]').value.trim();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];

    if (title && post_content) {
        const response = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title,
                post_content
            }),
            headers: { 'Content-Type': 'application/json'}
        });
    

        if (response.ok) {
            document.location.replace('/dashboard/');
        } else {
            alert(response.statusText);
        }
    };
};

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);