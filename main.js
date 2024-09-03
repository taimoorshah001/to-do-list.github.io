// scripts.js
$(document).ready(function() {
    $('#add-task').click(function() {
        let taskText = $('#new-task').val().trim();

        if (taskText) {
            let taskItem = $('<li class="adding">').text(taskText);
            let completeButton = $('<button class="complete">Complete</button>');
            let removeButton = $('<button class="remove">Remove</button>');

            taskItem.append(completeButton).append(removeButton);
            $('#task-list').append(taskItem);

            $('#new-task').val('');

            // Remove the task with animation
            removeButton.click(function() {
                taskItem.animate({ opacity: 0 }, 300, function() {
                    taskItem.remove();
                });
            });

            // Mark task as completed
            completeButton.click(function() {
                taskItem.toggleClass('completed');
            });

            // Apply fade-in animation
            taskItem.addClass('adding');
        }
    });

    // Allow pressing Enter to add task
    $('#new-task').keypress(function(e) {
        if (e.which === 13) {
            $('#add-task').click();
        }
    });
});
