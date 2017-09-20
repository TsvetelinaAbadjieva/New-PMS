var flagValidation = true;
var taskSectionId = 0;
var taskProjectId = 0;

document.getElementById('projectDashboardLink').addEventListener('click', function () {

  //  var oldProjects = [];
  document.getElementById('projectDashboard').style.display = '';
  document.getElementById('newCardProject').style.display = 'none';
  removeUnusableLi();
  // oldProjects = document.getElementsByClassName('project');
  // for (var k = 1; k< oldProjects.length; k++) {
  //   var item = oldProjects[k];
  //   console.log(k);
  //   item.style.display = 'none';
  //   //item.parentNode.removeChild(item);
  // }
  var data = {};
  if (isLoggedIn) {
    var userEmail = localStorage.getItem('user');
    var info = document.getElementById('userLoggedIn');
    info.innerText = userEmail + ", Welcome to Your dashboard!";
    info.style.fontSize = "larger";
    info.style.display = 'block';

    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', BASE_URL + '/projects', true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4 & xhttp.status == 200) {
        console.log(xhttp.responseText);
        data = JSON.parse(xhttp.responseText);
        drawProjectBoardCollection(data.data);
      }
    }
    xhttp.send();

  }
  else {
    info.style.display = 'none';
  }
});

document.getElementById('myProjectsLink').addEventListener('click', function () {

  document.getElementById('projectDashboard').style.display = '';
  document.getElementById('newCardProject').style.display = 'none';

  removeUnusableLi();

  var headerConfig = {
    "Content-type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem('token')
  }
  var data = {};
  if (isLoggedIn) {
    var userEmail = localStorage.getItem('user');
    var info = document.getElementById('userLoggedIn');
    info.innerText = userEmail + ", Welcome to Your dashboard!";
    info.style.fontSize = "larger";
    info.style.display = 'block';

    // callAjax('GET', BASE_URL + '/user/projects', headerConfig, null, function(data){
    //   drawProjectBoardCollection(data.data);
    // });
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', BASE_URL + '/user/projects', true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4 & xhttp.status == 200) {
        console.log(xhttp.responseText);
        data = JSON.parse(xhttp.responseText);
        drawProjectBoardCollection(data.data);
      }
    }
    xhttp.send();
  }
  else {
    info.style.display = 'none';
  }
});

document.getElementById('newProject').addEventListener('click', function () {
  document.getElementById('newCardProject').style.display = '';
  document.getElementById('alertInsertProject').style.display = 'none';
});

document.getElementById('projectTitleInput').addEventListener('change', fieldValidate);
document.getElementById('projectDescriptionInput').addEventListener('change', fieldValidate);
document.getElementById('projectDateInput').addEventListener('change', fieldValidate);

function fieldValidate() {

  console.log(this.id);
  console.log('Index of task');
  console.log(this.id.indexOf('task'));
  var input = this.value;
  var alert;
  if (this.id.indexOf('project') !== -1) {
    alert = document.getElementById('alertInsertProject');
  }
  if (this.id.indexOf('task') !== -1) {
    alert = document.getElementById('alertInsertTask');
  }

  console.log(alert);

  var correctDate = validateDueDate(input);

  if ((this.id == 'projectDateInput' || this.id == 'taskDueDateInput') && (!input || correctDate == false)) {

    alertMessage(alert, 'Please enter a valid date');
    flagValidation = false;
    return;
  } else {
    flagValidation = true;
  }

  if (validateInputField(input)) {

    alert.style.display = 'none';
    flagValidation = true;
  }
  else {

    alertMessage(alert, 'Please enter a valid information');
    flagValidation = false;
  }
  console.log(flagValidation);

};

drawProjectBoardCollection = function (data) {

  var oneBoard = document.getElementById('project');
  var container = document.getElementById('projectCollection');
  var fragment = document.createDocumentFragment();
  var projectTitle = document.getElementById('projectTitle');
  var projectDescription = document.getElementById('projectDescription');

  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      var cloned = document.createElement('li');
      cloned = document.getElementById('project').cloneNode(true);
      cloned.querySelector('h4').innerText = data[i].title;
      cloned.querySelector('h4').style.color = 'grey';
      cloned.querySelector('#assignMe').setAttribute('data_project_id', data[i].id);
      cloned.querySelector('#goToProject').setAttribute('data_project_id', data[i].id);
      cloned.querySelector('#goToProject').addEventListener('click', redirectToProject);
      cloned.querySelector('#assignMe').addEventListener('click', assignMe);
      cloned.querySelector('p').innerText = data[i].description;
      cloned.setAttribute('data_project_id', data[i].id);
      cloned.querySelector('#startDate').innerText = data[i].pr_start_date.split('T')[0];
      cloned.querySelector('#endDate').innerText = data[i].pr_due_date.split('T')[0];
      cloned.querySelector('#alertAssign').id = 'alertAssign_' + data[i].id;
      cloned.querySelector('#alertAssign').style.display = 'none';
      cloned.style.display = 'block';
      cloned.id = "project_" + data[i].id;
      console.log(cloned);
      fragment.appendChild(cloned);

    }
    container.appendChild(fragment);
  }
}

document.getElementById('saveProject').addEventListener('click', function () {

  var projectTitle = document.getElementById('projectTitleInput').value;
  var projectDescription = document.getElementById('projectDescriptionInput').value;
  var dueDate = document.getElementById('projectDateInput').value;
  var alert = document.getElementById('alertInsertProject');

  if (flagValidation) {

    projectTitle = escapeString(projectTitle);
    projectDescription = escapeString(projectDescription);

    var reqObj = {
      title: projectTitle,
      description: projectDescription,
      startDate: getToday(),
      dueDate: dueDate
    };
    console.log(reqObj);
    url = BASE_URL + '/project';
    var headerConfig = {
      "Content-type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem('token')
    };

    callAjax('POST', url, headerConfig, reqObj, function (data) {
      var alert = document.getElementById('alertInsertProject');
      alert.classList.remove('alert-danger');
      alert.classList.add('alert-success');
      alertMessage(alert, data.message);
    });
  }
  else {
    alertMessage(alert, 'Please, enter a valid input data');
  }
});

