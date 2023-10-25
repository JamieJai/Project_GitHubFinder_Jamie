function fetchUser() {
  var username = document.getElementById('username').value;

  if (username === '') {
    alert('Please enter a username.');
    return;
  }

  saveToHistory(username);
  localStorage.setItem('githubUsername', username);

  fetch(`https://api.github.com/users/${username}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('User not found');
      }
      return response.json();
    })
    .then(data => {
      displayProfile(data);
      fetchRepos(username);
    })
    .catch(error => {
      document.getElementById('profileDisplay').innerHTML = `<p>${error.message}</p>`;
    });
}

function saveToHistory(username) {
  let usernames = JSON.parse(localStorage.getItem('usernameHistory')) || [];

  if (!usernames.includes(username)) {
      usernames.push(username);

      if (usernames.length > 5) {
          usernames.shift();
      }

      localStorage.setItem('usernameHistory', JSON.stringify(usernames));
  }
}

function loadHistory() {
  const usernames = JSON.parse(localStorage.getItem('usernameHistory')) || [];
  const dataList = document.getElementById('history');
  dataList.innerHTML = '';

  usernames.forEach((username) => {
      const option = document.createElement('option');
      option.value = username;
      dataList.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const savedUsername = localStorage.getItem('githubUsername');
  
  if (savedUsername) {
    document.getElementById('username').value = savedUsername;
    fetchUser();
  }
  loadHistory();
  const fetchButton = document.querySelector('.fetchButton');
  const usernameInput = document.getElementById('username');

  const headerTitle = document.getElementById('header-title');
    headerTitle.addEventListener('click', () => {
        localStorage.removeItem('githubUsername');
        window.location.reload();
    });

  fetchButton.addEventListener('click', () => {
    const username = usernameInput.value;
    if (username) {
      localStorage.setItem('githubUsername', username);
      fetchUser();
    }
  });

  usernameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const username = usernameInput.value;
      if (username) {
        localStorage.setItem('githubUsername', username);
        fetchUser();
      }
    }
  });
});


function displayProfile(user) {
  document.getElementById('profileDisplay').style.display = 'flex';

  var html = `
          <div class="profile-left">
            <img src="${user.avatar_url}" alt="Profile Picture">
            <a href="${user.html_url}" target="_blank">
                <button class="view-profile">View Profile</button>
            </a>
          </div>
          <div class="profile-right">
          <div class="buttons">
              <button class="publicrepos">Public Repos: ${user.public_repos}</button>
              <button class="publicgists">Public Gists: ${user.public_gists}</button>
              <button class="followers">Followers: ${user.followers}</button>
              <button class="following">Following: ${user.following}</button>
          </div>
          <div class="profile-details">
              <p>Company: ${user.company || 'N/A'}</p>
              <p>Website/Blog: ${user.blog || 'N/A'}</p>
              <p>Location: ${user.location || 'N/A'}</p>
              <p>Member Since: ${new Date(user.created_at).toLocaleDateString()}</p>
          </div>
      </div>
  `;

  document.getElementById('profileDisplay').innerHTML = html;
}

function fetchRepos(username) {
  fetch(`https://api.github.com/users/${username}/repos`)
      .then(response => response.json())
      .then(data => {
          displayRepos(data);
          
          document.querySelector('.latest-repos').style.display = 'block';
          document.querySelector('.profile-box').style.display = 'block';
      })
      .catch(error => {
          console.error('Error fetching repos:', error);
      });
}

function displayRepos(repos) {
  const reposList = document.getElementById('repos-list');
  
  reposList.innerHTML = '';

  repos.slice(0, 5).forEach(repo => {
      const repoItem = document.createElement('div');
      repoItem.classList.add('repo-item');
      repoItem.innerHTML = `
          <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
          <span>Stars: ${repo.stargazers_count}</span>
          <span>Watchers: ${repo.watchers_count}</span>
          <span>Forks: ${repo.forks}</span>
      `;
      reposList.appendChild(repoItem);
  });
}
