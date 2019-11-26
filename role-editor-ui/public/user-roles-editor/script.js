if (!("path" in Event.prototype)) {
  Object.defineProperty(Event.prototype, "path", {
    get: function() {
      var path = [];
      var currentElem = this.target;
      while (currentElem) {
        path.push(currentElem);
        currentElem = currentElem.parentElement;
      }
      if (path.indexOf(window) === -1 && path.indexOf(document) === -1)
        path.push(document);
      if (path.indexOf(window) === -1)
        path.push(window);
      return path;
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  let users = await (await fetch('../users')).json();
  let allRoles = await (await fetch('../roles')).json();

  users.forEach(user => {
    let html = createUserHTML(user, allRoles)
    document.querySelector('.users').appendChild(html);
  })

  document.addEventListener('click', (e) => {
    handleRoleClick(e);
  })
})


function createUserHTML(user, allRoles) {
  let emptyTemplate = document.querySelector('.users .d-none');
  let newHtml = emptyTemplate.cloneNode(true);
  newHtml.classList.remove('d-none');
  newHtml.querySelector('.username').innerHTML = user.name;
  newHtml.setAttribute('user-id', user.id)

  let roleTemplate = newHtml.querySelector('.role').cloneNode(true);
  newHtml.querySelector('.roles').innerHTML = '';
  allRoles.forEach(role => {
    let newRoleHtml = roleTemplate.cloneNode(true);
    newRoleHtml.innerHTML = role.name;
    newRoleHtml.setAttribute('role-id', role.id)
    let userHasRole = user.roles.includes(role.name);
    // console.log(user.roles, role, userHasRole);
    if (userHasRole) {
      newRoleHtml.classList.add('bg-primary');
    }

    newHtml.querySelector('.roles').appendChild(newRoleHtml)
  });

  return newHtml;
}

async function handleRoleClick(e) {
  if (e.target.matches('.role, .role *')) {
    let roleElement = e.path.find(e => e.getAttribute('role-id'));
    let userElement = e.path.find(e => e.getAttribute('user-id'));
    let roleId = +roleElement.getAttribute('role-id');
    let userId = +userElement.getAttribute('user-id');
    let active = roleElement.classList.contains('bg-primary')

    let request;

    if (active) {
      request = removeRole(userId, roleId)
    } else {
      request = addRole(userId, roleId)
    }

    let result = await request;
    if (result.ok) {
      roleElement.classList.toggle('bg-primary');
    }
  }
}

function addRole(userId, roleId) {
  return fetch('../add-role-for-user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId, roleId
    })
  })
}

function removeRole(userId, roleId) {
  return fetch('../remove-role-for-user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId, roleId
    })
  })
}