document.getElementById('closeProject').addEventListener('click', function () {
  document.getElementById('newCardProject').style.display = 'none';
});

function assignMe() {

  //e.preventDefault();
  var _this = document.activeElement;
  console.log(_this);

  var projectLi = document.getElementById('project_' + _this.getAttribute('data_project_id'));
  var projectId = _this.getAttribute('data_project_id');
  var alert = document.getElementById('alertAssign_' + _this.getAttribute('data_project_id'));
  console.log(alert);
  var params = JSON.stringify({ projectId: projectId });
  var reqObj = { projectId: projectId };
  var data = {};
  if (isLoggedIn) {
    var headerConfig = {
      "Content-type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem('token')
    }
    callAjax('POST', BASE_URL + '/project/assign', headerConfig, reqObj, function (data) {
      alertMessage(alert, data.message);
    })
  }
};

document.getElementById('newSection').addEventListener('click', function () {

  document.getElementById('addSection').style.display = 'block';
  document.getElementById('newSectionTitle').style.display = 'block';
  this.style.display = 'none';

});

document.getElementById('addSection').addEventListener('click', function () {

  document.getElementById('newSection').style.display = 'block';
  document.getElementById('newSectionTitle').style.display = 'none';
  this.style.display = 'none';
  var input = document.getElementById('newSectionTitle').value;
  var alert = document.getElementById('alertCreateSection');
  var sectionId = 0;

  if (validateInputField(input)) {
    input = escapeString(input);

    var headerConfig = {
      "Content-type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem('token')
    };
    var url = BASE_URL + '/section';

    var reqObj = {
      section: input,
      projectId: this.getAttribute('data_project_id')
    };
    var _document = document;
    var _this = this;

    callAjax('POST', url, headerConfig, reqObj, function (data) {

      alert.classList.remove('alert-danger');
      alert.classList.add('alert-success');
      var newSection = _document.createElement('div');
      newSection = _document.getElementById('sectionDefault').cloneNode(true);
      _document.getElementById('project_board_' + _this.getAttribute('data_project_id')).appendChild(newSection);

      newSection.setAttribute('data_project_id', _this.getAttribute('data_project_id'));
      newSection.id = 'section_id_' + data.data;
      newSection.setAttribute('data_section_id', data.data);

      newSection.querySelector('#section_head').setAttribute('data_section_id', data.data);
      newSection.querySelector('#section_head').id = 'section_head_' + data.data;
      newSection.querySelector('#section_head_' + data.data).innerText = input;

      newSection.querySelector('#newTaskOpen').setAttribute('data_project_id', _this.getAttribute('data_project_id'));
      newSection.querySelector('#newTaskOpen').setAttribute('data_section_id', data.data);
      newSection.querySelector('#newTaskOpen').id = 'newTaskOpen_' + data.data;
      newSection.querySelector('#newTaskOpen_'+data.data).addEventListener('click', saveProjectSectionId);

      newSection.querySelector('#viewTaskOpen').setAttribute('data_project_id', _this.getAttribute('data_project_id'));
      newSection.querySelector('#viewTaskOpen').setAttribute('data_section_id', data.data);
      // newSection.querySelector('#viewTaskOpen_'+data.data).addEventListener('click', saveProjectSectionId);
      // newSection.querySelector('#viewTaskOpen').id = 'viewTaskOpen_' + data.data;

      //newSection.querySelector('#alertInsertTask').id = 'alertInsertTask_' + data.data;

      alertMessage(alert, 'Created section ' + input);
    });
  }
  else {
    alertMessage(alert, 'Please, fill the box ');
  }

});

document.getElementById('newTaskOpen').addEventListener('click', saveProjectSectionId);
document.getElementById('viewTaskOpen').addEventListener('click', saveProjectSectionId);

function removeUnusableLi() {

  var oldProjects = document.getElementsByClassName('project');
  for (var k = 1; k < oldProjects.length; k++) {

    var item = oldProjects[k];
    console.log(k);
    item.style.display = 'none';
    //item.parentNode.removeChild(item);
  }
};

function redirectToProject() {

  var projectId = this.getAttribute('data_project_id');
  console.log(projectId);

  var info = document.getElementById('userLoggedIn').innerText;
  var projectTitle = document.getElementById('project_' + projectId).querySelector('h4').innerText;
  document.querySelector('#project_title_head').innerText = localStorage.getItem('user') + ", Welcome to " + projectTitle;
  console.log(document.getElementById('project_board'));
  document.getElementById('project_board').setAttribute('data_project_id', projectId);
  document.getElementById('project_board').id = 'project_board_' + projectId;
  document.getElementById('addSection').setAttribute('data_project_id', projectId);
  document.getElementById('projectDashboard').style.display = 'none';
  document.getElementById('imgHomePage').style.display = 'none';
  document.getElementById('addSection').style.display = 'none';
  document.getElementById('newSectionTitle').style.display = 'none';
  document.getElementById('alertCreateSection').style.display = 'none';

  document.getElementById('sectionDefault').querySelector('#cardDefault').style.display = 'none';

  // TO DO call ajax for retrieve all sections and tasks
}

function saveProjectSectionId() {

  taskSectionId = this.getAttribute('data_section_id') || 0;
  taskProjectId = this.getAttribute('data_project_id') || 0;
}
