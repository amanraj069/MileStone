document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('profileImageUpload');
  const imagePreview = document.getElementById('imagePreview');
  const uploadBtn = document.getElementById('uploadImageBtn');

  // Handle file selection and preview
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB.');
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);

      // Show upload button
      uploadBtn.style.display = 'inline-block';
    }
  });

  // Handle image upload
  uploadBtn.addEventListener('click', async function() {
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('picture', file);

    uploadBtn.textContent = 'Uploading...';
    uploadBtn.disabled = true;

    try {
      const response = await fetch('/adminD/profile/upload-image', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        alert('Profile image updated successfully!');
        uploadBtn.style.display = 'none';
        fileInput.value = '';
      } else {
        alert(result.message || 'Failed to upload image.');
        // Reset preview to original image if upload failed
        imagePreview.src = imagePreview.getAttribute('data-original') || imagePreview.src;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      uploadBtn.textContent = 'Upload';
      uploadBtn.disabled = false;
    }
  });

  // Handle form submission for other profile data
  document.getElementById('profileEditForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      location: formData.get('location'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      linkedin: formData.get('linkedin'),
      twitter: formData.get('twitter'),
      facebook: formData.get('facebook'),
      instagram: formData.get('instagram'),
      aboutMe: formData.get('aboutMe'),
      subscription: formData.get('subscription'),
      role: formData.get('role'),
    };

    try {
      const response = await fetch('/adminD/profile/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Profile updated successfully!');
        window.location.href = '/adminD/profile';
      } else {
        alert(result.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the profile.');
    }
  });
});