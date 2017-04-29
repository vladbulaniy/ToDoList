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
            id: '',
            title: '',
            checked: false
        },

        validate : function(attrs) {
            if ( !$.trim(attrs.title) ){
                return 'Имя задачи должно быть валидным!';
            }
        },
        getCustomUrl: function (method) {
            switch (method) {
                case 'read':
                    return 'task.json';
                    break;
                case 'create':
                    return 'sendForWrite';
                    break;
                case 'update':
                    return 'sendForChangingCheck';
                    break;
                case 'delete':
                    console.log('delete was worked');
                    return 'sendForRemove';
                    break;
            }
        },
        // Now lets override the sync function to use our custom URLs
        sync: function (method, model, options) {
            options || (options = {});
            options.url = this.getCustomUrl(method.toLowerCase());

            // Lets notify backbone to use our URLs and do follow default course
            return Backbone.sync.apply(this, arguments);
        }
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
            console.log('this model before ', this.model);
            this.model.destroy({success: function(model, response) {
                console.log('this.model ', this.model);
            }},
                {error: function (data) {
                    console.log('error!!! ', data);
                }}
                );
            // this.model.save();
            console.log(tasksCollections);
        },
        remove: function () {
            this.$el.remove();
        }
    }); // App.Views.Task

    App.Collections.Task = Backbone.Collection.extend({
        model: App.Models.Task,
        url: 'task.json'   //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
        model: App.Models.Task,
        el: '#addButton',

        events: {
            'click' : 'addNewTask'
        },

        addNewTask: function () {
            var newTaskTitle = $('#inputForTask').val();
            console.log('collection ',this.collection);
            var newTask = new App.Models.Task({
                title: newTaskTitle,
                checked: false
            });
            this.collection.add(newTask);

            console.log('worked',newTask  );

            newTask.save(newTask.toJSON(), {error: function(data){
                console.log('error', data)
            }, success: function () {
                    console.log('success')
                }
            }
            );
            // newTask.url.set('temp');
            console.log('worked2 ',newTask.url )  ;
        },

        initialize: function () {
            console.log('snhdS',this.el);
        }
    })



    // var addTask = new App.Views.addTask();

    var tasksCollections;
    var toDoList = new App.Collections.Task;
    // var addTask = new App.Views.addTask({collection: tasksCollections} );


    toDoList.fetch()
        .then(function (data) {
            console.log('request succeeded with JSON response', data);
            tasksCollections = new App.Collections.Task(data);
            tasksCollections.url = 'task.json';
            console.log('tasksCollections ', tasksCollections.url);
            var tasksView = new App.Views.Tasks({collection: tasksCollections});
            var addTask = new App.Views.addTask({collection: tasksCollections});
            $('#todo-list').html(tasksView.render().el);
        })
        .catch(function (error) {
            console.log('request failed', error)
        });

})