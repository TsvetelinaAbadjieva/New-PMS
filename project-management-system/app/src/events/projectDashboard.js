 var flagValidation = true;

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

document.getElementById('myProjectsLink').addEventListener('click', function(){

  document.getElementById('projectDashboard').style.display = '';
  document.getElementById('newCardProject').style.display = 'none';

  removeUnusableLi();

  var headerConfig = {
    "Content-type" : "application/json",
    "Authorization": "Bearer "+localStorage.getItem('token')
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
document.getElementById('projectDescriptionInput').addEventListener('change',fieldValidate);
document.getElementById('projectDateInput').addEventListener('change',fieldValidate);

function fieldValidate() {

var input = this.value;
var alert = document.getElementById('alertInsertProject');
var correctDate = validateDueDate(input);

  if (this.id == 'projectDateInput' && (!input || correctDate == false)){
    alertMessage(alert,'Please enter a valid date');
    flagValidation = false;
    return;
  }else {
    flagValidation = true;
  }

  if(validateInputField(input)) {
      alert.style.display = 'none';
      flagValidation = true;

  }
  else {
      alertMessage(alert,'Please enter a valid information');
      flagValidation = false;
  }
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
            cloned.querySelector('#assignMe').addEventListener('click', assignMe);
            cloned.querySelector('p').innerText = data[i].description;
            cloned.setAttribute('data_project_id', data[i].id);
            cloned.querySelector('#startDate').innerText = data[i].pr_start_date.split('T')[0];
            cloned.querySelector('#endDate').innerText = data[i].pr_due_date.split('T')[0];
            cloned.querySelector('#alertAssign').id = 'alertAssign_'+data[i].id;
            cloned.querySelector('#alertAssign').style.display= 'none';
            cloned.style.display = 'block';
            cloned.id = "project_"+data[i].id;
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
console.log(projectTitle);
console.log(projectDescription);
  if(flagValidation) {
    projectTitle = escapeString(projectTitle);
    projectDescription = escapeString(projectDescription);

    var reqObj = {
      title: projectTitle,
      description: projectDescription,
      startDate: getToday(),
      dueDate : dueDate
    };
console.log(reqObj);
    url = BASE_URL+'/project';
    var headerConfig = {
        "Content-type" : "application/json",
        "Authorization": "Bearer "+localStorage.getItem('token')
      };

    callAjax('POST', url, headerConfig, reqObj, function(data) {
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

document.getElementById('closeProject').addEventListener('click', function(){
  document.getElementById('newCardProject').style.display = 'none';
});
function assignMe() {

  //e.preventDefault();
  var _this = document.activeElement;
  console.log(_this);

  var projectLi = document.getElementById('project_'+_this.getAttribute('data_project_id'));
  var projectId = _this.getAttribute('data_project_id');
  var alert = document.getElementById('alertAssign_'+_this.getAttribute('data_project_id'));
  console.log(alert);
  var params = JSON.stringify({projectId: projectId});
  var reqObj = {projectId: projectId};
  var data = {};
  if (isLoggedIn) {
    var headerConfig = {
      "Content-type" : "application/json",
      "Authorization": "Bearer "+localStorage.getItem('token')
    }
    callAjax('POST', BASE_URL+'/project/assign', headerConfig, reqObj, function(data){
      alertMessage(alert, data.message);
    })
      // var xhttp = new XMLHttpRequest();
      // xhttp.open('POST', BASE_URL + '/project/assign', true);
      // xhttp.setRequestHeader('Content-type', 'application/json');
      // xhttp.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
      // xhttp.onreadystatechange = function () {
      //     if (xhttp.readyState == 4 & xhttp.status == 200) {
      //         console.log(xhttp.responseText);
      //         data = JSON.parse(xhttp.responseText);
      //         alertMessage(alert, data.message);
      //         // alert.innerText = data.message;
      //         // alert.style.display = 'block';
      //         // setTimeout(function(){
      //         //   alert.style.display = 'none';
      //         // }, 3000);
      //     }
      // }
      // xhttp.send(params);
    }
  };
  function removeUnusableLi() {

    var oldProjects = document.getElementsByClassName('project');
    for (var k = 1; k< oldProjects.length; k++) {

      var item = oldProjects[k];
      console.log(k);
      item.style.display = 'none';
      //item.parentNode.removeChild(item);
    }
  };
