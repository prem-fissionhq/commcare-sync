import Cookies from 'js-cookie';

const addLogStubToTable = function () {
  // ht: https://stackoverflow.com/a/18333693/8207
  const exportRunTable = document.getElementById('export-run-table').getElementsByTagName('tbody')[0];
  const recordRow = exportRunTable.insertRow(0);

  // Populate the cell with initial data
  recordRow.insertCell(0).appendChild(document.createTextNode('Now'));
  recordRow.insertCell(1).appendChild(document.createTextNode('TBD'));
  recordRow.insertCell(2).appendChild(document.createTextNode('TBD'));
  recordRow.insertCell(3).appendChild(document.createTextNode('started'));
  recordRow.insertCell(4).appendChild(document.createTextNode('waiting for log...'));
  recordRow.insertCell(5).appendChild(document.createTextNode(''));
  return recordRow;
};


const setupLogTriggers = function () {
  let releaseNotesTriggers = document.getElementsByClassName('log-trigger');
  for (let i = 0; i < releaseNotesTriggers.length; i++) {
    releaseNotesTriggers[i].addEventListener("click", function (event) {
      let trigger = event.target.closest('a');
      let selectorId = 'export-log-' + trigger.dataset.exportRunId;
      let notes = document.getElementById(selectorId);
      let icon = trigger.querySelector(".fa");
      if (trigger.dataset.openStatus === 'closed') {
        notes.style.display = '';
        trigger.dataset.openStatus = 'open';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
      } else {
        notes.style.display = 'none';
        trigger.dataset.openStatus = 'closed';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
      }
    });
  }

};


const initializeExportRunButton = function (apiUrl, progressUrl) {
  const runExportButton = document.getElementById('run-export-button');
  const forceSyncCheckbox = document.getElementById('force-sync-checkbox');
  runExportButton.addEventListener('click', function (e) {
    e.preventDefault();
    const forceSync = forceSyncCheckbox.checked;
    runExportButton.classList.add('is-loading', 'is-disabled');
    const progressWrapper = document.getElementById('export-status-progress');
    progressWrapper.style.display = 'inherit';
    const progressBar = document.getElementById('progress-bar');
    const progressMessage = document.getElementById('progress-bar-message');
    const formData = {
      'forceSync': forceSync,
    };
    fetch(apiUrl, {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      body: JSON.stringify(formData),
    }).then(
      function (response) {
        return response.text();
      }).then(function (text) {

      const taskUrl = progressUrl.replace('task-id-stub', text);
      const recordRow = Exports.addLogStubToTable();
      if (typeof CeleryProgressBar === 'undefined') {
        const errorMessage = 'CeleryProgressBar class missing. Did you forget to import celery_progress.js?';
        console.error(errorMessage);
        progressBar.classList.add('is-danger');
        progressBar.setAttribute('value', '100');
        progressMessage.innerText = errorMessage;
        return;
      } else {  // Initialize progressbar
          progressBar.removeAttribute('value');
          progressBar.classList.remove('is-danger');
          progressBar.classList.remove('is-success');
      }
      CeleryProgressBar.initProgressBar(taskUrl, {
        onProgress: function () {
          progressMessage.innerHTML = 'Running Export...';
        },
        onSuccess: function () {
          progressBar.setAttribute('value', '100');
          progressMessage.innerHTML = 'Complete!';
        },
        onResult: function (resultElement, result) {
          recordRow.cells[2].innerText = result.duration;
          recordRow.cells[3].innerText = result.status;
          if (result.status === "completed") {
            progressBar.classList.add('is-success');
          } else if (result.status === "failed") {
            progressBar.classList.add('is-danger');
            progressBar.setAttribute('value', '100');
            progressMessage.innerText = 'Failed!';
          }
          recordRow.cells[4].innerHTML = '<a onclick=location.reload()>Refresh for log</a>';
          runExportButton.classList.remove('is-loading', 'is-disabled');
        }
      });
    })
      .catch(function (error) {
        console.error('Request failed', error);
      });
  }, false);
};

export const Exports = {
  setupLogTriggers: setupLogTriggers,
  addLogStubToTable: addLogStubToTable,
  initializeExportRunButton: initializeExportRunButton,
};
