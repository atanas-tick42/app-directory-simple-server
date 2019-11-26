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
  let allApps = await (await fetch('../apps')).json();
  let roles = await (await fetch('../roles')).json();

  roles.forEach(role => {
    let html = createRoleHTML(role, allApps)
    document.querySelector('.roles').appendChild(html);
  })

  document.addEventListener('click', (e) => {
    handleAppClick(e);
  });

  document.addEventListener('keyup', (e) => {
    handleSearchChange(e);
  })
})


function createRoleHTML(role, allApps) {
  let emptyTemplate = document.querySelector('.roles .d-none');
  let newHtml = emptyTemplate.cloneNode(true);
  newHtml.classList.remove('d-none');
  newHtml.querySelector('.role-name').innerHTML = role.name;
  newHtml.setAttribute('role-id', role.id)

  let appTemplate = newHtml.querySelector('.app').cloneNode(true);
  newHtml.querySelector('.apps.available').innerHTML = '';
  newHtml.querySelector('.apps.assigned').innerHTML = '';
  allApps.forEach(app => {
    let newAppHtml = appTemplate.cloneNode(true);
    newAppHtml.innerHTML = app.displayName;
    newAppHtml.setAttribute('app-id', app.id)
    let roleHasApp = role.apps.find(roleApp => roleApp.id === app.id);
    // console.log(user.roles, role, userHasRole);
    if (roleHasApp) {
      // newAppHtml.classList.add('bg-primary');
      newHtml.querySelector('.apps.assigned').appendChild(newAppHtml)
    } else {
      newHtml.querySelector('.apps.available').appendChild(newAppHtml)
    }


  });

  return newHtml;
}

async function handleAppClick(e) {
  if (e.target.matches('.app, .app *')) {
    let roleElement = e.path.find(e => e.getAttribute('role-id'));
    let appElement = e.path.find(e => e.getAttribute('app-id'));
    let roleId = +roleElement.getAttribute('role-id');
    let appId = +appElement.getAttribute('app-id');
    let available = appElement.parentNode.classList.contains('available')
    // console.log(appElement, appElement.parentNode, appElement.parentNode.classList.contains('assigned'));
    // let request;

    if (available) {
      request = addAppForRole(appId, roleId)
    } else {
      request = removeAppForRole(appId, roleId)
    }

    let result = await request;
    if (result.ok) {
      let appElementClone = appElement.cloneNode(true);
      appElement.parentNode.removeChild(appElement);
      appElementClone.classList.add('bg-primary')
      setTimeout(() => {
        appElementClone.classList.remove('bg-primary')
      }, 1000);
      let list = roleElement.querySelector(`.apps.${available ? 'assigned' : 'available'}`);
      list.scrollTo(0,0)
      list.prepend(appElementClone);
    }
  }
}

function handleSearchChange(e) {
  if (e.target.matches('.search')) {
    let list = e.target.parentNode.parentNode.querySelector('.apps');
    list.querySelectorAll('.app').forEach(app => {
      let match = app.innerHTML.toLowerCase().includes(e.target.value.toLowerCase());
      app.style.display = match ? 'block' : 'none';
    })
  }
}

function addAppForRole(appId, roleId) {
  return fetch('../add-app-for-role', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      appId, roleId
    })
  })
}

function removeAppForRole(appId, roleId) {
  return fetch('../remove-app-for-role', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      appId, roleId
    })
  })
}