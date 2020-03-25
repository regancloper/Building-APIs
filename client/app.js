// set up class for any comment generated
class Comment {
    constructor(author, text, id) {
        this.author = author;
        this.text = text;
        this.id = id;
        this.deleteBtn = $(`<button class="btn-sm btn-danger" id=btn-${this.id}>X</button>`);
        this.editBtn = $(`<button type="button" class="btn-sm btn-primary m-1" id="#editBtn-${this.id}">Edit</button>`);
        this.updateBtn = $(`<button type="button" class="btn btn-primary updateBtn" id="updateBtn">Save changes</button>`);
        this.div = this.generateChirp();
        $('.list-group').append(this.div);
        $(`#button-container-${this.id}`).append(this.deleteBtn, this.editBtn);
        this.addDeleteListener();
        this.addEditListener();
    }

    // generates a chirp based on author, text, and id
    generateChirp() {
        let post = $(
            `<div class="list-group-item list-group-item-action" id=${this.id}>
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${this.author}</h5>
                    <div id="button-container-${this.id}">
                    </div>
                </div>
                <p class="mb-1">${this.text}</p>
            </div>`
        );
        return post;
    };

    // adds a listener for the delete button
    addDeleteListener() {
        this.deleteBtn.click(() => {
            $.ajax({
                type: "DELETE",
                url: `/api/chirps/${this.id}`
            }).then(() => this.div.remove())
            .catch(e => console.log(e));
        });
    }

    // adds a listener for the edit button
    addEditListener() {
        this.editBtn.click(() => {
            $('#updateBtn').remove();
            $('.modal-footer').append(this.updateBtn);
            this.addUpdateListener();
            $('#exampleModalLongTitle').text(this.author);
            $('#modalText').val(this.text);
            $('#exampleModalCenter').modal('toggle');
        });
    }

    // adds a listener for the update button
    addUpdateListener() {
        this.updateBtn.click(() => {
            if (this.text !== $('#modalText').val()) {
                $.ajax({
                    type: "PUT",
                    url: `/api/chirps/${this.id}`,
                    data: JSON.stringify({ user: this.author, text: $('#modalText').val() }),
                    contentType: 'application/json',
                    success: () => {
                        console.log("successful update, id: " + '/api/chirps/' + this.id);
                    }
                });
                displayAllChirps();
            }
            $('#exampleModalCenter').modal('toggle');

        });
    };
}

// displays all chirps in json file
displayAllChirps();

// initializes comments with pre-existing chirps in json file
function displayAllChirps() {
    $('.list-group-item').remove();
    $.ajax({
        url: '/api/chirps',
        type: 'get',
        success: function (data) {
            // calls function to display all pre-existing chirps
            for (var i in data) {
                if (i !== "nextid") {
                    new Comment(data[i].user, data[i].text, i);
                }
            }
        }
    });
}


// responds to user clicking "add comment" button
$("#addButton").click((e) => {
    e.preventDefault();
    let post = {
        user: $('#author').val(),
        text: $('#commentText').val()
    };
    // makes post request using post object defined above
    $.ajax({
        type: "POST",
        url: '/api/chirps',
        data: JSON.stringify(post),
        contentType: 'application/json'
    });
    // gets correct id for newly generated chirp, and creates new chirp with that id
    $.get('/api/chirps', (data) => {
        let id = data.nextid - 1;
        new Comment(post.user, post.text, id);
    });
    // resets input fields to empty
    $('#author').val('');
    $('#commentText').val('');
});

