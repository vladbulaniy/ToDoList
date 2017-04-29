'use strict';

var Task = Backbone.Model.extend({
    defaults: {
        taskText: 'no text',
        checked: false
    }
})

var task = new Task();

var TasKView = Backbone.View.extend({
    el: $('#flex-conteiner'),


    events:{
        "click #addButton": "createOneTask"
    },

    createOneTask: function (e) {
        console.log('e ',e);
    },

    initialize : function () {

    }
})

var taskView = new TasKView(task);