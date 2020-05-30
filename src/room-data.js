const EventEmitter = require("events").EventEmitter

class QuizRoomData extends EventEmitter {
    constructor() {
        super();
        this.openRooms = {};
    }

    addQuizToRoom(userData, room) {
        if(userData.host && userData.quiz) {
            this.openRooms[room] = userData.quiz
            this.emit('quizRoomState', this.openRooms);
        }
    }

    getOpenRooms() {
        return this.openRooms;
    }

    removeRoom(room) {
        delete this.openRooms[room];
        this.emit('quizRoomState', this.openRooms);
    }
}

module.exports = QuizRoomData;