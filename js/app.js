'use strict';
$(function () {
    window.App = {
        Models: {},
        Collections:{},
        Views:{}
    }

    // template
    window.template = function (id) {
        return _.template( $('#' + id).html() );
    };

    App.Models.Task = Backbone.Model.extend({
        default: {
            title: '',
            id: '',
            checked: false
        },

        validate : function(attrs) {
            if ( !$.trim(attrs.title) ){
                return 'Имя задачи должно быть валидным!';
            }
        },
        url: "temp"
    }); //App.Models.Task

    App.Views.Task = Backbone.View.extend({
        initialize: function () {
            this.model.on('destroy', this.remove, this);
        },

        tagName: 'li',
        attributes: 'data-id',
        template: template('taskTemplate'),

        render: function () {
            this.$el.attr('data-id',4);
            var template = this.template( this.model.toJSON() );
            this.$el.html( template );
            return this;
        },
        events:{
            'click .checkingView': 'changeDone',
            'click .closeView': 'deleteTask'
        },
        changeDone: function(){
            this.$el.toggleClass('lineThrought');
            console.log('test was worked', this.$el.html() );
        },
        deleteTask: function () {
            this.model.destroy();
            console.log(tasksCollections);
        },
        remove: function () {
            this.$el.remove();
        }
    }); // App.Views.Task

    App.Collections.Task = Backbone.Collection.extend({
        model: App.Models.Task,
        url: '/task'
    });  //App.Collections.Task

    App.Views.Tasks = Backbone.View.extend({
        tagName: 'ul',

        initialize: function(){
           this.collection.on('add', this.addOne, this);
        },

        render: function () {
            this.collection.each(this.addOne, this);
            return this;
        },
        addOne:function (task) {
            // create new doughter view
            var taskView = new App.Views.Task({model:task});
            //add it to parent element
            this.$el.append(taskView.render().el);
        }
    }); //App.Views.Tasks

    App.Views.addTask = Backbone.View.extend({
        el: '#addButton',

        events: {
            'click' : 'addNewTask'
        },

        addNewTask: function () {
            var newTaskTitle = $('#inputForTask').val();

            var newTask = new App.Models.Task({title: newTaskTitle});
            this.collection.add(newTask);
            console.log('worked',newTask.get('title')  );
            console.log(this.collection);
        },

        initialize: function () {
            console.log('snhdS',this.el)
        }
    })

    /*
    var tasksCollections = new App.Collections.Task(

        [
       {
            title: 'Make table',
            id:3
        },
        {
            title: 'to call friend',
            id:4
        },
        {
            title: 'fix bags',
            id:5
        },

        ]

    );
*/


    var tasksCollections = new App.Collections.Task().fetch();
    console.log('tasksCollections', tasksCollections);
    /*
    var task = new App.Models.Task({
        title: 'Make hw',
        id:3
    });
*/

var tasksView = new App.Views.Tasks({collection: tasksCollections});
var addTask = new App.Views.addTask({collection: tasksCollections} );
    // console.log(tasksView.render().el);

$('#todo-list').html(tasksView.render().el);


})