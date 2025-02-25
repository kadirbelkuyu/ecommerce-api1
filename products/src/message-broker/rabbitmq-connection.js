const amqp = require("amqplib");

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    this.connection = await amqp.connect("amqp://rabbitmq-server:5672");
    this.channel = await this.connection.createChannel();
  }

  async publishMessage(queueName, message) {
    await this.channel.assertQueue(queueName);
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }

  async consumeMessages(queueName, callback) {
    await this.channel.assertQueue(queueName);
    this.channel.consume(queueName, (msg) => {
      const message = JSON.parse(msg.content.toString());
      callback(message);
      this.channel.ack(msg);
    });
  }
}

module.exports = new RabbitMQService();
