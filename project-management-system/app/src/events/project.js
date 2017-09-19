document.getElementById('saveTask').addEventListener('click', function () {

  var taskTitle = document.getElementById('taskTitleInput').value;
  var taskDescription = document.getElementById('taskDescriptionInput').value;
  var taskDueDate = document.getElementById('taskDueDateInput').value;
  var projectId = taskProjectId;
  var sectionId = taskSectionId || 0;

  var alert = document.getElementById('alertInsertTask');
  var taskTemplate = document.getElementById('section_id_' + sectionId).querySelector('#cardDefault')
  || document.getElementById('sectionDefault').querySelector('#cardDefault');
  var newTask = document.createElement('li');
  newTask = taskTemplate.cloneNode(true);
  var _document = document;
  console.log(taskTemplate)
  console.log(newTask)


  if (flagValidation) {
    taskTitle = escapeString(taskTitle);
    taskDescription = escapeString(taskDescription);

    var reqObj = {
      projectId: projectId,
      sectionId: sectionId,
      task: taskTitle,
      statusId: 1,
      description: taskDescription,
      startDate: getToday(),
      dueDate: taskDueDate
    };

    url = BASE_URL + '/task';
    var headerConfig = {
      "Content-type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem('token')
    };

    callAjax('POST', url, headerConfig, reqObj, function (data) {

      alert.classList.remove('alert-danger');

      if (data.data > 0) {
        console.log(data.data)

        alert.classList.add('alert-success');
        alertMessage(alert, data.message);
        newTask.id = 'taskTitle_' + data.data;
        newTask.querySelector('#taskTitle').id = 'taskTitle_' + data.data;
        newTask.querySelector('#taskTitle_' + data.data).setAttribute('data_task_id', data.data);
        newTask.querySelector('#taskTitle_' + data.data).innerText = taskTitle;
        newTask.querySelector('#taskTitle_' + data.data).style.display = 'block';

        newTask.querySelector('#taskDescription').id = 'taskDescription_' + data.data;
        newTask.querySelector('#taskDescription_' + data.data).setAttribute('data_task_id', data.data);
        newTask.querySelector('#taskDescription_' + data.data).innerText = taskDescription;
        newTask.querySelector('#taskDescription_' + data.data).style.display = 'block';

        newTask.querySelector('#viewTaskOpen').id = 'viewTaskOpen_' + data.data;
        newTask.querySelector('#viewTaskOpen_' + data.data).addEventListener('click', fieldValidate);

        newTask.id = 'cardDefault_' + data.data;
        newTask.setAttribute('data_task_id', data.data);
        newTask.style.display = 'block';

       // var parent = _document.getElementById('section_id_' + sectionId).querySelector('#tasks');
        var sibling = _document.getElementById('section_id_' + sectionId).querySelector('#cardDefault');
        var parent = sibling.parenNode;
        console.log(sibling);
        console.log('-parent-')
        console.log(sibling.parentNode);
        sibling.parentNode.insertBefore(newTask, sibling.nextSibling.nextSibling.nextSibling);
        //  _document.getElementById('section_id_' + sectionId).querySelector('#tasks').appendChild(newTask);
        console.log(_document.getElementById('section_id_' + sectionId).querySelector('#tasks'))
      }

    });
  }
  else {
    alertMessage(alert, 'Please, enter a valid input data');
  }

});


document.getElementById('taskTitleInput').addEventListener('change', fieldValidate);
document.getElementById('taskDescriptionInput').addEventListener('change', fieldValidate);
document.getElementById('taskDueDateInput').addEventListener('change', fieldValidate);
