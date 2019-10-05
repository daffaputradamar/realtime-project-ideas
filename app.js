const feathers = require("@feathersjs/feathers"),
  express = require("@feathersjs/express"),
  socketio = require("@feathersjs/socketio"),
  moment = require("moment");

const CHANNEL_NAME = "stream";

//Idea Service
class IdeaService {
  constructor() {
    this.ideas = [];
  }

  async find() {
    return this.ideas;
  }

  async create(data) {
    const idea = {
      id: this.ideas.length,
      text: data.text,
      tech: data.tech,
      viewer: data.viewer
    };
    idea.time = moment().format("h:mm:ss a");

    this.ideas.push(idea);

    return idea;
  }
}

const app = express(feathers());
app.use(express.json());
app.configure(socketio());

// Enbale REST Service
app.configure(express.rest());

//Register services
app.use("/ideas", new IdeaService());
app.use(express.static("public"));

//New connection connect to stream channel
app.on("connection", conn => app.channel(CHANNEL_NAME).join(conn));

//Publish event to stream
app.publish(data => app.channel(CHANNEL_NAME));

const PORT = process.env.PORT || 3030;

app
  .listen(PORT)
  .on("listening", () =>
    console.log(`Realtime server running on port ${PORT}`)
  );

// app.service('ideas').create({
//     text: 'Build a cool app',
//     tech: 'Node js',
//     viewer: 'John Doe'
// })
