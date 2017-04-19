window.addEventListener('load', function () {
var ELEMENTS ={
    addButton: document.getElementById('addButton'),
    inputForTask: document.getElementById('inputForTask'),
    tasksList: document.getElementById('tasksList'),
    closeView: document.getElementsByClassName('closeView'),
    show: document.getElementById('show')
}

function render(obj) {
    var newLi = document.createElement('li'),
        newSpan = document.createElement('span'),
        newCheck = document.createElement('input');

    newLi.setAttribute('data-id',obj.id)

    newCheck.setAttribute('type','checkbox');
    newCheck.className = 'checkingView';
    if (obj.checked){
        newLi.className = 'lineThrought';
    }
    newCheck.checked = obj.checked;
    newLi.appendChild(newCheck);

    newLi.appendChild( document.createTextNode(obj.taskText) );

    newSpan.innerHTML = '&times;';
    newSpan.className = 'closeView';
    newLi.appendChild(newSpan);

    ELEMENTS.tasksList.appendChild(newLi);
}

function displayFromFile(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'task.json', true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        var STATUS_OK = 200;
        if (this.readyState === this.DONE){
            if(this.status === STATUS_OK){
                console.log(this.response);
                this.response.forEach(function (elem) {
                    render(elem);
                })
            } else{
                console.log('ERROR!!!!!!!');
            }
        }
    }
    xhr.send();
}

function sendToServer(obj, state) {
    var xhr = new XMLHttpRequest();
    if (obj instanceof Object){
        xhr.open('POST', '/sendForWrite', true);
        xhr.responseType = 'json';

        xhr.send( JSON.stringify(obj) );

        xhr.onreadystatechange = function () {
            var STATUS_OK = 200;
            if (this.readyState === this.DONE) {
                if (this.status === STATUS_OK) {
                    render(this.response);
                } else {
                    console.log('ERROR!!!!!!!');
                }
            }
        }
    } // end if

    if (typeof obj === 'number'){
        if (state !== 'undefined'){
            xhr.open('POST', '/sendForChangingCheck', true);
            xhr.responseType = 'json';
            xhr.send( JSON.stringify(obj) );
            xhr.onreadystatechange = function () {
                var STATUS_OK = 200;
                if (this.readyState === this.DONE) {
                    if (this.status === STATUS_OK) {
                        console.log('the task was checked');
                    } else {
                        console.log('ERROR!!!!!!!');
                    }
                }
            }
        }else{
            xhr.open('POST', '/sendForRemove', true);
            xhr.responseType = 'json';
            xhr.send( JSON.stringify(obj) );
            xhr.onreadystatechange = function () {
                var STATUS_OK = 200;
                if (this.readyState === this.DONE) {
                    if (this.status === STATUS_OK) {
                        console.log('the task was removed');
                    } else {
                        console.log('ERROR!!!!!!!');
                    }
                }
            }
        }
    }// end if

}; //sendToServer()

function addTask() {
    var newTask = {
        taskText: ELEMENTS.inputForTask.value,
        checked: false
    }
    sendToServer(newTask);
    inputForTask.value = '';
}

//assign events
 ELEMENTS.addButton.addEventListener('click', addTask);
ELEMENTS.show.addEventListener('click', displayFromFile);

inputForTask.addEventListener('keydown', function (e) {
    if (e.key == 'Enter'){
        addTask();
    }
});

ELEMENTS.tasksList.onclick = function (event) {
    if( event.target.classList.contains('closeView') ){
        sendToServer( +event.target.parentNode.getAttribute('data-id') )
        event.target.parentNode.parentNode.removeChild(event.target.parentElement);
    }

    if( event.target.classList.contains('checkingView') ){
        event.target.parentNode.classList.toggle('lineThrought');
        sendToServer( +event.target.parentNode.getAttribute('data-id'), event.target.checked)
    }
}

});// end